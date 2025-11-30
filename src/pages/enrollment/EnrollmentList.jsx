import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrollments, getMyEnrollments, dropEnrollment } from '../../api/enrollment';
import DataTable from '../../components/tables/DataTable';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, enrollment: null });

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      let data;
      if (userRole === 'student') {
        data = await getMyEnrollments(filters);
      } else {
        data = await getEnrollments(filters);
      }
      setEnrollments(data.results || data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Failed to load enrollments');
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [userRole, filters]);

  const columns = [
    {
      field: 'course_offering',
      header: 'Course',
      render: (offering) => `${offering.course.code} - ${offering.course.title}`
    },
    {
      field: 'student',
      header: 'Student',
      render: (student) => `${student.personal_info.first_name} ${student.personal_info.last_name}`,
      hidden: userRole === 'student'
    },
    {
      field: 'enrollment_date',
      header: 'Enrollment Date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      field: 'status',
      header: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded text-sm ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    }
  ].filter(col => !col.hidden);

  const handleDrop = async (enrollment) => {
    try {
      await dropEnrollment(enrollment.id);
      toast.success('Course dropped successfully');
      fetchEnrollments();
      setDeleteModal({ isOpen: false, enrollment: null });
    } catch (err) {
      toast.error('Failed to drop course');
    }
  };

  const actions = userRole === 'admin' ? [
    {
      label: 'Edit',
      onClick: (enrollment) => navigate(`/admin/enrollments/${enrollment.id}/edit`),
      className: 'bg-yellow-500 text-white hover:bg-yellow-600'
    },
    {
      label: 'Drop',
      onClick: (enrollment) => setDeleteModal({ isOpen: true, enrollment }),
      className: 'bg-red-500 text-white hover:bg-red-600'
    }
  ] : [];

  return (
    <div className="container mx-auto p-4">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Drop Course"
        message={`Are you sure you want to drop ${deleteModal.enrollment?.course_offering.course.code}?`}
        onConfirm={() => handleDrop(deleteModal.enrollment)}
        onCancel={() => setDeleteModal({ isOpen: false, enrollment: null })}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Enrollments</h1>
        {userRole === 'student' && (
          <button
            onClick={() => navigate('/student/enrollments/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enroll in Courses
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <DataTable
          data={enrollments}
          columns={columns}
          actions={actions}
          pagination={true}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default EnrollmentList;