// ==========================================
// Cash Flow - Salary & Expense Tracker
// Salary Module Implementation
// ==========================================

// ==========================================
// Global State
// ==========================================
let salaryData = {
    totalSalary: 0
};

let expensesData = [];

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
// Salary Module
// ==========================================

/**
 * Validates salary input
 * @param {string|number} value - The salary value to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateSalary(value) {
    // Check if empty
    if (value === '' || value === null || value === undefined) {
        return {
            isValid: false,
            message: '❌ Salary cannot be empty'
        };
    }

    // Convert to number
    const salaryNum = parseFloat(value);

    // Check if valid number
    if (isNaN(salaryNum)) {
        return {
            isValid: false,
            message: '❌ Please enter a valid number'
        };
    }

    // Check if zero
    if (salaryNum === 0) {
        return {
            isValid: false,
            message: '❌ Salary cannot be zero'
        };
    }

    // Check if negative
    if (salaryNum < 0) {
        return {
            isValid: false,
            message: '❌ Salary cannot be negative'
        };
    }

    return {
        isValid: true,
        message: '✅ Salary saved successfully!'
    };
}

/**
 * Shows error/success message to user
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether it's an error or success message
 */
function showMessage(message, isError = true) {
    // Remove existing message if present
    const existingMessage = document.querySelector('.salary-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `salary-message ${isError ? 'error' : 'success'}`;
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

    // Add animation
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

    // Insert message after salary form
    const salaryForm = document.querySelector('.salary-form');
    salaryForm.appendChild(messageEl);

    // Auto-remove success message after 3 seconds
    if (!isError) {
        setTimeout(() => {
            messageEl.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

/**
 * Saves the salary and updates display
 */
function saveSalary() {
    const salaryValue = salaryInput.value.trim();

    // Validate salary
    const validation = validateSalary(salaryValue);

    if (!validation.isValid) {
        showMessage(validation.message, true);
        return;
    }

    // Save to state
    salaryData.totalSalary = parseFloat(salaryValue);

    // Show success message
    showMessage(validation.message, false);

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
    updateRemainingBalance();
}

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Updates the remaining balance
 */
function updateRemainingBalance() {
    const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = salaryData.totalSalary - totalExpenses;
    
    const formattedBalance = formatCurrency(balance);
    remainingBalanceDisplay.textContent = formattedBalance;
    
    // Change color based on balance
    if (balance < 0) {
        remainingBalanceDisplay.style.color = '#ef4444'; // Red
    } else if (balance < salaryData.totalSalary * 0.2) {
        remainingBalanceDisplay.style.color = '#f59e0b'; // Yellow
    } else {
        remainingBalanceDisplay.style.color = '#1f2937'; // Default
    }
}

// ==========================================
// Event Listeners
// ==========================================

/**
 * Save salary on button click
 */
saveSalaryBtn.addEventListener('click', saveSalary);

/**
 * Save salary on Enter key press
 */
salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveSalary();
    }
});

// ==========================================
// Initialization
// ==========================================

console.log('✅ Salary Module Loaded');
console.log('Ready to save salary...');

// Initialize display
updateSalaryDisplay();
