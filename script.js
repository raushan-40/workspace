// ==========================================
// Cash Flow - Salary & Expense Tracker
// Salary, Expense, Balance & Validation Module
// ==========================================

// ==========================================
// Global State
// ==========================================
let salaryData = {
    totalSalary: 0
};

let expensesData = [];
let expenseIdCounter = 1; // For generating unique IDs

// ==========================================
// DOM Elements
// ==========================================

// Salary Management
const salaryInput = document.getElementById('salaryInput');
const saveSalaryBtn = document.getElementById('saveSalaryBtn');

// Expense Management
const expenseForm = document.getElementById('expenseForm');
const expenseName = document.getElementById('expenseName');
const expenseAmount = document.getElementById('expenseAmount');

// Display Elements
const totalSalaryDisplay = document.getElementById('totalSalaryDisplay');
const totalExpensesDisplay = document.getElementById('totalExpensesDisplay');
const remainingBalanceDisplay = document.getElementById('remainingBalanceDisplay');

// Expense List
const expenseListContainer = document.getElementById('expenseListContainer');
const expenseTableWrapper = document.getElementById('expenseTableWrapper');
const expenseTableBody = document.getElementById('expenseTableBody');

// Analytics & Report
const expenseChart = document.getElementById('expenseChart');
const currencySelector = document.getElementById('currencySelector');
const downloadReportBtn = document.getElementById('downloadReportBtn');

// ==========================================
// Validation Module - Reusable Functions
// ==========================================

/**
 * Checks if a value is empty
 * @param {*} value - Value to check
 * @returns {boolean} - True if empty
 */
function isEmpty(value) {
    return value === '' || value === null || value === undefined;
}

/**
 * Checks if a string contains only whitespace
 * @param {string} text - Text to check
 * @returns {boolean} - True if only whitespace
 */
function isOnlyWhitespace(text) {
    return typeof text === 'string' && text.trim().length === 0;
}

/**
 * Checks if a value is a valid positive number
 * @param {*} value - Value to check
 * @returns {boolean} - True if valid positive number
 */
function isValidPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
}

/**
 * Checks if a value is zero
 * @param {*} value - Value to check
 * @returns {boolean} - True if zero
 */
function isZero(value) {
    return parseFloat(value) === 0;
}

/**
 * Checks if a value is negative
 * @param {*} value - Value to check
 * @returns {boolean} - True if negative
 */
function isNegative(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num < 0;
}

/**
 * Checks if a value is a valid number (can be negative or zero)
 * @param {*} value - Value to check
 * @returns {boolean} - True if valid number
 */
