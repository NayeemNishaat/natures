import { showAlert } from "./alert";

export const updateSettings = async (settings, type) => {
    try {
        const url =
            type === "password"
                ? "http://localhost:3000/api/v1/users/update-password"
                : "http://localhost:3000/api/v1/users/update-me";

        const res =
            type !== "photo"
                ? await fetch(url, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(settings)
                  })
                : await fetch(url, {
                      method: "PATCH",
                      body: settings
                  });

        const data = await res.json();
        if (data.status === "success") {
            showAlert("success", `${type.toUpperCase()} updated successfully!`);
        } else throw new Error(data.message);
    } catch (err) {
        showAlert("error", err.message);
    }
};
