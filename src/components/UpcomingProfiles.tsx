import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Download, Save, Search, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface UpcomingEmployee {
  id: number;
  fullName: string;
  contactNumber: string;
  email: string;
  position: string;
  expectedJoiningDate: string;
  status: 'Pending' | 'Confirmed' | 'Declined';
  resume: string;
  company: string;
}

const UpcomingProfiles: React.FC = () => {
  const [upcomingEmployees, setUpcomingEmployees] = useState<UpcomingEmployee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<UpcomingEmployee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof UpcomingEmployee>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<UpcomingEmployee, 'id'>>({
    fullName: '',
    contactNumber: '',
    email: '',
    position: '',
    expectedJoiningDate: '',
    status: 'Pending',
    resume: '',
    company: '',
  });
  const { user } = useUser();

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For this example, we'll use mock data
    const mockUpcomingEmployees: UpcomingEmployee[] = [
      {
        id: 1,
        fullName: 'Jane Smith',
        contactNumber: '987-654-3210',
        email: 'jane.smith@example.com',
        position: 'UX Designer',
        expectedJoiningDate: '2023-07-01',
        status: 'Confirmed',
        resume: 'jane_smith_resume.pdf',
        company: 'TechCorp',
      },
      // Add more mock upcoming employees here
    ];
    setUpcomingEmployees(mockUpcomingEmployees);
  }, []);

  const handleEdit = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setEditingId(id);
      setEditedEmployee(upcomingEmployees.find(emp => emp.id === id) || null);
    }
  };

  const handleSave = () => {
    if ((user?.role === 'admin' || user?.role === 'hr') && editedEmployee) {
      setUpcomingEmployees(upcomingEmployees.map(emp => emp.id === editedEmployee.id ? editedEmployee : emp));
      setEditingId(null);
      setEditedEmployee(null);
    }
  };

  const handleInputChange = (key: keyof UpcomingEmployee, value: string) => {
    if (editedEmployee) {
      setEditedEmployee({ ...editedEmployee, [key]: value });
    }
  };

  const handleDelete = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setUpcomingEmployees(upcomingEmployees.filter(emp => emp.id !== id));
    }
  };

  const handleAdd = () => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      const newEmployeeWithId: UpcomingEmployee = {
        ...newEmployee,
        id: upcomingEmployees.length > 0 ? Math.max(...upcomingEmployees.map(e => e.id)) + 1 : 1,
      };
      setUpcomingEmployees([...upcomingEmployees, newEmployeeWithId]);
      setShowAddForm(false);
      setNewEmployee({
        fullName: '',
        contactNumber: '',
        email: '',
        position: '',
        expectedJoiningDate: '',
        status: 'Pending',
        resume: '',
        company: '',
      });
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(upcomingEmployees[0]).join(",") + "\n"
      + upcomingEmployees.map(e => Object.values(e).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "upcoming_employee_profiles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column: keyof UpcomingEmployee) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredEmployees = upcomingEmployees.filter(emp =>
    Object.values(emp).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Upcoming Employee Profiles</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search upcoming employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700"
          />
          <Search className="absolute left-3 top-2 text-gray-400" size={20} />
        </div>
        <div className="space-x-2">
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              <Plus size={20} className="inline mr-1" /> Add Upcoming Employee
            </button>
          )}
          <button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            <Download size={20} className="inline mr-1" /> Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
              {Object.keys(upcomingEmployees[0] || {}).map((key) => (
                <th
                  key={key}
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort(key as keyof UpcomingEmployee)}
                >
                  {key}
                  {sortColumn === key && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
              {(user?.role === 'admin' || user?.role === 'hr') && (
                <th className="py-3 px-6 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
            {sortedEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                {Object.entries(employee).map(([key, value]) => (
                  <td key={key} className="py-3 px-6 text-left whitespace-nowrap">
                    {editingId === employee.id ? (
                      <input
                        type={key === 'expectedJoiningDate' ? 'date' : 'text'}
                        value={editedEmployee?.[key as keyof UpcomingEmployee] || ''}
                        onChange={(e) => handleInputChange(key as keyof UpcomingEmployee, e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      value
                    )}
                  </td>
                ))}
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      {editingId === employee.id ? (
                        <button
                          onClick={handleSave}
                          className="w-4 mr-2 transform hover:text-green-500 hover:scale-110"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(employee.id)}
                          className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Add New Upcoming Employee</h3>
            {/* Add form fields for new upcoming employee */}
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Add Upcoming Employee
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingProfiles;