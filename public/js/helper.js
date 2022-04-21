export const getTourData = () => {
    const form = new FormData();

    form.append("name", document.getElementById("name").value);
    form.append(
        "startLocation",
        JSON.stringify({
            coordinates: document.getElementById("coords").value.split(","),
            address: document.getElementById("address").value,
            description: document.getElementById("locInfo").value
        })
    );
    form.append(
        "locations",
        JSON.stringify(
            Array.from(document.querySelectorAll(".location")).map((loc) => {
                const data = loc.value.split("|");

                return {
                    coordinates: data[0].split(","),
                    address: data[1],
                    description: data[2],
                    day: +data[3]
                };
            })
        )
    );
    form.append(
        "guides",
        JSON.stringify(document.getElementById("guides").value.split("|"))
    );
    form.append("duration", document.getElementById("duration").value);
    form.append("maxGroupSize", document.getElementById("groupSize").value);
    form.append("difficulty", document.getElementById("difficulty").value);
    form.append("summary", document.getElementById("summary").value);
    form.append("description", document.getElementById("tourDesc").value);
    form.append(
        "startDates",
        JSON.stringify(
            Array.from(document.querySelectorAll(".stertDate")).map((date) =>
                new Date(date.value).toISOString()
            )
        )
    );
    form.append("imageCover", document.getElementById("coverImage").files[0]);
    form.append("images", document.getElementById("image1").files[0]);
    form.append("images", document.getElementById("image2").files[0]);
    form.append("images", document.getElementById("image3").files[0]);
    form.append("price", document.getElementById("price").value);

    return form;
};
