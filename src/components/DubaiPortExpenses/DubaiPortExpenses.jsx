import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const DubaiPortExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expensePrice, setExpensePrice] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingExpense, setEditingExpense] = useState(null); // Track expense being edited

  useEffect(() => {
    axios
      .get(`/api/expenses`)
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the expenses!', error);
      });
  }, []);

  const addOrUpdateExpense = () => {
    if (!expenseName || !expensePrice) {
      return; // Prevent empty submissions
    }

    const newExpense = {
      name: expenseName,
      amount: parseFloat(expensePrice) || 0,
      date: expenseDate,
    };

    if (editingExpense) {
      // Update existing expense
      axios
        .put(`/api/expenses/${editingExpense._id}`, newExpense)
        .then((response) => {
          setExpenses((prev) =>
            prev.map((expense) =>
              expense._id === editingExpense._id ? response.data : expense
            )
          );
          clearForm();
        })
        .catch((error) => {
          console.error('There was an error updating the expense!', error);
        });
    } else {
      // Add new expense
      axios
        .post(`/api/expenses`, newExpense)
        .then((response) => {
          setExpenses([...expenses, response.data]);
          clearForm();
        })
        .catch((error) => {
          console.error('There was an error adding the expense!', error);
        });
    }
  };

  const deleteExpense = (id) => {
    axios
      .delete(`/api/expenses/${id}`)
      .then(() => {
        setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      })
      .catch((error) => {
        console.error('There was an error deleting the expense!', error);
      });
  };

  const editExpense = (expense) => {
    setExpenseName(expense.name);
    setExpensePrice(expense.amount);
    setExpenseDate(expense.date);
    setEditingExpense(expense);
  };

  const clearForm = () => {
    setExpenseName('');
    setExpensePrice('');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setEditingExpense(null);
  };

  const calculateDailyTotal = (date) => {
    const dailyExpenses = expenses.filter((expense) => expense.date === date);
    return dailyExpenses
      .reduce((total, expense) => total + (expense.amount || 0), 0)
      .toFixed(2);
  };

  const calculateMonthlyTotal = () => {
    const groupedByMonth = {};

    expenses.forEach((expense) => {
      const [year, month] = expense.date.split('-');
      const monthKey = `${year}-${month}`;
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = 0;
      }
      groupedByMonth[monthKey] += expense.amount || 0;
    });

    return groupedByMonth;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', {
      month: 'long',
    });
    return `${monthName} ${year}`;
  };

  const uniqueDates = [...new Set(expenses.map((expense) => expense.date))];
  const monthlyTotals = calculateMonthlyTotal();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md sm:p-8 lg:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">
        Dubai Port Daily & Monthly Expense Tracker
      </h2>

      {/* Form Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="date"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />

        <input
          type="text"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />

        <input
          type="number"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          placeholder="Expense Price"
          value={expensePrice}
          onChange={(e) => setExpensePrice(e.target.value)}
        />
      </div>

      <button
        className="mt-4 bg-teal-600 text-white p-3 rounded-md w-full font-semibold hover:bg-teal-700 transition-all"
        onClick={addOrUpdateExpense}
      >
        {editingExpense ? 'Update Expense' : 'Add Expense'}
      </button>

      {editingExpense && (
        <button
          className="mt-2 bg-gray-600 text-white p-3 rounded-md w-full font-semibold hover:bg-gray-700 transition-all"
          onClick={clearForm}
        >
          Cancel Edit
        </button>
      )}

      {/* Daily Expenses Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-700">Daily Expenses</h3>
        {uniqueDates.map((date, index) => (
          <div
            key={index}
            className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-800">{formatDate(date)}</h4>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              {expenses
                .filter((expense) => expense.date === date)
                .map((expense) => (
                  <li key={expense._id}>
                    {expense.name}: AED {'->'} {expense.amount?.toFixed(2) || '0.00'}
                    <button
                      className="ml-4 text-blue-500 hover:underline"
                      onClick={() => editExpense(expense)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 text-red-500 hover:underline"
                      onClick={() => deleteExpense(expense._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
            <div className="mt-2 text-lg font-bold text-gray-900">
              Total: AED {'->'} {calculateDailyTotal(date)}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Totals */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-700">Monthly Totals</h3>
        {Object.entries(monthlyTotals).map(([monthKey, total], index) => (
          <div
            key={index}
            className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-800">{formatMonth(monthKey)}</h4>
            <p className="text-lg font-bold text-gray-900">Total: AED {'->'} {total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DubaiPortExpenses;
