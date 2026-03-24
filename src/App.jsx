import { useState, useEffect } from 'react'

function App() {
  // array to store all expenses 
  //the database for right now is just an array  
  //also using local storage to save expenses when user refreshes page 
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : [] 
  })

  //inputs - Named/Amount/Category 
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [category, setCategory] = useState('')
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0)

  // error messages for an invalid input
  const [error, setError] = useState('')
  
  //save expenses to local storage 
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  //run when user clicks "Add Expense"
  function submitExpense() {
    // convert amount: string → number
    const numericAmount = Number(expenseAmount)

    // check if the name field is empty
    if (!expenseName.trim()) {
      setError('Please enter an expense name.')
      return // stop if invalid
    }

    //check if amount is a valid positive number
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid positive number for the expense amount.')
      return
    }

    // check if category is selected
    if (!category) {
      setError('Please select a category.')
      return
    }

    // error is cleared if everything is valid
    setError('')

    // create a new expense object
    const newExpense = {
      name: expenseName,
      amount: numericAmount,
      category: category,
    }

    // add the new expense to the existing list
    // [...expenses] append newExpense to end of the array
    setExpenses([...expenses, newExpense])

    // clear input fields after submission
    setExpenseName('')
    setExpenseAmount('')
    setCategory('')
  }

  return (
    <div>
      <h1>Personal Spending</h1>

      {/* Input for expense NAME */}
      <input
        type="text"
        placeholder="Enter expense name"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
      />

      {/* Input for expense AMOUNT */}
      <input
        type="number"
        placeholder="Enter expense amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
      />

      {/* Dropdown for selecting CATEGORY */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        <option value="food">Food</option>
        <option value="transportation">Transportation</option>
        <option value="entertainment">Entertainment</option>
        <option value="utilities">Utilities</option>
        <option value="other">Other</option>
      </select>

      {/* button triggers submitExpense function */}
      <button onClick={submitExpense}>Add Expense</button>

      {/* Show error message only if it exists */}
      {error && <p>{error}</p>}

      <h2>Expenses</h2>

      {/* loop through expenses array and show each one */}
      {expenses.map((expense, index) => (
        <div key={index}>
          <p>Name: {expense.name}</p>
          <p>Amount: ${expense.amount.toFixed(2)}</p>
          <p>Category: {expense.category}</p>
          <hr />
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  )
}

export default App