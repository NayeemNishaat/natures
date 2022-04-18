import { showAlert } from "./alert";

class manageModel {
    constructor(collection, docId) {
        this.collection = collection;
        this.docId = docId;
    }

    async deleteOne() {
        try {
            const res = await fetch(
                `/api/v1/${this.collection}/${this.docId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await res.json();

            if (data.status === "success") {
                showAlert("success", "Successfully Deleted!", 2);
                setTimeout(() => location.reload(true), 2000);
            } else throw new Error(data.message);
        } catch (err) {
            showAlert("error", err.message, 2);
        }
    }
}

export default manageModel;
