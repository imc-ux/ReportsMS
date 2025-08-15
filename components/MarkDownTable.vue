<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, onMounted } from 'vue';

const root = ref(null);

onMounted(() => {

    console.log(root.value); // <div>这是根元素</div>

});



interface Props {
    templeteAr?: any;
    isShowName?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    templeteAr: {},
    isShowName: false,
});

function showName(info: any) {
    let time: string = '';
    let userName: string = '';
    if (info.createTime) {
        time = info.createTime.substring(0, 19);
    }
    if (info.userName) {
        userName = info.userName;
    }
    return userName + ' ' + time;
}

function templateTable(info: any) {
    if (info && info.templateTitle) {
        let text: string = '| <div class="min-width-70 font-title-style">区分</div>';
        const templateTitleArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        const elementArr = JSON.parse(JSON.parse(JSON.stringify(info.templateElement)));
        const contentArr = JSON.parse(JSON.parse(JSON.stringify(info.content)));
        templateTitleArr.forEach((data: any, index: number) => {
            if (index === 0) {
                text += '|<div class="min-width-120 font-title-style">' + data.value + '</div> ';
            } else {
                text += '|<div class="min-width-450 font-title-style">' + data.value + '</div> ';
            }
        });
        text += '| \n | -';
        templateTitleArr.forEach((_title: any) => {
            text += '| -'
        });
        text += '|\n';
        if (contentArr && contentArr.length > 0) {
            contentArr?.forEach((elem: any) => {
                elem.list?.forEach((element: any, index: number) => {
                    if (index === 0) {
                        text += '|<div class="font-style">' + elem.type + '</div> ';
                    } else {
                        text += '| ';
                    }
                    element?.forEach((data: any) => {
                        text += '|<div class="font-style">' + String(data).replaceAll('\n', '<br>') + '</div> ';
                    });
                    text += '|\n';
                });
            })
        } else {
            elementArr?.forEach((elem: any) => {
                text += '| ' + elem.value;
                templateTitleArr?.forEach((_element: any) => {
                    text += '| ';
                });
                text += '|\n';
            })
        }
        return text;
    } else {
        return '';
    }
}
</script>

<template>
    <span v-show="isShowName" class="span_full_width_style">{{ showName(props.templeteAr) }}</span>
    <MdPreview :modelValue="templateTable(props.templeteAr)" ref="root" />
</template>

<style>
.default-theme table tr th {
    border: 0.0625rem solid #000000;
}

.default-theme table tr th {
    background-color: rgb(49, 134, 155);
}

.default-theme table tr td:first-child {
    background-color: rgb(218, 238, 243);
    border-left: 0.0625rem solid #000000;
    border-right: 0.0625rem solid #000000;
    width: 4.375rem;
}

.default-theme table tr td:last-child {
    border-right: 0.0625rem solid #000000;
}

.default-theme table tr:last-child td {
    border-bottom: 0.0625rem solid #000000;
}

.default-theme table tr td:nth-child(2) {
    width: 7.8125rem;
    border-right: 0.0625rem solid #000000;
}

.font-title-style {
    color: white;
    font-size: medium;
    font-weight: 400;
}

.font-style {
    color: #000000;
    font-size: 12px;
    margin-left: -0.625rem;
}

.min-width-70 {
    min-width: 4.375rem;
}

.min-width-120 {
    min-width: 7.8125rem;
}

.min-width-450 {
    min-width: 28.125rem;
    width: 100%;
}

.span_full_width_style {
    width: 100%;
    padding-left: 1.25rem;
}
</style>
