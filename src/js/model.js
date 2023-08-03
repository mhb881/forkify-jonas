"use strict";

import { async} from "regenerator-runtime";
/**
 * MVC实践之model层
 */

import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

// data
export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const creatRecipeObject = function (data) {
    const { recipe } = data.data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // 小技巧
        ...(recipe.key && { key: recipe.key })
    };
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

        state.recipe = creatRecipeObject(data);

        // 检索书签数组是否与当前的菜谱的id一致
        if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        }
        else {
            state.recipe.bookmarked = false;
        }

    } catch (error) {
        console.error(`Some thing went wrong.${error}`);
        throw error;
    }
};

/**
 * 根据搜索关键词加载对应食谱
 * 
 * @param {string} query 
 */
export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);


        state.search.results = data.data.recipes.map((recipe) => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key })
            }
        })

        state.search.page = 1;
    } catch (error) {
        console.error(`Some thing went wrong.${error}`);
        throw error;
    }
};

// 分页计数和渲染数目
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};


export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

/**
 * NOTE
 * 
 * 将bookmarks里面的数据存储至localstorage
 * 
 */
const persistBookmarks = function () {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }

    persistBookmarks();
}

export const deleteBookmark = function (id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex((element) => element.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (state.recipe.id === id) {
        state.recipe.bookmarked = false;
    }
}


const init = function () {
    const storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage);
}
init();
// console.log(state.bookmarks);

// 清除缓存
export const clearBookmarks = function () {
    localStorage.clear("bookmarks");
}

// 上传菜谱函数 异步的
export const uploadRecipe = async function (newRecipe) {
    try {
        // 将表格上的数据进行转换，返回一个ingredients对象
        const ingredients = Object.entries(newRecipe).filter(
            (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
        ).map((ing) => {
            const ingArr = ing[1].replaceAll(" ", "").split(",").map((el) => el.trim());

            if (ingArr.length !== 3) throw new Error("Wrong ingredient format! Please use the correct format :)");

            const [quantity, unit, description] = ingArr;

            return { quantity: quantity ? +quantity : null, unit, description };
        });

        // 提交的数据格式与请求的数据格式是相同
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        console.log(ingredients);
        console.log(recipe);

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = creatRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}
