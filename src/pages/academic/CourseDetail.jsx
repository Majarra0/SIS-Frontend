import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '../../api/academic';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [prerequisiteDetails, setPrerequisiteDetails] = useState({});

  const fetchPrerequisiteDetails = async (courseId) => {
    try {
      const data = await getCourse(courseId);
      setPrerequisiteDetails(prev => ({
        ...prev,
        [courseId]: {
          course_code: data.course_code,
          title: data.title
        }
      }));
    } catch (err) {
      console.error(`Error fetching prerequisite details for course ${courseId}:`, err);
    }
  };
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourse(id);
        setCourse(data);
        
        // Fetch details for each prerequisite
        if (data.prerequisites?.length > 0) {
          await Promise.all(
            data.prerequisites.map(prereq => 
              fetchPrerequisiteDetails(prereq.required_course)
            )
          );
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details');
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-2 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!course) {
    return null;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{course.course_code}: {course.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => navigate(`/admin/courses/${id}/edit`)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Course Information</h2>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-600">Code:</span>
              <span className="col-span-2 font-medium">{course.course_code}</span>
              
              <span className="text-gray-600">Credits:</span>
              <span className="col-span-2 font-medium">{course.credit_hours}</span>
              
              <span className="text-gray-600">Level:</span>
              <span className="col-span-2 font-medium">{course.course_level}00 Level</span>
              
              <span className="text-gray-600">Department:</span>
              <span className="col-span-2 font-medium">{course.department?.name || 'N/A'}</span>

              <span className="text-gray-600">Status:</span>
              <span className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
          </div>
          <div>
    <h2 className="text-lg font-medium mb-2">Prerequisites</h2>
    {course.prerequisites?.length > 0 ? (
      <ul className="list-disc list-inside">
        {course.prerequisites.map((prereq, index) => {
          const details = prerequisiteDetails[prereq.required_course];
          return (
            <li 
              key={`${prereq.required_course}-${index}`} 
              className="mb-2"
            >
              <span className="font-medium">
                {details?.course_code}
              </span>
              {details && `: ${details.title}`}
              <span className="text-sm text-gray-600 ml-2">
                (Min. Grade: {prereq.minimum_grade})
              </span>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="text-gray-600">No prerequisites</p>
    )}
  </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700">{course.description}</p>
        </div>
      </div>
      
      {/* Syllabus section */}
      {course.syllabus && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-2">Syllabus</h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: course.syllabus }} />
          </div>
        </div>
      )}
      
      {/* Current offerings section */}
      {course.offerings && course.offerings.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium mb-2">Current Offerings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Term</th>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-left">Faculty</th>
                  <th className="px-4 py-2 text-left">Schedule</th>
                  <th className="px-4 py-2 text-left">Room</th>
                  <th className="px-4 py-2 text-left">Capacity</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
              {course.offerings.map((offering) => (
                  <tr key={offering.id} className="border-t">
                    <td className="px-4 py-2">{offering.term.name}</td>
                    <td className="px-4 py-2">{offering.section_number}</td>
                    <td className="px-4 py-2">
                      {`${offering.faculty.personal_info.first_name} ${offering.faculty.personal_info.last_name}`}
                    </td>
                    <td className="px-4 py-2">{offering.schedule}</td>
                    <td className="px-4 py-2">{offering.room}</td>
                    <td className="px-4 py-2">{offering.capacity}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        offering.status === 'OPEN' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {offering.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;