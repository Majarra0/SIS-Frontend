import React from 'react';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AttendanceList from '../pages/attendance/AttendanceList';
import { renderWithProviders } from './test-utils';

const getTableRows = () => {
  const table = screen.getByRole('table');
  const rows = within(table).getAllByRole('row');
  return rows.slice(1); // exclude header
};

const getDateInput = () => {
  return document.querySelector('input[type="date"]') || document.querySelector('input');
};

const getFilterSelects = () => {
  const selects = screen.getAllByRole('combobox');
  return {
    courseSelect: selects[0],
    statusSelect: selects[1]
  };
};

describe('AttendanceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial attendance records', () => {
    renderWithProviders(<AttendanceList />);
    expect(getTableRows()).toHaveLength(3);
  });

  it('filters by course code', async () => {
    renderWithProviders(<AttendanceList />);

    const { courseSelect } = getFilterSelects();
    await userEvent.selectOptions(courseSelect, 'CS301');
    const rows = getTableRows();

    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText(/CS301/)).toBeInTheDocument();
  });

  it('filters by status', async () => {
    renderWithProviders(<AttendanceList />);

    const { statusSelect } = getFilterSelects();
    await userEvent.selectOptions(statusSelect, 'absent');
    const rows = getTableRows();

    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText(/absent/i)).toBeInTheDocument();
  });

  it('filters by date', async () => {
    renderWithProviders(<AttendanceList />);

    await userEvent.type(getDateInput(), '2025-05-02');
    const rows = getTableRows();

    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText(/5\/2\/2025/i)).toBeInTheDocument();
  });

  it('resets filters to show all records', async () => {
    renderWithProviders(<AttendanceList />);

    const { courseSelect } = getFilterSelects();
    await userEvent.selectOptions(courseSelect, 'CS301');
    expect(getTableRows()).toHaveLength(2);

    await userEvent.click(screen.getByText(/reset filters/i));
    expect(getTableRows()).toHaveLength(3);
  });

  it('toggles the stats panel', async () => {
    renderWithProviders(<AttendanceList />);

    await userEvent.click(screen.getByRole('button', { name: /show stats/i }));
    expect(screen.getByText(/attendance rate/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /hide stats/i }));
    expect(screen.queryByText(/attendance rate/i)).not.toBeInTheDocument();
  });

  it('calculates stats for filtered results', async () => {
    renderWithProviders(<AttendanceList />);

    const { statusSelect } = getFilterSelects();
    await userEvent.selectOptions(statusSelect, 'absent');
    await userEvent.click(screen.getByRole('button', { name: /show stats/i }));

    const absentLabel = screen.getAllByText(/absent/i).find(el => el.className.includes('text-red-600'));
    const absentValue = absentLabel?.parentElement?.querySelector('.text-2xl');
    expect(absentValue?.textContent).toContain('1');
    const totalCard = screen.getByText(/total records/i).parentElement?.querySelector('.text-2xl');
    expect(totalCard?.textContent).toContain('1');
  });

  it('shows per-course stats when expanded', async () => {
    renderWithProviders(<AttendanceList />);

    await userEvent.click(screen.getByRole('button', { name: /show stats/i }));
    expect(screen.getAllByText(/CS301/).length).toBeGreaterThan(0);
  });

  it('shows bulk actions when rows are selected', async () => {
    renderWithProviders(<AttendanceList />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(checkbox);

    expect(screen.getByText(/bulk actions/i)).toBeInTheDocument();
  });

  it('keeps the bulk apply button disabled until an action is chosen', async () => {
    renderWithProviders(<AttendanceList />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(checkbox);

    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeDisabled();
  });

  it('marks selected rows as present in bulk', async () => {
    renderWithProviders(<AttendanceList />);

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[1]);

    await userEvent.selectOptions(screen.getByDisplayValue(/select action/i), 'markPresent');
    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    const rows = getTableRows();
    rows.slice(0, 2).forEach(row => {
      expect(within(row).getByText(/present/i)).toBeInTheDocument();
    });
  });

  it('marks selected rows as absent in bulk', async () => {
    renderWithProviders(<AttendanceList />);

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    await userEvent.selectOptions(screen.getByDisplayValue(/select action/i), 'markAbsent');
    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(within(getTableRows()[0]).getByText(/absent/i)).toBeInTheDocument();
  });

  it('shows delete bulk action only for admin/teacher', async () => {
    renderWithProviders(<AttendanceList />, { auth: { userRole: 'student' } });

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    await userEvent.click(screen.getByDisplayValue(/select action/i));

    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
  });

  it('allows admin to delete selected records', async () => {
    renderWithProviders(<AttendanceList />, { auth: { userRole: 'admin' } });

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    await userEvent.selectOptions(screen.getByDisplayValue(/select action/i), 'delete');
    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(getTableRows()).toHaveLength(2);
  });

  it('toggles status via row action', async () => {
    renderWithProviders(<AttendanceList />);

    const rows = getTableRows();
    const toggleButton = within(rows[0]).getByRole('button');
    const originalStatus = within(rows[0]).getByText(/present/i);

    await userEvent.click(toggleButton);
    await waitFor(() => expect(within(rows[0]).getByText(/absent/i)).toBeInTheDocument());
  });

  it('exports filtered data as CSV', async () => {
    renderWithProviders(<AttendanceList />);

    const { statusSelect } = getFilterSelects();
    await userEvent.selectOptions(statusSelect, 'present');
    await userEvent.click(screen.getByRole('button', { name: /export/i }));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith('Data exported successfully');
  });

  it('shows no data message when filters remove all rows', async () => {
    renderWithProviders(<AttendanceList />);

    await userEvent.type(getDateInput(), '2024-01-01');
    expect(screen.getByText(/no attendance records/i)).toBeInTheDocument();
  });

  it('keeps selection state in sync when toggling checkboxes', async () => {
    renderWithProviders(<AttendanceList />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(checkbox);
    expect(screen.getByText(/bulk actions/i)).toBeInTheDocument();

    await userEvent.click(checkbox);
    expect(screen.queryByText(/bulk actions/i)).not.toBeInTheDocument();
  });
});
