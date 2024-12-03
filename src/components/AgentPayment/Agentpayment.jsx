import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
export default function AgentPayment({ onSubmit }) {

  const reformatDateForInput = (date) => {
    const d = new Date(date); // Convert to Date object
    const year = d.getUTCFullYear(); // Get the year in UTC
    const month = String(d.getUTCMonth() + 1).padStart(2, "0"); // Get the month in UTC and pad with '0'
    const day = String(d.getUTCDate()).padStart(2, "0"); // Get the day in UTC and pad with '0'
    return `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'
  };

  console.log('date is ', reformatDateForInput('1986-09-26T00:00:00.000Z	'));
  const navigate = useNavigate();
  const [shipmentDetails, setShipmentDetails] = useState({
    shipmentNumber: "",
    arrivalDate: "",
    agentName: "",
    paymentAmount: "",
    paymentDate: "",
    paymentStatus: "Pending",
  });

  const [history, setHistory] = useState([]);
  const [amountInPKR, setAmountInPKR] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [deletedHistory, setDeletedHistory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const [paymentAmount, setPaymentAmount] = useState(); // New state for payment amount
  const [user, setUser] = useState({})
  const currencySymbols = {
    USD: "$", CNY: "¥", AED: "AED", SAR: "SAR", AFN: "AFN", EUR: "€",
  };

  // to get all the payments from the server
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `/api/agentPayments`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchHistory();
    setUser(JSON.parse(localStorage.getItem('user')))
  }, []);

  const handleChange = (e) => {
    // console.log('target===',e.target);
    const { name, value } = e.target;
    setShipmentDetails({ ...shipmentDetails, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payment = Number.parseInt(paymentAmount);
    let obj = {
      ...shipmentDetails,
      currency: selectedCurrency,
      paymentAmount: payment,
    };
    // Add new entry
    try {
      const response = await axios.post(`/api/agentPayments/save`, obj);
      setHistory([...history, response.data]);
  
      // Show success alert
      alert("Form submitted successfully!");
  
      // Clear form inputs
      setShipmentDetails({
        shipmentNumber: "",
        arrivalDate: "",
        agentName: "",
        paymentAmount: "",
        paymentDate: "",
        paymentStatus: "Pending",
      });
      setPaymentAmount("");
      setSelectedCurrency("USD"); // Reset currency to default if needed
    } catch (error) {
      console.error("Error submitting payment details:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `/api/agentPayments/delete/${id}`
      );
      setHistory(history.filter((entry) => entry._id !== id));
      setDeletedHistory([
        ...deletedHistory,
        history.find((entry) => entry._id === id),
      ]);
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const filteredHistory = history.filter(
    (entry) =>
      entry.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.arrivalDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.paymentAmount.toString().includes(searchQuery.toLowerCase()) ||
      entry.paymentDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <section className="bg-white shadow-lg rounded-lg p-8 mb-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Agent Payment
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Enter the details of the clearing agent payment for the shipment.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="shipmentNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Shipment Number:
              </label>
              <input
                id="shipmentNumber"
                name="shipmentNumber"
                type="text"
                value={shipmentDetails.shipmentNumber}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="arrivalDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Arrival Date:
              </label>
              <input
                id="arrivalDate"
                name="arrivalDate"
                type="date"
                value={reformatDateForInput(shipmentDetails.arrivalDate)}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="agentName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Clearing Agent Name:
              </label>
              <input
                id="agentName"
                name="agentName"
                type="text"
                value={shipmentDetails.agentName}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex flex-col mt-1">
              <p>Payment Amount:</p>
              <div className="flex gap-1 h-[35px] ">
                <select
                  id="currency"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full h-full p-1 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                >
                  <option value="USD">USD</option>
                  <option value="CNY">Chinese Yuan</option>
                  <option value="AED">Dirham</option>
                  <option value="SAR">Riyal</option>
                  <option value="AFN">Afghan Afghani</option>
                  <option value="EUR">Euro</option>
                </select>
                <input
                  id="conversionRate"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Payment Date:
              </label>
              <input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={reformatDateForInput(shipmentDetails.paymentDate)}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Payment Status:
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={shipmentDetails.paymentStatus}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white "
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="p-2 w-fit bg-orange-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {editingIndex !== null ? "Update Payment" : "Submit Payment"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white shadow-lg rounded-lg p-8 mb-8 max-w-5xl mx-auto flex flex-col gap-5">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
          Payment History
        </h2>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search payment history"
            className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={toggleHistory}
          className="p-2 bg-orange-500 text-white text-sm w-fit font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
        {showHistory && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-400 text-white text-[10px] sm:text-[12px] ">
                  <th className="sm:p-2 p-1 border border-gray-300">
                    Shipment Number
                  </th>
                  <th className="sm:p-2 p-1 border border-gray-300">
                    Arrival Date
                  </th>
                  <th className="sm:p-2 p-1 border border-gray-300">
                    Clearing Agent Name
                  </th>
                  <th className="sm:p-2 p-1 border border-gray-300">
                    Payment Amount
                  </th>
                  <th className="sm:p-2 p-1 border border-gray-300">
                    Payment Date
                  </th>
                  <th className="sm:p-2 p-1 border border-gray-300">
                    Payment Status
                  </th>
                  <th className="sm:p-2 p-1 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((entry, index) => (
                  <tr key={index} className="bg-white border-b border-gray-300">
                    <td className="py-3 px-4">{entry.shipmentNumber}</td>
                    <td className="py-3 px-4">{new Date(entry.arrivalDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{entry.agentName}</td>
                    <td className="py-3 px-4">{entry.paymentAmount}</td>
                    <td className="py-3 px-4">{new Date(entry.paymentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{entry.paymentStatus}</td>
                    <td className="py-3 px-4">
                      {user?.role === 'admin' &&
                        <>
                          <button
                            onClick={() =>
                              navigate(`/updateagentpayment/${entry?._id}`)
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                          >
                            Delete
                          </button>
                        </>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
