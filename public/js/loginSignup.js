import { showAlert } from "./alert";

export const login = async (email, password) => {
    try {
        const res = await fetch("/api/v1/users/login", {
            method: "POST",
            // credentials: "include", // Warning: When using fetch by default cookies are only sent for same origin ("same-origin"). For cross origin use "include" and to discard cookie use "omit".
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
        const res = await fetch("/api/v1/users/logout", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (data.status === "success") {
            showAlert("success", "Successfully logged out!");
            location.reload(true); // Remark: true for hard reload from server!
        }
    } catch (err) {
        showAlert("error", "Error when trying to log out. Please try again!");
    }
};

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await fetch("/api/v1/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, passwordConfirm })
        });

        const data = await res.json();

        if (data.status === "fail") throw new Error(data.message);

        if (data.status === "success") {
            showAlert(
                "success",
                "Account created successfully! Now please check your Email to activate and log into your account!"
            );
            setTimeout(() => {
                location.assign("/");
            }, 5000);
        }
    } catch (err) {
        showAlert("error", err.message);
    }
};

export const forgotPassword = async (email) => {
    try {
        const res = await fetch("/api/v1/users/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.status === "error") throw new Error();

        if (data.status === "success") {
            showAlert("success", data.message);
            setTimeout(() => {
                location.assign("/");
            }, 3000);
        }
    } catch (err) {
        showAlert("error", "Failed to send password reset link!");
    }
};

export const resetPassword = async (password, passwordConfirm, token) => {
    try {
        const res = await fetch(`/api/v1/users/reset-password/${token}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password, passwordConfirm })
        });

        const data = await res.json();
        if (data.status === "success") {
            showAlert("success", "Password changed successfully!");
            setTimeout(() => {
                location.assign("/");
            }, 3000);
        }
    } catch (err) {
        showAlert("error", "Failed to reset your password!");
    }
};
