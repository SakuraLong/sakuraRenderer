<template>
    <div ref="list_container" class="sr-list-container" :style="styleStr">
        <div
            class="sa-list-button"
            ref="sr_list_button"
            @click="clickButton"
            v-if="showButton"
        >
            {{ buttonName }}
        </div>
        <sr-scrollbar
            max-height="calc((100vh - 80px - 6rem)/2)"
            width="100%"
            ref="scrollbar"
        >
            <div
                ref="main_container"
                class="sr-list-main-container"
                v-show="showList"
            ></div>
        </sr-scrollbar>
        <div
            style="text-align: center"
            class="sr-list-title"
            v-if="!showButton || (showButton && showList)"
        >
            {{ data.option.name }}
        </div>
    </div>
</template>

<script>
export default {
    name: "sr-list",
    props: {
        data: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            styleStr: "",
            listData: [],
            showList: false,
            showName: false,
            showButton: true,
            buttonName: "展开",
            listClassDict: {
                listContainer: {
                    float: {
                        center: "sa-center",
                        left: "sa-float--left",
                        right: "sa-float--right",
                        none: "sa-list--block",
                    },
                    display: {
                        inline_block: "sa-list-container--inline-block",
                        block:"sa-list--block"
                    },
                },
            },
        };
    },
    methods: {
        clickButton() {
            this.showList = !this.showList;
            this.buttonName = this.buttonName === "折叠" ? "展开" : "折叠";
        },
        render(fatherEle, childData, type = "default") {
            const deepBuild = (data, indexList, lastIndex, type) => {
                let cataIndex = "";
                let tempList = [];
                let li = document.createElement("li");
                let spanLiIndex = document.createElement("span");
                let spanLiContent = document.createElement("span");
                li.classList.add("sa-list-li");
                spanLiIndex.classList.add("sa-list-li-index");
                spanLiContent.classList.add("sa-cata-li-conetnt");
                indexList.forEach((element, index) => {
                    tempList[index] = element;
                    if (index !== 0) {
                        cataIndex += ".";
                    }
                    cataIndex += element;
                });
                if (type === "default") {
                    // number or default
                    cataIndex = tempList[tempList.length - 1] - lastIndex;
                    if (cataIndex === 0) {
                        //无序列表
                        if (this.data.option.unordered_mode === "default") {
                            if (tempList.length === 1) {
                                cataIndex = "●";
                            } else if (tempList.length === 2) {
                                cataIndex = "○";
                            } else if (tempList.length === 3) {
                                cataIndex = "■";
                            } else if (tempList.length === 4) {
                                cataIndex = "□";
                            }
                        } else if (
                            this.data.option.unordered_mode === "solid"
                        ) {
                            cataIndex = "●";
                        } else if (
                            this.data.option.unordered_mode === "hollow"
                        ) {
                            cataIndex = "○";
                        } else if (
                            this.data.option.unordered_mode === "square"
                        ) {
                            cataIndex = "■";
                        } else if (
                            this.data.option.unordered_mode === "template"
                        ) {
                            if (
                                this.data.option.unordered_template ===
                                "DEFAULT"
                                //没有设置序号样式
                            ) {
                                if (tempList.length === 1) {
                                    cataIndex = "●";
                                } else if (tempList.length === 2) {
                                    cataIndex = "○";
                                } else if (tempList.length === 3) {
                                    cataIndex = "■";
                                } else if (tempList.length === 4) {
                                    cataIndex = "□";
                                }
                            } else {
                                cataIndex = this.data.option.unordered_template;
                            }
                        } else if (this.data.option.unordered_mode === "none") {
                            cataIndex = "";
                        }
                    } else {
                        // 有序列表
                        if (this.data.option.ordered_mode === "template") {
                            if (
                                this.data.option.ordered_template !== "DEFAULT"
                            ) {
                                if (
                                    this.data.option.ordered_template[0] === "*"
                                ) {
                                    cataIndex =
                                        cataIndex +
                                        this.data.option.ordered_template.substring(
                                            1
                                        );
                                } else if (
                                    this.data.option.ordered_template[
                                        this.data.option.ordered_template
                                            .length - 1
                                    ] === "*"
                                ) {
                                    cataIndex =
                                        this.data.option.ordered_template.substring(
                                            0,
                                            this.data.option.ordered_template
                                                .length - 1
                                        ) + cataIndex;
                                } else {
                                    if(this.data.option.ordered_template.split("*").length===2){
                                        cataIndex = this.data.option.ordered_template.split("*")[0] + cataIndex + this.data.option.ordered_template.split("*")[1];
                                    }
                                }
                            }
                        } else if (this.data.option.ordered_mode === "none") {
                            cataIndex = "";
                        }
                    }
                }
                spanLiIndex.textContent = cataIndex;
                spanLiContent.innerHTML = data.text;

                li.appendChild(spanLiIndex);
                li.appendChild(spanLiContent);
                // li.append(a);

                if (data.children.length !== 0) {
                    let olulList = []; // 存储外层ol和ul
                    let lastIndex_ = -1;
                    tempList.push(0);
                    data.children.forEach((data, index) => {
                        tempList[tempList.length - 1] = index + 1;
                        if (data.order_judge) {
                            if (
                                lastIndex_ === -1 ||
                                olulList.length === 0 ||
                                olulList[olulList.length - 1].type === "ul"
                            ) {
                                lastIndex_ = lastIndex_ === -1 ? 0 : lastIndex_;
                                let ol = document.createElement("ol");
                                olulList.push({
                                    type: "ol",
                                    data: ol,
                                });
                                ol.appendChild(
                                    deepBuild(data, tempList, lastIndex_, type)
                                );
                            } else {
                                olulList[olulList.length - 1].data.appendChild(
                                    deepBuild(data, tempList, lastIndex_, type)
                                );
                            }
                        } else {
                            lastIndex_ = index + 1;
                            if (
                                lastIndex_ === -1 ||
                                olulList.length === 0 ||
                                olulList[olulList.length - 1].type === "ol"
                            ) {
                                let ul = document.createElement("ul");
                                olulList.push({
                                    type: "ul",
                                    data: ul,
                                });
                                ul.appendChild(
                                    deepBuild(data, tempList, lastIndex_, type)
                                );
                            } else {
                                olulList[olulList.length - 1].data.appendChild(
                                    deepBuild(data, tempList, lastIndex_, type)
                                );
                            }
                        }
                    });
                    olulList.forEach((data) => {
                        li.appendChild(data.data);
                    });
                }
                return li;
            };
            let olulList = []; // 存储外层ol和ul
            let lastIndex = -1;
            childData.forEach((data, index) => {
                if (data.order_judge) {
                    if (
                        lastIndex === -1 ||
                        olulList.length === 0 ||
                        olulList[olulList.length - 1].type === "ul"
                    ) {
                        lastIndex = lastIndex === -1 ? 0 : lastIndex;
                        let ol = document.createElement("ol");
                        olulList.push({
                            type: "ol",
                            data: ol,
                        });
                        ol.appendChild(
                            deepBuild(data, [index + 1], lastIndex, type)
                        );
                    } else {
                        olulList[olulList.length - 1].data.appendChild(
                            deepBuild(data, [index + 1], lastIndex, type)
                        );
                    }
                } else {
                    lastIndex = index + 1;
                    if (
                        lastIndex === -1 ||
                        olulList.length === 0 ||
                        olulList[olulList.length - 1].type === "ol"
                    ) {
                        let ul = document.createElement("ul");
                        olulList.push({
                            type: "ul",
                            data: ul,
                        });
                        ul.appendChild(
                            deepBuild(data, [index + 1], lastIndex, type)
                        );
                    } else {
                        olulList[olulList.length - 1].data.appendChild(
                            deepBuild(data, [index + 1], lastIndex, type)
                        );
                    }
                }
            });
            olulList.forEach((data) => {
                fatherEle.appendChild(data.data);
            });
        },
    },
    mounted() {
        this.listData = this.data.listData;
        if (this.data.option.ordered_mode === "number") {
            this.render(
                this.$refs.main_container,
                this.data.listData,
                "number"
            );
        } else {
            this.render(
                this.$refs.main_container,
                this.data.listData,
                "default"
            );
        }
        if (!this.data.option.fold) {
            this.showList = true;
            this.showButton = false;
        }
        const listContainer = this.$refs.list_container;
        listContainer.style.clear = this.data.option.clear; // clear
        const listBody = this.$refs.main_container;
        if (this.data.option.float === "center" ||this.data.option.float === "none" ) {
            listBody.classList.add(
                this.listClassDict.listContainer.float[this.data.option.float]
            );
            listBody.classList.add(
                this.listClassDict.listContainer.display.block
            );
        } 
        else {
            listContainer.classList.add(
                this.listClassDict.listContainer.display.inline_block
            );
            listContainer.classList.add(
                this.listClassDict.listContainer.float[this.data.option.float]
            );
        }
        listBody.style.width = this.data.option.width;
        listBody.style.maxWidth = this.data.option.maxWidth;
        listBody.style.minWidth = this.data.option.minWidth;
        listBody.style.height = this.data.option.height;
        listBody.style.maxHeight = this.data.option.maxHeight;
        listBody.style.minHeight = this.data.option.minHeight;
        this.data.option.classList.forEach((className) => {
            this.$refs.list_container.classList.add(className);
        });
        this.data.option.styleList.forEach((styleName) => {
            this.styleStr += styleName + ";";
        });
    },
    created() {},
};
</script>
<style></style>
