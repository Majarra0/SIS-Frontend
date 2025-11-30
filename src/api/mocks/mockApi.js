import { mockDb } from './data';
import { 
  simulateNetwork, 
  filterBySearch, 
  paginate, 
  nextId, 
  normalizeId, 
  getMockUserId 
} from '../apiConfig';

const findDepartment = (id) => mockDb.departments.find(dept => dept.id === normalizeId(id));

const withDepartment = (entity) => {
  if (!entity) return entity;
  const department = entity.department || findDepartment(entity.department_id);
  return { ...entity, department };
};

// ---- Auth ----
export const mockAuth = {
  async login(username, password) {
    const user = mockDb.users.find(u => u.username === username);
    if (!user || (user.password && user.password !== password)) {
      throw new Error('Invalid username or password');
    }
    const tokens = {
      access: `mock-access-${user.id}`,
      refresh: `mock-refresh-${user.id}`
    };
    return simulateNetwork({ tokens, user: withDepartment(user) });
  },

  async refreshToken(refresh) {
    if (!refresh?.startsWith('mock-refresh-')) {
      throw new Error('Invalid refresh token');
    }
    const userId = Number(refresh.replace('mock-refresh-', ''));
    return simulateNetwork({ access: `mock-access-${userId}` });
  },

  async currentUser(userId) {
    const resolvedId = normalizeId(userId) ?? getMockUserId();
    const user = mockDb.users.find(u => u.id === resolvedId) || mockDb.users[0];
    return simulateNetwork(withDepartment(user));
  }
};

// ---- Users ----
export const mockUsersApi = {
  async list(params = {}) {
    const { role, search } = params;
    let data = [...mockDb.users];

    if (role) {
      data = data.filter(user => user.role === role);
    }

    data = filterBySearch(
      data,
      ['username', 'email', 'personal_info.first_name', 'personal_info.last_name'],
      search
    ).map(withDepartment);

    return simulateNetwork(paginate(data, params));
  },

  async detail(id) {
    const user = mockDb.users.find(u => u.id === normalizeId(id));
    if (!user) throw new Error('User not found');
    return simulateNetwork(withDepartment(user));
  },

  async create(payload) {
    const department = findDepartment(payload.department?.id || payload.department);
    const id = nextId(mockDb.users);
    const newUser = {
      id,
      username: payload.username,
      password: payload.password || 'password',
      email: payload.email,
      role: payload.role || 'student',
      is_active: true,
      department,
      personal_info: {
        first_name: payload.personal_info?.first_name || payload.first_name || '',
        middle_name: payload.personal_info?.middle_name || '',
        last_name: payload.personal_info?.last_name || payload.last_name || '',
        gender: payload.personal_info?.gender || payload.gender || 'M',
        date_of_birth: payload.personal_info?.date_of_birth || null,
        national_id: payload.personal_info?.national_id || null
      },
      contact_info: {
        primary_phone: payload.contact_info?.primary_phone || payload.primary_phone || '',
        emergency_contact_name: payload.contact_info?.emergency_contact_name || '',
        emergency_contact_phone: payload.contact_info?.emergency_contact_phone || '',
        emergency_contact_relation: payload.contact_info?.emergency_contact_relation || '',
        address: payload.contact_info?.address || '',
        city: payload.contact_info?.city || '',
        state: payload.contact_info?.state || '',
        country: payload.contact_info?.country || ''
      }
    };

    mockDb.users.push(newUser);
    return simulateNetwork(withDepartment(newUser));
  },

  async update(id, payload) {
    const userIndex = mockDb.users.findIndex(u => u.id === normalizeId(id));
    if (userIndex === -1) throw new Error('User not found');

    const existing = mockDb.users[userIndex];
    const department = findDepartment(payload.department?.id || payload.department) || existing.department;

    const personal_info = {
      ...existing.personal_info,
      ...payload.personal_info,
      first_name: payload.personal_info?.first_name ?? payload.first_name ?? existing.personal_info?.first_name,
      middle_name: payload.personal_info?.middle_name ?? payload.middle_name ?? existing.personal_info?.middle_name,
      last_name: payload.personal_info?.last_name ?? payload.last_name ?? existing.personal_info?.last_name,
      gender: payload.personal_info?.gender ?? payload.gender ?? existing.personal_info?.gender
    };

    const contact_info = {
      ...existing.contact_info,
      ...payload.contact_info,
      primary_phone: payload.contact_info?.primary_phone ?? payload.primary_phone ?? existing.contact_info?.primary_phone,
      address: payload.contact_info?.address ?? payload.address ?? existing.contact_info?.address,
      city: payload.contact_info?.city ?? payload.city ?? existing.contact_info?.city,
      state: payload.contact_info?.state ?? payload.state ?? existing.contact_info?.state,
      country: payload.contact_info?.country ?? payload.country ?? existing.contact_info?.country,
      emergency_contact_name: payload.contact_info?.emergency_contact_name ?? existing.contact_info?.emergency_contact_name,
      emergency_contact_phone: payload.contact_info?.emergency_contact_phone ?? existing.contact_info?.emergency_contact_phone,
      emergency_contact_relation: payload.contact_info?.emergency_contact_relation ?? existing.contact_info?.emergency_contact_relation
    };

    const updated = {
      ...existing,
      username: payload.username ?? existing.username,
      email: payload.email ?? existing.email,
      role: payload.role ?? existing.role,
      department,
      personal_info,
      contact_info
    };

    mockDb.users[userIndex] = updated;
    return simulateNetwork(withDepartment(updated));
  },

  async remove(id) {
    const idx = mockDb.users.findIndex(u => u.id === normalizeId(id));
    if (idx === -1) throw new Error('User not found');
    mockDb.users.splice(idx, 1);
    return simulateNetwork({ success: true });
  },

  async profile(id) {
    const resolvedId = id ?? getMockUserId();
    const user = mockDb.users.find(u => u.id === normalizeId(resolvedId)) || mockDb.users[0];
    return simulateNetwork(withDepartment(user));
  },

  async updateProfile(payload) {
    const currentId = getMockUserId();
    return this.update(currentId, payload);
  }
};

