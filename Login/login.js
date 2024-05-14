document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');

    passwordInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            loginUser();
        }
    });
});

async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const invalidCredentials = document.getElementById('invalidCredentials');

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        });

        const data = await response.json();

        console.log(data);

        // Handle the response here
        if (response.status === 200) {
            console.log("Login successful");
            invalidCredentials.style.display = "none";
            localStorage.setItem("ManagerUserId", data.userId)
            window.location.href='../Home/home.html'
        } else {
            invalidCredentials.style.display = "block";
        }
    } catch (error) {
        console.error("Error: ", error);
        // Handle error here
    }
}