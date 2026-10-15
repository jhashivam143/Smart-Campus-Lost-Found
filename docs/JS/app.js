function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href =
        "index.html";

}


// Automatically set today's date

const dateInput =
    document.getElementById("date");

if (dateInput) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.value = today;

}


// URL TYPE

const params =
    new URLSearchParams(
        window.location.search
    );

const type =
    params.get("type");

if (type) {

    const radio =
        document.querySelector(
            `input[value="${type}"]`
        );

    if (radio) {

        radio.checked = true;

    }

}