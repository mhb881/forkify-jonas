"use strict";

import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    addHandelerClick(handler) {
        this._parentElement.addEventListener("click", (e) => {
            e.preventDefault();
            const btn = e.target.closest(".btn--inline");
            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        });
    }

    // 分页渲染逻辑
    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1, and there are other pages
        if (this._data.page === 1 && numPages > 1) {
            return this.#generateMarkupNextBtn(curPage);
        }

        // Last page
        if (this._data.page === numPages && numPages > 1) {
            return this.#generateMarkupPrevBtn(curPage);
        }

        // Other page
        if (this._data.page < numPages) {
            return this.#generateMarkupAllBtn(curPage);
        }

        // Page 1, and there are No other pages
        return ``;
    }

    #generateMarkupPrevBtn(curPage) {
        return `
        <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;
    }

    #generateMarkupNextBtn(curPage) {
        return `
        <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
    }

    #generateMarkupAllBtn(curPage) {
        return `
            <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }
}

export default new PaginationView();