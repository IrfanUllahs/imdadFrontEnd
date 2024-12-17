import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";


const StockHouse = () => {
  const [products, setProducts] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [quantity, setQuantity] = useState();
  const [size, setSize] = useState();
  const [weight, setWeight] = useState();
  const [newProduct, setNewProduct] = useState({
    name: "",
    purchasePrice: "",
  });
  const [totalProfit, setTotalProfit] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [user, setUser] = useState({}); // User state
  // Fetch products from the backend on component mount
  useEffect(() => {
    fetchProducts();
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/stocks`);
      const data = response.data;
      console.log("this is data : ", data);
      setProducts(data);
      calculateTotalProfit(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to calculate total profit
  const calculateTotalProfit = (data) => {
    const profit = data.reduce((acc, product) => {
      return (
        acc + (product.salePrice - product.purchasePrice) * product.soldQuantity
      );
    }, 0);
    setTotalProfit(profit);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    const productToAdd = {
      name: newProduct.name,
      companyName: companyName, // Use the state value
      size: size,              // Use the state value
      weight: weight,
      purchasePrice: parseFloat(newProduct.purchasePrice),
      salePrice: parseFloat(newProduct.salePrice),
      quantity: quantity,
    };
  
    try {
      const response = await axios.post(`/api/stocks`, productToAdd);
      const addedProduct = response.data;
  
      // Update state with the new product
      setProducts([...products, addedProduct]);
      setNewProduct({
        name: "",
        purchasePrice: "",
      });
      setCompanyName("");
      setSize("");
      setWeight("");
      setQuantity("");
      calculateTotalProfit([...products, addedProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Inventory Manager</h1>

      {/* Search Bar */}


      {/* Add New Product Form */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Product</h2>
        <div className="flex flex-col gap-2">
          <input
            className="border rounded p-2 w-full"
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2 w-full"
            type="text"
            name="name"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            className="border rounded p-2 w-full"
            type="number"
            name="purchasePrice"
            placeholder="Purchase Price"
            value={newProduct.purchasePrice}
            onChange={handleInputChange}
          />
          <div className="flex flex-col mt-1">
            <div className="flex gap-1 sm:flex-row flex-col">
              <input
                id="conversionRate"
                type="text"
                placeholder="Enter size..."
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
             
              <input
                id="conversionRate"
                type="number"
                placeholder="Enter weight..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <button
            className="col-span-1 sm:col-span-2 lg:col-span-4 text-white rounded p-2 bg-orange-600 hover:bg-orange-500"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>
      </div>
      {/* search bar */}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left bg-white shadow-md rounded-lg">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="lg:p-3 p-1 sm:text-[14px] text-[10px]">Name</th>
              <th className="lg:p-3 p-1 sm:text-[14px] text-[10px]">Company</th>
              {
                user?.role === "admin" &&
                <>
                  <th className="lg:p-3 p-1 sm:text-[14px] text-[10px]">Purchase Price</th>
                  <th className="lg:p-3 p-1 sm:text-[14px] text-[10px]">Total Price</th>
                </>
              }

              <th className="lg:p-3 p-1 sm:text-[14px] text-[10px]">Size</th>
              <th className="lg:p-3 p-1 sm:text-[14px] text-[10px]">Weight</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="lg:p-3 p-1 text-[14px]">{product.name}</td>
                <td className="lg:p-3 p-1 text-[14px]">{product.companyName}</td>
                {user?.role === "admin" &&
                  <>
                    <td className="lg:p-3 p-1 text-[14px]">{product.purchasePrice}</td>
                    <td className="lg:p-3 p-1 text-[14px]">{(product.purchasePrice)*(product.quantity)}</td>

                  </>
                }
                <td className="lg:p-3 p-1 text-[14px]">{product.size}</td>
                <td className="lg:p-3 p-1 text-[14px]">{product.quantity}kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Profit */}
      {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold">
          Total Profit Today: {totalProfit}
        </h2>
      </div> */}
    </div>
  );
};

export default StockHouse;
