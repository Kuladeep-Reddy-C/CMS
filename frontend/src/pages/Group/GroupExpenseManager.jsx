import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';

const GroupExpenseManager = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  // State for group details
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [place, setPlace] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [date, setDate] = useState('');
  const [groupCreated, setGroupCreated] = useState(false);

  // State for expense items
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', pricePerUnit: '' });

  // State for individual expenses
  const [members, setMembers] = useState([]);
  const [memberExpenses, setMemberExpenses] = useState([]);

  // New state for multi-item member expense form
  const [selectedMember, setSelectedMember] = useState('');
  const [memberItemAllocations, setMemberItemAllocations] = useState([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/member/getallusers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the API returns an array of users with firstName and lastName
      const userList = data.map(user => [`${user.firstName} ${user.lastName || ''}, ${user.emailAddresses[0].emailAddress}, ${user.phoneNumbers[0].phoneNumber}, ${user.id}`]);
      setMembers(userList);
      console.log('Fetched users:', userList);
    } catch (error) {
      console.error('Failed to fetch users:', error.message);
      // Fallback to sample members
      const sampleMembers = ['Kuladeep', 'Pavan', 'Rohit', 'Suresh', 'Ramesh'];
      setMembers(sampleMembers);
      alert('Failed to fetch users. Using sample members.');
    }
  };

  // Run fetchUsers on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate remaining quantities of items after member allocation
  const getRemainingQuantity = (itemName) => {
    const item = items.find(item => item.name === itemName);
    if (!item) return 0;

    const allocatedQuantity = memberExpenses
      .filter(expense => expense.itemName === itemName)
      .reduce((sum, expense) => sum + Number(expense.quantity), 0);

    return item.quantity - allocatedQuantity;
  };

  // Calculate totals
  const calculateItemsTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  };

  const calculateMemberExpensesTotal = () => {
    return memberExpenses.reduce((sum, expense) => sum + (expense.quantity * expense.pricePerUnit), 0);
  };

  // Handle form submissions
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (groupName && place && paidBy && date) {
      setGroupCreated(true);
      setStep(2);
    } else {
      alert('Please fill in all group details');
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.name && newItem.quantity && newItem.pricePerUnit) {
      setItems([...items, {
        name: newItem.name,
        quantity: Number(newItem.quantity),
        pricePerUnit: Number(newItem.pricePerUnit)
      }]);
      setNewItem({ name: '', quantity: '', pricePerUnit: '' });
    } else {
      alert('Please fill in all item details');
    }
  };

  const handleDeleteItem = (index) => {
    const itemToDelete = items[index];
    const isUsedInMemberExpenses = memberExpenses.some(expense => expense.itemName === itemToDelete.name);

    if (isUsedInMemberExpenses) {
      alert('Cannot delete item as it is already allocated to members');
      return;
    }

    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleEditItem = (index) => {
    const itemToEdit = items[index];
    setNewItem({
      name: itemToEdit.name,
      quantity: itemToEdit.quantity,
      pricePerUnit: itemToEdit.pricePerUnit
    });

    handleDeleteItem(index);
  };

  const handleItemQuantityChange = (itemName, quantity) => {
    const updatedAllocations = [...memberItemAllocations];
    const existingIndex = updatedAllocations.findIndex(item => item.itemName === itemName);

    if (existingIndex >= 0) {
      if (quantity <= 0) {
        updatedAllocations.splice(existingIndex, 1);
      } else {
        updatedAllocations[existingIndex].quantity = Number(quantity);
      }
    } else if (quantity > 0) {
      const item = items.find(item => item.name === itemName);
      updatedAllocations.push({
        itemName: itemName,
        quantity: Number(quantity),
        pricePerUnit: item.pricePerUnit
      });
    }

    setMemberItemAllocations(updatedAllocations);
  };

  const handleAddMemberItemsExpense = (e) => {
    e.preventDefault();

    if (!selectedMember || memberItemAllocations.length === 0) {
      alert('Please select a member and at least one item');
      return;
    }

    for (const allocation of memberItemAllocations) {
      const remainingQuantity = getRemainingQuantity(allocation.itemName);
      if (allocation.quantity > remainingQuantity) {
        alert(`Only ${remainingQuantity} ${allocation.itemName}(s) available`);
        return;
      }
    }

    const newExpenses = memberItemAllocations.map(allocation => ({
      memberName: selectedMember.split(',')[0].trim(),
      memberEmail: selectedMember.split(',')[1].trim(),
      memberPhone: selectedMember.split(',')[2].trim(),
      itemName: allocation.itemName,
      quantity: allocation.quantity,
      pricePerUnit: allocation.pricePerUnit
    }));

    setMemberExpenses([...memberExpenses, ...newExpenses]);

    setSelectedMember('');
    setMemberItemAllocations([]);
  };

  const handleDeleteMemberExpense = (index) => {
    const updatedMemberExpenses = [...memberExpenses];
    updatedMemberExpenses.splice(index, 1);
    setMemberExpenses(updatedMemberExpenses);
  };

  const handleEditMemberExpense = (index) => {
    const expenseToEdit = memberExpenses[index];

    setSelectedMember(expenseToEdit.memberName);

    setMemberItemAllocations([{
      itemName: expenseToEdit.itemName,
      quantity: expenseToEdit.quantity,
      pricePerUnit: expenseToEdit.pricePerUnit
    }]);

    handleDeleteMemberExpense(index);
  };

  const { user } = useUser();

  const handleFinalSubmit = async () => {
    const expenseData = {
      userId: user.id,
      groupDetails: {
        name: groupName,
        place,
        paidBy,
        date
      },
      items,
      memberExpenses,
    };
    console.log('Final expense data:', expenseData);
    try {
      const response = await fetch(`${url}/api2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error.message);
    }

    alert("Expense management form submitted successfully!");

    setStep(1);
    setGroupName('');
    setPlace('');
    setPaidBy('');
    setDate('');
    setGroupCreated(false);
    setItems([]);
    setMemberExpenses([]);
    setSelectedMember('');
    setMemberItemAllocations([]);
  };

  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const getMemberExpenseSummary = () => {
    const summary = {};

    memberExpenses.forEach(expense => {
      if (!summary[expense.memberName]) {
        summary[expense.memberName] = 0;
      }
      summary[expense.memberName] += expense.quantity * expense.pricePerUnit;
    });

    return Object.entries(summary).map(([name, total]) => ({
      memberName: name,
      total
    }));
  };

  const getMemberExpenseDetails = (memberName) => {
    return memberExpenses.filter(expense => expense.memberName === memberName);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Group Expense Manager</h1>

      {/* Step 1: Group Creation */}
      {step === 1 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Group Creation</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Group Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block mb-1">Canteen Place</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Enter canteen place"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">Paid By</label>
                <select
                  className="w-full p-2 border rounded"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                >
                  <option value="">Select payer</option>
                  {members.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Create
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Expense Entry */}
      {step === 2 && (
        <div>
          {groupCreated && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Group Details</h2>
              <p><strong>Group Name:</strong> {groupName} | <strong>Place:</strong> {place} | <strong>Paid By:</strong> {paidBy} | <strong>Date:</strong> {date}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Expense Entry</h2>
            <form onSubmit={handleAddItem} className="mb-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block mb-1">Item Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block mb-1">Price per unit</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={newItem.pricePerUnit}
                    onChange={(e) => setNewItem({...newItem, pricePerUnit: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                  onClick={() => setNewItem({ name: '', quantity: '', pricePerUnit: '' })}
                >
                  Cancel
                </button>
              </div>
            </form>
            
            {items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-left">Quantity</th>
                      <th className="border p-2 text-left">Price per unit</th>
                      <th className="border p-2 text-left">Total</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{formatCurrency(item.pricePerUnit)}</td>
                        <td className="border p-2">{formatCurrency(item.quantity * item.pricePerUnit)}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleEditItem(index)}
                            className="bg-yellow-500 text-white py-1 px-2 rounded mr-1 text-sm hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="3" className="border p-2 text-right">Total</td>
                      <td className="border p-2">{formatCurrency(calculateItemsTotal())}</td>
                      <td className="border p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {items.length > 0 && (
              <button
                onClick={() => setStep(3)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Continue to Member Expenses
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Individual Member Expenses */}
      {step === 3 && (
        <div>
          {groupCreated && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Group Details</h2>
              <p><strong>Group Name:</strong> {groupName} | <strong>Place:</strong> {place} | <strong>Paid By:</strong> {paidBy} | <strong>Date:</strong> {date}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Individual Member Expenses</h2>
            
            <form onSubmit={handleAddMemberItemsExpense} className="mb-6">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Select Member</label>
                <select
                  className="w-full p-2 border rounded mb-4"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Select member</option>
                  {members.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>
                
                {selectedMember && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Allocate Items for {selectedMember}</h3>
                    <div className="bg-white p-4 rounded border mb-4">
                      <div className="grid grid-cols-4 gap-2 font-medium mb-2 text-gray-700">
                        <div>Item</div>
                        <div>Available</div>
                        <div>Quantity</div>
                        <div>Price</div>
                      </div>
                      
                      {items.filter(item => getRemainingQuantity(item.name) > 0).map((item, index) => {
                        const allocation = memberItemAllocations.find(a => a.itemName === item.name);
                        const allocatedQty = allocation ? allocation.quantity : 0;
                        const remainingQty = getRemainingQuantity(item.name);
                        
                        return (
                          <div key={index} className="grid grid-cols-4 gap-2 items-center py-2 border-b">
                            <div>{item.name}</div>
                            <div>{remainingQty}</div>
                            <div>
                              <input
                                type="number"
                                min="0"
                                max={remainingQty}
                                className="w-full p-2 border rounded"
                                value={allocatedQty}
                                onChange={(e) => handleItemQuantityChange(item.name, e.target.value)}
                                placeholder="0"
                              />
                            </div>
                            <div>{formatCurrency(item.pricePerUnit)}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {memberItemAllocations.length > 0 && (
                      <div className="bg-gray-100 p-3 rounded mb-4">
                        <h4 className="font-medium mb-2">Summary for {selectedMember}</h4>
                        <ul className="mb-2">
                          {memberItemAllocations.map((allocation, index) => (
                            <li key={index} className="mb-1">
                              {allocation.quantity} x {allocation.itemName} = {formatCurrency(allocation.quantity * allocation.pricePerUnit)}
                            </li>
                          ))}
                        </ul>
                        <div className="font-bold">
                          Total: {formatCurrency(memberItemAllocations.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!selectedMember || memberItemAllocations.length === 0}
                  className={`${!selectedMember || memberItemAllocations.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded`}
                >
                  Add Expenses for {selectedMember || "Member"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => {
                    setSelectedMember('');
                    setMemberItemAllocations([]);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            
            {memberExpenses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Member Expense Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2 text-left">Member</th>
                        <th className="border p-2 text-left">Items</th>
                        <th className="border p-2 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMemberExpenseSummary().map((summary, index) => {
                        const memberDetails = getMemberExpenseDetails(summary.memberName);
                        return (
                          <tr key={index} className="border-b">
                            <td className="border p-2 font-medium">{summary.memberName}</td>
                            <td className="border p-2">
                              <ul className="list-disc ml-4">
                                {memberDetails.map((expense, idx) => (
                                  <li key={idx} className="mb-1">
                                    {expense.quantity} x {expense.itemName} = {formatCurrency(expense.quantity * expense.pricePerUnit)}
                                    <button
                                      onClick={() => handleEditMemberExpense(memberExpenses.findIndex(e => 
                                        e.memberName === expense.memberName && 
                                        e.itemName === expense.itemName &&
                                        e.quantity === expense.quantity
                                      ))}
                                      className="bg-yellow-500 text-white py-0 px-2 rounded text-xs ml-2 hover:bg-yellow-600"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteMemberExpense(memberExpenses.findIndex(e => 
                                        e.memberName === expense.memberName && 
                                        e.itemName === expense.itemName &&
                                        e.quantity === expense.quantity
                                      ))}
                                      className="bg-red-500 text-white py-0 px-2 rounded text-xs ml-1 hover:bg-red-600"
                                    >
                                      Delete
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="border p-2 font-medium">{formatCurrency(summary.total)}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan="2" className="border p-2 text-right">Grand Total</td>
                        <td className="border p-2">{formatCurrency(calculateMemberExpensesTotal())}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Items Allocation Status</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-left">Total Quantity</th>
                      <th className="border p-2 text-left">Allocated</th>
                      <th className="border p-2 text-left">Remaining</th>
                      <th className="border p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const totalQty = item.quantity;
                      const allocatedQty = totalQty - getRemainingQuantity(item.name);
                      const remainingQty = getRemainingQuantity(item.name);
                      const isFullyAllocated = remainingQty === 0;
                      
                      return (
                        <tr key={index} className="border-b">
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">{totalQty}</td>
                          <td className="border p-2">{allocatedQty}</td>
                          <td className="border p-2">{remainingQty}</td>
                          <td className="border p-2">
                            <span className={`inline-block px-2 py-1 rounded ${isFullyAllocated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {isFullyAllocated ? 'Fully Allocated' : 'Partially Allocated'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Total Group Expenses:</strong> {formatCurrency(calculateItemsTotal())}
              </div>
              <div>
                <strong>Total Member Expenses:</strong> {formatCurrency(calculateMemberExpensesTotal())}
              </div>
              <div>
                <strong>Remaining Unallocated Amount:</strong> {formatCurrency(calculateItemsTotal() - calculateMemberExpensesTotal())}
              </div>
            </div>
            
            <div className="flex mt-4 gap-4">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Back to Expenses
              </button>
              <button
                onClick={handleFinalSubmit}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                disabled={calculateItemsTotal() !== calculateMemberExpensesTotal() && calculateMemberExpensesTotal() > 0}
              >
                Submit Group Expense
              </button>
            </div>
            
            {calculateItemsTotal() !== calculateMemberExpensesTotal() && calculateMemberExpensesTotal() > 0 && (
              <div className="mt-4 text-red-600">
                Note: All items must be fully allocated before submitting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupExpenseManager;