/**
 * 非贪婪替换
 * 匹配替换最外层的内容
 * 项目里面没有特殊说明不用这个
 * code ignore 用这个检索
 * @param {String} string_begin 匹配开始字符串
 * @param {String} string_end 匹配结束字符串
 * @param {String} content 检查的内容
 * @param {Function} func 处理内容的函数，会传入入参以及匹配的内容，需要返回匹配的替换的结果
 * @param {Boolean} 是否会找到全部
 * @returns
 */
function replaceNonGreed(string_begin, string_end, content, func, all = false) {
    let res = {
        replace: false,
        content: content,
    };
    let left_index = 0; // string_begin检索的位置
    let right_index = 0; // string_end检索的位置
    let left_index_list = []; // 匹配到左字符串的下标位置数组
    let right_index_list = []; // 匹配到右字符串的下标位置数组
    let h = 0; // 防止死循环
    while (content.indexOf(string_begin, left_index) !== -1) {
        if (++h > 10000) break;
        left_index = content.indexOf(string_begin, left_index);
        left_index_list.push(left_index);
        left_index += string_begin.length;
    }
    h = 0;
    while (content.indexOf(string_end, right_index) !== -1) {
        if (++h > 10000) break;
        right_index = content.indexOf(string_end, right_index);
        right_index_list.push(right_index);
        right_index += string_end.length;
    }
    if (left_index_list.length === 0 || right_index_list.length === 0)
        return res; // 匹配失败
    // right_index_list.reverse(); // 反转 最大排在最前
    h = 0;
    let temp_list = [];
    let l_i = 0;
    let r_i = 0;
    while (h < 100000) {
        h++;
        if(l_i >= left_index_list.length && r_i >= right_index_list.length){
            break;
        }else if(l_i >= left_index_list.length && r_i < right_index_list.length){
            temp_list.push({type:"right", index:right_index_list[r_i]});
            r_i++;
        }else if(l_i < left_index_list.length && r_i >= right_index_list.length){
            temp_list.push({type:"left", index:left_index_list[l_i]});
            l_i++;
        }else {
            if (left_index_list[l_i] < right_index_list[r_i]){
                temp_list.push({type:"left", index:left_index_list[l_i]});
                l_i++;
            }else{
                temp_list.push({type:"right", index:right_index_list[r_i]});
                r_i++;
            }
        }
    }
    let stack = 0;
    let lr_list = [];
    l_i = left_index_list[0];
    r_i = -1;
    for(let i=0;i<temp_list.length;i++){
        if(temp_list[i].type === "left"){
            stack++;
        }else{
            r_i = temp_list[i].index;
            stack--;
        }
        if(stack === 0) {
            lr_list.push([l_i, r_i]);
            // 找到当前后面的第一个left
            l_i = -1;
            for(let j = i+ 1;j < temp_list.length;j++){
                if(temp_list[j].type === "left"){
                    l_i = temp_list[j].index;
                    break;
                }
            }
            if(l_i === -1) break; // 后面没有left了
        }
    }
    let replace_difference = 0; // 变化前后的差数
    for(let i=0;i<lr_list.length;i++){
        if(!all && i > 0) break;
        if (lr_list[i][0] >= lr_list[i][1]) continue;
        let temp = content.slice(lr_list[i][0] + replace_difference, lr_list[i][1] + string_end.length + replace_difference); // 不一定唯一，但一定是最先检索到
        let before = content.length;
        content = content.replace(
            temp,
            func({
                stringBegin: string_begin,
                stringEnd: string_end,
                content: content,
                replace: temp,
            })
        );
        let after = content.length;
        replace_difference = replace_difference + after - before;
        res.replace = true;
    }
    res.content = content;
    return res;
}

/**
 * 贪婪替换
 * 匹配替换最内层的内容
 * 项目里面用这个为主
 * @param {String} string_begin 匹配开始字符串
 * @param {String} string_end 匹配结束字符串
 * @param {String} content 检查的内容
 * @param {Function} func 处理内容的函数，会传入入参以及匹配的内容，需要返回匹配的替换的结果
 * @returns
 */
function replaceGreed(string_begin, string_end, content, func) {
    let res = {
        replace: false,
        content: content,
    };
    let left_index = 0; // string_begin检索的位置
    let right_index = 0; // string_end检索的位置
    let left_index_list = []; // 匹配到左字符串的下标位置数组
    let right_index_list = []; // 匹配到右字符串的下标位置数组
    let h = 0; // 防止死循环
    while (content.indexOf(string_begin, left_index) !== -1) {
        if (++h > 10000) break;
        left_index = content.indexOf(string_begin, left_index);
        left_index_list.push(left_index);
        left_index += string_begin.length;
    }
    h = 0;
    while (content.indexOf(string_end, right_index) !== -1) {
        if (++h > 10000) break;
        right_index = content.indexOf(string_end, right_index);
        right_index_list.push(right_index);
        right_index += string_end.length;
    }
    if (left_index_list.length === 0 || right_index_list.length === 0)
        return res; // 匹配失败
    // right_index_list.reverse(); // 反转 最大排在最前
    // h = 0;
    // while (
    //     left_index_list[0] < right_index_list[0] &&
    //     left_index_list.length !== right_index_list.length
    // ) {
    //     if (++h > 10000) break;
    //     if (left_index_list.length > right_index_list.length)
    //         left_index_list.shift();
    //     else right_index_list.shift();
    // }
    left_index = -1;
    right_index = -1;
    for(let i = 0; i < right_index_list.length; i++) {
        for(let j = 0; j < left_index_list.length; j++) {
            if(right_index_list[i] > left_index_list[j]) left_index = j;
        }
        if(left_index !== -1) {
            right_index = i;
            break;
        }
    }
    if (left_index === -1) return res; // 匹配失败
    left_index = left_index_list[left_index];
    right_index = right_index_list[right_index];
    let temp = content.slice(left_index, right_index + string_end.length); // 不一定唯一，但一定是最先检索到
    content = content.replace(
        temp,
        func({
            stringBegin: string_begin,
            stringEnd: string_end,
            content: content,
            replace: temp,
        })
    );
    res.replace = true;
    res.content = content;
    return res;
}

