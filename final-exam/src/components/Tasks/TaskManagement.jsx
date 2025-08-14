import React from 'react';
import TaskDashboard from './TaskDashboard';



const TaskManagement = ({ user, onLogout }) => {

  return <TaskDashboard user={user} onLogout={onLogout} />;
};

export default TaskManagement;