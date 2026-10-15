// REGISTER

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;
        }

        const user = {
            name: name,
            email: email,
            password: password,
            role: "STUDENT"
        };

        localStorage.setItem(
            "campusUser",
            JSON.stringify(user)
        );

        alert("Registration successful!");

        window.location.href = "login.html";

    });

}


// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const savedUser =
            JSON.parse(
                localStorage.getItem("campusUser")
            );

        if (!savedUser) {

            alert("No account found. Please register first.");

            return;
        }

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            alert("Login successful!");

            window.location.href =
                "dashboard.html";

        } else {

            alert("Invalid email or password.");

        }

    });

}