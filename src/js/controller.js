"use strict";

/**
 * MVC实践之controller层
 */

import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";

import { MODEL_CLOSE_SEC } from "./config.js";

// Babel polyfill
import "core-js/stable";
import "regenerator-runtime/runtime.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
/**
 * NOTE
 * 
 * Implement your code 
 */

// 当代码改变时不刷新页面 (Parcel里面的)
// if (module.hot) {
//   module.hot.accept();
// }

// 渲染recipe的逻辑
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    // 局部更新，这个方法很好用
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarkView.update(model.state.bookmarks);

    // 2) Loding recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

  }
  catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

// 控制搜索功能的逻辑
const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    console.log(query);

    // 加载动画
    resultsView.renderSpinner();

    // 2) Load search query
    await model.loadSearchResults(query);

    // 3) Render results
    // console.log(model.state.search.result);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (error) {
    console.error(error);
  }
};

// 分页功能实现，点击按钮渲染新结果和新按钮
const controlPagination = function (goToPage) {
  // 1) Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view (方法的复用)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

// 增加书签的功能
const controlAddBookmark = function () {
  // 1) Add or remove the bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarkView.render(model.state.bookmarks);
}


const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
}


const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

  } catch (error) {
    console.error("💥", error);
    addRecipeView.renderError(error.message);
  }
}


const newFeature = function () {
  console.log("Welcome to the application!");
}

// 初始化函数
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandelerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // model.clearBookmarks();
  newFeature();
}

init();