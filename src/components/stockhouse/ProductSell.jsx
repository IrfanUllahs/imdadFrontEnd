import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";


const AddTransaction = () => {
  const [selectedQuantity, setSelectedQuantity] = useState("quantity");
  const [showHistory, setShowHistory] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productPrice, setProductPrice] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [payment, setPayment] = useState();
  const [loan, setLoan] = useState();
  const [transactions, setTransactions] = useState([]); // State for storing transaction data
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      const customersResponse = await axios.get(
        `/api/customers`
      );
      const productsResponse = await axios.get(
        `/api/stocks`
      );
      setCustomers(customersResponse.data);
      setProducts(productsResponse.data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/api/transactions`);
        console.log("this is the response : ", response.data);
        setTransactions(response.data); // Populate transactions with API data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const result = (totalQuantity) * (productPrice);
    setTotalPrice(result);
  }, [totalQuantity, productPrice]);

  useEffect(() => {
    setLoan(Number(totalPrice) - Number(payment));
  }, [totalPrice, payment]);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(productId);
    setProductPrice(product ? product.price : 0);
  };
  const handleSave = async () => {
    try {
      let customerId = selectedCustomer;
      await axios.post(`/api/transactions`, {
        customer: customerId,
        product: selectedProduct,
        quantity: totalQuantity,
        payment,
        loan,
        totalPrice,
      });

      // Reset form
      setSelectedCustomer("");
      setNewCustomer("");
      setSelectedProduct("");
      setTotalQuantity(0);
      setProductPrice(0);
      setTotalPrice(0);
      setPayment(0);
      setLoan(0);

      alert("Transaction saved successfully!");
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction");
    }
  };

  return (
    <div className="py-8 px-2 lg:px-24">
      <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">
        Add Transaction
      </h2>

      <div className="space-y-6">
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
          <Link to="/customer">
            <button className="bg-orange-600 rounded-md p-1 mt-3 text-white hover:bg-orange-500">
              Add New Customer
            </button>
          </Link>
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-gray-700">
            Product Name
          </label>
          <select
            value={selectedProduct}
            onChange={handleProductChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>


        <div className="flex flex-col mt-1">
          {/* <p>Payment Amount:</p> */}
          <div className="flex gap-1 sm:flex-row flex-col ">


            <input
              id="conversionRate"
              type="text"
              placeholder="Enter size..."
              // value={conversionRate}
              // onChange={(e) => setConversionRate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          
            <input
              id="conversionRate"
              type="number"
              placeholder="Enter weight..."
              value={totalQuantity}
              onChange={(e) => setTotalQuantity((e.target.value))}
              // onChange={(e) => setConversionRate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-semibold text-gray-700">
              Price(Per Item)
            </label>
            <input
              type="number"
              value={productPrice}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              // readOnly
              onChange={(e) => setProductPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-gray-700">
              Total Price
            </label>
            <input
              type="number"
              value={totalPrice}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-semibold text-gray-700">
              Payment
            </label>
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(Number(e.target.value))}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-gray-700">
              Loan
            </label>
            <input
              type="number"
              value={loan}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none"
              readOnly
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 mt-6 text-white font-semibold bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Save Transaction
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="mt-6 py-2 px-4 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>

        {/* Transaction History Table */}
        {showHistory && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Transaction History</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="min-w-full bg-white border-gray-200 border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Customer</th>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">Company</th>
                    <th className="py-2 px-4 border-b">Size</th>
                    <th className="py-2 px-4 border-b">Weight</th>
                    <th className="py-2 px-4 border-b">Price</th>
                    <th className="py-2 px-4 border-b">Payment</th>
                    <th className="py-2 px-4 border-b">Loan</th>
                    <th className="py-2 px-4 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="py-2 px-4 border-b">{transaction.customer?.name || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{transaction.product?.name || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{transaction.product?.companyName || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{transaction.product?.size || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{transaction.quantity}</td>
                      <td className="py-2 px-4 border-b">{transaction.totalPrice}</td>
                      <td className="py-2 px-4 border-b">{transaction.payment}</td>
                      <td className="py-2 px-4 border-b">{transaction.loan}</td>
                      <td className="py-2 px-4 border-b">{new Date(transaction.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;