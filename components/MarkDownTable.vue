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
        let templateTitleArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        let elementArr = JSON.parse(JSON.parse(JSON.stringify(info.templateElement)));
        let contentArr = JSON.parse(JSON.parse(JSON.stringify(info.content)));
        for (let i = 0; i < templateTitleArr.length; i++) {
            text += '| ' + templateTitleArr[i].value;
        }
        text += '| \n | :---:';
        for (let j = 0; j < templateTitleArr.length; j++) {
            text += '| -'
        }
        text += '|\n';
        if (contentArr && contentArr.length > 0) {
            for (let z = 0; z < contentArr.length; z++) {
                for (let y = 0; y < contentArr[z].list.length; y++) {
                    if (y === 0) {
                        text += '| ' + contentArr[z].type;
                    } else {
                        text += '| ';
                    }
                    let list = contentArr[z].list[y];
                    for (let x = 0; x < list.length; x++) {
                        text += '| ' + String(list[x]).replaceAll('\n', '<br>');
                    }
                    text += '|\n';
                }
            }
        } else {
            for (let f = 0; f < elementArr.length; f++) {
                text += '| ' + elementArr[f].value;
                for (let l = 0; l < templateTitleArr.length; l++) {
                    text += '| ';
                }
                text += '|\n';
            }
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