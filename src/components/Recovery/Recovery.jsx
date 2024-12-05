import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";




const Recovery = () => {
  const [form, setForm] = useState({
    recoveryDate: "",
    amountRecovered: "",
  });
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [recoveryHistory, setRecoveryHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch customers and recovery history on mount
  useEffect(() => {
    fetchCustomers();
    fetchRecoveryHistory();
  }, []);

  let customersData;
  // Fetch customers from the API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/customers`);

      // Destructure data to extract required fields
      customersData = response.data.map(({ _id, name, email, loanAmount, recoveryHistory }) => ({
        _id,
        name,
        email,
        loanAmount,
        recoveryHistory
      }));

      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };


  // Fetch recovery history from the API
  const fetchRecoveryHistory = async () => {
    try {
      const response = await axios.get(`/api/recoveries`);
      setRecoveryHistory(response.data);
    } catch (error) {
      console.error("Error fetching recovery history:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    const { recoveryDate, amountRecovered } = form;
    if (!amountRecovered || isNaN(amountRecovered)) {
      alert("Please enter a valid recovery amount");
      return;
    }



    // Update the customer's loan amount in the Customer API
    await axios.put(
      `/api/customers/update/${selectedCustomer}`,
      { loan: amountRecovered }
    );

    // Store the recovery record in the Recovery API
    await axios.post(`/api/recoveries/add`, {
      customerId: selectedCustomer,
      customersData: customersData,
      recoveryDate,
      amountRecovered: parseFloat(amountRecovered),
    });

    // Refresh customer and recovery data
    fetchCustomers();
    fetchRecoveryHistory();

    alert("Recovery recorded successfully!");
    setForm({ recoveryDate: "", amountRecovered: "" });
    setSelectedCustomer("");

  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <section className="bg-white shadow-lg rounded-lg p-4 md:p-8 mb-8 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6">
          Recovery Management
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md mb-8"
        >
          <h3 className="text-xl font-bold mb-4">Record New Recovery</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-4">
            <div>
              <label className="block text-[14px] font-semibold text-gray-700">
                Customer Name
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="amountRecovered"
                className="block text-base text-gray-700 mb-2"
              >
                Amount Recovered (₨):
              </label>
              <input
                id="amountRecovered"
                name="amountRecovered"
                type="number"
                value={form.amountRecovered}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="recoveryDate"
                className="block text-base text-gray-700 mb-2"
              >
                Recovery Date:
              </label>
              <input
                id="recoveryDate"
                name="recoveryDate"
                type="date"
                value={form.recoveryDate}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Record Recovery
          </button>
        </form>

        <div className="text-center mb-6">
          <button
            onClick={toggleHistory}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>

        {showHistory && (
  <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 max-w-4xl mx-auto">
    <h3 className="text-lg md:text-xl font-bold mb-4">Recovery History</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 md:px-6 border-b text-sm md:text-base text-left">#</th>
            <th className="py-2 px-4 md:px-6 border-b text-sm md:text-base text-left">Customer Name</th>
            <th className="py-2 px-4 md:px-6 border-b text-sm md:text-base text-left">Loan Amount</th>
            <th className="py-2 px-4 md:px-6 border-b text-sm md:text-base text-left">Amount Recovered</th>
            <th className="py-2 px-4 md:px-6 border-b text-sm md:text-base text-left">Recovery Date</th>
          </tr>
        </thead>
        <tbody>
          {recoveryHistory.map((recovery, index) => (
            <tr key={recovery._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 md:px-6 border-b text-sm md:text-base">{index + 1}</td>
              <td className="py-2 px-4 md:px-6 border-b text-sm md:text-base">{recovery.customerId.name}</td>
              <td className="py-2 px-4 md:px-6 border-b text-sm md:text-base">₨ {recovery.customerId.loan}</td>
              <td className="py-2 px-4 md:px-6 border-b text-sm md:text-base">₨ {recovery.amountRecovered}</td>
              <td className="py-2 px-4 md:px-6 border-b text-sm md:text-base">
                {new Date(recovery.recoveryDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      </section>
    </div>
  );
};

export default Recovery;
