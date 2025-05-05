import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import AcademicCalendar from './AcademicCalendar';

export default function PropSender() {
  const [calendarData, setCalendarData] = useState([]);
  const { user } = useUser();
  const url = 'http://localhost:3000';

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/calendar/${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const result = await response.json();
      setCalendarData(result.data);
      console.log('Fetched data:', result.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleSaveCalendar = async (groupId, updatedEvents) => {
    try {
      console.log('Saving events for group:', groupId, updatedEvents);
      const response = await fetch(`${url}/calendar/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ calendar: updatedEvents })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      setCalendarData(prevData =>
        prevData.map(group =>
          group._id === groupId ? result.data : group
        )
      );
      console.log('Updated data:', result.data);
      return result;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  };

  const handleDeleteCalendar = async (groupId) => {
    try {
      console.log('Deleting group:', groupId);
      const response = await fetch(`${url}/calendar/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      setCalendarData(prevData =>
        prevData.filter(group => group._id !== groupId)
      );
      console.log('Group deleted:', groupId);
      return { message: 'Group deleted' };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  return (
    <div>
      {calendarData.length > 0 && (
        <AcademicCalendar
          data={calendarData}
          onSave={handleSaveCalendar}
          onDelete={handleDeleteCalendar}
        />
      )}
    </div>
  );
}