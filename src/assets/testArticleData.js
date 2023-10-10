const test_article_data_list = [
    {
        type: "sr-title",
        data: {
            type: "h1",
            content: "标题",
            id: "title_id1",
            option: {
                textAlign: "left",
                borderPosition: "left",
                hoverAnimation: false,
                hasLink: true,
            },
        },
    },
    {
        type: "sr-title",
        data: {
            type: "h2",
            content: "标题标题标题",
            id: "title_id2",
            option: {
                textAlign: "center",
                borderPosition: "bottom",
                hoverAnimation: true,
                hasLink: false,
            },
        },
    },
    {
        type: "sr-title",
        data: {
            type: "h3",
            content: "标题33333333333",
            id: "title_id3",
            option: {
                textAlign: "left",
                borderPosition: "none",
                hoverAnimation: true,
                hasLink: true,
            },
        },
    },
];

const article = 
`
配置项
配置项
|-
= 一级标题 ?style ta=center|bp=bottom|ha|hl=false

== 标题

=== $x+y=\\Delta$

= $$x+y=z$$

段落1段落1段落1段落1段落1


<poem>
asuinsac

sacasc


ascasc

ascsac

sacasc
</poem>

{|标题|type=h1
|class=class1;class2
|ta=l|bp=bottom|ha
|class=class3;class4
|style=color:red;
|-
|<span style='color:black'>不知道写啥</span>
|}

{|table|class=class1
|fold|width=400px|maxHeight=300px
|border=border
|hover=row
|-
|+ asc|saca|sca c=5/t|
|-
|sacasc r=2|sacasc|sacasc|sacasc|sacasc|
|-
|sacasc|sacasc|sacasc|sacasc|
|-
|sacasc r=2|sacasc|sacasc t|
sacascsacascsacascsacascsacascsacascsacascsacas
csacascsacascsacascsacascsacascsacascsacascsacascsacascsacascsac
ascsacascsacascsacascsacascsacascsacascsacascsacas c=2|
|-
|sacasc|sacasc|sacasc|sac$x+y=z$asc|
|}

{|table|border=border|hover=node
|nw=150px|nh=150px|fontSize=26px
|-
| 123 d| 123 d| 123 d| 123 d
|-
| 123 d| 用一些技巧 c=2/r=1/t | 你还可以 c=1/r=2/t
|-
| 123 d| 这样 c=1/r=2/t | 不一样的表格 c=1/r=1/t
|-
| 123 d| 画出 c=2/r=1/t
|}

{|albumIS
| width=500px
|-
| https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg
| img1.jpg
| img2.png
| img3.jpg
| img4.jpeg
|}

`;

export default {
    test_article_data_list,
    article
};
