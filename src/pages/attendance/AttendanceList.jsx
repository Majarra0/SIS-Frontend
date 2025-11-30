import React, { useState, useMemo, useEffect } from 'react';
import { FaUserCheck, FaDownload, FaCalendarAlt, 
         FaBook, FaChartBar, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
import DataTable from '../../components/tables/DataTable';
import useAuth from '../../hooks/useAuth';

// Enhanced mock attendance data with more entries
const mockAttendance = [
  {
    id: 1,
    student: { id: '2023CS24', name: 'Ali Zaman', course: 'Computer Science' },
    course: { code: 'CS301', title: 'Data Structures' },
    date: '2025-05-01',
    status: 'present',
    checkedBy: 'Dr. Smith',
    checkedAt: '2025-05-01T09:15:00Z',
    notes: 'Participated actively in class'
  },
  {
    id: 2,
    student: { id: '2023CS35', name: 'Qassim Raad', course: 'Computer Science' },
    course: { code: 'CS301', title: 'Data Structures' },
    date: '2025-05-01',
    status: 'absent',
    checkedBy: 'Dr. Smith',
    checkedAt: '2025-05-01T09:20:00Z',
    notes: 'Medical leave'
  },
  {
    id: 3,
    student: { id: '2023003', name: 'Alex Johnson', course: 'Computer Science' },
    course: { code: 'CS302', title: 'Algorithms' },
    date: '2025-05-02',
    status: 'present',
    checkedBy: 'Dr. Williams',
    checkedAt: '2025-05-02T10:05:00Z',
    notes: ''
  }
];

// Unique courses extracted from mock data
const uniqueCourses = [...new Set(mockAttendance.map(item => item.course.code))].map(
  code => {
    const course = mockAttendance.find(item => item.course.code === code).course;
    return { code: course.code, title: course.title };
  }
);

const AttendanceList = () => {
  const [attendance, setAttendance] = useState(mockAttendance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    course: '',
    date: '',
    status: ''
  });
  const [bulkAction, setBulkAction] = useState('');

  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin' || userRole === 'teacher';

  // Apply filters to data
  const filteredData = useMemo(() => {
    return attendance.filter(record => 
      (!filters.course || record.course.code === filters.course) &&
      (!filters.date || record.date === filters.date) &&
      (!filters.status || record.status === filters.status)
    );
  }, [attendance, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(a => a.status === 'present').length;
    
    return {
      total,
      present,
      absent: total - present,
      rate: total ? ((present / total) * 100).toFixed(1) : '0.0',
      byCourse: Object.entries(
        filteredData.reduce((acc, curr) => {
          acc[curr.course.code] = acc[curr.course.code] || { total: 0, present: 0 };
          acc[curr.course.code].total++;
          if (curr.status === 'present') acc[curr.course.code].present++;
          return acc;
        }, {})
      )
    };
  }, [filteredData]);

  // Handle bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedRecords.length === 0) {
      return;
    }

    if (bulkAction === 'markPresent' || bulkAction === 'markAbsent') {
      const newStatus = bulkAction === 'markPresent' ? 'present' : 'absent';
      setAttendance(prev => 
        prev.map(record => 
          selectedRecords.includes(record.id) 
            ? { ...record, status: newStatus }
            : record
        )
      );
      
      // Success notification and reset selection
      alert(`${selectedRecords.length} records marked as ${newStatus}`);
      setSelectedRecords([]);
      setBulkAction('');
    } else if (bulkAction === 'delete' && isAdmin) {
      setAttendance(prev => 
        prev.filter(record => !selectedRecords.includes(record.id))
      );
      
      // Success notification and reset selection
      alert(`${selectedRecords.length} records deleted`);
      setSelectedRecords([]);
      setBulkAction('');
    }
  };

  // Export attendance data
  const exportData = () => {
    const csvData = filteredData.map(record => ({
      'Student ID': record.student.id,
      'Student Name': record.student.name,
      'Course': `${record.course.code} - ${record.course.title}`,
      'Date': record.date,
      'Status': record.status,
      'Recorded By': record.checkedBy,
      'Notes': record.notes
    }));
    
    // Simple CSV export
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(obj => Object.values(obj).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert('Data exported successfully');
  };

  // Toggle record selection
  const toggleSelection = (id) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(recordId => recordId !== id) 
        : [...prev, id]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ course: '', date: '', status: '' });
  };

  const columns = [
    {
      field: 'select',
      header: '',
      width: '40px',
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={selectedRecords.includes(row.id)}
          onChange={() => toggleSelection(row.id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      )
    },
    {
      field: 'student',
      header: 'Student',
      render: (student) => (
        <div>
          <div className="font-medium text-gray-900">{student.name}</div>
          <div className="text-sm text-gray-500">ID: {student.id}</div>
        </div>
      )
    },
    {
      field: 'course',
      header: 'Course',
      render: (course) => (
        <div className="flex items-center">
          <FaBook className="text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{course.code}</div>
            <div className="text-sm text-gray-500">{course.title}</div>
          </div>
        </div>
      )
    },
    {
      field: 'date',
      header: 'Date',
      render: (date) => (
        <div className="flex items-center">
          <FaCalendarAlt className="text-gray-400 mr-2" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      field: 'status',
      header: 'Status',
      render: (status) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${status === 'present' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'}`}
        >
          {status === 'present' ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setAttendance(prev => 
                prev.map(record => 
                  record.id === row.id 
                    ? { ...record, status: record.status === 'present' ? 'absent' : 'present' }
                    : record
                )
              );
            }}
            className={`p-1 rounded ${row.status === 'present' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
            title={row.status === 'present' ? 'Mark as present' : 'Mark as absent'}
          >
            {row.status === 'present' ? <FaTimes /> : <FaCheck />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaUserCheck className="text-blue-600 text-3xl mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-sm text-gray-500">
                {filteredData.length} records found
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700"
            >
              <FaChartBar className="mr-2" />
              {showStats ? 'Hide' : 'Show'} Stats
            </button>
            <button
              onClick={exportData}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg
                       hover:bg-green-700"
            >
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {showStats && (
        <div className="bg-white rounded-xl shadow-lg p-5 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Total Records</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Present</div>
              <div className="text-2xl font-bold text-green-900">{stats.present}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-red-600">Absent</div>
              <div className="text-2xl font-bold text-red-900">{stats.absent}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Attendance Rate</div>
              <div className="text-2xl font-bold text-purple-900">{stats.rate}%</div>
            </div>
          </div>
          
          {/* Course-specific stats */}
          {stats.byCourse.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-medium mb-2">Course-specific Attendance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stats.byCourse.map(([code, data]) => (
                  <div key={code} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{code}</div>
                    <div className="flex justify-between">
                      <span>{data.present}/{data.total} present</span>
                      <span className="font-medium">
                        {data.total ? ((data.present / data.total) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Bulk Actions Section */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-5">
        <div className="flex items-center mb-4">
          <FaFilter className="text-gray-400 mr-2" />
          <h2 className="text-lg font-medium">Filters & Actions</h2>
          {(filters.course || filters.date || filters.status) && (
            <button 
              onClick={resetFilters}
              className="ml-auto text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="w-full rounded-lg border-gray-300 p-2 border focus:border-blue-500"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-lg border-gray-300 p-2 border focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-lg border-gray-300 p-2 border focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          {selectedRecords.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulk Actions ({selectedRecords.length} selected)
              </label>
              <div className="flex space-x-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="flex-1 rounded-lg border-gray-300 p-2 border focus:border-blue-500"
                >
                  <option value="">Select Action</option>
                  <option value="markPresent">Mark Present</option>
                  <option value="markAbsent">Mark Absent</option>
                  {isAdmin && <option value="delete">Delete</option>}
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No attendance records found matching your filters
          </div>
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            pagination={true}
            pageSize={10}
            className="min-w-full divide-y divide-gray-200"
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceList;