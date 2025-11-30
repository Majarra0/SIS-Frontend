const departments = [
  {
    id: 1,
    name: 'Computer Science',
    department_code: 'CS',
    code: 'CS',
    description: 'Software engineering, data science, and AI programs.',
    is_active: true
  },
  {
    id: 2,
    name: 'Mathematics',
    department_code: 'MATH',
    code: 'MATH',
    description: 'Applied and pure mathematics.',
    is_active: true
  },
  {
    id: 3,
    name: 'Physics',
    department_code: 'PHYS',
    code: 'PHYS',
    description: 'Physics and astronomy.',
    is_active: true
  },
  {
    id: 4,
    name: 'Business',
    department_code: 'BUS',
    code: 'BUS',
    description: 'Management and finance.',
    is_active: true
  }
];

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@sis.test',
    role: 'admin',
    is_active: true,
    department: departments[0],
    personal_info: {
      first_name: 'Amina',
      middle_name: '',
      last_name: 'Rahman',
      gender: 'F',
      date_of_birth: '1985-06-12',
      national_id: 'ADM001'
    },
    contact_info: {
      primary_phone: '+974-5555-1000',
      emergency_contact_name: 'Kareem Rahman',
      emergency_contact_phone: '+974-5555-1001',
      emergency_contact_relation: 'Spouse',
      address: '123 Admin St',
      city: 'Doha',
      state: '',
      country: 'Qatar'
    }
  },
  {
    id: 2,
    username: 'faculty',
    password: 'password',
    email: 'omar.saleh@sis.test',
    role: 'faculty',
    is_active: true,
    department: departments[0],
    personal_info: {
      first_name: 'Omar',
      middle_name: 'Youssef',
      last_name: 'Saleh',
      gender: 'M',
      date_of_birth: '1978-09-05',
      national_id: 'FAC145'
    },
    contact_info: {
      primary_phone: '+974-5555-2000',
      emergency_contact_name: 'Leila Saleh',
      emergency_contact_phone: '+974-5555-2001',
      emergency_contact_relation: 'Spouse',
      address: '45 Faculty Ave',
      city: 'Doha',
      state: '',
      country: 'Qatar'
    }
  },
  {
    id: 3,
    username: 'physics',
    password: 'password',
    email: 'sarah.najib@sis.test',
    role: 'faculty',
    is_active: true,
    department: departments[2],
    personal_info: {
      first_name: 'Sarah',
      middle_name: 'K.',
      last_name: 'Najib',
      gender: 'F',
      date_of_birth: '1982-11-20',
      national_id: 'FAC199'
    },
    contact_info: {
      primary_phone: '+974-5555-2100',
      emergency_contact_name: 'Omar Najib',
      emergency_contact_phone: '+974-5555-2101',
      emergency_contact_relation: 'Spouse',
      address: '12 Crescent Rd',
      city: 'Doha',
      state: '',
      country: 'Qatar'
    }
  },
  {
    id: 4,
    username: 'student',
    password: 'password',
    email: 'layla.yousef@sis.test',
    role: 'student',
    is_active: true,
    department: departments[0],
    personal_info: {
      first_name: 'Layla',
      middle_name: '',
      last_name: 'Yousef',
      gender: 'F',
      date_of_birth: '2004-04-15',
      national_id: 'STU3001'
    },
    contact_info: {
      primary_phone: '+974-5555-3001',
      emergency_contact_name: 'Hassan Yousef',
      emergency_contact_phone: '+974-5555-3002',
      emergency_contact_relation: 'Father',
      address: '321 Student Rd',
      city: 'Doha',
      state: '',
      country: 'Qatar'
    }
  },
  {
    id: 5,
    username: 'student2',
    password: 'password',
    email: 'omar.ramzi@sis.test',
    role: 'student',
    is_active: true,
    department: departments[1],
    personal_info: {
      first_name: 'Omar',
      middle_name: '',
      last_name: 'Ramzi',
      gender: 'M',
      date_of_birth: '2003-12-01',
      national_id: 'STU3002'
    },
    contact_info: {
      primary_phone: '+974-5555-3003',
      emergency_contact_name: 'Samir Ramzi',
      emergency_contact_phone: '+974-5555-3004',
      emergency_contact_relation: 'Father',
      address: '54 Student Ln',
      city: 'Doha',
      state: '',
      country: 'Qatar'
    }
  },
  {
    id: 6,
    username: 'student3',
    password: 'password',
    email: 'sara.mansour@sis.test',
    role: 'student',
    is_active: true,
    department: departments[3],
    personal_info: {
      first_name: 'Sara',
      middle_name: 'Ali',
      last_name: 'Mansour',
      gender: 'F',
      date_of_birth: '2004-02-22',
      national_id: 'STU3003'
    },
    contact_info: {
      primary_phone: '+974-5555-3005',
      emergency_contact_name: 'Mona Mansour',
      emergency_contact_phone: '+974-5555-3006',
      emergency_contact_relation: 'Mother',
      address: '99 Market St',
      city: 'Doha',
      state: '',
      country: 'Qatar'
    }
  }
];

const programs = [
  {
    id: 1,
    program_code: 'BSCS',
    name: 'B.Sc. Computer Science',
    department_id: 1,
    total_credits_required: 120,
    minimum_gpa: 2.5,
    degree_level: 'bachelor',
    is_active: true
  },
  {
    id: 2,
    program_code: 'BSMATH',
    name: 'B.Sc. Mathematics',
    department_id: 2,
    total_credits_required: 120,
    minimum_gpa: 2.5,
    degree_level: 'bachelor',
    is_active: true
  }
];

const courses = [
  {
    id: 1,
    course_code: 'CS101',
    code: 'CS101',
    title: 'Introduction to Programming',
    description: 'Fundamentals of programming using Python.',
    credit_hours: 3,
    credits: 3,
    department: departments[0],
    department_id: 1,
    course_level: 100,
    is_active: true,
    prerequisites: []
  },
  {
    id: 2,
    course_code: 'CS201',
    code: 'CS201',
    title: 'Data Structures',
    description: 'Core data structures and algorithms.',
    credit_hours: 3,
    credits: 3,
    department: departments[0],
    department_id: 1,
    course_level: 200,
    is_active: true,
    prerequisites: [
      { required_course: 1, minimum_grade: 2.0 }
    ]
  },
  {
    id: 3,
    course_code: 'CS301',
    code: 'CS301',
    title: 'Algorithms',
    description: 'Algorithm design and analysis.',
    credit_hours: 3,
    credits: 3,
    department: departments[0],
    department_id: 1,
    course_level: 300,
    is_active: true,
    prerequisites: [
      { required_course: 2, minimum_grade: 2.0 }
    ]
  },
  {
    id: 4,
    course_code: 'MATH201',
    code: 'MATH201',
    title: 'Linear Algebra',
    description: 'Matrices, vectors, and linear transformations.',
    credit_hours: 4,
    credits: 4,
    department: departments[1],
    department_id: 2,
    course_level: 200,
    is_active: true,
    prerequisites: []
  },
  {
    id: 5,
    course_code: 'BUS101',
    code: 'BUS101',
    title: 'Principles of Management',
    description: 'Foundations of business management and leadership.',
    credit_hours: 3,
    credits: 3,
    department: departments[3],
    department_id: 4,
    course_level: 100,
    is_active: true,
    prerequisites: []
  }
];

const terms = [
  {
    id: 1,
    name: 'Spring 2025',
    start_date: '2025-01-10',
    end_date: '2025-05-20',
    is_current: true
  },
  {
    id: 2,
    name: 'Fall 2024',
    start_date: '2024-08-20',
    end_date: '2024-12-15',
    is_current: false
  }
];

const courseOfferings = [
  {
    id: 1,
    course: courses[1],
    course_id: courses[1].id,
    term: terms[0],
    faculty: users[1],
    section_number: 'A',
    capacity: 35,
    schedule: 'Mon/Wed 10:00 - 11:15',
    room: 'Room 201',
    status: 'OPEN'
  },
  {
    id: 2,
    course: courses[2],
    course_id: courses[2].id,
    term: terms[0],
    faculty: users[1],
    section_number: 'B',
    capacity: 30,
    schedule: 'Tue/Thu 12:00 - 13:15',
    room: 'Room 305',
    status: 'OPEN'
  },
  {
    id: 3,
    course: courses[3],
    course_id: courses[3].id,
    term: terms[0],
    faculty: users[2],
    section_number: 'A',
    capacity: 40,
    schedule: 'Tue/Thu 09:00 - 10:15',
    room: 'Room 110',
    status: 'OPEN'
  }
];

courses.forEach(course => {
  course.offerings = courseOfferings.filter(offering => offering.course_id === course.id);
});

const enrollments = [
  {
    id: 1,
    course_offering: courseOfferings[0],
    student: users[3],
    enrollment_date: '2025-01-22',
    status: 'active'
  },
  {
    id: 2,
    course_offering: courseOfferings[1],
    student: users[3],
    enrollment_date: '2025-01-23',
    status: 'active'
  },
  {
    id: 3,
    course_offering: courseOfferings[2],
    student: users[4],
    enrollment_date: '2025-01-25',
    status: 'active'
  }
];

const attendanceRecords = [];

const gradeComponents = [
  { id: 1, course_offering_id: 1, name: 'Midterm Exam', weight: 30 },
  { id: 2, course_offering_id: 1, name: 'Final Exam', weight: 40 },
  { id: 3, course_offering_id: 2, name: 'Project', weight: 35 }
];

const grades = [
  {
    id: 1,
    enrollment_id: 1,
    course_offering_id: 1,
    grade_component_id: 1,
    score: 88,
    comment: 'Great work on problem solving.'
  },
  {
    id: 2,
    enrollment_id: 1,
    course_offering_id: 1,
    grade_component_id: 2,
    score: 91,
    comment: 'Excellent final exam.'
  },
  {
    id: 3,
    enrollment_id: 2,
    course_offering_id: 2,
    grade_component_id: 3,
    score: 84,
    comment: 'Solid project implementation.'
  }
];

departments[0].head_faculty = users[1];
departments[0].head = users[1];
departments[1].head_faculty = null;
departments[2].head_faculty = users[2];
departments[2].head = users[2];
departments[3].head_faculty = null;

export const mockDb = {
  departments,
  users,
  programs,
  courses,
  terms,
  courseOfferings,
  enrollments,
  attendanceRecords,
  gradeComponents,
  grades
};
