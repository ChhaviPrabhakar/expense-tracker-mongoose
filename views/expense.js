function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a Premium user ";
    document.getElementById('form').style.display = "block";
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const decodeToken = parseJwt(token);
        const isPremiumUser = decodeToken.ispremiumuser;
        if (isPremiumUser) {
            showPremiumUserMessage();
            showLeaderboard();
        }
        const response = await axios
            .get('http://localhost:3000/expense/get-expense', { headers: { "Authorization": token } });
        console.log(response.data.allExpense);
        for (var i = 0; i < response.data.allExpense.length; i++) {
            addExpenseOnScreen(response.data.allExpense[i]);
        }
    } catch (err) {
        console.log(err);
    }
});

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

function removeExpenseFromScreen(expenseId) {
    let parentNode = document.getElementById('expenseList');
    let childNodeToBeDeleted = document.getElementById(expenseId);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted);
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

function download(){
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}