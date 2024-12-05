
import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar.jsx';

import './Layout.css'; // Add styles for layout if needed

const Layout = () => {
    return (
        <div className="layout">
            <StudentSidebar /> {/* Persistent Sidebar */}
            <div className="content">
                <Outlet /> {/* Dynamic content for the current route */}
            </div>
        </div>
    );
};

export default Layout;
