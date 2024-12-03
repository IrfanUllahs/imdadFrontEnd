import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";


export default function CommissionTracker() {
  const [commissions, setCommissions] = useState([]);
  const [view, setView] = useState("daily");
  const [newCommission, setNewCommission] = useState({
    name: "",
    date: "",
    amount: "",
  });
  const [editingCommission, setEditingCommission] = useState(null);
  const [user, setUser] = useState({})
  // setUser(JSON.parse(localStorage.getItem('user')))

  const API_BASE = `/api/commissions`;

  // Fetch commissions from the server
  const fetchCommissions = async () => {
    try {
      const response = await axios.get(API_BASE);
      setCommissions(response.data);
    } catch (error) {
      console.error("Error fetching commissions:", error);
    }
  };

  // Add a new commission
  const addCommission = async (commission) => {
    try {
      const response = await axios.post(API_BASE, commission);
      return response.data;
    } catch (error) {
      console.error("Error adding commission:", error);
      throw error;
    }
  };

  // Update an existing commission
  const updateCommission = async (id, updatedCommission) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, updatedCommission);
      return response.data;
    } catch (error) {
      console.error("Error updating commission:", error);
      throw error;
    }
  };

  // Delete a commission
  const deleteCommission = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error("Error deleting commission:", error);
    }
  };

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommission({ ...newCommission, [name]: value });
  };

  // Add or update commission handler
  const saveCommissionHandler = async () => {
    if (!newCommission.name || !newCommission.date || !newCommission.amount) {
      alert("Please fill out all fields!");
      return;
    }
    try {
      if (editingCommission) {
        // Update commission
        const updatedCommission = await updateCommission(
          editingCommission._id,
          newCommission
        );
        setCommissions(
          commissions.map((commission) =>
            commission._id === updatedCommission._id ? updatedCommission : commission
          )
        );
        setEditingCommission(null);
      } else {
        // Add new commission
        const savedCommission = await addCommission(newCommission);
        setCommissions([...commissions, savedCommission]);
      }
      setNewCommission({ name: "", date: "", amount: "" });
    } catch (error) {
      console.error("Error saving commission:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this commission?")) {
      try {
        await deleteCommission(id);
        setCommissions(commissions.filter((commission) => commission._id !== id));
      } catch (error) {
        console.error("Error deleting commission:", error);
      }
    }
  };

  // Handle edit
  const handleEdit = (commission) => {
    setNewCommission({
      name: commission.name,
      date: commission.date.split("T")[0],
      amount: commission.amount,
    });
    setEditingCommission(commission);
  };

  // Toggle view (daily/monthly)
  const toggleView = (viewType) => {
    setView(viewType);
  };

  // Filter commissions for the view
  const filteredCommissions =
    view === "daily"
      ? commissions.filter(
        (c) => new Date(c.date).toDateString() === new Date().toDateString()
      )
      : commissions; // For "monthly", additional filtering logic can be added

  // Calculate monthly total
  const monthlyTotal = filteredCommissions.reduce(
    (total, commission) => total + parseFloat(commission.amount),
    0
  );

  // Fetch data on component mount
  useEffect(() => {
    fetchCommissions();
    // const [user,setUser]=useState({})
    setUser(JSON.parse(localStorage.getItem('user')))
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Commission Tracker
        </h2>

        {/* Toggle View Buttons */}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-lg mx-2 font-medium ${view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => toggleView("daily")}
          >
            Daily
          </button>
          <button
            className={`px-4 py-2 rounded-lg mx-2 font-medium ${view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => toggleView("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newCommission.name}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="date"
            name="date"
            value={newCommission.date}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newCommission.amount}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={saveCommissionHandler}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editingCommission ? "Update Commission" : "Add Commission"}
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Amount</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((commission) => (
                <tr key={commission._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{commission.name}</td>
                  <td className="py-3 px-4">
                    {new Date(commission.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    Rs{commission.amount}
                  </td>
                  {user && user.role === "admin" &&
                    <>
                      <td className="py-3 px-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(commission)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(commission._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Total */}
        {view === "monthly" && (
          <div className="mt-4 text-center font-medium text-gray-700">
            Monthly Total Commission:{" "}
            <span className="text-green-600">Rs{monthlyTotal}</span>
          </div>
        )}

        <div className="mt-4 text-center font-medium text-gray-600">
          Showing {view} commissions
        </div>
      </div>
    </div>
  );
}
