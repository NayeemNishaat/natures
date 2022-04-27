const lastPageEl = document.querySelector(".last");

const lastPage = +lastPageEl.textContent;

const resolvePage = (currentPage) => {
    const prevPage = currentPage === "start" ? null : currentPage - 1;
    const nextPage = currentPage === "end" ? null : currentPage + 1;

    return [prevPage, nextPage];
};

module.exports = handlePagination = () => {
    document.querySelectorAll(".page__item").forEach((page) => {
        page.addEventListener("click", (e) => {
            const currentPage = +e.target.textContent;
            const middlePageEl = document.querySelector(".middle");
            const prevPageEl = document.querySelector(".prev");
            const nextPageEl = document.querySelector(".next");

            document.querySelector(".active").classList.remove("active");
            if (currentPage !== 1 && currentPage !== 6)
                middlePageEl.classList.add("active");
            if (currentPage === 1) prevPageEl.classList.add("active");
            if (currentPage === lastPage) nextPageEl.classList.add("active");

            let prevPage;
            let nextPage;

            if (currentPage === 1) {
                [prevPage, nextPage] = [null, 2];
            } else if (currentPage === lastPage) {
                [prevPage, nextPage] = [lastPage - 1, null];
            } else {
                [prevPage, nextPage] = resolvePage(currentPage);
            }

            if (currentPage !== 1 && currentPage !== lastPage) {
                prevPageEl.textContent = prevPage;
                middlePageEl.textContent = currentPage;
                nextPageEl.textContent = nextPage;
            }

            // console.log(prevPage, currentPage, nextPage);
        });
    });
};
