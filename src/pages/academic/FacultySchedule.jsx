import React, { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaBook, 
         FaClipboardList, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mock data for faculty's courses
const mockFacultyCourses = [
  {
    id: 1,
    code: 'CS301',
    title: 'Data Structures',
    schedule: 'Mon/Wed 10:00-11:30',
    students: 35,
    color: 'blue'
  },
  {
    id: 2,
    code: 'CS401',
    title: 'Advanced Algorithms',
    schedule: 'Tue/Thu 13:00-14:30',
    students: 28,
    color: 'green'
  },
  {
    id: 3,
    code: 'CS450',
    title: 'Database Systems',
    schedule: 'Mon/Wed 14:00-15:30',
    students: 32,
    color: 'purple'
  }
];

// Mock data for calendar events
const mockEvents = [
  {
    id: 1,
    courseId: 1,
    title: 'Midterm Exam',
    type: 'exam',
    date: '2025-05-15',
    time: '10:00',
    description: 'Covers chapters 1-5',
    location: 'Room 301'
  },
  {
    id: 2,
    courseId: 1,
    title: 'Project Deadline',
    type: 'deadline',
    date: '2025-05-20',
    time: '23:59',
    description: 'Final project submission',
    location: 'Online'
  },
  {
    id: 3,
    courseId: 2,
    title: 'Guest Lecture',
    type: 'lecture',
    date: '2025-05-10',
    time: '13:00',
    description: 'Industry expert presentation',
    location: 'Auditorium A'
  },
  {
    id: 4,
    courseId: 3,
    title: 'Office Hours',
    type: 'office-hours',
    date: '2025-05-12',
    time: '16:00-18:00',
    description: 'Student consultations',
    location: 'Office 205'
  },
  {
    id: 5,
    courseId: 2,
    title: 'Quiz 2',
    type: 'exam',
    date: '2025-05-18',
    time: '13:00',
    description: 'Short quiz on recent material',
    location: 'Room 401'
  }
];

const eventTypes = {
  exam: {
    icon: <FaBook className="flex-shrink-0" />,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300'
  },
  deadline: {
    icon: <FaClipboardList className="flex-shrink-0" />,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300'
  },
  lecture: {
    icon: <FaClock className="flex-shrink-0" />,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300'
  },
  'office-hours': {
    icon: <FaEdit className="flex-shrink-0" />,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300'
  }
};

// Course colors mapping
const courseColors = {
  blue: {
    light: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-700'
  },
  green: {
    light: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700'
  },
  purple: {
    light: 'bg-purple-50',
    border: 'border-purple-500',
    text: 'text-purple-700'
  }
};

const FacultySchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(mockEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedView, setSelectedView] = useState('month');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Get calendar days for the current month
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Add previous month's days
    const firstDay = date.getDay();
    for (let i = firstDay; i > 0; i--) {
      days.push({
        date: new Date(year, month, -i + 1),
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    while (date.getMonth() === month) {
      days.push({
        date: new Date(date),
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString()
      });
      date.setDate(date.getDate() + 1);
    }
    
    // Add next month's days
    const lastDay = new Date(year, month + 1, 0).getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    let filtered = events.filter(event => event.date === dateStr);
    
    // If a course is selected, filter events for that course
    if (selectedCourse) {
      filtered = filtered.filter(event => event.courseId === selectedCourse);
    }
    
    return filtered;
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? {...e, ...eventData} : e));
    } else {
      // Add new event
      const newEvent = {
        id: events.length + 1,
        ...eventData
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowEventModal(false);
  };

  const handleCourseFilter = (courseId) => {
    if (selectedCourse === courseId) {
      setSelectedCourse(null); // Toggle off if already selected
    } else {
      setSelectedCourse(courseId); // Select the course
    }
  };

  const getCourseById = (courseId) => {
    return mockFacultyCourses.find(course => course.id === courseId);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day, idx) => (
            <div key={idx} className="bg-gray-100 p-2 text-center">
              <div className="text-sm font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className={`text-sm rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                day.toDateString() === new Date().toDateString() 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600'
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-24 gap-px bg-gray-200 h-96 overflow-y-auto">
          {weekDays.map((day, dayIdx) => {
            const dayEvents = getEventsForDate(day);
            
            return (
              <div key={dayIdx} className="bg-white relative">
                {dayEvents.map((event, eventIdx) => {
                  const course = getCourseById(event.courseId);
                  const eventType = eventTypes[event.type];
                  
                  return (
                    <div 
                      key={eventIdx}
                      className={`absolute w-full px-2 py-1 ${eventType.bgColor} ${eventType.borderColor} 
                                border-l-4 rounded-r mb-1 cursor-pointer text-xs overflow-hidden`}
                      style={{
                        top: `${parseInt(event.time.split(':')[0]) * 4}%`,
                        height: '12%'
                      }}
                      onClick={() => handleEditEvent(event)}
                    >
                      <div className="flex items-center">
                        {eventType.icon}
                        <span className="ml-1 font-medium truncate">{event.title}</span>
                      </div>
                      <div className="truncate">{course?.code} - {event.time}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const filteredEvents = selectedCourse 
      ? events.filter(event => event.courseId === selectedCourse)
      : events;
    
    // Sort events by date and time
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEvents.map(event => {
              const course = getCourseById(event.courseId);
              const eventType = eventTypes[event.type];
              
              return (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${eventType.bgColor} flex items-center justify-center`}>
                        {eventType.icon}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${courseColors[course?.color].light} ${courseColors[course?.color].text}`}>
                      {course?.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div>{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-7 gap-1 mt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {getDaysInMonth().map((day, idx) => {
            const dayEvents = getEventsForDate(day.date);
            
            return (
              <div
                key={idx}
                className={`min-h-[120px] p-2 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${
                  day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth 
                    ? day.isToday 
                      ? 'text-blue-600' 
                      : 'text-gray-900' 
                    : 'text-gray-400'
                }`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.length > 0 && dayEvents.slice(0, 3).map(event => {
                    const course = getCourseById(event.courseId);
                    const eventType = eventTypes[event.type];
                    
                    return (
                      <div
                        key={event.id}
                        className={`${eventType.bgColor} ${eventType.textColor} ${eventType.borderColor} 
                                  text-xs p-1 rounded border-l-4 cursor-pointer truncate`}
                        onClick={() => handleEditEvent(event)}
                      >
                        <div className="flex items-center">
                          {eventType.icon}
                          <span className="ml-1 truncate">{event.title}</span>
                        </div>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      + {dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEventModal = () => {
    if (!showEventModal) return null;
    
    const event = selectedEvent || {
      title: '',
      courseId: mockFacultyCourses[0].id,
      type: 'lecture',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      description: '',
      location: ''
    };
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Event title"
                defaultValue={event.title}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={event.courseId}
                >
                  {mockFacultyCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={event.type}
                >
                  <option value="lecture">Lecture</option>
                  <option value="exam">Exam</option>
                  <option value="deadline">Deadline</option>
                  <option value="office-hours">Office Hours</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={event.date}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={event.time}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Room number or location"
                defaultValue={event.location}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Event details"
                defaultValue={event.description}
              />
            </div>
          </form>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              onClick={() => setShowEventModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveEvent({
                ...event,
                // In a real app, we would collect values from form fields
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Schedule</h1>
              <p className="text-sm text-gray-500">
                Manage your courses, exams, and deadlines
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAddEvent}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white 
                       rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Event
            </button>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="month">Month View</option>
              <option value="week">Week View</option>
              <option value="list">List View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (selectedView === 'month') {
                newDate.setMonth(selectedDate.getMonth() - 1);
              } else if (selectedView === 'week') {
                newDate.setDate(selectedDate.getDate() - 7);
              }
              setSelectedDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedView === 'month' && selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            {selectedView === 'week' && `Week of ${getWeekDays()[0].toLocaleDateString()} - ${getWeekDays()[6].toLocaleDateString()}`}
            {selectedView === 'list' && 'All Events'}
          </h2>
          
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (selectedView === 'month') {
                newDate.setMonth(selectedDate.getMonth() + 1);
              } else if (selectedView === 'week') {
                newDate.setDate(selectedDate.getDate() + 7);
              }
              setSelectedDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Courses Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCourse(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium 
                   ${!selectedCourse ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
        >
          All Courses
        </button>
        {mockFacultyCourses.map(course => (
          <button
            key={course.id}
            onClick={() => handleCourseFilter(course.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium 
                     ${selectedCourse === course.id 
                       ? `${courseColors[course.color].light} ${courseColors[course.color].text}`
                       : 'bg-gray-100 text-gray-800'}`}
          >
            {course.code}
          </button>
        ))}
      </div>

      {/* Courses Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {mockFacultyCourses.map(course => (
          <div 
            key={course.id} 
            className={`bg-white rounded-xl shadow-lg p-4 ${courseColors[course.color].border} border-l-4 cursor-pointer
                     ${selectedCourse === course.id ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => handleCourseFilter(course.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{course.code}</h3>
                <p className="text-sm text-gray-500">{course.title}</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {course.students} students
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-2">{course.schedule}</div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <span>{events.filter(e => e.courseId === course.id && e.type === 'exam').length} Exams</span>
              <span>{events.filter(e => e.courseId === course.id && e.type === 'deadline').length} Deadlines</span>
              <span>{events.filter(e => e.courseId === course.id).length} Total Events</span>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {selectedView === 'month' && renderMonthView()}
      {selectedView === 'week' && renderWeekView()}
      {selectedView === 'list' && renderListView()}
      
      {/* Event Modal */}
      {renderEventModal()}
    </div>
  );
};

export default FacultySchedule;