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
        let text: string = '| 区分 ';
        const templateTitleArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        const elementArr = JSON.parse(JSON.parse(JSON.stringify(info.templateElement)));
        const contentArr = JSON.parse(JSON.parse(JSON.stringify(info.content)));
        templateTitleArr.forEach((data: any) => {
            text += '| ' + data.value;
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