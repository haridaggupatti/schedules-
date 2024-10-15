import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardData {
  totalProfiles: number;
  schedulesCompleted: number;
  profilesProcessedThisWeek: number;
  interviewsConducted: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  interviewsCleared: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  candidatesPlaced: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  weeklyStats: Array<{ day: string; interviews: number; cleared: number; placed: number }>;
  monthlyStats: Array<{ week: string; interviews: number; cleared: number; placed: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const initialDashboardData: DashboardData = {
  totalProfiles: 0,
  schedulesCompleted: 0,
  profilesProcessedThisWeek: 0,
  interviewsConducted: { daily: 0, weekly: 0, monthly: 0 },
  interviewsCleared: { daily: 0, weekly: 0, monthly: 0 },
  candidatesPlaced: { daily: 0, weekly: 0, monthly: 0 },
  weeklyStats: [
    { day: 'Mon', interviews: 0, cleared: 0, placed: 0 },
    { day: 'Tue', interviews: 0, cleared: 0, placed: 0 },
    { day: 'Wed', interviews: 0, cleared: 0, placed: 0 },
    { day: 'Thu', interviews: 0, cleared: 0, placed: 0 },
    { day: 'Fri', interviews: 0, cleared: 0, placed: 0 },
  ],
  monthlyStats: [
    { week: 'Week 1', interviews: 0, cleared: 0, placed: 0 },
    { week: 'Week 2', interviews: 0, cleared: 0, placed: 0 },
    { week: 'Week 3', interviews: 0, cleared: 0, placed: 0 },
    { week: 'Week 4', interviews: 0, cleared: 0, placed: 0 },
  ],
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);

  useEffect(() => {
    const fetchDashboardData = () => {
      // In a real application, you would make API calls to fetch data from different modules
      // For this example, we'll use the initial data structure with all zeros
      setDashboardData(prevData => ({
        ...prevData,
        // Simulate small increments to show real-time updates
        totalProfiles: prevData.totalProfiles + Math.floor(Math.random() * 3),
        schedulesCompleted: prevData.schedulesCompleted + Math.floor(Math.random() * 2),
        profilesProcessedThisWeek: prevData.profilesProcessedThisWeek + Math.floor(Math.random() * 2),
        interviewsConducted: {
          daily: prevData.interviewsConducted.daily + Math.floor(Math.random() * 2),
          weekly: prevData.interviewsConducted.weekly + Math.floor(Math.random() * 3),
          monthly: prevData.interviewsConducted.monthly + Math.floor(Math.random() * 5),
        },
        interviewsCleared: {
          daily: prevData.interviewsCleared.daily + Math.floor(Math.random() * 2),
          weekly: prevData.interviewsCleared.weekly + Math.floor(Math.random() * 3),
          monthly: prevData.interviewsCleared.monthly + Math.floor(Math.random() * 4),
        },
        candidatesPlaced: {
          daily: prevData.candidatesPlaced.daily + Math.floor(Math.random() * 1),
          weekly: prevData.candidatesPlaced.weekly + Math.floor(Math.random() * 2),
          monthly: prevData.candidatesPlaced.monthly + Math.floor(Math.random() * 3),
        },
        weeklyStats: prevData.weeklyStats.map(stat => ({
          ...stat,
          interviews: stat.interviews + Math.floor(Math.random() * 2),
          cleared: stat.cleared + Math.floor(Math.random() * 2),
          placed: stat.placed + Math.floor(Math.random() * 1),
        })),
        monthlyStats: prevData.monthlyStats.map(stat => ({
          ...stat,
          interviews: stat.interviews + Math.floor(Math.random() * 3),
          cleared: stat.cleared + Math.floor(Math.random() * 2),
          placed: stat.placed + Math.floor(Math.random() * 2),
        })),
      }));
    };

    // Fetch data initially
    fetchDashboardData();

    // Set up interval to fetch data every 5 seconds (5000 ms) for demonstration
    const intervalId = setInterval(fetchDashboardData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const pieChartData = [
    { name: 'Total Profiles', value: dashboardData.totalProfiles },
    { name: 'Schedules Completed', value: dashboardData.schedulesCompleted },
    { name: 'Profiles Processed This Week', value: dashboardData.profilesProcessedThisWeek },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Total Profiles</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dashboardData.totalProfiles}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Schedules Completed</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{dashboardData.schedulesCompleted}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Profiles Processed This Week</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{dashboardData.profilesProcessedThisWeek}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="interviews" stroke="#8884d8" />
              <Line type="monotone" dataKey="cleared" stroke="#82ca9d" />
              <Line type="monotone" dataKey="placed" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="interviews" fill="#8884d8" />
              <Bar dataKey="cleared" fill="#82ca9d" />
              <Bar dataKey="placed" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Interviews Conducted</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Daily: {dashboardData.interviewsConducted.daily}
          </p>
          <p className="text-xl font-semibold text-indigo-500 dark:text-indigo-300">
            Weekly: {dashboardData.interviewsConducted.weekly}
          </p>
          <p className="text-lg text-indigo-400 dark:text-indigo-200">
            Monthly: {dashboardData.interviewsConducted.monthly}
          </p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">Interviews Cleared</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            Daily: {dashboardData.interviewsCleared.daily}
          </p>
          <p className="text-xl font-semibold text-purple-500 dark:text-purple-300">
            Weekly: {dashboardData.interviewsCleared.weekly}
          </p>
          <p className="text-lg text-purple-400 dark:text-purple-200">
            Monthly: {dashboardData.interviewsCleared.monthly}
          </p>
        </div>
        <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-200 mb-2">Candidates Placed</h3>
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            Daily: {dashboardData.candidatesPlaced.daily}
          </p>
          <p className="text-xl font-semibold text-pink-500 dark:text-pink-300">
            Weekly: {dashboardData.candidatesPlaced.weekly}
          </p>
          <p className="text-lg text-pink-400 dark:text-pink-200">
            Monthly: {dashboardData.candidatesPlaced.monthly}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;