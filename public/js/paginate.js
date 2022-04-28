const lastPage = +document.querySelector(".last").dataset.page;
const middlePageEl = document.querySelector(".middle");
const prevPageEl = document.querySelector(".prev");
const nextPageEl = document.querySelector(".next");
const firstPageEl = document.querySelector(".first");
const lastPageEl = document.querySelector(".last");
const pageEls = document.querySelectorAll(".page__item");

const updatePage = (currentPage, first = true) => {
    prevPageEl.textContent = first ? currentPage : currentPage - 2;
    prevPageEl.dataset.page = first ? currentPage : currentPage - 2;
    middlePageEl.textContent = first ? currentPage + 1 : currentPage - 1;
    middlePageEl.dataset.page = first ? currentPage + 1 : currentPage - 1;
    nextPageEl.textContent = first ? currentPage + 2 : currentPage;
    nextPageEl.dataset.page = first ? currentPage + 2 : currentPage;
};

const resolvePage = (currentPage) => {
    return [currentPage - 1, currentPage + 1];
};

module.exports = handlePagination = () => {
    pageEls.forEach((pageEl) => {
        pageEl.addEventListener("click", (e) => {
            const currentPage = +e.target.dataset.page;

            document
                .querySelectorAll(".active")
                .forEach((activeEl) => activeEl.classList.remove("active"));

            if (currentPage !== 1 && currentPage !== lastPage)
                middlePageEl.classList.add("active");
            if (currentPage === 1) {
                prevPageEl.classList.add("active");
                firstPageEl.classList.add("active");
                updatePage(currentPage);
            }
            if (currentPage === lastPage) {
                nextPageEl.classList.add("active");
                lastPageEl.classList.add("active");
                updatePage(currentPage, false);
            }

            let prevPage, nextPage;

            if (currentPage === 1) {
                [prevPage, nextPage] = [null, 2];
            } else if (currentPage === lastPage) {
                [prevPage, nextPage] = [lastPage - 1, null];
            } else {
                [prevPage, nextPage] = resolvePage(currentPage);
            }

            if (currentPage !== 1 && currentPage !== lastPage) {
                prevPageEl.textContent = prevPage;
                prevPageEl.dataset.page = prevPage;
                middlePageEl.textContent = currentPage;
                middlePageEl.dataset.page = currentPage;
                nextPageEl.textContent = nextPage;
                nextPageEl.dataset.page = nextPage;
            }

            // console.log(prevPage, currentPage, nextPage);
        });
    });
};
