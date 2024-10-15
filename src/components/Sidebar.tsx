import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, CalendarClock, ChevronLeft, ChevronRight, LogOut, BarChart2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useUser();

  const sidebarItems = [
    { id: 'employeeProfiles', label: 'LIST OF PROFILES', icon: Users, path: '/' },
    { id: 'upcomingProfiles', label: 'UPCOMING PROFILES', icon: Calendar, path: '/upcoming-profiles' },
    { id: 'interviewScheduler', label: 'INTERVIEW SCHEDULES', icon: CalendarClock, path: '/interview-scheduler' },
    { id: 'dashboard', label: 'DASHBOARD', icon: BarChart2, path: '/dashboard' },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } fixed h-full`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
          {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="mt-8">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center py-2 px-4 ${
              location.pathname === item.path ? 'bg-gray-700' : ''
            } hover:bg-gray-700`}
          >
            <item.icon className={`${collapsed ? 'mx-auto' : 'mr-4'}`} size={24} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      {user && (
        <button
          onClick={logout}
          className="absolute bottom-4 left-0 right-0 flex items-center justify-center py-2 px-4 hover:bg-gray-700"
        >
          <LogOut className={`${collapsed ? 'mx-auto' : 'mr-4'}`} size={24} />
          {!collapsed && <span>Logout</span>}
        </button>
      )}
    </aside>
  );
};

export default Sidebar;