import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [transactions, setTransactions] = useState({});
  console.log(transactions);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [expandedCustomerId, setExpandedCustomerId] = useState(null); // New state for toggling details
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCustomersAndTranscations();
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    filterCustomers(searchTerm);
  }, [customers, searchTerm]);

  const fetchCustomersAndTranscations = async () => {
    try {
      const response = await axios.get(`/api/customers`);

      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };
  const fetchTransactions = async (customerId) => {
    try {
      const response2 = await axios.get(`/api/transactions/${customerId}`);
      console.log("this is the customer based data : >>> ", response2);
      setTransactions(response2.data);
    } catch (err) {
      setTransactions({});
      console.error("Error fetching transactions:", err);
    }
  }
  const filterCustomers = (term) => {
    if (!term) {
      setFilteredCustomers(customers);
    } else {
      const lowercasedTerm = term.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowercasedTerm) ||
          customer.email.toLowerCase().includes(lowercasedTerm) ||
          customer.phone.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`/api/customers/${form.id}`, form);
      } else {
        await axios.post(`/api/customers`, form);
      }
      fetchCustomersAndTranscations();
    } catch (err) {
      console.error("Error saving customer:", err);
    }
     // Show success alert
     alert("Form submitted successfully!");
    setForm({ id: null, name: "", email: "", phone: "", address: "" });
  };

  const handleEdit = (customer) => {
    setForm({ ...customer });
  };

  const handleViewDetails = (customerId) => {
    setExpandedCustomerId(
      expandedCustomerId === customerId ? null : customerId
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (expandedCustomerId) {
      fetchTransactions(expandedCustomerId);
    }
  }, [expandedCustomerId]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Customer Management
        </h2>

        {/* Customer Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg shadow-md mb-8"
        >
          <h3 className="text-[18px] font-bold mb-4">
            {form.id ? "Edit Customer" : "Add New Customer"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Name:
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Phone:
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Address:
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white  lg:p-3 p-1 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {form.id ? "Update Customer" : "Add Customer"}
          </button>
        </form>

        {/* Customer List */}
        <h3 className="text-xl font-bold mb-4">Customer List</h3>
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full lg:p-2 p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <ul className="bg-gray-50 sm:p-6 rounded-lg shadow-md">
          {filteredCustomers.map((customer) => (
            <li
              key={customer._id}
              className="mb-4 p-4 border-b border-gray-300"
            >
              <div className="flex justify-between  sm:flex-row flex-col sm:gap-0 gap-3">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    {customer.name}
                  </h4>
                  <p className="text-gray-600">Email: {customer.email}</p>
                  <p className="text-gray-600">Phone: {customer.phone}</p>
                </div>
                <div>
                  {user && user.role === "admin" &&
                    <>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg mr-2"
                      >
                        Edit
                      </button>
                    </>
                  }
                  <button
                    onClick={() => handleViewDetails(customer._id)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-lg"
                  >
                    {expandedCustomerId === customer._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>
              {expandedCustomerId === customer._id && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <p>
                    <strong className="font-bold text-gray-700">Name:</strong>{" "}
                    {customer.name}
                  </p>
                  <p>
                    <strong className="font-bold text-gray-700">Email:</strong>{" "}
                    {customer.email}
                  </p>
                  <p>
                    <strong className="font-bold text-gray-700">Phone:</strong>{" "}
                    {customer.phone}
                  </p>
                  <p>
                    <strong className="font-bold text-gray-700">
                      Address:
                    </strong>{" "}
                    {customer.address}
                  </p>
                  <p>
                    <strong className="font-bold text-gray-700">
                      Loan:
                    </strong>{" "}
                    {customer.loan}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Customer;
