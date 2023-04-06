function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a Premium user ";
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showLeaderboard() {
    const LBbutton = document.createElement("input");
    LBbutton.type = "button";
    LBbutton.value = "Show Leaderboard";
    document.getElementById('message').appendChild(LBbutton);
    LBbutton.classList.add("lbButton");
    LBbutton.onclick = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios
                .get('http://localhost:3000/premium/showleaderboard', { headers: { "Authorization": token } });

            let leaderBoardList = document.getElementById('leaderboard');
            leaderBoardList.innerHTML += '<h1>Leader Board</h1>';
            response.data.forEach((userDetails) => {
                leaderBoardList.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0} </li>`;
            })

        } catch (err) {
            console.log(err);
        }
    }
}

async function addExpense(e) {
    e.preventDefault();
    try {
        const expense = {
            exAmount: e.target.exAmo.value,
            description: e.target.choDes.value,
            category: e.target.choCat.value
        }
        const token = localStorage.getItem('token');
        const response = await axios
            .post('http://localhost:3000/expense/add-expense', expense, { headers: { "Authorization": token } });
        addExpenseOnScreen(response.data.newExpense);
    } catch (err) {
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

const expenseList = document.getElementById('expenseList');
const page = 1;
const rowPerPage = document.getElementById('rowPerPage');
const rowBtn = document.getElementById('rowbtn');
rowBtn.addEventListener('click', () => {
    localStorage.setItem('rowPerPage', rowPerPage.value);
    removeAllExpensesFromScreen(expenseList);
    getExpenses(page);
});


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const decodeToken = parseJwt(token);
        const isPremiumUser = decodeToken.ispremiumuser;
        if (isPremiumUser) {
            showPremiumUserMessage();
            showLeaderboard();
        }

        const row = localStorage.getItem('rowPerPage') || rowPerPage.value;

        const response = await axios
            .get(`http://localhost:3000/expense/get-expense?page=${page}&rowPerPage=${row}`, { headers: { "Authorization": token } });
        console.log(response.data.allExpense);
        for (var i = 0; i < response.data.allExpense.length; i++) {
            addExpenseOnScreen(response.data.allExpense[i]);
            showPagination(response.data);
        }
    } catch (err) {
        console.log(err);
    }
});

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
    lastPage
}) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (hasPrevPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = prevPage;
        btn2.addEventListener('click', () => {removeAllExpensesFromScreen(expenseList), getExpenses(prevPage) });
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click', () => { removeAllExpensesFromScreen(expenseList), getExpenses(currentPage) });
    pagination.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => { removeAllExpensesFromScreen(expenseList), getExpenses(nextPage) });
        pagination.appendChild(btn3);
    }
}

async function getExpenses(page) {
    try {
        const token = localStorage.getItem('token');

        const row = localStorage.getItem('rowPerPage') || rowPerPage.value;

        const response = await axios
            .get(`http://localhost:3000/expense/get-expense?page=${page}&rowPerPage=${row}`, { headers: { "Authorization": token } });
        console.log(response.data.allExpense);
        for (var i = 0; i < response.data.allExpense.length; i++) {
            addExpenseOnScreen(response.data.allExpense[i]);
            showPagination(response.data);
        }
    } catch (err) {
        console.log(err);
    }
}

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios
            .delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers: { "Authorization": token } });
        removeExpenseFromScreen(expenseId);
    } catch (err) {
        console.log(err);
    }
}

async function editExpense(exAmo, description, category, expenseId){
    document.getElementById('exAmo').value = exAmo;
    document.getElementById('choDes').value = description;
    document.getElementById('choCat').value = category;
    deleteExpense(expenseId);
}

function removeExpenseFromScreen(expenseId) {
    let parentNode = document.getElementById('expenseList');
    let childNodeToBeDeleted = document.getElementById(expenseId);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted);
    }
}

function removeAllExpensesFromScreen(ulElement) {
    const listItems = ulElement.querySelectorAll('li');
    for (let i = 0; i < listItems.length; i++) {
        ulElement.removeChild(listItems[i]);
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios
            .get('http://localhost:3000/purchase/premiumMembership', { headers: { "Authorization": token } });
        console.log(response);

        var options = {
            "key_id": response.data.key_id,
            "order_id": response.data.order.id,
            // "prefill": {
            //     "name": "Chhavi Prabhakar",
            //     "email": "prabhakarchhavi9@gmail.com",
            //     "contact": "9608946965"
            //   },
            //   "theme": {
            //    "color": "#3399cc"
            //   },
            "handler": async function (response) {
                const res = await axios
                    .post('http://localhost:3000/purchase/updateTransactionStatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { "Authorization": token } });

                alert('You are Premium User now.');
                showPremiumUserMessage();
                localStorage.setItem('token', res.data.token);
                showLeaderboard();
            },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Transaction failed!');
        });
    } catch (err) {
        console.log(err);
    }
}

async function download() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios
            .get('http://localhost:3000/expense/download', { headers: { "Authorization": token } });
        if (response.status === 200) {
            //the backend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
            const fURL = await axios
                .get('http://localhost:3000/expense/downloaded-expense', { headers: { "Authorization": token } });

            let downloadedList = document.getElementById('downloadedExpense');
            downloadedList.innerHTML += '<h1>Downloaded Expenses</h1>';
            for (var i = 0; i < fURL.data.downloadedExpenseData.length; i++) {
                downloadedList.innerHTML += `<li><a href=${fURL.data.downloadedExpenseData[i]}>File${i + 1}</a> Downloaded at - ${fURL.data.downloadedExpenseData[i].updatedAt}</li>`;
            }
        } else {
            throw new Error(response.data.message)
        }
    } catch (err) {
        console.log(err);
    }
}