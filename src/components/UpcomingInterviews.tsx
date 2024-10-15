import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Save, Search, Download } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Interview {
  id: number;
  candidateName: string;
  contactNumber: string;
  technology: string;
  dateTime: string;
}

const UpcomingInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedInterview, setEditedInterview] = useState<Interview | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Interview>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { user } = useUser();

  useEffect(() => {
    const storedInterviews = localStorage.getItem('interviews');
    if (storedInterviews) {
      setInterviews(JSON.parse(storedInterviews));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  const handleEdit = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setEditingId(id);
      setEditedInterview(interviews.find(int => int.id === id) || null);
    }
  };

  const handleSave = () => {
    if ((user?.role === 'admin' || user?.role === 'hr') && editedInterview) {
      setInterviews(interviews.map(int => int.id === editedInterview.id ? editedInterview : int));
      setEditingId(null);
      setEditedInterview(null);
    }
  };

  const handleInputChange = (key: keyof Interview, value: string) => {
    if (editedInterview) {
      setEditedInterview({ ...editedInterview, [key]: value });
    }
  };

  const handleDelete = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setInterviews(interviews.filter(int => int.id !== id));
    }
  };

  const handleAdd = () => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      const newInterview: Interview = {
        id: interviews.length + 1,
        candidateName: '',
        contactNumber: '',
        technology: '',
        dateTime: '',
      };
      setInterviews([...interviews, newInterview]);
      setEditingId(newInterview.id);
      setEditedInterview(newInterview);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(interviews[0]).join(",") + "\n"
      + interviews.map(i => Object.values(i).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "upcoming_interviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column: keyof Interview) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredInterviews = interviews.filter(int =>
    Object.values(int).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Upcoming Interviews</h2>
        <div className="flex space-x-2">
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              <Plus size={16} className="inline mr-1" /> Add Interview
            </button>
          )}
          <button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            <Download size={16} className="inline mr-1" /> Export CSV
          </button>
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border rounded dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-2 top-2 text-gray-400" size={20} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
              {Object.keys(interviews[0] || {}).map((key) => (
                <th
                  key={key}
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={() => handleSort(key as keyof Interview)}
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
            {sortedInterviews.map((interview) => (
              <tr key={interview.id} className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                {Object.entries(interview).map(([key, value]) => (
                  <td key={key} className="py-3 px-6 text-left whitespace-nowrap">
                    {editingId === interview.id ? (
                      <input
                        type={key === 'dateTime' ? 'datetime-local' : 'text'}
                        value={editedInterview?.[key as keyof Interview] || ''}
                        onChange={(e) => handleInputChange(key as keyof Interview, e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      key === 'dateTime' ? new Date(value).toLocaleString() : value
                    )}
                  </td>
                ))}
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      {editingId === interview.id ? (
                        <button
                          onClick={handleSave}
                          className="w-4 mr-2 transform hover:text-green-500 hover:scale-110"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(interview.id)}
                          className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(interview.id)}
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
    </div>
  );
};

export default UpcomingInterviews;