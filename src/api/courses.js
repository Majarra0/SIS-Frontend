// courses.js
import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockAcademicApi } from './mocks/mockApi';

export const getCourses = async (params) => {
  if (isMockMode) {
    return mockAcademicApi.getCourses(params);
  }
  const response = await apiClient.get('/academic/courses/', { params });
  return response.data;
};

export const deleteCourse = async (courseId) => {
  if (isMockMode) {
    return mockAcademicApi.deleteCourse(courseId);
  }
  return await apiClient.delete(`/academic/courses/${courseId}`);
};

export const createCourse = async (courseData) => {
  if (isMockMode) {
    return mockAcademicApi.createCourse(courseData);
  }
  const response = await apiClient.post('/academic/courses/', courseData);
  return response.data;
};
