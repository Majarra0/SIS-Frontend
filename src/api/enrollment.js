import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockEnrollmentApi } from './mocks/mockApi';

// Terms
export const getTerms = async (params = {}) => {
  if (isMockMode) {
    return mockEnrollmentApi.getTerms(params);
  }
  const response = await apiClient.get('/enrollment/terms/', { params });
  return response.data;
};

export const getCurrentTerm = async () => {
  if (isMockMode) {
    return mockEnrollmentApi.getCurrentTerm();
  }
  const response = await apiClient.get('/enrollment/terms/current/');
  return response.data;
};

// Course Offerings
export const getCourseOfferings = async (params = {}) => {
  if (isMockMode) {
    return mockEnrollmentApi.getCourseOfferings(params);
  }
  const response = await apiClient.get('/enrollment/offerings/', { params });
  return response.data;
};

export const getEnrolledStudents = async (offeringId) => {
  if (isMockMode) {
    return mockEnrollmentApi.getEnrolledStudents(offeringId);
  }
  const response = await apiClient.get(`/enrollment/offerings/${offeringId}/enrolled_students/`);
  return response.data;
};

// Enrollments
export const getEnrollments = async (params = {}) => {
  if (isMockMode) {
    return mockEnrollmentApi.getEnrollments(params);
  }
  const response = await apiClient.get('/enrollment/enrollments/', { params });
  return response.data;
};

export const getMyEnrollments = async (params = {}) => {
  if (isMockMode) {
    return mockEnrollmentApi.getMyEnrollments(params);
  }
  const response = await apiClient.get('/enrollment/enrollments/my_schedule/', { params });
  return response.data;
};

export const createEnrollment = async (enrollmentData) => {
  if (isMockMode) {
    return mockEnrollmentApi.createEnrollment(enrollmentData);
  }
  const response = await apiClient.post('/enrollment/enrollments/', enrollmentData);
  return response.data;
};

export const getEnrollment = async (id) => {
  if (isMockMode) {
    return mockEnrollmentApi.getEnrollment(id);
  }
  const response = await apiClient.get(`/enrollment/enrollments/${id}/`);
  return response.data;
};

export const updateEnrollment = async (id, enrollmentData) => {
  if (isMockMode) {
    return mockEnrollmentApi.updateEnrollment(id, enrollmentData);
  }
  const response = await apiClient.put(`/enrollment/enrollments/${id}/`, enrollmentData);
  return response.data;
};

export const dropEnrollment = async (enrollmentId) => {
  if (isMockMode) {
    return mockEnrollmentApi.dropEnrollment(enrollmentId);
  }
  const response = await apiClient.post(`/enrollment/enrollments/${enrollmentId}/drop_course/`);
  return response.data;
};
