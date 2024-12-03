import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";


export default function FreightDetail() {
  const [selectedStatus, setSelectedStatus] = useState("In Peshawar");
  const [details, setDetails] = useState({
    shipmentNumber: "",
    originCity: "",
    destinationCity: "",
    departureDate: "",
    arrivalDate: "",
    carrierName: "",
    freightCostPKR: "",
    customsFeePKR: "",
    status: "In Peshawar",
    containerNumber: "0",
    aeroplaneNumber: "0",
    contactNumber: "",
    journey: "",
    driverPaymentPKR: "",
  });

  const [useContainer, setUseContainer] = useState();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState({})
  // setUser(JSON.parse(localStorage.getItem('user')))

  // Function to format date to DD/MM/YYYY
  const formatDateToISO = (date) => {
    // Convert date string (e.g., "25/12/2024") to "2024-12-25"
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchFreightHistory();
    setUser(JSON.parse(localStorage.getItem('user')))
  }, []);

  const fetchFreightHistory = async () => {
    try {
      const response = await axios.get(`/api/freight`);
      setHistory(response.data);
      setFilteredHistory(response.data);
    } catch (error) {
      console.error("Error fetching freight history:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the date fields before submitting
    const detailsObj = {
      ...details,
      status: selectedStatus,
      departureDate: details.departureDate,
      arrivalDate: details.arrivalDate,
      aeroplaneNumber: details.aeroplaneNumber,
    };

    // Log detailsObj to ensure it's structured correctly
    console.log("this is : : : ", detailsObj);

    try {
      if (isEditing) {
        await axios.put(`/api/freight/update/${editId}`, detailsObj);
        setIsEditing(false);
        setEditId(null);
      } else {
        const response = await axios.post(`/api/freight`, detailsObj);
        console.log(response);
      }
      fetchFreightHistory();
      resetForm();
    } catch (error) {
      console.error("Error submitting freight details:", error);
    }
  };


  const resetForm = () => {
    setDetails({
      shipmentNumber: "",
      originCity: "",
      destinationCity: "",
      departureDate: "",
      arrivalDate: "",
      carrierName: "",
      freightCostPKR: "",
      customsFeePKR: "",
      status: "In Transit",
      containerNumber: "0",
      aeroplaneNumber: "0",
      contactNumber: "",
      journey: "",
      driverPaymentPKR: "",
    });
    setSelectedStatus("In Peshawar");
  };

  const handleEdit = (entry) => {
    setDetails({ ...entry });
    setEditId(entry._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/freight/delete/${id}`);
      fetchFreightHistory();
    } catch (error) {
      console.error("Error deleting freight details:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistory(history);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = history.filter((entry) =>
        Object.values(entry).some((value) =>
          value.toString().toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  return (
    <div className="bg-gray-100 flex flex-col gap-6">
      <section className="bg-white shadow-lg rounded-lg sm:p-12 p-2">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          {isEditing ? "Update Freight Details" : "Freight Details"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div >
            {/* Your existing form fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipment Number
                  </label>
                  <input
                    name="shipmentNumber"
                    type="text"
                    value={details.shipmentNumber}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin City
                  </label>
                  <input
                    name="originCity"
                    type="text"
                    value={details.originCity}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination City
                  </label>
                  <input
                    name="destinationCity"
                    type="text"
                    value={details.destinationCity}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    name="contactNumber"
                    type="text"
                    value={details.contactNumber}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date
                  </label>
                  <input
                    name="departureDate"
                    type="date"
                    value={details.departureDate}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Payment (PKR)
                  </label>
                  <input
                    name="driverPaymentPKR"
                    type="number"
                    value={details.driverPaymentPKR}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Duty Free (PKR)
                  </label>
                  <input
                    name="customsFeePKR"
                    type="number"
                    value={details.customsFeePKR}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    freight Cost (PKR)
                  </label>
                  <input
                    name="freightCostPKR"
                    type="number"
                    value={details.freightCostPKR}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arival Date
                  </label>
                  <input
                    name="arrivalDate"
                    type="date"
                    value={details.arrivalDate}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrier Name
                  </label>
                  <input
                    name="carrierName"
                    type="text"
                    value={details.carrierName}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atoms
                  </label>
                  <input
                    name="atoms"
                    type="text"
                    value={details.atoms}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm"
                  >
                    <option value="In Peshawre">In Peshawer</option>
                    <option value="In Lahore">In Lahore</option>
                    <option value="In Karachi">In Karachi</option>
                    <option value="In Dubai">In Dubai</option>
                  </select>
                </div>
                {/* Add similar fields for other properties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Use Container or Aeroplane Number
                  </label>
                  <select
                    onChange={(e) =>
                      setUseContainer(e.target.value === "container")
                    }
                    className="w-full p-1 border border-gray-300 rounded-lg shadow-sm"
                  >
                    <option value="container">Container</option>
                    <option value="aeroplane">Aeroplane</option>
                  </select>
                </div>
                {useContainer ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Container Number
                    </label>
                    <input
                      name="containerNumber"
                      type="text"
                      value={details.containerNumber}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aeroplane Number
                    </label>
                    <input
                      name="aeroplaneNumber"
                      type="text"
                      value={details.aeroplaneNumber}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Journey
                </label>
                <input
                  name="journey"
                  type="text"
                  value={details.journey}
                  onChange={handleChange}
                  className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </form>
          </div>
          <button
            type="submit"
            className="py-1 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {isEditing ? "Update Details" : "Submit Details"}
          </button>
        </form>
      </section>

      <section className="bg-white shadow-lg rounded-lg sm:p-12 p-2">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Freight History</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 w-full border rounded-lg shadow-sm"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Shipment Number</th>
                <th className="border border-gray-300 px-4 py-2">Origin City</th>
                <th className="border border-gray-300 px-4 py-2">Destination City</th>
                <th className="border border-gray-300 px-4 py-2">Departure Date</th>
                <th className="border border-gray-300 px-4 py-2">Arrival Date</th>
                <th className="border border-gray-300 px-4 py-2">Carrier Name</th>
                <th className="border border-gray-300 px-4 py-2">Freight Cost (PKR)</th>
                <th className="border border-gray-300 px-4 py-2">Customs Fee (PKR)</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Container Number</th>
                <th className="border border-gray-300 px-4 py-2">Aeroplane Number</th>
                <th className="border border-gray-300 px-4 py-2">Contact Number</th>
                <th className="border border-gray-300 px-4 py-2">Journey</th>
                <th className="border border-gray-300 px-4 py-2">Driver Payment (PKR)</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{entry.shipmentNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.originCity}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.destinationCity}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(entry.departureDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(entry.arrivalDate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.carrierName}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.freightCostPKR}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.customsFeePKR}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.containerNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.aeroplaneNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.contactNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.journey}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.driverPaymentPKR}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user && user.role === "admin" &&
                      <>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
      </section>
    </div>
  );
}

