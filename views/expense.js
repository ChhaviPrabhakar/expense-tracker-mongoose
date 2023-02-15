async function addExpense(e) {
    e.preventDefault();
    try {
        const expense = {
            exAmount: e.target.exAmo.value,
            description: e.target.choDes.value,
            category: e.target.choCat.value
        }
        const token  = localStorage.getItem('token')
        const response = await axios
        .post('http://localhost:3000/expense/add-expense', expense, { headers: {"Authorization" : token} });
        addExpenseOnScreen(response.data.newExpense);
    } catch(err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }

    //clearing inputs fields
    e.target.exAmo.value = '';
    e.target.choDes.value = '';
    e.target.choCat.value = '';
}

function addExpenseOnScreen(expense) {

    let parentNode = document.getElementById('expenseList');
    let childHTML = `<li id=${expense.id}> ${expense.exAmount} - ${expense.description} - ${expense.category}
    <button type=del onclick= deleteExpense('${expense.id}')> Delete Expense </button>
    <button type=edit onclick= editExpense('${expense.exAmount}','${expense.description}','${expense.category}','${expense.id}')> Edit Expense </button>
    </li>`;
    parentNode.innerHTML += childHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios
            .get('http://localhost:3000/expense/get-expense', { headers: {"Authorization" : token} });
        console.log(response.data.allExpense);
        for (var i = 0; i < response.data.allExpense.length; i++) {
            addExpenseOnScreen(response.data.allExpense[i]);
        }
    } catch(err) {
        console.log(err);
    }
});

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem('token')
        const response = await axios
        .delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers: {"Authorization" : token} });
        removeExpenseFromScreen(expenseId);
    } catch(err) {
        console.log(err);
    }
}

function removeExpenseFromScreen(expenseId) {
    let parentNode = document.getElementById('expenseList');
    let childNodeToBeDeleted = document.getElementById(expenseId);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted);
    }
}