/*
标题解析器
*/

import ComponentsParser from "./componentParser"; // 组件解析器（各个具体组件解析器的父类）

class TitleParser extends ComponentsParser {
    constructor(component, option, rendererData) {
        super(component, option, rendererData);
        this.default = false; // 是否是组件模板（是否是{||}包裹）
        this.name = ["title", "标题"];
        this.template = {
            type: "sr-title", // 组件名称（请不要更改名称，这个和vue的name是对应的）
            data: {
                // 标题数据
                type: "h1", // 标题类型
                content: "", // 标题内容
                option: {
                    // 标题配置项
                    textAlign: "left", // 文字排版
                    borderPosition: "left", // 边框位置
                    hoverAnimation: false, // hover动画
                    hasLink: true, // 有无页面内跳转链接
                },
            },
        }; // 标题默认配置
    }
    judge() {
        // 重写
        if (this.component[0] === "=") {
            return true;
        } else if (this.name.indexOf(this.dataList[0]) !== -1) {
            this.default = true;
            return true;
        } else {
            return false;
        }
    }
    analyse() {
        this.template.data.option = Object.assign(this.template.data.option, this.baseOption); // 合并baseOption
        let component = this.component;
        let titleType = 0;
        let title = "";
        let style = null;
        let styleList = [];
        if (!this.default) {
            let t1 = component.split("?style");
            title = t1[0];
            style = t1.length === 1 ? null : t1[t1.length - 1];
            let t2 = title.split(" ");
            let typeA = t2[0];
            if (t2.length < 2) {
                // 格式错误
                return {
                    type: "error",
                    msg: "title格式错误",
                    content: this.content,
                };
            }
            title = t2[1];
            for (let i = 2; i < t2.length; i++) title += " " + t2[i];
            titleType = typeA.length > 6 ? 6 : typeA.length;
            this.template.data.type = "h" + titleType.toString();
            this.template.data.content = title;
            if(style){
                style = style.trim();
                styleList = style.split("|");
            }
        } else {
            let divideIndex = this.dataList.indexOf("-");
            if(divideIndex === -1){
                // 格式错误
                return {
                    type: "error",
                    msg: "title格式错误",
                    content: this.content,
                };
            }
            for(let i=0;i<divideIndex;i++){
                styleList.push(this.dataList[i]);
            }
            for(let i=divideIndex+1;i<this.dataList.length;i++){
                this.template.data.content += this.dataList[i];
            }
        }
        if (styleList.length!==0) {
            styleList.forEach((styleELe) => {
                let key = styleELe.split("=")[0];
                let value = styleELe.split("=")[styleELe.split("=").length - 1];
                switch(key){
                    case "textAlign":
                    case "TA":
                        if(["left", "center", "l", "c"].indexOf(value) !== -1){
                            this.template.data.option.textAlign = value;
                        }
                        break;
                    case "borderPosition":
                    case "BP":
                        if(["left", "l", "bottom", "b", "n", "none"].indexOf(value) !== -1){
                            this.template.data.option.borderPosition = value;
                        }
                        break;
                    case "hoverAnimation":   
                    case "HA":
                        if(["true", "false"].indexOf(value) !== -1){
                            this.template.data.option.hoverAnimation = eval(value);
                        }else if(key === value){
                            this.template.data.option.hoverAnimation = true;
                        }
                        break;
                    case "hasLink":
                    case "HL":
                        if(["true", "false"].indexOf(value) !== -1){
                            this.template.data.option.hasLink = eval(value);
                        }else if(key === value){
                            this.template.data.option.hasLink = true;
                        }
                        break;
                    case "type":
                        // 之后要做正确性检查
                        this.template.data.type = value;
                        break;
                    default:
                        if(this.default && key.length === 2 && key[0] === "h" && Number(key[1])){
                            if(parseInt(key[1]) <= 6){
                                this.template.data.type = value;
                            }
                        }
                        break;
                }
            });
        }
        this.template.data.content = this.template.data.content.trim();
        const temp = this.template.data.content;
        // this.template.data.content = this.replacePoem(this.template.data.content); // 替换poem
        this.template.data.content = this.replaceModule(this.template.data.content); // 模板
        this.template.data.content = this.replaceTemplate(this.template.data.content); // 模块
        this.template.data.content = this.replaceSymbol(this.template.data.content); // 符号
        this.template.data.content = this.replaceGrammar_(this.template.data.content); // 语法
        // this.template.data.content = this.replaceCode(this.template.data.content); // 替换code
        // this.template.data.content = this.replaceHtml(this.template.data.content); // 替换html
        this.template.data.content = this.replaceIgnore(this.template.data.content); // 替换ignore
        let tid = this.template.data.option.id === "" ? temp : this.template.data.option.id;
        let sid = tid;
        let t = 1;
        let h = 0;
        while(this.rendererData.title.idMap.get(sid) !== undefined && h < 10) {
            h++;
            sid = tid + "_" + t.toString();
            t++;
        }
        tid = tid === sid ? tid : sid;
        this.rendererData.title.idMap.set(tid, true);
        this.template.data.option.id = tid;
        return {
            type: "success",
            msg: "",
            content: this.template,
        };
    }
    analysePro(content, type, option) {
        this.template.data.option = Object.assign(
            this.template.data.option,
            this.baseOption
        ); // 合并baseOption
        this.template.data.content = content;
        let tid = this.template.data.option.id === "" ? this.template.data.content : this.template.data.option.id;
        let sid = tid;
        let t = 1;
        let h = 0;
        while(this.rendererData.title.idMap.get(sid) !== undefined && h < 10) {
            h++;
            sid = tid + "_" + t.toString();
            t++;
        }
        tid = tid === sid ? tid : sid;
        this.rendererData.title.idMap.set(tid, true);
        this.template.data.option.id = tid;
        this.template.data.type = type;
        for (let key in this.template.data.option) {
            this.template.data.option[key] =
                option[key] === undefined
                    ? this.template.data.option[key]
                    : option[key];
        }
        return {
            type: "success",
            msg: "",
            content: this.template,
        };
    }
}

export default TitleParser;
