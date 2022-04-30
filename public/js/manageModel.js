import { showAlert } from "./alert";

class manageModel {
    constructor(collection, docId, tourSlug) {
        this.collection = collection;
        this.docId = docId;
        this.tourSlug = tourSlug;
    }

    // async deleteOne() {
    //     try {
    //         const res = await fetch(
    //             `/api/v1/${this.collection}/${this.docId}`,
    //             {
    //                 method: "DELETE",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 }
    //             }
    //         );

    //         const data = await res.json();

    //         if (data.status === "success") {
    //             showAlert("success", "Successfully Deleted!", 2);
    //             setTimeout(() => location.reload(true), 2000);
    //         } else throw new Error(data.message);
    //     } catch (err) {
    //         showAlert("error", err.message, 2);
    //     }
    // }

    async delete() {
        try {
            const res = await fetch(`/api/v1/${this.collection}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    docId: this.docId,
                    tourSlug: this.tourSlug
                })
            });

            const data = await res.json();

            if (data.status === "success") {
                showAlert("success", "Successfully Deleted!", 2);
                setTimeout(() => location.reload(true), 2000);
            } else throw new Error(data.message);
        } catch (err) {
            showAlert("error", err.message, 2);
        }
    }

    async createUpdate(userData, docId = null) {
        try {
            let res;

            if (!docId)
                res = await fetch(`/api/v1/${this.collection}`, {
                    method: "POST",
                    body: userData
                });
            else
                res = await fetch(`/api/v1/${this.collection}/${docId}`, {
                    method: "PATCH",
                    headers:
                        this.collection === "users"
                            ? {
                                  "Content-Type": "application/json"
                              }
                            : {},
                    body: userData
                });

            const data = await res.json();

            if (data.status === "success") {
                showAlert("success", "Successful!", 2);
                setTimeout(
                    () => location.assign(`/manage-${this.collection}`),
                    2000
                );
            } else throw new Error(data.message);
        } catch (err) {
            showAlert("error", err.message, 2);
        }
    }
}

export default manageModel;
