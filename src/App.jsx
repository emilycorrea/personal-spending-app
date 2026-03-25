import { useState, useEffect } from "react";
import Papa from "papaparse"; // for parsing csv files

const CATEGORY_OPTIONS = [
  "food",
  "travel",
  "shopping",
  "personal",
  "entertainment",
  "bills & utilities",
  "other",
]; // can add to this later if we want more categories

function App() {
  // array to store all expenses
  //the database for right now is just an array
  //also using local storage to save expenses when user refreshes page
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  //inputs - Named/Amount/Category
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [category, setCategory] = useState("");
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // error messages for an invalid input
  const [error, setError] = useState("");
  // filter for categories
  const [filter, setFilter] = useState("all");

  const filteredExpenses =
    filter === "all"
      ? expenses
      : expenses.filter((expense) => expense.category === filter);

  //save expenses to local storage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //run when user clicks "Add Expense"
  function submitExpense() {
    // convert amount: string → number
    const numericAmount = Number(expenseAmount);

    // check if the name field is empty
    if (!expenseName.trim()) {
      setError("Please enter an expense name.");
      return; // stop if invalid
    }

    //check if amount is a valid positive number
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive number for the expense amount.");
      return;
    }

    // check if category is selected
    if (!category) {
      setError("Please select a category.");
      return;
    }

    // error is cleared if everything is valid
    setError("");

    // create a new expense object
    const newExpense = {
      id: Date.now(), // unique id based on timestamp
      name: expenseName,
      amount: numericAmount,
      category: category,
    };

    // add the new expense to the existing list
    // [...expenses] append newExpense to end of the array
    setExpenses([...expenses, newExpense]);

    // clear input fields after submission
    setExpenseName("");
    setExpenseAmount("");
    setCategory("");
  }
  //deletes singular expense based on the id that is passed in
  function deleteExpense(id) {
    // filter out with the matching id
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  }

  //deletes all expenses when user clicks "Delete All"
  function deleteAllExpenses() {
    setExpenses([]);
  }
  // function to normalize category names from an imported CSV data
  function normalizeCategory(rawCategory) {
    const category = rawCategory?.toLowerCase();

    if (!category) return "other";

    if (
      category.includes("food") ||
      category.includes("dining") ||
      category.includes("restaurant")
    ) {
      return "food";
    }

    if (
      category.includes("transport") ||
      category.includes("fuel") ||
      category.includes("travel")
    ) {
      return "travel";
    }

    if (
      category.includes("shop") ||
      category.includes("shopping") ||
      category.includes("retail")
    ) {
      return "shopping";
    }

    if (
      category.includes("subscription") ||
      category.includes("beauty") ||
      category.includes("personal")
    ) {
      return "personal";
    }
    if (
      category.includes("entertainment") || 
      category.includes("leisure") || 
      category.includes("movie") ||
      category.includes("music") ||
      category.includes("game")

    ) {
      return "entertainment";
    }

    if (
      category.includes("utility") ||
      category.includes("bill") ||
      category.includes("rent")
    ) {
      return "bills & utilities";
    }

    return "other";
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      setError("No file selected. Please choose a CSV file.");
      return;
    }
    Papa.parse(file, {
      header: true, // uses first row as keys
      skipEmptyLines: true, // ignores empty lines
      complete: function (results) {
        const rows = results.data;
        const importedExpenses = rows
          .filter((row) => Number(row["Debit Amount"]) > 0) // only expenses
          .map((row, index) => ({
            id: Date.now() + index, // guarantee unique id based on timestamp + index
            name: row.Category || "Imported Expense",
            amount: Number(row["Debit Amount"]),
            category: normalizeCategory(row.Category),
          })); 
        setExpenses((prev) => [...prev, ...importedExpenses]);
      },
    });
  }

  return (
    <div className="app">
      <h1>Personal Spending</h1>
      <div>
        <p> import your bank statement</p>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      <div className="summary-card">
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>

      <div className="form-card">
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
        <div>
          {expenses.length > 0 && (
          <button className="delete-all-button" onClick={deleteAllExpenses}>
            Delete All
          </button> 
          )}
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
              <p>Name: {expense.name}</p>
              <p>Amount: ${expense.amount.toFixed(2)}</p>
              <p>Category: {expense.category}</p>

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
