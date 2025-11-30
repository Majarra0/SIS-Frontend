import apiClient from './apiclient';
import { isMockMode } from './apiConfig';
import { mockAcademicApi } from './mocks/mockApi';

// Programs
export const getPrograms = async (params = {}) => {
  if (isMockMode) {
    return mockAcademicApi.getPrograms(params);
  }
  const response = await apiClient.get('/academic/programs/', { params });
  return response.data;
};

export const createProgram = async (programData) => {
  if (isMockMode) {
    return mockAcademicApi.createProgram(programData);
  }
  const response = await apiClient.post('/academic/programs/', {
    program_code: programData.program_code,
    name: programData.name,
    department_id: programData.department_id,
    total_credits_required: programData.total_credits_required,
    minimum_gpa: programData.minimum_gpa,
    degree_level: programData.degree_level,
    is_active: programData.is_active ?? true
  });
  return response.data;
};

export const getCourses = async (params = {}) => {
  if (isMockMode) {
    return mockAcademicApi.getCourses(params);
  }
  const response = await apiClient.get('/academic/courses/', { params });
  return response.data;
};

export const getCourse = async (id) => {
  if (isMockMode) {
    return mockAcademicApi.getCourse(id);
  }
  const response = await apiClient.get(`/academic/courses/${id}/`);
  return response.data;
};

export const createCourse = async (courseData) => {
  try {
    if (isMockMode) {
      return mockAcademicApi.createCourse(courseData);
    }
    // Transform prerequisites into the expected nested format
    const formattedData = {
      ...courseData,
      prerequisite_courses: courseData.prerequisites
        .filter(prereq => prereq.course_id)
        .map(prereq => ({
          required_course: parseInt(prereq.course_id),
          minimum_grade: prereq.minimum_grade ?? 1
        }))
    };

    // Remove the original prerequisites array
    delete formattedData.prerequisites;

    const response = await apiClient.post('/academic/courses/', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};


export const getProgram = async (id) => {
  if (isMockMode) {
    const programs = await mockAcademicApi.getPrograms();
    const list = Array.isArray(programs) ? programs : programs.results || [];
    return list.find(program => program.id === Number(id));
  }
  const response = await apiClient.get(`/academic/programs/${id}/`);
  return response.data;
};

export const getProgramCourses = async (programId) => {
  if (isMockMode) {
    const programs = await mockAcademicApi.getPrograms();
    const programList = Array.isArray(programs) ? programs : programs.results || [];
    const program = programList.find(p => p.id === Number(programId));
    return program
      ? mockAcademicApi.getCourses({ department_id: program.department_id })
      : [];
  }
  const response = await apiClient.get(`/academic/programs/${programId}/courses/`);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  try {
    if (isMockMode) {
      return mockAcademicApi.updateCourse(courseId, courseData);
    }
    // Format prerequisite_courses just like in createCourse
    const formattedData = {
      ...courseData,
      prerequisite_courses: courseData.prerequisites
        .filter(prereq => prereq.course_id)
        .map(prereq => ({
          required_course: parseInt(prereq.course_id),
          minimum_grade: prereq.minimum_grade ?? 1
        }))
    };

    // Remove the original prerequisites array
    delete formattedData.prerequisites;

    // PUT request to update the course by ID
    const response = await apiClient.put(`/academic/courses/${courseId}/`, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};


export const deleteCourse = async (id) => {
  if (isMockMode) {
    return mockAcademicApi.deleteCourse(id);
  }
  await apiClient.delete(`/academic/courses/${id}/`);
};

export const getCoursePrerequisites = async (id) => {
  if (isMockMode) {
    return mockAcademicApi.getCoursePrerequisites(id);
  }
  const response = await apiClient.get(`/academic/courses/${id}/prerequisites/`);
  return response.data;
};
