import React, { useState, useEffect } from "react";
import axios from "../../utils/axios.js";


export default function Purchase() {
  const [amountInPKR, setAmountInPKR] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD

  const currencySymbols = {
    USD: "$",
    CNY: "¥",
    AED: "AED",
    SAR: "SAR",
    AFN: "AFN",
    EUR: "€",
  };

  const amountInSelectedCurrency = (amountInPKR / conversionRate).toFixed(2);
  const selectedCurrencySymbol = currencySymbols[selectedCurrency];

  const handlePKRChange = (event) => {
    setAmountInPKR(event.target.value);
  };

  const handleReset = () => {
    setAmountInPKR(100000);
  };

  const handleSave = async () => {
    if (!amountInPKR || !conversionRate || !selectedCurrency) {
      alert("Please fill in all the required fields.");
      return;
    }
    const newEntry = {
      pkr: amountInPKR,
      amountInSelectedCurrency,
      selectedCurrency,
      selectedCurrencySymbol,
    };

    try {
      // console.log('************',newEntry);
      const response = await axios.post(`/api/purchase-history/save`,
        newEntry
      );


      setHistory([...history, response.data]);
      setFilteredHistory([...history, response.data]);
      alert("Entry successfully saved!");

      // Reset form fields
      setAmountInPKR("");
      setConversionRate("");
      setSelectedCurrency("");
    } catch (error) {
      console.error("Error saving purchase history:", error);
    }
  };


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`/api/purchase-history`
        );
        setHistory(response.data);
        setFilteredHistory(response.data);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchHistory();
  }, []);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = history.filter(
      (entry) =>
        (entry.date && entry.date.includes(value)) ||
        (entry.pkr !== undefined && entry.pkr.toString().includes(value)) ||
        (entry.amountInSelectedCurrency !== undefined &&
          entry.amountInSelectedCurrency.toString().includes(value))
    );

    setFilteredHistory(filtered);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <section className="mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Currency Convertor
        </h2>
        {/* <p className="text-sm text-gray-600 mb-6">
                    For Imdad Pharma, understanding the currency conversion rates between Pakistani Rupee (PKR) and various currencies is crucial for accurate budgeting and financial planning.
                </p> */}

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex flex-col gap-3 lg:px-[100px]">
          <div className="flex gap-1 h-[30px] ">
            <select
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full h-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
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
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="pkrAmount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Amount in PKR:
            </label>
            <input
              id="pkrAmount"
              type="number"
              value={amountInPKR}
              onChange={handlePKRChange}
              className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <p className="text-sm text-gray-600 mb-4">
            <strong>Equivalent Amount:</strong>
            <br />
            <strong>{amountInPKR.toLocaleString()} PKR</strong> is approximately{" "}
            <strong>
              {selectedCurrencySymbol}
              {amountInSelectedCurrency} {selectedCurrency}
            </strong>
            .
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white  p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="bg-orange-600 text-white  p-1 rounded-lg hover:bg-orange-700 transition duration-200"
            >
              Reset Amount
            </button>
          </div>
        </div>
        <section className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Conversion History
          </h3>
          <button
            onClick={toggleHistory}
            className="bg-gray-600 text-white  p-2 rounded-lg hover:bg-gray-700 transition duration-200 mb-4"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
          {showHistory && (
            <>
              <input
                type="text"
                placeholder="Search by date or amount"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-1 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {filteredHistory.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No purchase history available.
                </p>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border-b text-sm sm:text-base">
                            Entry Number
                          </th>
                          <th className="p-2 border-b text-sm sm:text-base">
                            Date
                          </th>
                          <th className="p-2 border-b text-sm sm:text-base">
                            Amount (PKR)
                          </th>
                          <th className="p-2 border-b text-sm sm:text-base">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.map((entry, index) => (
                          <tr key={index}>
                            <td className="p-2 border-b text-sm sm:text-base">
                              {index + 1}
                            </td>
                            <td className="p-2 border-b text-sm sm:text-base">
                              {new Date(entry.date).toLocaleDateString()}
                            </td>
                            <td className="p-2 border-b text-sm sm:text-base">
                              <strong>Rs.</strong> {entry.pkr}
                            </td>
                            <td className="p-2 border-b text-sm sm:text-base">
                              <strong>{entry.selectedCurrencySymbol}</strong>{" "}
                              {entry.amountInSelectedCurrency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </div>
  );
}
