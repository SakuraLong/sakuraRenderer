import "./theme-chalk"; // 导入css
import "./labels"; // 导入标签

import ArticleContainer from "./packages/articleContainer";
import Paragraph from "./packages/paragraph";
import Title from "./packages/title";

const components = [
    ArticleContainer,
    Paragraph,
    Title
];

const install = function (Vue, opts = {}) {
    // locale.use(opts.locale);
    // locale.i18n(opts.i18n);

    components.forEach((component) => {
        Vue.component(component.name, component);
    });

    // Vue.use(InfiniteScroll);
    // Vue.use(Loading.directive);

    // Vue.prototype.$ELEMENT = {
    //     size: opts.size || "",
    //     zIndex: opts.zIndex || 2000,
    // };

    // Vue.prototype.$loading = Loading.service;
    // Vue.prototype.$msgbox = MessageBox;
    // Vue.prototype.$alert = MessageBox.alert;
    // Vue.prototype.$confirm = MessageBox.confirm;
    // Vue.prototype.$prompt = MessageBox.prompt;
    // Vue.prototype.$notify = Notification;
    // Vue.prototype.$message = Message;
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

// const a = "ppp";

export default {
    install,
    ArticleContainer,
    Paragraph
};