// ---- Departments ----
export const mockDepartmentsApi = {
  async list(params = {}) {
    const data = filterBySearch(
      mockDb.departments,
      ['name', 'department_code', 'code'],
      params.search
    );
    return simulateNetwork(paginate(data, params));
  },

  async detail(id) {
    const department = findDepartment(id);
    if (!department) throw new Error('Department not found');
    return simulateNetwork(department);
  },

  async create(payload) {
    const id = nextId(mockDb.departments);
    const newDepartment = {
      id,
      name: payload.name,
      department_code: payload.department_code || payload.code || payload.name.slice(0, 4).toUpperCase(),
      code: payload.code || payload.department_code || payload.name.slice(0, 4).toUpperCase(),
      description: payload.description || '',
      is_active: payload.is_active ?? true,
      head_faculty: payload.head_faculty || null,
      head: payload.head_faculty || null
    };
    mockDb.departments.push(newDepartment);
    return simulateNetwork(newDepartment);
  },

  async update(id, payload) {
    const idx = mockDb.departments.findIndex(dept => dept.id === normalizeId(id));
    if (idx === -1) throw new Error('Department not found');
    const updated = {
      ...mockDb.departments[idx],
      ...payload,
      head_faculty: payload.head_faculty || payload.head || mockDb.departments[idx].head_faculty,
      head: payload.head || payload.head_faculty || mockDb.departments[idx].head
    };
    mockDb.departments[idx] = updated;
    return simulateNetwork(updated);
  },

  async remove(id) {
    const idx = mockDb.departments.findIndex(dept => dept.id === normalizeId(id));
    if (idx === -1) throw new Error('Department not found');
    mockDb.departments.splice(idx, 1);
    return simulateNetwork({ success: true });
  },

  async faculty(departmentId) {
    const data = mockDb.users
      .filter(user => user.role === 'faculty' && user.department?.id === normalizeId(departmentId))
      .map(withDepartment);
    return simulateNetwork(data);
  },

  async courses(departmentId) {
    const data = mockDb.courses
      .filter(course => course.department?.id === normalizeId(departmentId))
      .map(course => ({ ...course, department: course.department }));
    return simulateNetwork(data);
  }
};

