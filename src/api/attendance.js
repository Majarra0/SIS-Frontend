import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockAttendanceApi } from './mocks/mockApi';

export const getAttendance = async (params = {}) => {
  if (isMockMode) {
    return mockAttendanceApi.getAttendance(params);
  }
  const response = await apiClient.get('/attendance/', { params });
  return response.data;
};

export const getMyAttendance = async (params = {}) => {
  if (isMockMode) {
    return mockAttendanceApi.getMyAttendance(params);
  }
  const response = await apiClient.get('/attendance/student_report/', { params });
  return response.data;
};

export const createAttendance = async (data) => {
  if (isMockMode) {
    return mockAttendanceApi.createAttendance(data);
  }
  const response = await apiClient.post('/attendance/', data);
  return response.data;
};

export const bulkCreateAttendance = async (data) => {
  if (isMockMode) {
    return mockAttendanceApi.bulkCreateAttendance(data);
  }
  const response = await apiClient.post('/attendance/bulk_create/', data);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  if (isMockMode) {
    return mockAttendanceApi.updateAttendance(id, data);
  }
  const response = await apiClient.put(`/attendance/${id}/`, data);
  return response.data;
};

export const getStudentReport = async (studentId, params = {}) => {
  if (isMockMode) {
    return mockAttendanceApi.getStudentReport(studentId, params);
  }
  const response = await apiClient.get('/attendance/student_report/', {
    params: { ...params, student_id: studentId }
  });
  return response.data;
};

export const getCourseReport = async (courseId, params = {}) => {
  if (isMockMode) {
    return mockAttendanceApi.getCourseReport(courseId, params);
  }
  const response = await apiClient.get('/attendance/course_report/', {
    params: { ...params, course_id: courseId }
  });
  return response.data;
};
