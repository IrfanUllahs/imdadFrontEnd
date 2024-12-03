import React, { useState, useEffect } from "react";
import axios from "../../utils/axios"; // Import axios instance


const topPakistaniBanks = [
  "Habib Bank Limited (HBL)",
  "United Bank Limited (UBL)",
  "Bank of Khyber",
  "National Bank of Pakistan (NBP)",
  "MCB Bank Limited",
  "Allied Bank Limited (ABL)",
  "Bank Alfalah",
  "Standard Chartered Bank Pakistan",
  "Bank of Punjab (BOP)",
  "Faysal Bank Limited",
  "Meezan Bank",
  "Askari Bank",
  "Summit Bank",
  "Silk Bank",
  "JS Bank",
  "Soneri Bank",
];

const Payment = () => {
  const [paymentType, setPaymentType] = useState("cash");
  const [payerName, setPayerName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState({})

  useEffect(() => {
    // Fetch payments from the backend on component mount
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`/api/recievedPayment`); // Use your correct API endpoint
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
  
    const paymentData = {
      paymentType,
      payerName,
      recipientName,
      transactionDate,
      amount: paymentType === "cash" ? cashAmount : bankAmount,
      bankName: selectedBank || "cash",
      senderName,
    };
  
    try {
      if (editPaymentId !== null) {
        // Update existing payment
        const response = await axios.put(
          `/api/recievedPayment/update/${editPaymentId}`,
          paymentData
        );
        setPayments(
          payments.map((payment) =>
            payment._id === editPaymentId ? response.data : payment
          )
        );
      } else {
        // Create a new payment
        const response = await axios.post(
          `/api/recievedPayment`,
          paymentData
        );
        setPayments([...payments, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/recievedPayment/delete/${id}`);
      setPayments(payments.filter((payment) => payment._id !== id));
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };
  
  const handleEdit = (payment) => {
    setEditPaymentId(payment._id);
    setPaymentType(payment.paymentType);
    setPayerName(payment.payerName);
    setRecipientName(payment.recipientName);
    setTransactionDate(payment.transactionDate);
    if (payment.paymentType === "cash") {
      setCashAmount(payment.amount);
      setSelectedBank("");
      setBankAmount("");
      setSenderName("");
    } else {
      setBankAmount(payment.amount);
      setSelectedBank(payment.bankName);
      setSenderName(payment.senderName);
      setCashAmount("");
      setPayerName("");
    }
  };
  
  const resetForm = () => {
    setPayerName("");
    setRecipientName("");
    setTransactionDate("");
    setCashAmount("");
    setSelectedBank("");
    setBankAmount("");
    setSenderName("");
    setEditPaymentId(null);
    setPaymentType("cash");
  };
  
  const filteredPayments = payments.filter((payment) =>
    payment.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Received Payment
      </h2>

      <form onSubmit={handlePaymentSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
          </div>

          {/* Transaction Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            />
          </div>

          {/* Payer Name */}
          {paymentType === "cash" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payer Name
              </label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Enter payer name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </div>
          )}

          {/* Sender Name */}
          {paymentType === "bank" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </div>
          )}

          {/* Recipient Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            />
          </div>

          {/* Cash Amount */}
          {paymentType === "cash" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount (Cash)
              </label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="Enter cash amount"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </div>
          )}

          {/* Bank Name */}
          {/* {paymentType === "bank" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                placeholder="Enter bank name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </div>
          )} */}
          {paymentType === "bank" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="mt-1 block w-full border  bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-400"
                required
              >
                <option value="" disabled>
                  Select a bank
                </option>
                {topPakistaniBanks.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bank Amount */}
          {paymentType === "bank" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (Bank)
              </label>
              <input
                type="number"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
                placeholder="Enter bank amount"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {editPaymentId ? "Update Payment" : "Submit Payment"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </form>

      <hr className="mb-6" />

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by recipient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
        />
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow ">
          <thead>
            <tr className="bg-blue-500 text-white   text-[12px] ">
              <th className="py-3 px-4 text-left">Payment Type</th>
              <th className="py-3 px-4 text-left">Payer / Sender</th>
              <th className="py-3 px-4 text-left">Recipient Name</th>
              <th className="py-3 px-4 text-left">Transaction Date</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-600">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {payment.paymentType === "cash"
                      ? payment.paymentType.charAt(0).toUpperCase() +
                      payment.paymentType.slice(1)
                      : payment.bankName}
                  </td>
                  <td className="py-3 px-4">
                    {payment.paymentType === "cash"
                      ? payment.payerName
                      : payment.senderName}
                  </td>
                  <td className="py-3 px-4">{payment.recipientName}</td>
                  <td className="py-3 px-4">
                    {new Date(payment.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{payment.amount}</td>
                  <td className="py-3 px-4 space-x-1">
                    {user?.role === 'admin' &&
                      <>
                        <button
                          onClick={() => handleEdit(payment)}
                          className="bg-yellow-500 text-white px-4 mx-1 py-1 rounded-md hover:bg-yellow-600 transition sm:my-0 my-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
