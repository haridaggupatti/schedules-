import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Download, Save, Search, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Employee {
  id: number;
  fullName: string;
  contactNumber: string;
  email: string;
  password: string;
  department: string;
  advancePayment: number;
  referralSource: string;
  totalExperience: string;
  jobPortalUsername: string;
  jobPortalPassword: string;
  interviewContactNumber: string;
  interviewsAttended: number;
  upcomingInterviews: number;
  profileStatus: 'Active' | 'On Leave' | 'Terminated' | 'Cleared';
}

const EmployeeProfiles: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Employee>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    fullName: '',
    contactNumber: '',
    email: '',
    password: '',
    department: '',
    advancePayment: 0,
    referralSource: '',
    totalExperience: '',
    jobPortalUsername: '',
    jobPortalPassword: '',
    interviewContactNumber: '',
    interviewsAttended: 0,
    upcomingInterviews: 0,
    profileStatus: 'Active',
  });
  const { user } = useUser();

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For this example, we'll use mock data
    const mockEmployees: Employee[] = [
      {
        id: 1,
        fullName: 'John Doe',
        contactNumber: '123-456-7890',
        email: 'john.doe@example.com',
        password: '********',
        department: 'IT',
        advancePayment: 1000,
        referralSource: 'Employee Referral',
        totalExperience: '5 years',
        jobPortalUsername: 'johndoe',
        jobPortalPassword: '********',
        interviewContactNumber: '987-654-3210',
        interviewsAttended: 3,
        upcomingInterviews: 1,
        profileStatus: 'Active',
      },
      // Add more mock employees here
    ];
    setEmployees(mockEmployees);
  }, []);

  const handleEdit = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setEditingId(id);
      setEditedEmployee(employees.find(emp => emp.id === id) || null);
    }
  };

  const handleSave = () => {
    if ((user?.role === 'admin' || user?.role === 'hr') && editedEmployee) {
      setEmployees(employees.map(emp => emp.id === editedEmployee.id ? editedEmployee : emp));
      setEditingId(null);
      setEditedEmployee(null);
    }
  };

  const handleInputChange = (key: keyof Employee, value: string | number) => {
    if (editedEmployee) {
      setEditedEmployee({ ...editedEmployee, [key]: value });
    }
  };

  const handleDelete = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleAdd = () => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      const newEmployeeWithId: Employee = {
        ...newEmployee,
        id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      };
      setEmployees([...employees, newEmployeeWithId]);
      setShowAddForm(false);
      setNewEmployee({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        department: '',
        advancePayment: 0,
        referralSource: '',
        totalExperience: '',
        jobPortalUsername: '',
        jobPortalPassword: '',
        interviewContactNumber: '',
        interviewsAttended: 0,
        upcomingInterviews: 0,
        profileStatus: 'Active',
      });
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(employees[0]).join(",") + "\n"
      + employees.map(e => Object.values(e).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_profiles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column: keyof Employee) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredEmployees = employees.filter(emp =>
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
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Employee Profiles</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees..."
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
              <Plus size={20} className="inline mr-1" /> Add Employee
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
              {Object.keys(employees[0] || {}).map((key) => (
                <th
                  key={key}
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort(key as keyof Employee)}
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
              <tr
                key={employee.id}
                className={`border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  employee.profileStatus === 'Cleared' ? 'bg-green-100 dark:bg-green-800' : ''
                }`}
              >
                {Object.entries(employee).map(([key, value]) => (
                  <td key={key} className="py-3 px-6 text-left whitespace-nowrap">
                    {editingId === employee.id ? (
                      <input
                        type={key === 'password' || key === 'jobPortalPassword' ? 'password' : 'text'}
                        value={editedEmployee?.[key as keyof Employee] || ''}
                        onChange={(e) => handleInputChange(key as keyof Employee, e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      key === 'password' || key === 'jobPortalPassword' ? '********' : value
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
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Add New Employee</h3>
            {/* Add form fields for new employee */}
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Add Employee
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

export default EmployeeProfiles;