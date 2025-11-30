import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa';

const mockScheduleData = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timeSlots: [
    '08:30 - 09:30',
    '09:30 - 10:30',
    '10:30 - 11:30',
    '11:30 - 12:30',
    '12:30 - 13:30'
  ],
  courses: [
    {
      id: 1,
      courseCode: 'CS101',
      title: 'Programming Fundamentals',
      instructor: 'Dr. Ahmad Khalid Mahmoud',
      room: 'Room 101',
      day: 'Monday',
      timeSlot: '08:30 - 09:30',
      color: 'blue',
      department: 'CS'
    },
    {
      id: 2,
      courseCode: 'MATH201',
      title: 'Linear Algebra',
      instructor: 'Prof. Omar Youssef Ibrahim',
      room: 'Room 205',
      day: 'Monday',
      timeSlot: '10:30 - 11:30',
      color: 'purple',
      department: 'MATH'
    },
    {
      id: 3,
      courseCode: 'EE201',
      title: 'Circuit Analysis',
      instructor: 'Dr. Mohammed Firas Jamal',
      room: 'Lab 301',
      day: 'Tuesday',
      timeSlot: '09:30 - 10:30',
      color: 'green',
      department: 'EE'
    },
    {
      id: 4,
      courseCode: 'CS201',
      title: 'Data Structures',
      instructor: 'Prof. Tariq Nabil Hassan',
      room: 'Lab 102',
      day: 'Wednesday',
      timeSlot: '08:30 - 09:30',
      color: 'blue',
      department: 'CS'
    },
    {
      id: 5,
      courseCode: 'MATH202',
      title: 'Discrete Mathematics',
      instructor: 'Dr. Ali Samir Farouk',
      room: 'Room 303',
      day: 'Thursday',
      timeSlot: '11:30 - 12:30',
      color: 'purple',
      department: 'MATH'
    },
    {
      id: 6,
      courseCode: 'EE202',
      title: 'Digital Electronics',
      instructor: 'Dr. Ahmad Khalid Mahmoud',
      room: 'Lab 302',
      day: 'Friday',
      timeSlot: '12:30 - 13:30',
      color: 'green',
      department: 'EE'
    },
    {
      id: 7,
      courseCode: 'CS301',
      title: 'Database Systems',
      instructor: 'Prof. Omar Youssef Ibrahim',
      room: 'Room 201',
      day: 'Wednesday',
      timeSlot: '11:30 - 12:30',
      color: 'blue',
      department: 'CS'
    },
    {
      id: 8,
      courseCode: 'MATH301',
      title: 'Numerical Analysis',
      instructor: 'Dr. Mohammed Firas Jamal',
      room: 'Room 304',
      day: 'Thursday',
      timeSlot: '09:30 - 10:30',
      color: 'purple',
      department: 'MATH'
    }
  ]
};

const colorClasses = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200'
};

const CourseSchedule = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2025');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  const getCourseForSlot = (day, timeSlot) => {
    return mockScheduleData.courses.find(
      course => course.day === day && 
                course.timeSlot === timeSlot &&
                (selectedDepartment === '' || course.department === selectedDepartment)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Schedule</h1>
              <p className="text-sm text-gray-500">
                Faculty of Engineering - Spring 2025
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option>Spring 2025</option>
              <option>Fall 2024</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              <option value="CS">Computer Science</option>
              <option value="EE">Electrical Engineering</option>
              <option value="MATH">Mathematics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                {mockScheduleData.days.map((day) => (
                  <th
                    key={day}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockScheduleData.timeSlots.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      {timeSlot}
                    </div>
                  </td>
                  {mockScheduleData.days.map((day) => {
                    const course = getCourseForSlot(day, timeSlot);
                    return (
                      <td key={`${day}-${timeSlot}`} className="px-6 py-4">
                        {course ? (
                          <div className={`p-3 rounded-lg border ${colorClasses[course.color]}`}>
                            <div className="font-medium mb-1">{course.courseCode}</div>
                            <div className="text-sm mb-1">{course.title}</div>
                            <div className="text-xs flex items-center">
                              <FaChalkboardTeacher className="mr-1" />
                              {course.instructor}
                            </div>
                            <div className="text-xs flex items-center mt-1">
                              <FaBuilding className="mr-1" />
                              {course.room}
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            Available
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseSchedule;