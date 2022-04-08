/* eslint-disable */ // Disabling because es-lint is configured for nodeJs only not for client side!

const login = async (email, password) => {
    try {
        const res = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }
};

document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
});
