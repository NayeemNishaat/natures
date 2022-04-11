import { showAlert } from "./alert";

export const updateData = async (name, email) => {
    try {
        const res = await fetch(
            "http://localhost:3000/api/v1/users/update-me",
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email })
            }
        );

        const data = await res.json();
        if (data.status === "success") {
            showAlert("success", "User info updated!");
        } else throw new Error(data.message);
    } catch (err) {
        showAlert("error", err.message);
    }
};
