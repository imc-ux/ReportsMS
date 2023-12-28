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
    let text: string = '| 区分 ';
    if (info && info.templateTitle) {
        let templateTitleArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        let contentArr = JSON.parse(JSON.parse(JSON.stringify(info.content)));
        for (let i = 0; i < templateTitleArr.length; i++) {
            text += '| ' + templateTitleArr[i].value;
        }
        text += '| \n | :---:';
        for (let j = 0; j < templateTitleArr.length; j++) {
            text += '| -'
        }
        text += '|\n';
        for (let z = 0; z < contentArr.length; z++) {
            for (let y = 0; y < contentArr[z].list.length; y++) {
                if (y === 0) {
                    text += '| ' + contentArr[z].type;
                } else {
                    text += '| ';
                }
                let list = contentArr[z].list[y];
                for (let x = 0; x < list.length; x++) {
                    text += '| ' + list[x];
                }
                text += '|\n';
            }
        }
    }
    return text;
}
</script>

<template>
    <MdPreview :modelValue="templateTable(props.templeteAr)" />
</template>