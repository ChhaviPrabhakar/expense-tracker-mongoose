async function login(e) {
    e.preventDefault();
    
    const loginDetails = {
        email: e.target.email.value,
        password: e.target.pswd.value
    };

    try {
        const response = await axios
            .post('http://localhost:3000/user/login', loginDetails);
        localStorage.setItem('token', response.data.token);
        window.location.href = "./expense.html";
    } catch (err) {
        console.log(JSON.stringify(err));
        document.getElementById('errmsg').innerHTML = err.response.data.message;
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
}