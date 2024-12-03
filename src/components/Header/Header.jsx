import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import DropdownMenu from "../DropDown/DropDown";
const stockHouse = [
  { name: "All Stock List", link: "/stockhouse" },
  { name: "Sell Products", link: "/productSell" },
];
const payment = [
  { name: "Received Payment", link: "/payment" },
  { name: "Send Payment", link: "/sendPayment" },
  { name: "Agent Payment", link: "/AgentPayment" },
];
const expenses = [
  { name: "Daily Expenses", link: "/dailyExpenses" },
  { name: "Dubai Port Expenses", link: "/DubaiPortExpenses" },
  { name: "Commission", link: "/commission" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white ">
      <nav className="mx-auto flex flex-row justify-between items-center px-2 xl:px-4 py-3 border-2 border-gray-200 relative">
        {/* this is logo */}
        <div className="lg:flex items-center hidden">
          <Link
            to="/"
            onClick={handleNavLinkClick}
            className="text-2xl font-bold text-red-600"
          >
            IMDAD
          </Link>
        </div>

        {/* this is for smaller screens */}
        {!isOpen ? (
          <div className="flex items-center lg:hidden ">
            <Link
              to="/"
              onClick={handleNavLinkClick}
              className="text-2xl font-bold text-red-600"
            >
              IMDAD
            </Link>
          </div>
        ) : null}

        <div
          className={`lg:hidden mt-2 absolute top-0  ${
            isOpen ? "right-0" : "right-2"
          }`}
        >
          <button
            onClick={handleToggle}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div
          className={`lg:flex flex-col lg:flex-row items-center w-full lg:w-auto hidden`}
        >
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 lg:ml-auto text-center text-black">
            <li>
              <NavLink
                to="/purchase"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Convertor
              </NavLink>
            </li>

            {/* Payment dropdown */}
            <li>
              <DropdownMenu
                navLabel="Payment"
                navItems={payment}
                handleNavLinkClick={handleNavLinkClick}
                islarge={true}
              />
            </li>

            <li>
              <NavLink
                to="/Freightdetail"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Freight Detail
              </NavLink>
            </li>

            <li className="relative group">
              <DropdownMenu
                navLabel="StockHouse"
                navItems={stockHouse}
                handleNavLinkClick={handleNavLinkClick}
                islarge={true}
              />
            </li>

            <li>
              <NavLink
                to="/Customer"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Customers
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Recovery"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Recovery
              </NavLink>
            </li>

            <li className="relative group">
              <DropdownMenu
                navLabel="Expenses"
                navItems={expenses}
                handleNavLinkClick={handleNavLinkClick}
                islarge={true}
              />
            </li>
          </ul>
        </div>

        {/* Login button */}
        <div className="lg:mt-0 lg:ml-4 hidden lg:block">
          <Link
            to="/logout"
            onClick={handleNavLinkClick}
            className="bg-orange-600 text-white px-2 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            Log Out
          </Link>
        </div>

        {/* Smaller screens */}
        <div
          className={`flex flex-col lg:flex-row items-center w-full lg:w-auto lg:hidden h-screen overflow-hidden ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 lg:ml-auto text-center text-[20px] font-bold">
            <li>
              <NavLink
                to="/home"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/purchase"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Convertor
              </NavLink>
            </li>
            <li className="relative group">
              <DropdownMenu
                navLabel="Payment"
                navItems={payment}
                handleNavLinkClick={handleNavLinkClick}
                islarge={false}
              />
            </li>
            <li>
              <NavLink
                to="/Freightdetail"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Freight Detail
              </NavLink>
            </li>
            <li className="relative group">
              <DropdownMenu
                navLabel="StockHouse"
                navItems={stockHouse}
                handleNavLinkClick={handleNavLinkClick}
                islarge={false}
              />
            </li>
            <li>
              <NavLink
                to="/Customer"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Customers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Recovery"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-600 font-medium"
                    : "text-black hover:text-orange-600 transition"
                }
              >
                Recovery
              </NavLink>
            </li>
            <li className="relative group">
              <DropdownMenu
                navLabel="Expenses"
                navItems={expenses}
                handleNavLinkClick={handleNavLinkClick}
                islarge={false}
              />
            </li>
          </ul>
        </div>

        {/* Logout button for small screens */}
        {!isOpen ? (
          <div className="lg:mt-0 lg:ml-4 block lg:hidden mr-16 lg:mr-0">
            <Link
              to="/logout"
              onClick={handleNavLinkClick}
              className="bg-orange-600 text-white px-2 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Log Out
            </Link>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
