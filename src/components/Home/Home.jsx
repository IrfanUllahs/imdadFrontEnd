import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";


export default function Home() {
  const [payments, setPayments] = useState({
    UBL: 0,
    MCB: 0,
    HBL: 0,
    Khyber: 0,
    Meezan: 0,
    Cash: 0,
  });

  const [totalammount, setTotalammount] = useState({
    totalAmount: 0
  });

  const [montlyPayments, setMonthlyPayments] = useState({
    UBL: 0,
    MCB: 0,
    HBL: 0,
    Khyber: 0,
    Meezan: 0,
    Cash: 0,
  });

  const [loading, setLoading] = useState(true);

 // Fetch data from the database
useEffect(() => {
  const fetchPayments = async () => {
    try {
      const response = await axios.get(`/api/recievedPayment/today`);
      const data = response.data;
      console.log("Fetched payments:", data);
      // Set state with the fetched data
      setPayments({
        UBL: data["United Bank Limited (UBL)"] || 0,
        MCB: data["MCB Bank Limited"] || 0,
        HBL: data["Habib Bank Limited (HBL)"] || 0,
        Khyber: data["Bank of Khyber"] || 0,
        Meezan: data["Meezan Bank"] || 0,
        Cash: data["cash"] || 0,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyPayments = async () => {
    try {
      const response = await axios.get(`/api/recievedPayment/monthly`);
      const data = response.data;

      setMonthlyPayments({
        UBL: data["United Bank Limited (UBL)"] || 0,
        MCB: data["MCB Bank Limited"] || 0,
        HBL: data["Habib Bank Limited (HBL)"] || 0,
        Khyber: data["Bank of Khyber"] || 0,
        Meezan: data["Meezan Bank"] || 0,
        Cash: data["cash"] || 0,
      });
    } catch (error) {
      console.error("Error fetching monthly payments:", error);
    }
  };

  const fetchTotalAmmount = async () => {
    try {
      const response = await axios.get(`/api/recievedPayment/total-yearly`);
      const data = response.data;

      setTotalammount({
        totalAmount: data["totalAmount"] || 0,
      });
    } catch (error) {
      console.error("Error fetching total amount:", error);
    }
  };

  fetchTotalAmmount();
  fetchPayments();
  fetchMonthlyPayments();
}, []);


  const arrowUp = (
    <svg
      className="w-6 h-6 inline-block text-green-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 7.414V14a1 1 0 11-2 0V7.414L7.707 9.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 5z"
        clipRule="evenodd"
      />
    </svg>
  );

  const arrowDown = (
    <svg
      className="w-6 h-6 inline-block text-red-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 15a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L9 12.586V6a1 1 0 112 0v6.586l1.293-1.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 15z"
        clipRule="evenodd"
      />
    </svg>
  );

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <aside className="overflow-hidden text-black rounded-lg mx-2 lg:py-16 flex lg:flex-row flex-col justify-between items-center lg:gap-0 gap-14 ">
        <div className="lg:order-1 order-2 lg:ml-4">
          <img
            className="w-96"
            src="https://i.ibb.co/5BCcDYB/Remote2.png"
            alt="image1"
          />
        </div>
        <div className="px-4 sm:px-6 lg:px-8 lg:order-2 order-1 pt-16">
          <div className="max-w-xl sm:mt-1 mt-20 space-y-8 text-center sm:text-right sm:ml-auto">
            <h2 className="text-4xl font-bold sm:text-5xl">
              IMDAD PHARMA 💊
              <span className="hidden sm:block text-4xl">IMDAD PHARMA 💊</span>
            </h2>

            <Link
              className="inline-flex text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75"
              to="/"
            >
              <svg
                fill="white"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04 10.011v-20.022l10.04 10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
              </svg>
              &nbsp; IMDAD PHARMA
            </Link>
          </div>
        </div>
      </aside>

      <div className="md:grid place-items-center sm:mt-20 hidden">
        <img
          className="sm:w-96 w-48"
          src="https://i.ibb.co/2M7rtLk/Remote1.png"
          alt="image2"
        />
      </div>

      <h1 className="text-center text-2xl sm:text-5xl py-10 font-medium">
        IMDAD PHARMA 💊
      </h1>

      <h1 className="text-xl font-bold text-[14px] mx-5">Daily Received Payments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-4 sm:mx-16 my-10">
        {[
          { label: "UBL", amount: payments.UBL, color: "text-blue-600" },
          { label: "MCB", amount: payments.MCB, color: "text-green-600" },
          { label: "HBL", amount: payments.HBL, color: "text-purple-600" },
          { label: "KHYBER", amount: payments.Khyber, color: "text-yellow-600" },
          { label: "Meezan", amount: payments.Meezan, color: "text-indigo-600" },
          { label: "CASH", amount: payments.Cash, color: "text-red-600" },
        ].map((bank, index) => (
          <div key={index} className="bg-orange-300 shadow-lg rounded-lg p-6 text-center text-white transition duration-300 transform hover:scale-105">
            <h3 className="text-lg font-medium flex justify-center items-center space-x-2">
              <img src={`/images/${bank.label}.png`} alt={`${bank.label} logo`} className="w-8 h-8 rounded-lg" />
              <span>Today Received in {bank.label}</span>
            </h3>
            <p className={`text-2xl font-bold ${bank.color} flex items-center justify-center mt-4`}>
              <span className="mr-2 transition-transform duration-300 transform">
                {bank.amount >= 0 ? arrowUp : arrowDown}
              </span>
              Rs. {bank.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <h1 className="text-xl my-4 font-bold text-[14px] mx-5">Monthly Received Payments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-4 sm:mx-16 my-10">
        <PaymentCard name="UBL" amount={montlyPayments.UBL.toLocaleString()} />
        <PaymentCard name="MCB" amount={montlyPayments.MCB.toLocaleString()} />
        <PaymentCard name="HBL" amount={montlyPayments.HBL.toLocaleString()} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-4 sm:mx-16 my-10">
        <PaymentCard name="Khyber" amount={montlyPayments.Khyber.toLocaleString()} />
        <PaymentCard name="Meezan" amount={montlyPayments.Meezan.toLocaleString()} />
        <PaymentCard name="Cash" amount={montlyPayments.Cash.toLocaleString()} />
      </div>
      <h2 className="text-xl font-bold text-[14px] mx-5">Total Amount</h2>

      {/* Total Amount Card */}
      <div className="grid grid-cols-1 mx-4 sm:mx-16 my-10">
        <TotalAmountCard total={totalammount.totalAmount.toLocaleString()} />
      </div>
    </div>
  );
}
const PaymentCard = ({ name, amount }) => {
  return (
    <div className="bg-orange-400 shadow-lg rounded-lg p-6 text-center text-white transition duration-300 transform hover:scale-105">
      {/* Display the bank logo */}
      <img
        src={`/images/${name.toLowerCase()}.png`}
        alt={`${name} logo`}
        className="h-10 mx-auto mb-2"
      />
      <h3 className="text-lg font-medium">Monthly Received in {name}</h3>
      <p className="text-2xl font-bold text-blue-600">
        Rs. {amount.toLocaleString()}
      </p>
    </div>
  );
};


// Total Amount Card Component
const TotalAmountCard = ({ total }) => {
  return (
    <div className=" shadow-lg rounded-lg p-6 text-center bg-orange-500 text-white transition duration-300 transform hover:scale-100">
      <img
        src={`/images/totalamount.png`}
        alt="Total Amount logo"
        className="h-10 mx-auto mb-2"
      />
      <h3 className="text-lg font-medium">Total Received Amount</h3>
      <p className="text-2xl font-bold text-green-600">
        Rs. {total.toLocaleString()}
      </p>
    </div>
  );
};