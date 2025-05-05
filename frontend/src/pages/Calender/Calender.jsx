import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import AcademicCalendar from './AcademicCalendar';
import PropSender from './PropSender';

const Calendar = () => {
    const url = 'http://localhost:3000';
    const [step1, setStep1] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const { user } = useUser();

    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${url}/member/studentProfiles`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsersList(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let groupMembers = formData.getAll('groupMembers'); // Get selected members
    
        // Find the creator's profile in usersList
        const creatorProfile = usersList.find((u) => u.userId === user?.id);
        if (creatorProfile && !groupMembers.includes(creatorProfile.userId)) {
            groupMembers.push(creatorProfile.userId); // Ensure creator is included
        }
    
        const formValues = {
            groupName: formData.get('groupName'),
            groupDescription: formData.get('groupDescription'),
            groupMembers: groupMembers, // Array of selected user IDs, including creator
            createdBy: user.id,
            calendar: []
        };
        console.log('Form Data:', formValues);
    
        fetch(`${url}/calendar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues), // Corrected here
        })
        .then(response => response.json())
        .then(data => console.log('Response Data:', data))
        .catch(error => console.error('Error:', error));
    };
    

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                    onClick={() => setStep1(true)}
                >
                    Create Study Group
                </button>

                {/* Uncomment this section if you want to display the user list */}
                {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usersList.map((user) => (
                        <div key={user._id} className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
                            <p className="text-sm text-gray-600">UserId: {user.userId}</p>
                            <p className="text-sm text-gray-600">Email: {user.email}</p>
                            <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                            <p className="text-sm text-gray-600">Roll Number: {user.rollNumber}</p>
                            <p className="text-sm text-gray-600">Department: {user.department}</p>
                            <p className="text-sm text-gray-600">Year: {user.year}</p>
                            <p className="text-sm italic text-gray-500">Bio: {user.bio}</p>
                        </div>
                    ))}
                </div> */}

                {step1 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={() => setStep1(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Study Group</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        id="groupName"
                                        name="groupName"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                        Group Description
                                    </label>
                                    <textarea
                                        id="groupDescription"
                                        name="groupDescription"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Group Members
                                    </label>
                                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                                        {usersList.map((u) => (
                                            <div key={u._id} className="flex items-center space-x-2 py-1">
                                                <input
                                                    type="checkbox"
                                                    id={`member-${u._id}`}
                                                    name="groupMembers"
                                                    value={u.userId}
                                                    defaultChecked={u.userId === user?.id}
                                                    disabled={u.userId === user?.id}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor={`member-${u._id}`} className="text-sm text-gray-700">
                                                    {u.fullName} ({u.email}) {u.userId === user?.id && <span className="font-semibold text-blue-600">(You)</span>}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Select additional members to add to the group</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                                >
                                    Create Group
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <PropSender />
        </div>
    );
};

export default Calendar;