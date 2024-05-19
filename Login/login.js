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
            var d = new Date();
            d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = "ManagerUserId" + "=" + data.userId + ";" + expires + ";path=/";
            window.location.href='../Home/home.html'
        } else {
            invalidCredentials.style.display = "block";
        }
    } catch (error) {
        console.error("Error: ", error);
        // Handle error here
    }
}


function setCookie(cookieName, cookieValue, expirationDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}