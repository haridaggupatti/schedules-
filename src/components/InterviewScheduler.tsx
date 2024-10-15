import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, FileText, Trash2, Download, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Interview {
  id: number;
  candidateName: string;
  company: string;
  resume: string;
  date: string;
  time: string;
}

const InterviewScheduler: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [newInterview, setNewInterview] = useState<Omit<Interview, 'id'>>({
    candidateName: '',
    company: '',
    resume: '',
    date: selectedDate.toISOString().split('T')[0],
    time: '',
  });
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

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddInterview = () => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      const newInterviewWithId: Interview = {
        ...newInterview,
        id: interviews.length > 0 ? Math.max(...interviews.map(i => i.id)) + 1 : 1,
      };
      setInterviews([...interviews, newInterviewWithId]);
      setShowAddModal(false);
      setNewInterview({
        candidateName: '',
        company: '',
        resume: '',
        date: selectedDate.toISOString().split('T')[0],
        time: '',
      });
    }
  };

  const handleEditInterview = (interview: Interview) => {
    setEditingInterview(interview);
    setShowAddModal(true);
  };

  const handleUpdateInterview = () => {
    if (editingInterview) {
      setInterviews(interviews.map(i => i.id === editingInterview.id ? editingInterview : i));
      setShowAddModal(false);
      setEditingInterview(null);
    }
  };

  const handleDeleteInterview = (id: number) => {
    if (user?.role === 'admin' || user?.role === 'hr') {
      setInterviews(interviews.filter(interview => interview.id !== id));
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(interviews[0]).join(",") + "\n"
      + interviews.map(i => Object.values(i).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "interview_schedules.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWeekDates = (date: Date): Date[] => {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() - date.getDay() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getInterviewsForDate = (date: Date): Interview[] => {
    const dateString = date.toISOString().split('T')[0];
    return interviews.filter(interview => interview.date === dateString);
  };

  const getAvailableTimeSlots = (date: Date): string[] => {
    const bookedTimes = getInterviewsForDate(date).map(interview => interview.time);
    const allTimeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    return allTimeSlots.filter(time => !bookedTimes.includes(time));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Interview Scheduler</h2>
        <div className="flex space-x-2">
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button
              onClick={() => { setEditingInterview(null); setShowAddModal(true); }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              <Plus size={20} className="inline mr-1" /> Add Interview
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

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded"
        >
          <ChevronLeft size={20} className="inline" />
        </button>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {`${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`}
        </h3>
        <button
          onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded"
        >
          <ChevronRight size={20} className="inline" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => (
          <div key={index} className="border rounded-lg p-2">
            <h4 className="text-sm font-semibold mb-2">{formatDate(date)}</h4>
            <div className="space-y-2">
              {getInterviewsForDate(date).map(interview => (
                <div key={interview.id} className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{interview.time}</span>
                    <div>
                      <button
                        onClick={() => handleEditInterview(interview)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteInterview(interview.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p>{interview.candidateName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{interview.company}</p>
                </div>
              ))}
              {getAvailableTimeSlots(date).map(time => (
                <div key={time} className="bg-green-100 dark:bg-green-700 p-2 rounded-lg text-sm">
                  <span className="font-semibold">{time}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
              {editingInterview ? 'Edit Interview' : 'Add New Interview'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={editingInterview?.candidateName || newInterview.candidateName}
                onChange={(e) => editingInterview 
                  ? setEditingInterview({...editingInterview, candidateName: e.target.value})
                  : setNewInterview({...newInterview, candidateName: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Company"
                value={editingInterview?.company || newInterview.company}
                onChange={(e) => editingInterview
                  ? setEditingInterview({...editingInterview, company: e.target.value})
                  : setNewInterview({...newInterview, company: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Resume"
                value={editingInterview?.resume || newInterview.resume}
                onChange={(e) => editingInterview
                  ? setEditingInterview({...editingInterview, resume: e.target.value})
                  : setNewInterview({...newInterview, resume: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={editingInterview?.date || newInterview.date}
                onChange={(e) => editingInterview
                  ? setEditingInterview({...editingInterview, date: e.target.value})
                  : setNewInterview({...newInterview, date: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="time"
                value={editingInterview?.time || newInterview.time}
                onChange={(e) => editingInterview
                  ? setEditingInterview({...editingInterview, time: e.target.value})
                  : setNewInterview({...newInterview, time: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={editingInterview ? handleUpdateInterview : handleAddInterview}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {editingInterview ? 'Update Interview' : 'Add Interview'}
              </button>
              <button
                onClick={() => { setShowAddModal(false); setEditingInterview(null); }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;