import React from 'react';
import { screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { toast } from 'react-toastify';
import GradeList from '../pages/grading/GradeList';
import StudentGrades from '../pages/grading/StudentGrades';
import { renderWithProviders } from './test-utils';

const getGradeRows = () => {
  const table = screen.getByRole('table');
  const rows = within(table).getAllByRole('row');
  return rows.slice(1);
};

describe('GradeList (faculty)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFaculty = () => renderWithProviders(<GradeList />, { auth: { userRole: 'faculty', isAuthenticated: true } });

  it('renders all grade rows for faculty', () => {
    renderFaculty();
    expect(getGradeRows()).toHaveLength(8);
  });

  it('shows faculty-only controls', () => {
    renderFaculty();
    expect(screen.getByRole('button', { name: /add grades/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish selected/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show statistics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply curve/i })).toBeInTheDocument();
  });

  it('disables publish until a grade is selected', () => {
    renderFaculty();
    expect(screen.getByRole('button', { name: /publish selected/i })).toBeDisabled();
  });

  it('filters grades by course', async () => {
    renderFaculty();
    const [courseSelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(courseSelect, 'CS301');
    expect(getGradeRows()).toHaveLength(4);
  });

  it('filters grades by component', async () => {
    renderFaculty();
    const [, componentSelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(componentSelect, 'Project');
    expect(getGradeRows()).toHaveLength(2);
  });

  it('filters by visibility', async () => {
    renderFaculty();
    const [, , visibilitySelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(visibilitySelect, 'hidden');
    expect(getGradeRows()).toHaveLength(3);
  });

  it('shows only visible grades when requested', async () => {
    renderFaculty();
    const [, , visibilitySelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(visibilitySelect, 'visible');
    expect(getGradeRows()).toHaveLength(5);
  });

  it('opens and hides statistics panel', async () => {
    renderFaculty();
    await userEvent.click(screen.getByRole('button', { name: /show statistics/i }));
    expect(screen.getByText(/class average/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /hide statistics/i }));
    expect(screen.queryByText(/class average/i)).not.toBeInTheDocument();
  });

  it('displays grade distribution stats', async () => {
    renderFaculty();
    await userEvent.click(screen.getByRole('button', { name: /show statistics/i }));
    expect(screen.getByText(/a:/i)).toBeInTheDocument();
    expect(screen.getByText(/f:/i)).toBeInTheDocument();
  });

  it('hides the student column for student viewers', () => {
    renderWithProviders(<GradeList />, { auth: { userRole: 'student', isAuthenticated: true } });
    expect(screen.queryByText(/ID:/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add grades/i })).not.toBeInTheDocument();
  });

  it('selects grades and publishes them, clearing selection', async () => {
    const successSpy = vi.spyOn(toast, 'success');
    renderFaculty();

    const checkbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(screen.getByRole('button', { name: /publish selected/i }));
    await waitFor(() => expect(successSpy).toHaveBeenCalledWith('Grades published successfully'));
    expect(checkbox).not.toBeChecked();
  });

  it('toggles component visibility from hidden to visible', async () => {
    renderFaculty();
    const hiddenStatus = screen.getAllByText(/status: hidden/i)[0];
    const hiddenCard = hiddenStatus.closest('.border') || hiddenStatus.closest('div');
    const toggle = within(hiddenCard).getAllByRole('button')[0];

    await userEvent.click(toggle);
    const [, , visibilitySelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(visibilitySelect, 'hidden');

    expect(getGradeRows().length).toBeLessThan(3);
  });

  it('applies a flat curve to grades', async () => {
    const errorSpy = vi.spyOn(toast, 'error');
    renderFaculty();
    expect(screen.getByText('85%')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /apply curve/i }));

    const modal = screen.getByText(/apply grade curve/i).closest('div');
    const curveType = within(modal).getByRole('combobox');
    const valueInput = within(modal).getByRole('spinbutton');
    const applyButton = within(modal).getByRole('button', { name: /^apply curve$/i });

    await userEvent.selectOptions(curveType, 'flat');
    await userEvent.click(valueInput);
    fireEvent.change(valueInput, { target: { value: '5' } });
    expect(curveType).toHaveValue('flat');
    expect(valueInput).toHaveValue(5);
    await userEvent.click(applyButton, { pointerEventsCheck: 0 });

    await waitFor(() => expect(screen.getByText(/apply grade curve/i)).toBeInTheDocument());
    await waitFor(() => expect(errorSpy).not.toHaveBeenCalled());
  });

  it('applies a percentage curve scoped to a course', async () => {
    const errorSpy = vi.spyOn(toast, 'error');
    renderFaculty();
    const [courseSelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(courseSelect, 'CS301');
    await userEvent.click(screen.getByRole('button', { name: /apply curve/i }));

    const modal = screen.getByText(/apply grade curve/i).closest('div');
    const curveType = within(modal).getByRole('combobox');
    const valueInput = within(modal).getByRole('spinbutton');
    const applyButton = within(modal).getByRole('button', { name: /^apply curve$/i });

    await userEvent.selectOptions(curveType, 'percentage');
    await userEvent.click(valueInput);
    fireEvent.change(valueInput, { target: { value: '10' } });
    expect(curveType).toHaveValue('percentage');
    expect(valueInput).toHaveValue(10);
    fireEvent.click(applyButton);

    await waitFor(() => expect(screen.getByText(/apply grade curve/i)).toBeInTheDocument());
    await waitFor(() => expect(errorSpy).not.toHaveBeenCalled());
  });

  it('applies a highest-grade curve to a component', async () => {
    const errorSpy = vi.spyOn(toast, 'error');
    renderFaculty();
    const [, componentSelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(componentSelect, 'Project');
    await userEvent.click(screen.getByRole('button', { name: /apply curve/i }));

    const modal = screen.getByText(/apply grade curve/i).closest('div');
    const curveType = within(modal).getByRole('combobox');
    const valueInput = within(modal).getByRole('spinbutton');
    const applyButton = within(modal).getByRole('button', { name: /^apply curve$/i });

    await userEvent.selectOptions(curveType, 'highest');
    await userEvent.click(valueInput);
    fireEvent.change(valueInput, { target: { value: '100' } });
    expect(curveType).toHaveValue('highest');
    expect(valueInput).toHaveValue(100);
    fireEvent.click(applyButton);

    await waitFor(() => expect(screen.getByText(/apply grade curve/i)).toBeInTheDocument());
    await waitFor(() => expect(errorSpy).not.toHaveBeenCalled());
  });

  it('requires curve type and value before applying', async () => {
    const errorSpy = vi.spyOn(toast, 'error');
    renderFaculty();

    await userEvent.click(screen.getByRole('button', { name: /apply curve/i }));
    const modal = screen.getByText(/apply grade curve/i).closest('div');
    const applyButton = within(modal).getByRole('button', { name: /^apply curve$/i });
    await userEvent.click(applyButton);

    expect(errorSpy).toHaveBeenCalled();
  });

  it('updates component options when course filter changes', async () => {
    renderFaculty();
    const [courseSelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(courseSelect, 'CS301');

    const [, componentSelect] = screen.getAllByRole('combobox');
    const options = componentSelect.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('renders action buttons for each row when faculty is viewing', () => {
    renderFaculty();
    expect(screen.getAllByRole('button', { name: /edit/i }).length).toBeGreaterThan(0);
  });
});

describe('GradeList (student)', () => {
  it('hides selection checkboxes and faculty actions for students', () => {
    renderWithProviders(<GradeList />, { auth: { userRole: 'student', isAuthenticated: true } });
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /publish selected/i })).not.toBeInTheDocument();
  });

  it('filters visible grades for students', async () => {
    renderWithProviders(<GradeList />, { auth: { userRole: 'student', isAuthenticated: true } });
    const [, , visibilitySelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(visibilitySelect, 'hidden');
    expect(getGradeRows()).toHaveLength(3);
  });
});

describe('StudentGrades view', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows GPA and course stats when stats are revealed', async () => {
    renderWithProviders(<StudentGrades />);
    await userEvent.click(screen.getByRole('button', { name: /show statistics/i }));

    expect(screen.getByText(/current gpa/i)).toBeInTheDocument();
    expect(screen.getByText(/highest grade/i)).toBeInTheDocument();
  });

  it('hides statistics panel when toggled off', async () => {
    renderWithProviders(<StudentGrades />);
    await userEvent.click(screen.getByRole('button', { name: /show statistics/i }));
    await userEvent.click(screen.getByRole('button', { name: /hide statistics/i }));

    expect(screen.queryByText(/current gpa/i)).not.toBeInTheDocument();
  });

  it('lists course cards with final grades', () => {
    renderWithProviders(<StudentGrades />);
    expect(screen.getAllByText(/final grade/i)).toHaveLength(2);
  });

  it('shows component weights and feedback details', () => {
    renderWithProviders(<StudentGrades />);
    expect(screen.getAllByText(/30%/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/project implementation/i)).toBeInTheDocument();
  });

  it('downloads transcript via toast info message', async () => {
    const infoSpy = vi.spyOn(toast, 'info');
    renderWithProviders(<StudentGrades />);

    await userEvent.click(screen.getByRole('button', { name: /download transcript/i }));
    expect(infoSpy).toHaveBeenCalled();
  });
});
