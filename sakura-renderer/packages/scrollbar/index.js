import Scrollbar from "./src/scrollbar";

/* istanbul ignore next */
Scrollbar.install = function (Vue) {
    Vue.component(Scrollbar.name, Scrollbar);
};

export default Scrollbar;
