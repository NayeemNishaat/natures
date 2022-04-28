import { showAlert } from "./alert";

const lastPage = +document.querySelector(".last")?.dataset.page;
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

const handlePagination = () => {
    pageEls.forEach((pageEl) => {
        pageEl.addEventListener("click", async (e) => {
            const currentPage = +e.target.dataset.page;

            document
                .querySelectorAll(".active")
                .forEach((activeEl) => activeEl.classList.remove("active")); // Note: Selecting active elements here not outside of the event listener because we need updated current active elements!

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
            try {
                const res = await fetch(
                    `/api/v1/users?role[ne]=admin&page=${currentPage}&limit=12`
                );

                const data = await res.json();
                let markup = "";

                if (data.status === "success") {
                    data.data.doc.forEach((d) => {
                        markup =
                            markup +
                            `
                        <div class="card" data-user-id="${d._id}"><button class="button">X</button><a href="/update-user/${d._id}"><svg class="edit__icon"><use xlink:href="img/icons.svg#icon-edit"></use></svg></a><input class="checkbox" type="checkbox"><div class="card__header"><div class="card__picture"><img class="card__picture-img" src="/img/users/${d.photo}" alt="Photo of ${d.name}"></div><h3 class="heading-quaternary"><span>${d.name}</span></h3></div><div class="card__footer"><p><span class="card__footer-value">${d.email}</span> <span class="card__footer-text"></span></p><p class="card__ratings"><span class="card__footer-value">${d.role}</span></p></div></div>`;
                    });

                    document.querySelector(".card-container").innerHTML =
                        markup;
                } else throw new Error(data.message);
            } catch (err) {
                showAlert("error", err.message);
            }
        });
    });
};

module.exports = handlePagination;
