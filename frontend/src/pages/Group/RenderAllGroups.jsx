import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Calendar, Circle } from 'lucide-react';
import Loader from '../loading/Loader';

const RenderAllGroups = () => {
    const { user } = useUser();
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toggling, setToggling] = useState({});
    const url = import.meta.env.VITE_BACKEND_URL;
    
    useEffect(() => {
        if (!user) return;

        const fetchGroups = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/api2/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Create a Group or become a part of a Group ${response.status}`);
                }

                const data = await response.json();
                const updatedData = data.map(group => ({
                    ...group,
                    memberExpenses: group.memberExpenses.map(expense => ({
                        ...expense,
                        paymentStatus: expense.memberName === group.groupDetails.paidBy ? 'Paid' : expense.paymentStatus,
                    })),
                }));
                setGroups(updatedData);
                setError(null);
            } catch (error) {
                setError(error.message);
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [user]);

    const formatCurrency = (amount) => {
        return `₹${Number(amount).toFixed(2)}`;
    };

    const calculateGroupTotal = (items) => {
        return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
    };

    const calculateSettledAmount = (memberExpenses) => {
        return memberExpenses
            .filter(expense => expense.paymentStatus === 'Paid')
            .reduce((sum, expense) => sum + expense.quantity * expense.pricePerUnit, 0);
    };

    const calculateMemberTotal = (memberExpenses) => {
        return memberExpenses.reduce((sum, expense) => sum + expense.quantity * expense.pricePerUnit, 0);
    };

    const togglePaymentStatus = async (groupId, expenseIndex, currentStatus) => {
        const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
        const key = `${groupId}-${expenseIndex}`;
        setToggling(prev => ({ ...prev, [key]: true }));

        setGroups(prevGroups =>
            prevGroups.map(group =>
                group._id === groupId
                    ? {
                          ...group,
                          memberExpenses: group.memberExpenses.map((exp, idx) =>
                              idx === parseInt(expenseIndex)
                                  ? { ...exp, paymentStatus: newStatus }
                                  : exp
                          ),
                      }
                    : group
            )
        );

        try {
            const response = await fetch(`http://localhost:3000/api2/${groupId}/member-expense/${expenseIndex}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { memberExpense } = await response.json();
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group._id === groupId
                        ? {
                              ...group,
                              memberExpenses: group.memberExpenses.map((exp, idx) =>
                                  idx === parseInt(expenseIndex) ? memberExpense : exp
                              ),
                          }
                        : group
                )
            );
        } catch (error) {
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group._id === groupId
                        ? {
                              ...group,
                              memberExpenses: group.memberExpenses.map((exp, idx) =>
                                  idx === parseInt(expenseIndex)
                                      ? { ...exp, paymentStatus: currentStatus }
                                      : exp
                              ),
                          }
                        : group
                )
            );
            alert(`Failed to update payment status: ${error.message}`);
        } finally {
            setToggling(prev => ({ ...prev, [key]: false }));
        }
    };

    const handlePoke = async (expense) => {
        const res = await fetch(url + "/api3/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        });

        const data = await res.json();
        if (data.success) {
            alert("Email sent to member!");
        } else {
            alert("Failed to send email");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-red-600 text-lg font-semibold bg-red-100 p-6 rounded-2xl shadow-md">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div
                className="relative bg-cover bg-center h-64 flex items-center justify-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative text-center text-white z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Group Expenses</h1>
                    <p className="text-lg md:text-xl">Track and manage shared costs effortlessly</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                {groups.length === 0 ? (
                    <div className="text-gray-600 text-center p-6 bg-white rounded-2xl shadow-md">
                        No group expenses found. Create or join a group to get started!
                    </div>
                ) : (
                    groups.map(group => {
                        const isCreator = group.groupDetails.paidBy.split(',')[0].includes(user?.fullName);
                        console.log(isCreator, group.groupDetails.paidBy.split(',')[0], user?.fullName )
                        const totalAmount = calculateGroupTotal(group.items);
                        const settledAmount = calculateSettledAmount(group.memberExpenses);
                        const unsettledAmount = totalAmount - settledAmount;
                        const progressPercentage = totalAmount > 0 ? (settledAmount / totalAmount) * 100 : 0;

                        return (
                            <div
                                key={group._id}
                                className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-xl transform transition duration-300"
                            >
                                {/* Group Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {group.groupDetails.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">{group.groupDetails.place}</p>
                                    </div>
                                    <span className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-full font-medium">
                                        {new Date(group.groupDetails.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                        })}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center text-sm text-gray-500 mb-6">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                                    {new Date(group.groupDetails.date).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>

                                {/* Total Amount */}
                                <div className="text-lg font-semibold text-gray-800 mb-3">Total Amount</div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-green-600 font-medium">
                                        Settled: {formatCurrency(settledAmount)}
                                    </span>
                                    <span className="text-gray-800 font-semibold">
                                        {formatCurrency(totalAmount)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="text-red-500 text-sm flex items-center mb-4">
                                    <Circle size={12} fill="red" className="text-red-500 mr-2" />
                                    Unsettled: {formatCurrency(unsettledAmount)}
                                </div>

                                {/* Paid By */}
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 mr-3">
                                        {group.groupDetails.paidBy
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Paid By{' '}
                                        <span className="font-semibold text-gray-800">
                                            {isCreator
                                                ? 'You, '
                                                : ''}{group.groupDetails.paidBy.split(',')[0]}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                        Items ({group.items.length})
                                    </h4>
                                    <div className="overflow-x-auto rounded-lg shadow-sm">
                                        <table className="w-full table-auto border-collapse bg-white">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Item</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Price/Unit</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.items.map((item, index) => (
                                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="p-4 text-gray-600">{item.name}</td>
                                                        <td className="p-4 text-gray-600">{item.quantity}</td>
                                                        <td className="p-4 text-gray-600">{formatCurrency(item.pricePerUnit)}</td>
                                                        <td className="p-4 text-gray-600 font-medium">
                                                            {formatCurrency(item.quantity * item.pricePerUnit)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Member Expenses Table */}
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                        Member Expenses ({group.memberExpenses.length})
                                    </h4>
                                    <div className="overflow-x-auto rounded-lg shadow-sm">
                                        <table className="w-full table-auto border-collapse bg-white">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Member</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Item</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Price/Unit</th>
                                                    <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                                    {isCreator && (
                                                        <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.memberExpenses.map((expense, index) => (
                                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="p-4 text-gray-600">{expense.memberName}</td>
                                                        <td className="p-4 text-gray-600">{expense.itemName}</td>
                                                        <td className="p-4 text-gray-600">{expense.quantity}</td>
                                                        <td className="p-4 text-gray-600">{formatCurrency(expense.pricePerUnit)}</td>
                                                        <td className="p-4 text-gray-600 font-medium">
                                                            {formatCurrency(expense.quantity * expense.pricePerUnit)}
                                                        </td>
                                                        {isCreator && (
                                                            <td className="p-4 flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        togglePaymentStatus(
                                                                            group._id,
                                                                            index,
                                                                            expense.paymentStatus
                                                                        )
                                                                    }
                                                                    disabled={toggling[`${group._id}-${index}`]}
                                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                                                                        expense.paymentStatus === 'Paid'
                                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                        } ${
                                                                        toggling[`${group._id}-${index}`]
                                                                            ? 'opacity-50 cursor-not-allowed'
                                                                            : ''
                                                                        }`}
                                                                >
                                                                    {expense.paymentStatus}
                                                                </button>
                                                                {expense.paymentStatus === 'Pending' && (
                                                                    <button
                                                                        onClick={() => handlePoke(expense)}
                                                                        className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition duration-200"
                                                                    >
                                                                        Poke
                                                                    </button>
                                                                )}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50 font-semibold">
                                                    <td
                                                        colSpan={isCreator ? 5 : 4}
                                                        className="p-4 text-right text-gray-700"
                                                    >
                                                        Total
                                                    </td>
                                                    <td className="p-4 text-gray-800">
                                                        {formatCurrency(calculateMemberTotal(group.memberExpenses))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RenderAllGroups;