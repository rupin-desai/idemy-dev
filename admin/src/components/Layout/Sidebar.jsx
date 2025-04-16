// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/blockchain', label: 'Blockchain Explorer' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/create-transaction', label: 'Create Transaction' },
    { path: '/student-transactions', label: 'Student Tracker' }, // Add this line
    { path: '/mine', label: 'Mine Block' },
    { path: '/wallet', label: 'Wallet' },
  ];
  
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Blockchain Admin</h1>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link 
                to={item.path} 
                className={`block p-2 rounded-md ${location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;