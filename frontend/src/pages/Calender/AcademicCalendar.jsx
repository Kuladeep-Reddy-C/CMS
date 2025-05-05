import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Save, XCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

// Event types with their corresponding colors
const EVENT_TYPES = {
  QUIZ: { label: 'Quiz', color: 'bg-blue-500' },
  LAB: { label: 'Lab Evaluation', color: 'bg-green-500' },
  MIDTERM: { label: 'Mid-Term', color: 'bg-yellow-500' },
  ENDSEM: { label: 'End-Sem', color: 'bg-red-500' },
  CUSTOM: { label: 'Custom', color: 'bg-purple-500' },
  MEETING: { label: 'Meeting', color: 'bg-orange-500' }
};

export default function AcademicCalendar({ data, onSave, onDelete }) {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: formatDateForInput(new Date()),
    type: 'QUIZ',
    description: ''
  });
  const [notification, setNotification] = useState(null);

  // Initialize selected group and events
  useEffect(() => {
    if (data && data.length > 0) {
      const initialGroup = data[0];
      setSelectedGroup(initialGroup);
      setEvents(initialGroup.calendar.map(event => ({
        ...event,
        date: new Date(event.date)
      })));
    } else {
      setSelectedGroup(null);
      setEvents([]);
    }
  }, [data]);

  // Update events when selected group changes
  useEffect(() => {
    if (selectedGroup) {
      setEvents(selectedGroup.calendar.map(event => ({
        ...event,
        date: new Date(event.date)
      })));
    }
  }, [selectedGroup]);

  // Format date for input field
  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Parse date string to date object
  function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Get days in a month
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Get first day of the month
  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  // Add a new event
  async function handleAddEvent() {
    if (!newEvent.title.trim()) {
      setNotification({ type: 'error', message: 'Event title is required' });
      return;
    }

    const eventDate = parseDate(newEvent.date);
    const id = Date.now().toString();
    const newEventObj = {
      id,
      title: newEvent.title,
      date: eventDate,
      type: newEvent.type,
      description: newEvent.description
    };

    const updatedEvents = [...events, newEventObj];
    setEvents(updatedEvents);

    if (selectedGroup && onSave) {
      const formattedEvents = updatedEvents.map(event => ({
        ...event,
        date: event.date.toISOString()
      }));
      try {
        await onSave(selectedGroup._id, formattedEvents);
        setNotification({ type: 'success', message: 'Event added' });
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to add event' });
        setEvents(events); // Revert on error
      }
    }

    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: formatDateForInput(new Date()),
      type: 'QUIZ',
      description: ''
    });
  }

  // Delete an event
  async function handleDeleteEvent(id) {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);

    if (selectedGroup && onSave) {
      const formattedEvents = updatedEvents.map(event => ({
        ...event,
        date: event.date.toISOString()
      }));
      try {
        await onSave(selectedGroup._id, formattedEvents);
        setNotification({ type: 'success', message: 'Event deleted' });
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to delete event' });
        setEvents(events); // Revert on error
      }
    }
  }

  // Delete the selected group
  async function handleDeleteGroup() {
    if (selectedGroup && onDelete) {
      if (!window.confirm(`Are you sure you want to delete the group "${selectedGroup.groupName}"?`)) {
        return;
      }
      try {
        await onDelete(selectedGroup._id);
        setNotification({ type: 'success', message: `Group "${selectedGroup.groupName}" deleted` });
        setSelectedGroup(null);
        setEvents([]);
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to delete group' });
      }
    }
  }

  // Navigate to previous month
  function prevMonth() {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  // Navigate to next month
  function nextMonth() {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  // Manual save
  async function exportData() {
    if (selectedGroup && onSave) {
      const formattedEvents = events.map(event => ({
        ...event,
        date: event.date.toISOString()
      }));
      try {
        await onSave(selectedGroup._id, formattedEvents);
        setNotification({ type: 'success', message: 'Changes saved' });
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to save changes' });
      }
    }
  }

  // Render calendar grid
  function renderCalendarDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event =>
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      );

      days.push(
        <div key={day} className="h-24 border border-gray-200 p-1 overflow-y-auto">
          <div className="font-bold text-sm">{day}</div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`text-xs mb-1 p-1 rounded text-white ${EVENT_TYPES[event.type]?.color || 'bg-gray-500'} flex justify-between items-center`}
            >
              <span className="truncate">{event.title}</span>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="ml-1 p-1 hover:bg-red-700 rounded"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    return days;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      {/* Group Tabs */}
      {data && data.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {data.map(group => (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`px-4 py-2 rounded ${
                selectedGroup?._id === group._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {group.groupName}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar size={24} className="mr-2" />
          <h1 className="text-2xl font-bold">Academic Calendar</h1>
          {selectedGroup && (
            <span className="ml-2 text-gray-600">({selectedGroup.groupName})</span>
          )}
        </div>
        <div className="flex gap-4">
          {selectedGroup && user.id === selectedGroup.createdBy && (
            <button
              onClick={handleDeleteGroup}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            >
              <XCircle size={16} className="mr-1" />
              Delete Group
            </button>
          )}
          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <Save size={16} className="mr-1" />
            Save
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Event
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-2 rounded ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center py-2 bg-gray-100">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(EVENT_TYPES).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <div className={`w-4 h-4 ${value.color} rounded mr-1`}></div>
            <span className="text-sm">{value.label}</span>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select
                value={newEvent.type}
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(EVENT_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event description"
                rows="3"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}