/**
 * 对象深拷贝
 * @param {Object} obj 对象
 * @param {Object} cache cache
 * @returns 深拷贝的新的对象
 */
const deepClone = (obj, cache = []) => {
    // 如果为普通数据类型，则直接返回，完成拷贝
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    // cache用来储存原始值和对应拷贝数据，在递归调用deepCopy函数时，如果本次拷贝的原始值在之前已经拷贝了，则直接返回储存中的copy值，这样的话就不用再循环复制本次原始值里面的每一项了。
    // 还有一个更为重要的作用，假如原始值里面嵌套两个引用地址相同的对象，使用cache可以保证拷贝出来的copy值里面两个对象的引用地址也相同。
    // 如果find查找的是一个空数组，则不会执行
    const hit = find(cache, (c) => c.original === obj);
    if (hit) {
        return hit.copy;
    }
    // 定义拷贝的数据类型
    const copy = Array.isArray(obj) ? [] : {};
    // 用来记录拷贝的原始值和copy值
    cache.push[
        {
            original: obj,
            copy,
        }
    ];
    // 递归调用深拷贝函数，拷贝对象中的每一个值
    Object.keys(obj).forEach((key) => {
        copy[key] = deepClone(obj[key], cache);
    });
    return copy;
};

/**
 * 浏览器数据库存储
 * @param {int} type 存储方式
 */
class Storage {
    constructor(type) {
        //type 0代表长期 1代表短期
        this.type = type;
    }
    /**
     *
     * @param {string} key 键
     * @param {*} value 值
     * @param {string} type 值的类型能直接存的就不用填
     *
     * @example set("bus", 1900)
     * @example set("car", {"bus":1900}, "JSON")
     */
    set(key, value, type) {
        if (type == null) {
            if (this.type === 0) {
                window.localStorage.setItem(key, value);
            } else {
                window.sessionStorage.setItem(key, value);
            }
        } else if (type === "JSON") {
            if (this.type === 0) {
                window.localStorage.setItem(
                    key,
                    JSON.stringify(value).toString()
                );
            } else {
                window.sessionStorage.setItem(
                    key,
                    JSON.stringify(value).toString()
                );
            }
        }
    }
    /**
     *
     * @param {string} key 键
     * @param {*} type 值的类型能直接存的就不用填
     * @returns 值
     *
     * @example get("bus")
     * @example get("car", "JSON")
     */
    get(key, type, default_value) {
        if (type == null) {
            if (this.type === 0) {
                let t = window.localStorage.getItem(key);
                if(t==null){
                    this.set(key, default_value, type);
                }
                return window.localStorage.getItem(key);
            } else {
                let t = window.sessionStorage.getItem(key);
                if(t==null){
                    this.set(key, default_value, type);
                }
                return window.sessionStorage.getItem(key);
            }
        } else if (type === "JSON") {
            if (this.type === 0) {
                let t = JSON.parse(window.localStorage.getItem(key));
                if(t==null){
                    this.set(key, default_value, type);
                }
                return JSON.parse(window.localStorage.getItem(key));
            } else {
                let t = JSON.parse(window.sessionStorage.getItem(key));
                if(t==null){
                    this.set(key, default_value, type);
                }
                return JSON.parse(window.sessionStorage.getItem(key));
            }
        }
    }
    /**
     *
     * @param {string} key 键
     * @param {*} type 值的类型能直接存的就不用填
     * @returns 值
     *
     * @example delete("bus")
     * @example delete("car", "JSON")
     */
    delete(key, type) {
        if (type == null) {
            if (this.type === 0) {
                return window.localStorage.removeItem(key);
            } else {
                return window.sessionStorage.removeItem(key);
            }
        } else if (type === "JSON") {
            if (this.type === 0) {
                return JSON.parse(window.localStorage.removeItem(key));
            } else {
                return JSON.parse(window.sessionStorage.removeItem(key));
            }
        }
    }
}
/**
 *
 * @param {int} save_type 数据库保存方式0:长期;1:短期
 * @param {string} key 键
 * @param {*} value 值
 * @param {string} type 值的类型能直接存的就不用填
 */
const set = (save_type, key, value, type) => {
    new Storage(save_type).set(key, value, type);
};
/**
 *
 * @param {int} save_type 数据库保存方式0:长期;1:短期
 * @param {string} key 键
 * @param {string} default_value 默认值
 * @param {string} type 值的类型能直接存的就不用填
 * 
 * @returns 存储的数据
 */
const get = (save_type, key, default_value, type) => {
    return new Storage(save_type).get(key, type, default_value);
};
/**
 *
 * @param {int} save_type 数据库保存方式0:长期;1:短期
 * @param {string} key 键
 * @param {string} type 值的类型能直接存的就不用填
 */
const del = (save_type, key, type) => {
    new Storage(save_type).delete(key, type);
};


export default {
    replaceNonGreed,
    replaceGreed,
    deepClone,
    set,
    get,
    del
};
