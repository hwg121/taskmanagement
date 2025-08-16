import React from 'react';
import AdminDashboard from './AdminDashboard';

const AdminManagement = ({ user, onLogout }) => {
  return <AdminDashboard user={user} onLogout={onLogout} />;
};

export default AdminManagement;

