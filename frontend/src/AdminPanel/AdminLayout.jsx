
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';

import './AdminLayout.css'; // Add styles for layout if needed

const AdminLayout = () => {
    return (
        <div className="layout">
            <AdminSidebar /> {/* Persistent Sidebar */}
            <div className="content">
                <Outlet /> {/* Dynamic content for the current route */}
            </div>
        </div>
    );
};

export default AdminLayout;
