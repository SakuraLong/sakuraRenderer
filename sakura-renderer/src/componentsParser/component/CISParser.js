/*
CISParser解析器
*/
import ComponentsParser from "./componentParser";
import ImageShowerParser from "./imageShowerParser";

class CISParser extends ImageShowerParser {
    constructor(component, option, rendererData) {
        super(component, option, rendererData);
        this.name = ["carouselIS", "走马灯", "CIS"];
        this.template = {
            type: "sr-carousel-is", // 组件名称
            data: {
                imgList: [],
                option: {
                    interval: false,
                    loop: true,
                    intervaltime: 2000,
                },
            },
        }; // 标题段落配置
    }
    judge() {
        // 重写
        if (this.name.indexOf(this.dataList[0]) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    analyse() {
        this.analyseImageShowerOption(); // 获取imageShower的配置项
        this.getImgListData(); // 获取数据
        this.template.data.option = Object.assign(
            this.template.data.option,
            this.baseOption
        ); // 合并baseOption
        let styleList = [];
        let divideIndex = this.dataList.indexOf("-");
        if (divideIndex === -1) {
            // 格式错误
            return {
                type: "error",
                msg: "carouselIS格式错误",
                content: this.content,
            };
        }
        for (let i = 0; i < divideIndex; i++) {
            styleList.push(this.dataList[i]);
        }
        this.template.data.imgList = this.imageListData;
        this.template.data.imgList.forEach((Ele) => {
            Ele.src = this.template.data.option.baseUrl + Ele.src;
        });
        if (styleList.length !== 0) {
            styleList.forEach((styleELe) => {
                if (styleELe.indexOf("=") === -1) {
                    // 不是样式设置
                    if (styleELe === "loop") {
                        this.template.data.option.cycle = true;
                    } else if (styleELe === "interval" || styleELe === "i") {
                        this.template.data.option.interval = true;
                    } else {
                        return {
                            type: "error",
                            msg: "carouselIS格式错误",
                            content: this.content,
                        };
                    }
                } else {
                    let key = styleELe.split("=")[0];
                    let value =
                        styleELe.split("=")[styleELe.split("=").length - 1];
                    switch (key) {
                        case "interval":
                        case "i":
                            if (value === "false") {
                                this.template.data.option.interval = false;
                            } else {
                                this.template.data.option.interval = true;
                                this.template.data.option.intervaltime = value;
                            }
                            break;
                        case "loop":
                            if (value === "true") {
                                this.template.data.option.loop = true;
                            } else if (value === "false") {
                                this.template.data.option.loop = false;
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
        }
        return {
            type: "success",
            msg: "",
            content: this.template,
        };
    }
}

export default CISParser;
