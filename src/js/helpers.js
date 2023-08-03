"use strict";

import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

// 重构异步函数
const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};


export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchPro = uploadData ? fetch(url, {
            // 请求的方法
            method: "POST",
            // headers是关于请求本身的信息
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(uploadData)
        }) : fetch(url);

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        // 防错机制
        if (!res.ok) {
            throw new Error(`${data.message} (${res.status})`);
        }

        return data;
    } catch (error) {
        throw error;
    }
};




// For model get recipe data source
// export const getJSON = async function (url) {
//     try {
//         /**
//          * 利用Promise.race方法实现网络请求超时的功能
//          * 如果网络太差，导致fetch函数一直请求无法响应
//          * 当超过一定时间时，timeout函数则会比fetch函数更快返回response对象
//          */
//         const fetchPro = fetch(url);
//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//         // const res = await fetch("https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886");
//         const data = await res.json();

//         // 防错机制
//         if (!res.ok) {
//             throw new Error(`${data.message} (${res.status})`);
//         }

//         // console.log(res);
//         // console.log(data);

//         return data;
//     } catch (error) {
//         /**
//          * 这里抛出错误使得controller层捕获到该错误
//          * 因为这是helpers层，不应该在这里捕获错误
//          */
//         throw error;
//     }
// };

// export const sendJSON = async function (url, uploadData) {
//     try {
//         // 使用fetch函数发送数据
//         const fetchPro = fetch(url, {
//             // 请求的方法
//             method: "POST",
//             // headers是关于请求本身的信息
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(uploadData)
//         });

//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//         const data = await res.json();

//         // 防错机制
//         if (!res.ok) {
//             throw new Error(`${data.message} (${res.status})`);
//         }

//         return data;
//     } catch (error) {
//         throw error;
//     }
// };