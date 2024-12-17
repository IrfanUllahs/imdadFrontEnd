import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CustomerKhata = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchCustomerDetails();
    fetchCustomerTransactions();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`/api/customers/${customerId}`);
      setCustomer(response.data);

    } catch (err) {
      console.error("Error fetching customer details:", err);
    }
  };
  
  const fetchCustomerTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions/${customerId}`);
      console.log("this is the response : ", response.data);
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handlePrintPDF = async () => {
    const element = document.getElementById("khata-section");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${customer?.name}_Khata.pdf`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <section
        id="khata-section"
        className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          {customer ? `${customer.name}'s Khata` : "Loading..."}
        </h2>
        <button
        onClick={handlePrintPDF}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold mb-2 py-2 px-4 rounded-lg shadow-md"
      >
        Print PDF
      </button>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg border-2">
              <thead className="bg-gray-100 border-b">
                <tr className="bg-orange-400 text-white">
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Product
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Company
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Size
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Weight
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Total Price
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Payment
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Loan
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.product.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.product.companyName}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.product.size}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.quantity} kg
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.payment.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {transaction.loan.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="shadow-lg rounded-lg p-6 mt-5 text-center bg-orange-500 text-white transition duration-300 transform hover:scale-100">
              <h2 className="text-xl font-bold text-[14px] mx-5 text-white">
                Total Remaining Loan
              </h2>
              <p className="text-[30px]">{customer?.loan.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No transactions found for this customer.</p>
        )}
      </section>
     
    </div>
  );
};

export default CustomerKhata;
