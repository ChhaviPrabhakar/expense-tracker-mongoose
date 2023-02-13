async function login(e) {
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.pswd.value
    }

    try {
        const response = await axios
        .post('http://localhost:3000/user/login', loginDetails);
    } catch(err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
}