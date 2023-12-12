// 孙锦瑞
import Template from "./template";

class UndParser extends Template {
    constructor(option, content, rendererData) {
        super(option, content, rendererData);
        this.name = ["und", "下划线"]; // 这个模板的名字
    }
    judge() {
        if (this.name.indexOf(this.dataList[0]) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    analyseTemplate(content) {
        // console.log("analyseTemplate:", content);
        this.dataListInit(content); // 对dataList初始化，必须要写
        if (!this.judge()) return content; // 判断是不是这个模板
        // 以下是处理UndParser模板
        let text = ""; // 文本内容
        let color = "#303133"; // 颜色
        let size = "1"; // 粗细

        const switchKeyValue = (key, value) => {
            switch (key) {
                case "content":
                case "内容":
                    text = value;
                    break;
                case "color":
                case "颜色":
                    color = value;
                    break;
                case "size":
                case "粗细":
                    size = value;
                    break;
            }
        };
        this.dataList.forEach((data, index) => {
            let key = data.split("=")[0];
            let value = data.split("=")[data.split("=").length - 1];
            switch (index) {
                case 1:
                    if (key === value) text = value;
                    else switchKeyValue(key, value);
                    break;
                case 2:
                    if (key === value) color = value;
                    else switchKeyValue(key, value);
                    break;
                case 3:
                    if (key === value) size = value;
                    else switchKeyValue(key, value);
                    break;
            }
        });

        let undItem =
            "<p style='" +
            "border-bottom: solid " +
            size +
            "px " +
            color +
            ";width: fit-content;'>" +
            text +
            "</p>";

        return undItem; // 返回被替换的内容
    }
}

export default UndParser;