// ---- Academic / Courses ----
export const mockAcademicApi = {
  async getPrograms(params = {}) {
    const data = mockDb.programs.filter(program => {
      if (params.department_id && program.department_id !== normalizeId(params.department_id)) {
        return false;
      }
      return true;
    });
    return simulateNetwork(paginate(data, params));
  },

  async createProgram(payload) {
    const id = nextId(mockDb.programs);
    const program = { id, ...payload, is_active: payload.is_active ?? true };
    mockDb.programs.push(program);
    return simulateNetwork(program);
  },

  async getCourses(params = {}) {
    const { search, department_id } = params;
    let data = [...mockDb.courses];

    if (department_id) {
      const depId = normalizeId(department_id);
      data = data.filter(course => course.department?.id === depId);
    }

    data = filterBySearch(
      data,
      ['course_code', 'code', 'title', 'department.name'],
      search
    );

    return simulateNetwork(paginate(data, params));
  },

  async getCourse(id) {
    const course = mockDb.courses.find(c => c.id === normalizeId(id));
    if (!course) throw new Error('Course not found');
    return simulateNetwork({ ...course, department: findDepartment(course.department?.id || course.department_id) });
  },

  async createCourse(payload) {
    const department = findDepartment(payload.department_id || payload.department);
    const id = nextId(mockDb.courses);
    const prerequisites = (payload.prerequisites || payload.prerequisite_courses || []).map(prereq => ({
      required_course: normalizeId(prereq.required_course || prereq.course_id || prereq),
      minimum_grade: prereq.minimum_grade ?? 2.0
    }));
    const course = {
      id,
      course_code: payload.course_code,
      code: payload.course_code,
      title: payload.title,
      description: payload.description || '',
      credit_hours: payload.credit_hours ?? payload.credits ?? 3,
      credits: payload.credit_hours ?? payload.credits ?? 3,
      department,
      department_id: department?.id,
      course_level: payload.course_level || 100,
      is_active: payload.is_active ?? true,
      prerequisites
    };
    mockDb.courses.push(course);
    return simulateNetwork(course);
  },

  async updateCourse(id, payload) {
    const idx = mockDb.courses.findIndex(c => c.id === normalizeId(id));
    if (idx === -1) throw new Error('Course not found');
    const department = findDepartment(payload.department_id || payload.department) || mockDb.courses[idx].department;
    const prerequisites = (payload.prerequisites || payload.prerequisite_courses || mockDb.courses[idx].prerequisites || []).map(prereq => ({
      required_course: normalizeId(prereq.required_course || prereq.course_id || prereq),
      minimum_grade: prereq.minimum_grade ?? 2.0
    }));
    const updated = {
      ...mockDb.courses[idx],
      ...payload,
      department,
      department_id: department?.id,
      course_level: payload.course_level || mockDb.courses[idx].course_level,
      prerequisites
    };
    mockDb.courses[idx] = updated;
    return simulateNetwork(updated);
  },

  async deleteCourse(id) {
    const idx = mockDb.courses.findIndex(c => c.id === normalizeId(id));
    if (idx === -1) throw new Error('Course not found');
    mockDb.courses.splice(idx, 1);
    mockDb.courseOfferings = mockDb.courseOfferings?.filter(off => off.course_id !== normalizeId(id));
    return simulateNetwork({ success: true });
  },

  async getCoursePrerequisites(id) {
    const course = mockDb.courses.find(c => c.id === normalizeId(id));
    if (!course) throw new Error('Course not found');
    return simulateNetwork(course.prerequisites || []);
  }
};

