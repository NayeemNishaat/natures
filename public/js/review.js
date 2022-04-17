import { showAlert } from "./alert";

export const submitReview = async (tourId, review, rating) => {
    try {
        const res = await fetch(`/api/v1/tours/${tourId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review, rating })
        });

        const data = await res.json();

        if (data.status === "success") {
            showAlert("success", "Your review was submitted successfully.");

            setTimeout(() => {
                location.reload();
            }, 2000);
        } else throw new Error(data.message);
    } catch (err) {
        showAlert("error", err.message);
    }
};
