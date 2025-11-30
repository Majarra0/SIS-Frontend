import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockGradingApi } from './mocks/mockApi';

// Grade Components
export const getGradeComponents = async (params = {}) => {
  if (isMockMode) {
    return mockGradingApi.getGradeComponents(params);
  }
  const response = await apiClient.get('/grading/components/', { params });
  return response.data;
};

export const createGradeComponent = async (componentData) => {
  if (isMockMode) {
    return mockGradingApi.createGradeComponent(componentData);
  }
  const response = await apiClient.post('/grading/components/', {
    name: componentData.name,
    weight: componentData.weight,
    course_offering_id: componentData.course_offering_id
  });
  return response.data;
};

// Grades
export const submitGrades = async (gradesData) => {
  if (isMockMode) {
    return mockGradingApi.submitGrades(gradesData);
  }
  const response = await apiClient.post('/grading/grades/', {
    course_offering_id: gradesData.course_offering_id,
    grade_component_id: gradesData.grade_component_id,
    grades: gradesData.grades.map(grade => ({
      enrollment_id: grade.enrollment_id,
      score: grade.score,
      comment: grade.comment
    }))
  });
  return response.data;
};

export const getCourseGrades = async (courseOfferingId) => {
  if (isMockMode) {
    return mockGradingApi.getCourseGrades(courseOfferingId);
  }
  const response = await apiClient.get('/grading/grades/course_grades/', {
    params: { course_offering_id: courseOfferingId }
  });
  return response.data;
};

// Grades
export const getGrades = async (params = {}) => {
  if (isMockMode) {
    return mockGradingApi.getGrades(params);
  }
  const response = await apiClient.get('/grading/grades/', { params });
  return response.data;
};

export const submitGrade = async (gradeData) => {
  if (isMockMode) {
    return mockGradingApi.submitGrade(gradeData);
  }
  const response = await apiClient.post('/grading/grades/', gradeData);
  return response.data;
};

export const updateGrade = async (id, gradeData) => {
  if (isMockMode) {
    return mockGradingApi.updateGrade(id, gradeData);
  }
  const response = await apiClient.put(`/grading/grades/${id}/`, gradeData);
  return response.data;
};

export const getStudentGrades = async (studentId, params = {}) => {
  if (isMockMode) {
    return mockGradingApi.getStudentGrades(studentId, params);
  }
  const response = await apiClient.get('/grading/grades/student_grades/', {
    params: { ...params, student_id: studentId }
  });
  return response.data;
};

// Academic Records
export const getAcademicRecords = async (params = {}) => {
  if (isMockMode) {
    return mockGradingApi.getAcademicRecords(params);
  }
  const response = await apiClient.get('/grading/academic-records/', { params });
  return response.data;
};

export const calculateGPA = async (studentId) => {
  if (isMockMode) {
    return mockGradingApi.calculateGPA(studentId);
  }
  const response = await apiClient.get('/grading/academic-records/calculate_gpa/', {
    params: { student_id: studentId }
  });
  return response.data;
};
