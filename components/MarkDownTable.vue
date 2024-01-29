<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

interface Props {
    templeteAr?: any;
}

const props = withDefaults(defineProps<Props>(), {
    templeteAr: {},
});

function templateTable(info: any) {
    if (info && info.templateTitle) {
        let text: string = '| <div class="min-width-100">区分</div>';
        const templateTitleArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        const elementArr = JSON.parse(JSON.parse(JSON.stringify(info.templateElement)));
        const contentArr = JSON.parse(JSON.parse(JSON.stringify(info.content)));
        templateTitleArr.forEach((data: any, index: number) => {
            if (index === 0) {
                text += '|<div class="min-width-120">' + data.value + '</div> ';
            } else {
                text += '|<div class="min-width-480">' + data.value + '</div> ';
            }
        });
        text += '| \n | :---:';
        templateTitleArr.forEach((_title: any) => {
            text += '| -'
        });
        text += '|\n';
        if (contentArr && contentArr.length > 0) {
            contentArr?.forEach((elem: any) => {
                elem.list?.forEach((element: any, index: number) => {
                    if (index === 0) {
                        text += '| ' + elem.type;
                    } else {
                        text += '| ';
                    }
                    element?.forEach((data: any) => {
                        text += '| ' + String(data).replaceAll('\n', '<br>');
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
    <MdPreview :modelValue="templateTable(props.templeteAr)" />
</template>

<style>
.default-theme table tr th,
.default-theme table tr td {
    border: 0.0625rem solid #c8c9cc;
}

.default-theme table tr th {
    background-color: rgb(49, 134, 155);
}

.default-theme table tr td:first-child {
    background-color: rgb(218, 238, 243);
}

.min-width-100 {
    min-width: 6.25rem;
}

.min-width-120 {
    min-width: 7.5rem;
}

.min-width-480 {
    min-width: 30rem;
}
</style>
