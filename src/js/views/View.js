"use strict";

/**
 * view的父类，里面包含了各种重复使用的函数
 * 或者类似功能的函数
 */
import icons from "url:../../img/icons.svg";

export default class View {
    _data;

    /**
     * Render the received object to DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe) 
     * @param {boolean} [render=true] If false, creat markup string instead of rendering to the DOM 
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Blackbeans
     * @todo Finish implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this.#clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }


    /**
     * NOTE
     * 
     * 这是一个DOM部分更新算法
     * 更新所需要的部分的数据而不是所有
     * 减少浏览器加载压力
     * 
     * @param {Array} data 
     */
    update(data) {
        if (!data) return this.renderError();
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const newMarkup = this._generateMarkup();

        // 小技巧，将字符串转换为DOM对象 具体的方法介绍看MDN文档
        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll("*"));
        const curElements = Array.from(this._parentElement.querySelectorAll("*"));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(newEl.isEqualNode(curEl) ? "" : curEl);

            // Updates changed Text
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
                curEl.textContent = newEl.textContent;
            }

            // Update changed Attributes
            if (!newEl.isEqualNode(curEl)) {
                // 将属性对象转换为数组然后逐项替换
                Array.from(newEl.attributes).forEach((attr) => {
                    curEl.setAttribute(attr.name, attr.value);
                });
            }
        });
    }

    #clear() {
        this._parentElement.innerHTML = "";
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        this.#clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this.#clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this.#clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
}