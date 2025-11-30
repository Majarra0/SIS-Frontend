import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockDepartmentsApi } from './mocks/mockApi';

export const getPaginatedDepartments = async (page = 1, pageSize = 10, params = {}) => {
  if (isMockMode) {
    return mockDepartmentsApi.list({ page, page_size: pageSize, ...params });
  }
  const response = await apiClient.get('/departments/', {
    params: {
      ...params,
      page,
      page_size: pageSize
    }
  });
  return response.data;
};

export const getDepartments = async (params = {}) => {
  if (isMockMode) {
    return mockDepartmentsApi.list(params);
  }
  // Support all possible filter parameters
  const queryParams = {
    search: params.search,
    is_active: params.isActive,
    head_id: params.headId,
    page: params.page,
    page_size: params.pageSize,
    ...params
  };
  
  const response = await apiClient.get('/departments/', { params: queryParams });
  return response.data;
};

export const getDepartmentById = async (id) => {
  if (isMockMode) {
    return mockDepartmentsApi.detail(id);
  }
  const response = await apiClient.get(`/departments/${id}/`);
  return response.data;
};

export const createDepartment = async (data) => {
  if (isMockMode) {
    return mockDepartmentsApi.create(data);
  }
  const response = await apiClient.post('/departments/', data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  if (isMockMode) {
    return mockDepartmentsApi.update(id, data);
  }
  const response = await apiClient.put(`/departments/${id}/`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  if (isMockMode) {
    return mockDepartmentsApi.remove(id);
  }
  const response = await apiClient.delete(`/departments/${id}/`);
  return response.data;
};

export const getDepartmentFaculty = async (departmentId) => {
  if (isMockMode) {
    return mockDepartmentsApi.faculty(departmentId);
  }
  // Change from 'faculty' to 'faculty_members' to match backend endpoint
  const response = await apiClient.get(`/departments/${departmentId}/faculty_members/`);
  return response.data;
};

export const getDepartmentCourses = async (departmentId) => {
  if (isMockMode) {
    return mockDepartmentsApi.courses(departmentId);
  }
  const response = await apiClient.get(`/departments/${departmentId}/courses/`);
  return response.data;
};
