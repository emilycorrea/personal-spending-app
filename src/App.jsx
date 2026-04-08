import { useState, useEffect } from "react";
import Papa from "papaparse";

import { CATEGORY_OPTIONS } from "./constants/categories";
import { normalizeCategory } from "./utils/normalizeCategory";
import { normalizeDate } from "./utils/normalizeDate";
import { handleExpenseName } from "./utils/handleExpenseName";
import { getDebitAmount } from "./utils/getDebitAmount";
import { SpendingChart } from "./components/pieChart";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  //database connection
  //fetch expenses from the backend and store them in the expenses state variable
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/expenses`)
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error("Error fetching expenses:", err));
  }, []);

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const [sort, setSort] = useState("date-desc");

  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/expenses/summary`)
      .then((res) => res.json())
      .then((rows) => {
        const sum = rows.reduce((acc, row) => acc + row.total, 0);
        setTotal(sum);
      })
      .catch((err) => console.error("Error fetching total:", err));
  }, [expenses]);

  //for filtering and sorting the expenses in the header
  const filteredExpenses = (
    filter === "all"
      ? expenses
      : expenses.filter((expense) => expense.category === filter)
  ).sort((a, b) => {
    if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sort === "amount-desc") return b.amount - a.amount;
    if (sort === "amount-asc") return a.amount - b.amount;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });
  //calculate the total amount of all expenses to display in the summary card
  //const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  //fetch expenses from the backend
  // store them in the expenses state variable
  // useEffect(() => {
  //   fetch(`${API_URL}/expenses`)
  //     .then((res) => res.json())
  //     .then((data) => setExpenses(data))
  //     .catch((err) => console.error("Error fetching expenses:", err));
  // }, []);

  function submitExpense() {
    const numericAmount = Number(expenseAmount);

    if (!expenseName.trim()) {
      setError("Please enter an expense name.");
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive number for the expense amount.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!expenseDate) {
      setError("Please select a date.");
      return;
    }

    setError("");

    const newExpense = {
      name: expenseName,
      amount: numericAmount,
      category: category,
      date: expenseDate,
    };

    fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    })
      .then((res) => res.json())
      .then((savedExpense) => {
        setExpenses((prev) => [...prev, savedExpense]);
        setExpenseName("");
        setExpenseAmount("");
        setCategory("");
        setExpenseDate("");
      })
      .catch((err) => console.error("Error adding expense:", err));
  }

  function deleteExpense(id) {
    fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      })
      .catch((err) => console.error("Error deleting expense:", err));
  }

  function deleteAllExpenses() {
    fetch(`${API_URL}/expenses`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log("Status:", res.status); // check what comes back
        if (!res.ok) throw new Error("Failed to delete all expenses");
        setExpenses([]);
      })
      .catch((err) => console.error("Error deleting all expenses:", err));
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      setError("No file selected. Please choose a CSV file.");
      return;
    }


    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rows = results.data;

        const importedExpenses = rows
          .filter((row) => getDebitAmount(row) > 0)
          .map((row) => ({
            name: handleExpenseName(row),
            amount: getDebitAmount(row),
            category: normalizeCategory(row.Category),
            date: normalizeDate(
              row.Date ||
                row.TransactionDate ||
                row["Transaction Date"] ||
                row["Date of Transaction"],
            ),
          }));

        // POST each expense to the backend
        Promise.all(
          importedExpenses.map((expense) =>
            fetch(`${API_URL}/expenses`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(expense),
            }).then((res) => res.json()),
          ),
        )
          .then((savedExpenses) => {
            setExpenses((prev) => [...prev, ...savedExpenses]);
          })
          .catch((err) => console.error("Error importing expenses:", err));
      },
    });
  }

  //this is for the UI
  // converts "2023-08-15" → "08/15/23"
  function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-");
    if (parts.length !== 3) return "";

    const [year, month, day] = parts;

    return `${month}/${day}/${year.slice(-2)}`;
  }

  return (
    <div className="app">
      <h1>Personal Spending</h1>

      <div className="import-card">
        <p>Import your bank statement</p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>


      <div className="summary-card">
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>

      <SpendingChart expenses={expenses} /> 

      <div className="form-card">
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter expense name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter amount $"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <button className="button" onClick={submitExpense}>
          Add Expense
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="expenses-card">
        <div className="expenses-header">
          <h2>Expenses</h2>
          <div className="header-controls">
            {expenses.length > 0 && (
              <button className="delete-all-button" onClick={deleteAllExpenses}>
                Delete All
              </button>
            )}
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="expense-columns">
          <span
            onClick={() =>
              setSort(sort === "date-desc" ? "date-asc" : "date-desc")
            }
          >
            Date {sort === "date-desc" ? "↓" : sort === "date-asc" ? "↑" : ""}
          </span>
          <span
            onClick={() =>
              setSort(sort === "name-asc" ? "name-desc" : "name-asc")
            }
          >
            Name {sort === "name-asc" ? "↑" : sort === "name-desc" ? "↓" : ""}
          </span>
          <span>Category</span>
          <span
            onClick={() =>
              setSort(sort === "amount-desc" ? "amount-asc" : "amount-desc")
            }
          >
            Amount{" "}
            {sort === "amount-desc" ? "↓" : sort === "amount-asc" ? "↑" : ""}
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="empty-message">
            {filter === "all"
              ? "No expenses added yet."
              : "No expenses in this category."}
          </p>
        ) : (
          filteredExpenses.map((expense) => (
            <div className="expense" key={expense.id}>
              <span className="expense-date">{formatDate(expense.date)}</span>
              <span className="expense-name">{expense.name}</span>
              <span className="expense-category">{expense.category}</span>
              <span className="expense-amount">
                ${expense.amount.toFixed(2)}
              </span>
              <button
                className="delete-button"
                onClick={() => deleteExpense(expense.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
