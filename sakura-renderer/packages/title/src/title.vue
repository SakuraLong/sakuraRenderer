<template>
    <component 
        :is="data.type" 
        :data-title="data.content" 
        ref="srTitle"
        :style="styleStr"
        class="sa-title"
        :id="'sr-title-' + data.option.id"
    >
    <span style="display: inline-block;" :id="data.option.id" ref="srTitle_span" :data-title="data.content" v-html="data.content"></span>
    <a v-if="hasLink" class="sa-title__a" :href="'#'+data.option.id" aria-hidden="true" @click="this.clickTitleLink">#</a>
    </component>
</template>

<script>
/*
给h1~h6设置id是为了读取offsetTop
data:{
    type:"h1",
    content:"标题",
    id:"title_id",
    option:{
        text_align:"left",
        borderPosition:"left",
        hoverAnimation:false,
        color:"",
        fontSize:""
    }
}
*/
export default {
    name: "sr-title",
    props: {
        data: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            hasLink:false,
            styleStr:""
        };
    },
    mounted(){
        this.$refs.srTitle.style.clear = this.data.option.clear; // clear
        if(this.data.option.textAlign === "center" || this.data.option.textAlign === "c"){
            this.$refs.srTitle.classList.add("sa-title--center");
        }else{
            this.$refs.srTitle.classList.add("sa-title--left");
        }
        if(this.data.option.borderPosition === "bottom" || this.data.option.borderPosition === "b"){
            this.$refs.srTitle.classList.add("sa-title--border-bottom");
        }else if(this.data.option.borderPosition === "none" || this.data.option.borderPosition === "n"){
            //
        }else{
            this.$refs.srTitle.classList.add("sa-title--border-left");
        }
        if(this.data.option.hoverAnimation && (this.data.option.borderPosition === "bottom" || this.data.option.borderPosition === "b")){
            this.$refs.srTitle.classList.add("sa-title--border-bottom--ani");
        }else if(this.data.option.hoverAnimation && (this.data.option.borderPosition === "left" || this.data.option.borderPosition === "l")){
            this.$refs.srTitle.classList.add("sa-title--border-left--ani");
        }
        this.hasLink = this.data.option.hasLink === true ? true : false;
        this.data.option.classList.forEach((className)=>{
            this.$refs.srTitle.classList.add(className);
        });
        this.data.option.styleList.forEach((styleName)=>{
            this.styleStr += styleName + ";";
        });
    },
    methods:{
        clickTitleLink(){
            let data = {
                id:this.data.option.id
            };
            this.$emit("eventsFunction", "title", "clickLink", data);
        }
    }
};
</script>
