"use strict";

/**
 * 搜索部分的视图层
 */

class SearchView {
    #parentEl = document.querySelector(".search");

    getQuery() {
        const query = this.#parentEl.querySelector(".search__field").value;
        this.#clearInput();
        return query;
    }

    #clearInput() {
        this.#parentEl.querySelector(".search__field").value = "";
    }

    addHandlerSearch(handler) {
        this.#parentEl.querySelector(".search__btn")
            .addEventListener("click", (e) => {
                e.preventDefault();
                handler();
            });

        this.#parentEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handler();
            };
        })
    }
}

export default new SearchView();