/*
组件解析器
*/

import utils from "../../../utils";

class ComponentsParser {
    constructor(component, option, rendererData = {}) {
        this.component = component.trim();
        this.option = option;
        this.rendererData = rendererData;
        this.replaceTemplate_ = rendererData.func.replaceTemplate; // 模板
        this.replaceModule_ = rendererData.func.replaceModule; // 模块
        this.replaceGrammar_ = rendererData.func.replaceGrammar; // 语法

        this.ignoreReplaceList = rendererData.ignoreReplaceList === undefined ? [] : utils.deepClone(rendererData.ignoreReplaceList);
        this.codeReplaceList = rendererData.codeReplaceList === undefined ? [] : utils.deepClone(rendererData.codeReplaceList);
        this.poemReplaceList = rendererData.poemReplaceList === undefined ? [] : utils.deepClone(rendererData.poemReplaceList);
        this.htmlReplaceList = rendererData.htmlReplaceList === undefined ? [] : utils.deepClone(rendererData.htmlReplaceList);
        this.templateReplaceList = rendererData.template.templateList === undefined ? [] : utils.deepClone(rendererData.template.templateList);
        this.moduleReplaceList = rendererData.module.moduleList === undefined ? [] : utils.deepClone(rendererData.module.moduleList);
        this.symbolReplaceList = rendererData.module.moduleList === undefined ? [] : utils.deepClone(rendererData.symbol.symbolList);
        this.templateReplaceList = this.templateReplaceList.reverse(); // 取反 因为模板可以嵌套 所以要由外到内检查 所以替换列表取反

        this.replaceIgnore = this.replace(this.ignoreReplaceList);
        this.replaceCode = this.replace(this.codeReplaceList);
        this.replacePoem = this.replace(this.poemReplaceList);
        this.replaceHtml = this.replace(this.htmlReplaceList);
        this.replaceTemplate = this.replace(this.templateReplaceList);
        this.replaceModule = this.replace(this.moduleReplaceList);
        this.replaceSymbol = this.replace(this.symbolReplaceList);
        // poem -> module -> template -> grammar -> code -> html -> ignore
        this.type = ""; // 类型
        this.dataList = []; // 数据列表
        this.componentBaseOption = {}; // 需要修改的默认值
        this.baseOption = {
            key: parseInt(Math.random() * 1000000),
            float: "none", // 浮动情况
            clear: "none", // clear情况
            maxWidth: "100%", // 最大宽度
            maxHeight: "none", // 最大高度
            minWidth: "none", // 最小宽度
            minHeight: "none", // 最小高度
            width: "auto", // 宽度
            height: "auto", // 高度
            color: "DEFAULT", // 文字颜色 vue要判断，如果是DEFAULT的话不进行修改！！
            fontSize: "DEFAULT", // 文字大小 同上
            fontFamily: "DEFAULT", // 字体 同上
            classList: [], // 类名列表
            styleList: [], // 样式列表
            id: "", // 组件id
        }; // 基础基本上通用的配置项
        // 在vue里面挑选你需要的使用，不一定每个都有用
        // 如果需要修改默认值可以在子类的constructor里面修改（看得清楚
        this.template = {};
        this.name = [];
        this.init();
    }
    judge() {
        // 需要重写，返回true/false代表是不是这个组件
        return false;
    }
    analyse() {
        // 需要重写，返回解析的数据
        return {};
    }
    analyseBaseOption() {
        this.changeBaseOption(); // 检查子类是否要修改默认baseOption
        this.analyseImageShowerOption(); // 如果有imageShowerOption
        let divideIndex = this.dataList.indexOf("-");
        for(let i = 1; i < divideIndex; i++) {
            let data = this.dataList[i];
            let key = data.split("=")[0];
            let value = data.split("=")[data.split("=").length - 1];
            switch(key){
                case "left":
                case "right":
                case "both":
                case "none":
                case "center":
                    if(key === value) this.baseOption.float = key; // 需要注意，这个case在clear组件中通用的，所以会case both
                    break;
                case "float":
                case "f":
                    if (["none", "center", "left", "right"].indexOf(value) !== -1) {
                        this.baseOption.float = ["center", "left", "right", "none"].find((ele)=>{return ele === value;});
                    }
                    break;
                case "clear":
                    if (["none", "both", "left", "right"].indexOf(value) !== -1) {
                        this.baseOption.clear = ["left", "both", "right", "none"].find((ele)=>{return ele === value;});
                    }
                    break;
                case "c":
                    // c有可能是clear，也可以是color
                    if (["none", "both", "left", "right"].indexOf(value) !== -1) {
                        this.baseOption.clear = ["center", "both", "right", "none"].find((ele)=>{return ele === value;});
                    }else{
                        this.baseOption.color = value;
                    }
                    break;
                case "width":
                case "w":
                    this.baseOption.width = value;
                    break;
                case "height":
                case "h":
                    this.baseOption.height = value;
                    break;
                case "maxWidth":
                case "maxW":
                    this.baseOption.maxWidth = value;
                    break;
                case "maxHeight":
                case "maxH":
                    this.baseOption.maxHeight = value;
                    break;
                case "minWidth":
                case "minW":
                    this.baseOption.minWidth = value;
                    break;
                case "minHeight":
                case "minH":
                    this.baseOption.minHeight = value;
                    break;
                case "fontSize":
                case "FS":
                    this.baseOption.fontSize = value;
                    break;
                case "fontFamily":
                case "FF":
                    this.baseOption.fontFamily = value;
                    break;
                case "class":
                    if (value)
                        this.baseOption.classList = this.baseOption.classList.concat(
                            value.split(";")
                        );
                    break;
                case "style":
                    if (value)
                        this.baseOption.styleList = this.baseOption.styleList.concat(
                            value.split(";")
                        );
                    break;
                case "id":
                    this.baseOption.id = value;
                    break;
            }
        }
    }
    init() {
        // 初始化，如果不是{||}不影响，因为不是{||}格式不会调用dataList
        let component = this.component;
        component = component.slice(2, -2); // 去掉{||}
        component = component.replace(/\n/g, ""); // 去掉所有换行符
        let dataList = component.split("|"); // 分割数据
        for (let i = 0; i < dataList.length; i++) {
            dataList[i] = dataList[i].trim();
        }
        this.dataList = dataList;
    }
    replace(replaceList) {
        return function(content) {
            replaceList.forEach((data) => {
                content = content.replace(data.key, data.value);
            });
            return content;
        };
    }
    analyseImageShowerOption(){
        // 解析imageShowerOption
    }
    changeBaseOption() {
        for (let key in this.baseOption) {
            this.baseOption[key] = this.componentBaseOption[key] === undefined ? this.baseOption[key] : this.componentBaseOption[key];
        }
    }
    replaceAll(content) {
        let t = content;
        t = this.replacePoem(t); // 替换poem
        t = this.replaceModule(t); // 模板
        t = this.replaceTemplate(t); // 模块
        t = this.replaceSymbol(t); // 符号
        t = this.replaceGrammar_(t); // 语法
        t = this.replaceCode(t); // 替换code
        t = this.replaceHtml(t); // 替换html
        t = this.replaceIgnore(t); // 替换ignore
        return t;
    }
}

export default ComponentsParser;
