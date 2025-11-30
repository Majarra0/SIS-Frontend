import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaBuilding, FaCalendar, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Mock user data
const mockUserData = {
  id: "2023CS1234",
  role: "student",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@university.edu",
  phone: "+1 (555) 123-4567",
  department: "Computer Science",
  joinDate: "2023-09-01",
  academicInfo: {
    program: "Bachelor of Science",
    year: 2,
    advisor: "Dr. Sarah Johnson",
    status: "Active"
  },
  personalInfo: {
    dateOfBirth: "2000-05-15",
    address: "123 University Ave, College Town, ST 12345",
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Parent",
      phone: "+1 (555) 987-6543"
    }
  }
};

const UserProfile = () => {
  const [user] = useState(mockUserData);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: user.phone,
    address: user.personalInfo.address
  });

  const handleContactUpdate = async (e) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Contact information updated successfully');
    setIsEditingContact(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <FaUser className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-gray-600">View and manage your profile information</p>
            </div>
          </div>
        </div>

        {/* Main Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="flex items-center text-gray-900">
                      <FaIdCard className="text-gray-400 mr-2" />
                      {user.id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="flex items-center text-gray-900">
                      <FaBuilding className="text-gray-400 mr-2" />
                      {user.department}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="flex items-center text-gray-900">
                      <FaCalendar className="text-gray-400 mr-2" />
                      {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="flex items-center text-gray-900">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      {user.email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Program Status</p>
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {user.academicInfo.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="text-gray-900">{user.academicInfo.program}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-gray-900">Year {user.academicInfo.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic Advisor</p>
                <p className="text-gray-900">{user.academicInfo.advisor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <FaEdit className="mr-1" />
              {isEditingContact ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingContact ? (
            <form onSubmit={handleContactUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingContact(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="flex items-center text-gray-900">
                    <FaPhone className="text-gray-400 mr-2" />
                    {user.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="flex items-center text-gray-900">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    {user.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{user.personalInfo.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 text-yellow-600">
            <FaLock />
            <span className="text-sm">
              To change your password, please contact the IT department
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;