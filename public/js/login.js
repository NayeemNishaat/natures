/* eslint-disable */ // Disabling because es-lint is configured for nodeJs only not for client side!

import { showAlert } from "./alert";

export const login = async (email, password) => {
    try {
        const res = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.status === "success") {
            showAlert("success", "Logged in successfully!");

            setTimeout(() => {
                location.assign("/");
            }, 1500);
        } else throw new Error(data.message);
    } catch (err) {
        showAlert("error", err.message);
    }
};

export const logout = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/v1/users/logout", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (data.status === "success") location.reload(true); // Remark: true for hard reload from server!
    } catch (err) {
        showAlert("error", "Error when trying to log out. Please try again!");
    }
};
