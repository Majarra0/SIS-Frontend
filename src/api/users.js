import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockUsersApi } from './mocks/mockApi';

export const getUsers = async (params = {}) => {
  try {
    if (isMockMode) {
      return await mockUsersApi.list(params);
    }
    // Fetch users with their related info in a single request
    const response = await apiClient.get('/users/with-info/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    if (isMockMode) {
      return await mockUsersApi.detail(id);
    }
    // Using a single request to get user with all related info
    const response = await apiClient.get(`/users/${id}/with-info/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch user details');
  }
};

export const createUser = async (userData) => {
  try {
    if (isMockMode) {
      return await mockUsersApi.create(userData);
    }
    const userResponse = await apiClient.post('/users/create-with-personal-info/', {
      // Basic user info
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role,
      // Personal info as a nested object
      personal_info: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        gender: userData.gender || 'M',
        date_of_birth: userData.date_of_birth || null,
        national_id: userData.national_id || null
      },
      // Contact info as a nested object
      contact_info: {
        primary_phone: userData.primary_phone || '',
        emergency_contact_name: userData.emergency_contact_name || '',
        emergency_contact_phone: userData.emergency_contact_phone || '',
        emergency_contact_relation: userData.emergency_contact_relation || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || ''
      }
    });

    return userResponse.data;

  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Permission denied: Only administrators can create users');
    } else if (error.response?.status === 400) {
      const messages = Object.entries(error.response.data)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw new Error('Failed to create user. Please try again.');
  }
};

export const updateUser = async (id, userData) => {
  try {
    if (isMockMode) {
      return await mockUsersApi.update(id, userData);
    }
    // First update the base user info
    await apiClient.put(`/users/${id}/`, {
      username: userData.username,
      email: userData.email,
      role: userData.role
    });

    // Update personal info
    if (userData.personal_info) {
      await apiClient.put(`/users/${id}/personal-info/`, {
        first_name: userData.personal_info.first_name,
        middle_name: userData.personal_info.middle_name,
        last_name: userData.personal_info.last_name,
        gender: userData.personal_info.gender,
        date_of_birth: userData.personal_info.date_of_birth,
        national_id: userData.personal_info.national_id
      });
    }

    // Update contact info
    if (userData.contact_info) {
      await apiClient.put(`/users/${id}/contact-info/`, {
        primary_phone: userData.contact_info.primary_phone,
        emergency_contact_name: userData.contact_info.emergency_contact_name,
        emergency_contact_phone: userData.contact_info.emergency_contact_phone,
        emergency_contact_relation: userData.contact_info.emergency_contact_relation,
        address: userData.contact_info.address,
        city: userData.contact_info.city,
        state: userData.contact_info.state,
        country: userData.contact_info.country
      });
    }
    // Return the updated user data
    const updatedUser = await getUserById(id);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(error.response?.data?.detail || 'Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    if (isMockMode) {
      return await mockUsersApi.remove(id);
    }
    await apiClient.delete(`/users/${id}/`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  if (isMockMode) {
    return mockUsersApi.profile();
  }
  const response = await apiClient.get('/users/profile/');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  if (isMockMode) {
    return mockUsersApi.updateProfile(userData);
  }
  const response = await apiClient.put('/users/profile/', userData);
  return response.data;
};