// ---- Enrollment ----
export const mockEnrollmentApi = {
  async getTerms(params = {}) {
    return simulateNetwork(paginate(mockDb.terms, params));
  },

  async getCurrentTerm() {
    const term = mockDb.terms.find(t => t.is_current) || mockDb.terms[0];
    return simulateNetwork(term);
  },

  async getCourseOfferings(params = {}) {
    let data = [...mockDb.courseOfferings];
    if (params.faculty_id) {
      data = data.filter(off => off.faculty?.id === normalizeId(params.faculty_id));
    }
    if (params.course_id) {
      data = data.filter(off => off.course_id === normalizeId(params.course_id));
    }
    return simulateNetwork(paginate(data, params));
  },

  async getEnrolledStudents(offeringId) {
    const data = mockDb.enrollments
      .filter(enrollment => enrollment.course_offering.id === normalizeId(offeringId))
      .map(enrollment => enrollment.student);
    return simulateNetwork(data);
  },

  async getEnrollments(params = {}) {
    let data = [...mockDb.enrollments];

    if (params.student) {
      data = data.filter(enrollment => enrollment.student.id === normalizeId(params.student));
    }

    if (params.active) {
      data = data.filter(enrollment => enrollment.status === 'active');
    }

    return simulateNetwork(paginate(data, params));
  },

  async getMyEnrollments(params = {}) {
    const currentId = params.student || getMockUserId() || mockDb.users.find(u => u.role === 'student')?.id;
    return this.getEnrollments({ ...params, student: currentId });
  },

  async createEnrollment(payload) {
    const student = mockDb.users.find(u => u.id === normalizeId(payload.student)) || mockDb.users.find(u => u.role === 'student');
    const courseId = normalizeId(payload.course || payload.course_id);
    const offering = mockDb.courseOfferings.find(off => off.course_id === courseId) || mockDb.courseOfferings[0];

    const newEnrollment = {
      id: nextId(mockDb.enrollments),
      course_offering: offering,
      student,
      enrollment_date: new Date().toISOString(),
      status: 'active'
    };
    mockDb.enrollments.push(newEnrollment);
    return simulateNetwork(newEnrollment);
  },

  async getEnrollment(id) {
    const enrollment = mockDb.enrollments.find(e => e.id === normalizeId(id));
    if (!enrollment) throw new Error('Enrollment not found');
    return simulateNetwork(enrollment);
  },

  async updateEnrollment(id, payload) {
    const idx = mockDb.enrollments.findIndex(e => e.id === normalizeId(id));
    if (idx === -1) throw new Error('Enrollment not found');
    const updated = { ...mockDb.enrollments[idx], ...payload };
    mockDb.enrollments[idx] = updated;
    return simulateNetwork(updated);
  },

  async dropEnrollment(id) {
    const idx = mockDb.enrollments.findIndex(e => e.id === normalizeId(id));
    if (idx === -1) throw new Error('Enrollment not found');
    mockDb.enrollments.splice(idx, 1);
    return simulateNetwork({ success: true });
  }
};