function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validates a text field (like expense name)
 * @param {string} text - Text to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateTextField(text, fieldName = 'Field') {
    // Check if empty
    if (isEmpty(text)) {
        return {
            isValid: false,
            message: `❌ ${fieldName} cannot be empty`
        };
    }

    // Check if only whitespace
    if (isOnlyWhitespace(text)) {
        return {
            isValid: false,
            message: `❌ ${fieldName} cannot contain only spaces`
        };
    }

    // Check length
    if (text.trim().length < 2) {
        return {
            isValid: false,
            message: `❌ ${fieldName} must be at least 2 characters`
        };
    }

    if (text.trim().length > 50) {
        return {
            isValid: false,
            message: `❌ ${fieldName} must not exceed 50 characters`
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

/**
 * Validates a numeric field (like salary or expense amount)
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateNumericField(value, fieldName = 'Amount') {
    // Check if empty
    if (isEmpty(value)) {
        return {
            isValid: false,
            message: `❌ ${fieldName} cannot be empty`
        };
    }

    // Check if valid number
    if (!isValidNumber(value)) {
        return {
            isValid: false,
            message: `❌ ${fieldName} must be a valid number`
        };
    }

    // Check if negative
    if (isNegative(value)) {
        return {
            isValid: false,
            message: `❌ ${fieldName} cannot be negative`
        };
    }

    // Check if zero
    if (isZero(value)) {
        return {
            isValid: false,
            message: `❌ ${fieldName} cannot be zero`
        };
    }

    // Check if value is too large
    const numValue = parseFloat(value);
    if (numValue > 999999999) {
        return {
            isValid: false,
            message: `❌ ${fieldName} is too large`
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

// ==========================================
// Message Display Module
// ==========================================

/**
 * Shows error/success message to user
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether it's an error or success message
 * @param {string} type - 'salary' or 'expense' to determine where to show message
 */
function showMessage(message, isError = true, type = 'salary') {
    let targetElement;

    if (type === 'salary') {
        targetElement = document.querySelector('.salary-form');
    } else if (type === 'expense') {
        targetElement = document.querySelector('.expense-form');
    }

    if (!targetElement) return;

    // Remove existing message if present
    const existingMessage = targetElement.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isError ? 'error' : 'success'}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
        ${isError 
            ? 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca;' 
            : 'background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;'}
    `;

    // Add animation if not exists
    const style = document.createElement('style');
    if (!document.querySelector('style[data-message-animation]')) {
        style.setAttribute('data-message-animation', 'true');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Insert message after form
    targetElement.appendChild(messageEl);

    // Auto-remove success message after 3 seconds
    if (!isError) {
        setTimeout(() => {
            messageEl.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// ==========================================
// Salary Module
// ==========================================

/**
 * Validates salary input using reusable validation functions
 * @param {string|number} value - The salary value to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateSalary(value) {
    return validateNumericField(value, 'Salary');
}

/**
 * Saves the salary and updates display
 */
function saveSalary() {
    const salaryValue = salaryInput.value.trim();

    // Validate salary
    const validation = validateSalary(salaryValue);

    if (!validation.isValid) {
        showMessage(validation.message, true, 'salary');
        return;
    }

    // Save to state
    salaryData.totalSalary = parseFloat(salaryValue);

    // Show success message
    showMessage('✅ Salary saved successfully!', false, 'salary');

    // Update display
    updateSalaryDisplay();

    // Clear input
    salaryInput.value = '';
    salaryInput.focus();

    // Log for debugging
    console.log('Salary saved:', salaryData.totalSalary);
}

/**
 * Updates the salary display in summary card
 */
function updateSalaryDisplay() {
    const formattedSalary = formatCurrency(salaryData.totalSalary);
    totalSalaryDisplay.textContent = formattedSalary;
    
    // Update remaining balance
    updateBalance();
}

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// ==========================================
// Balance Calculation Module
// ==========================================

/**
 * Calculates total expenses from the expenses array
 * @returns {number} - Total of all expenses
 */
function calculateTotalExpenses() {
    return expensesData.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculates remaining balance
 * Formula: Remaining Balance = Total Salary - Total Expenses
 * @returns {number} - Remaining balance
 */
function calculateRemainingBalance() {
    const totalExpenses = calculateTotalExpenses();
    return salaryData.totalSalary - totalExpenses;
}

/**
 * Updates all balance-related displays
 * This is the main function called whenever balance needs updating
 */
function updateBalance() {
    // Calculate values
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = calculateRemainingBalance();

    // Format and display total expenses
    const formattedExpenses = formatCurrency(totalExpenses);
    totalExpensesDisplay.textContent = formattedExpenses;

    // Format and display remaining balance
    const formattedBalance = formatCurrency(remainingBalance);
    remainingBalanceDisplay.textContent = formattedBalance;

    // Update balance card color based on value
    updateBalanceCardColor(remainingBalance);

    // Log for debugging
    console.log('Balance updated:', {
        totalSalary: salaryData.totalSalary,
        totalExpenses: totalExpenses,
        remainingBalance: remainingBalance
    });
}

/**
 * Updates the color of the remaining balance card based on balance value
 * @param {number} balance - The current remaining balance
 */
function updateBalanceCardColor(balance) {
    if (balance < 0) {
        // Red - overspent
        remainingBalanceDisplay.style.color = '#ef4444';
    } else if (salaryData.totalSalary > 0 && balance < salaryData.totalSalary * 0.2) {
        // Yellow - warning (less than 20% of salary)
        remainingBalanceDisplay.style.color = '#f59e0b';
    } else {
        // Default - healthy balance
        remainingBalanceDisplay.style.color = '#1f2937';
    }
}

// ==========================================
// Expense Module
// ==========================================

/**
 * Validates expense inputs using reusable validation functions
 * @param {string} name - Expense name
 * @param {string|number} amount - Expense amount
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateExpense(name, amount) {
    // Validate name
    const nameValidation = validateTextField(name, 'Expense name');
    if (!nameValidation.isValid) {
        return nameValidation;
    }

    // Validate amount
    const amountValidation = validateNumericField(amount, 'Expense amount');
    if (!amountValidation.isValid) {
        return amountValidation;
    }

    return {
        isValid: true,
        message: ''
    };
}

/**
 * Creates a new expense object
 * @param {string} name - Expense name
 * @param {number} amount - Expense amount
 * @returns {object} - Expense object with id, name, amount
 */
function createExpense(name, amount) {
    return {
        id: expenseIdCounter++,
        name: name.trim(),
        amount: parseFloat(amount)
    };
}

/**
 * Adds a new expense
 */
function addExpense() {
    const name = expenseName.value;
    const amount = expenseAmount.value;

    // Validate inputs
    const validation = validateExpense(name, amount);

    if (!validation.isValid) {
        showMessage(validation.message, true, 'expense');
        return;
    }

    // Create expense object
    const newExpense = createExpense(name, amount);

    // Add to expenses array
    expensesData.push(newExpense);

    // Show success message
    showMessage('✅ Expense added successfully!', false, 'expense');

    // Render expense list
    renderExpenseList();

    // Update balance (this will update total expenses and remaining balance)
    updateBalance();

    // Clear form
    expenseForm.reset();
    expenseName.focus();

    // Log for debugging
    console.log('Expense added:', newExpense);
    console.log('All expenses:', expensesData);
}

/**
 * Renders the expense list in the table
 */
function renderExpenseList() {
    // Clear table body
    expenseTableBody.innerHTML = '';

    // If no expenses, show empty state
    if (expensesData.length === 0) {
        expenseListContainer.style.display = 'block';
        expenseTableWrapper.style.display = 'none';
        return;
    }

    // Show table and hide empty state
    expenseListContainer.style.display = 'none';
    expenseTableWrapper.style.display = 'block';

    // Render each expense as a table row
    expensesData.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="expense-table-name">${escapeHtml(expense.name)}</td>
            <td class="expense-table-amount">${formatCurrency(expense.amount)}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

/**
 * Deletes an expense by id
 * @param {number} id - The expense id to delete
 */
function deleteExpense(id) {
    // Find index of expense
    const index = expensesData.findIndex(expense => expense.id === id);

    if (index !== -1) {
        // Remove from array
        const deletedExpense = expensesData.splice(index, 1)[0];
        console.log('Expense deleted:', deletedExpense);

        // Re-render list
        renderExpenseList();

        // Update balance (this will update total expenses and remaining balance)
        updateBalance();

        // Show message
        showMessage('✅ Expense deleted successfully!', false, 'expense');
    }
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// Event Listeners
// ==========================================

// Salary Events
saveSalaryBtn.addEventListener('click', saveSalary);

salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveSalary();
    }
});

// Expense Events
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addExpense();
});

expenseAmount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addExpense();
    }
});

// ==========================================
// Initialization
// ==========================================

console.log('✅ Salary, Expense, Balance & Validation Module Loaded');
console.log('Reusable validation functions: validateTextField(), validateNumericField()');
console.log('Ready with enhanced validation...');

// Initialize display
updateSalaryDisplay();
renderExpenseList();
updateBalance();
