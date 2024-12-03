import React, { useState, useEffect } from 'react';
import axios from "../../utils/axios";

const DailyExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expensePrice, setExpensePrice] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/dailyexpenses`)
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the expenses!', error);
      });
  }, []);

  const addOrUpdateExpense = () => {
    if (!expenseName || !expensePrice) return;

    const newExpense = {
      name: expenseName,
      price: parseFloat(expensePrice) || 0,
      date: expenseDate,
    };

    if (editingExpense) {
      axios
        .put(`/api/dailyexpenses/${editingExpense._id}`, newExpense)
        .then((response) => {
          setExpenses(
            expenses.map((expense) =>
              expense._id === editingExpense._id ? response.data : expense
            )
          );
          resetForm();
        })
        .catch((error) => {
          console.error('There was an error updating the expense!', error);
        });
    } else {
      axios
        .post(`/api/dailyexpenses`, newExpense)
        .then((response) => {
          setExpenses([...expenses, response.data]);
          resetForm();
        })
        .catch((error) => {
          console.error('There was an error adding the expense!', error);
        });
    }
  };

  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      axios
        .delete(`/api/dailyexpenses/${id}`)
        .then(() => {
          setExpenses(expenses.filter((expense) => expense._id !== id));
        })
        .catch((error) => {
          console.error('There was an error deleting the expense!', error);
        });
    }
  };

  const editExpense = (expense) => {
    setExpenseName(expense.name);
    setExpensePrice(expense.price);
    setExpenseDate(expense.date.split('T')[0]);
    setEditingExpense(expense);
  };

  const resetForm = () => {
    setExpenseName('');
    setExpensePrice('');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setEditingExpense(null);
  };

  const calculateDailyTotal = (date) => {
    const dailyExpenses = expenses.filter(
      (expense) => expense.date && expense.date.split('T')[0] === date
    );
    return dailyExpenses.reduce((total, expense) => total + (expense.price || 0), 0);
  };

  const calculateMonthlyTotal = () => {
    const groupedByMonth = {};
    expenses.forEach((expense) => {
      const [year, month] = expense.date.split('T')[0].split('-');
      const monthKey = `${year}-${month}`;
      groupedByMonth[monthKey] = (groupedByMonth[monthKey] || 0) + (expense.price || 0);
    });
    return groupedByMonth;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const uniqueDates = [...new Set(expenses.map((expense) => expense.date.split('T')[0]))];
  const monthlyTotals = calculateMonthlyTotal();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md sm:p-8 lg:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Daily Expense Tracker</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="date"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />

        <input
          type="text"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />

        <input
          type="number"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Expense Price"
          value={expensePrice}
          onChange={(e) => setExpensePrice(e.target.value)}
        />
      </div>

      <button
        className="mt-4 bg-blue-600 text-white p-3 rounded-md w-full font-semibold hover:bg-blue-700 transition-all"
        onClick={addOrUpdateExpense}
      >
        {editingExpense ? 'Update Expense' : 'Add Expense'}
      </button>

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
                .filter((expense) => expense.date.split('T')[0] === date)
                .map((expense) => (
                  <li key={expense._id} className="flex justify-between items-center">
                    <span>
                      {expense.name}: Rs {'->'} {expense.price.toFixed(2)}
                    </span>
                    <div>
                      <button
                        className="text-blue-500 hover:underline mr-4"
                        onClick={() => editExpense(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteExpense(expense._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="mt-2 text-lg font-bold text-gray-900">
              Total: Rs {'->'} {calculateDailyTotal(date).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-700">Monthly Totals</h3>
        {Object.entries(monthlyTotals).map(([monthKey, total]) => (
          <div
            key={monthKey}
            className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-800">{monthKey}</h4>
            <p className="text-lg font-bold text-gray-900">Total: Rs {'->'} {total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyExpense;
