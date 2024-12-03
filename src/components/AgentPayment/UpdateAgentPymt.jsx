import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios"

// import { set } from "mongoose";
export default function UpdateAgentPymt({ onSubmit }) {
  const updateApiURL = `/api/agentPayments/update/`;
  const getApiURL = `/api/agentPayments/`;

  const navigate = useNavigate();

  const { id } = useParams();
  const [shipmentDetails, setShipmentDetails] = useState({
    shipmentNumber: "",
    agentName: "",
    paymentAmount: "",
    paymentStatus: "Pending",
  });
  const [arrivalDate, setArrivalDate] = useState();
  const [paymentDate, setPaymentDate] = useState();

  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Fetch the current data for the payment
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${getApiURL}${id}`);
        const data = response.data;
        console.log(data);

        // Populate the form fields
        setShipmentDetails({
          shipmentNumber: data.shipmentNumber,
          // arrivalDate: data.arrivalDate,
          agentName: data.agentName,
          paymentAmount: data.paymentAmount,
          // paymentDate: data.paymentDate,
          paymentStatus: data.paymentStatus,
        });
        setArrivalDate(data.arrivalDate);
        setPaymentDate(data.paymentDate);

        setSelectedCurrency(data.currency || "USD");
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipmentDetails({ ...shipmentDetails, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...shipmentDetails,
      currency: selectedCurrency,
      arrivalDate: arrivalDate,
      paymentDate: paymentDate,
    };

    try {
      console.log(updatedData);
      const response = await axios.put(`${updateApiURL}${id}`, updatedData);
      const data = response.data;
      setShipmentDetails({
        shipmentNumber: data.shipmentNumber,
        // arrivalDate: data.arrivalDate,
        agentName: data.agentName,
        paymentAmount: data.paymentAmount,
        // paymentDate: data.paymentDate,
        paymentStatus: data.paymentStatus,
      });
      // console.log("Updated successfully:", response.data);
      navigate('/agentpayment')

    } catch (error) {
      console.error("Error updating payment details:", error);
      alert("Failed to update payment details.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <section className="bg-white shadow-lg rounded-lg p-8 mb-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Update Agent Payment
        </h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="shipmentNumber" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-2">
                Arrival Date:
              </label>
              <input
                id="arrivalDate"
                name="arrivalDate"
                type="date"
                value={arrivalDate || ""}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">
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
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  value={shipmentDetails.paymentAmount}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date:
              </label>
              <input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={paymentDate || ""}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status:
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={shipmentDetails.paymentStatus}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
              Update Payment
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