// ---- Attendance ----
export const mockAttendanceApi = {
  async getAttendance(params = {}) {
    return simulateNetwork(paginate(mockDb.attendanceRecords, params));
  },

  async getMyAttendance(params = {}) {
    const studentId = params.student_id || getMockUserId();
    const data = mockDb.attendanceRecords.filter(record => record.student_id === normalizeId(studentId));
    return simulateNetwork(paginate(data, params));
  },

  async createAttendance(payload) {
    const record = { id: nextId(mockDb.attendanceRecords), ...payload };
    mockDb.attendanceRecords.push(record);
    return simulateNetwork(record);
  },

  async bulkCreateAttendance(payload) {
    const created = payload.attendance_records.map(entry => {
      const record = {
        id: nextId(mockDb.attendanceRecords),
        course_offering_id: payload.course_offering_id,
        date: payload.date,
        ...entry
      };
      mockDb.attendanceRecords.push(record);
      return record;
    });
    return simulateNetwork(created);
  },

  async updateAttendance(id, payload) {
    const idx = mockDb.attendanceRecords.findIndex(rec => rec.id === normalizeId(id));
    if (idx === -1) throw new Error('Attendance record not found');
    const updated = { ...mockDb.attendanceRecords[idx], ...payload };
    mockDb.attendanceRecords[idx] = updated;
    return simulateNetwork(updated);
  },

  async getStudentReport(studentId, params = {}) {
    const data = mockDb.attendanceRecords.filter(rec => rec.student_id === normalizeId(studentId));
    return simulateNetwork(paginate(data, params));
  },

  async getCourseReport(courseId, params = {}) {
    const data = mockDb.attendanceRecords.filter(rec => rec.course_id === normalizeId(courseId) || rec.course_offering_id === normalizeId(courseId));
    return simulateNetwork(paginate(data, params));
  }
};

// ---- Grading (minimal mocks to satisfy API shape) ----
export const mockGradingApi = {
  async getGradeComponents(params = {}) {
    let data = [...mockDb.gradeComponents];
    if (params.course_offering_id) {
      data = data.filter(component => component.course_offering_id === normalizeId(params.course_offering_id));
    }
    return simulateNetwork(paginate(data, params));
  },

  async createGradeComponent(payload) {
    const component = { id: nextId(mockDb.gradeComponents), ...payload };
    mockDb.gradeComponents.push(component);
    return simulateNetwork(component);
  },

  async submitGrades(payload) {
    payload.grades.forEach(entry => {
      const grade = {
        id: nextId(mockDb.grades),
        enrollment_id: entry.enrollment_id,
        grade_component_id: payload.grade_component_id,
        course_offering_id: payload.course_offering_id,
        score: entry.score,
        comment: entry.comment
      };
      mockDb.grades.push(grade);
    });
    return simulateNetwork({ success: true });
  },

  async getCourseGrades(courseOfferingId) {
    const data = mockDb.grades.filter(grade => grade.course_offering_id === normalizeId(courseOfferingId));
    return simulateNetwork(data);
  },

  async getGrades(params = {}) {
    return simulateNetwork(paginate(mockDb.grades, params));
  },

  async submitGrade(payload) {
    const grade = { id: nextId(mockDb.grades), ...payload };
    mockDb.grades.push(grade);
    return simulateNetwork(grade);
  },

  async updateGrade(id, payload) {
    const idx = mockDb.grades.findIndex(g => g.id === normalizeId(id));
    if (idx === -1) throw new Error('Grade not found');
    const updated = { ...mockDb.grades[idx], ...payload };
    mockDb.grades[idx] = updated;
    return simulateNetwork(updated);
  },

  async getStudentGrades(studentId, params = {}) {
    const studentEnrollments = mockDb.enrollments.filter(enrollment => enrollment.student.id === normalizeId(studentId));
    const ids = studentEnrollments.map(e => e.id);
    const data = mockDb.grades.filter(grade => ids.includes(grade.enrollment_id));
    return simulateNetwork(paginate(data, params));
  },

  async getAcademicRecords(params = {}) {
    const data = mockDb.enrollments.map(enrollment => ({
      student_id: enrollment.student.id,
      term: enrollment.course_offering.term.name,
      course: enrollment.course_offering.course.course_code,
      status: enrollment.status
    }));
    return simulateNetwork(paginate(data, params));
  },

  async calculateGPA(studentId) {
    const studentGrades = await this.getStudentGrades(studentId);
    const gradesArray = Array.isArray(studentGrades) ? studentGrades : studentGrades.results || [];
    const gpa = gradesArray.length ? 3.4 : 0;
    return simulateNetwork({ gpa });
  }
};
