<script lang="ts" setup>

interface Props {
    templeteAr?: any;
}

const props = withDefaults(defineProps<Props>(), {
    templeteAr: {},
});

function templateTitle(info: any) {
    if (info && info.templateTitle) {
        const tempArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        let infos: any[] = [{ value: '区分', code0: '' }];
        for (let i = 0; i < tempArr.length; i++) {
            const info: any = {};
            info.value = tempArr[i].value;
            info.code = 'code' + (i + 1);
            infos.push(info);
        }
        return infos;
    } else {
        return [];
    }
}

function templateTable(info: any) {
    if (info && info.templateTitle) {
        let contentArr = JSON.parse(JSON.parse(JSON.stringify(info.content)));
        let elementArr = JSON.parse(JSON.parse(JSON.stringify(info.templateElement)));
        let titlelength = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle))).length ?? 0;
        let infos: any[] = [];
        for (let i = 0; i < elementArr.length; i++) {
            if (contentArr && contentArr.length > 0) {
                let findInfo = contentArr.find((item: any) => item.type === elementArr[i].value);
                if (findInfo) {
                    let listInfo = findInfo.list;
                    for (let j = 0; j < listInfo.length; j++) {
                        let info: any = {};
                        if (j == 0) {
                            info.code0 = elementArr[i].value
                        } else {
                            info.code0 = '';
                        }
                        for (let z = 0; z < titlelength; z++) {
                            info['code' + (z + 1)] = listInfo[j][z];
                        }
                        infos.push(info);
                    }
                } else {
                    let infoTemp: any = {};
                    infoTemp.code0 = elementArr[i].value;
                    for (let z = 0; z < titlelength; z++) {
                        infoTemp['code' + (z + 1)] = '';
                    }
                    infos.push(infoTemp);
                }
            } else {
                let infoOb: any = {};
                infoOb.code0 = elementArr[i].value;
                for (let z = 0; z < titlelength; z++) {
                    infoOb['code' + (z + 1)] = '';
                }
                infos.push(infoOb);
            }
        }
        return infos;
    } else {
        return [];
    }
}
</script>

<template>
    <view class="content">
        <div class="table">
            <table>
                <tr>
                    <td v-for="item in templateTitle(props.templeteAr)">{{ item.value }}</td>
                </tr>
                <tr v-for="item in templateTable(props.templeteAr)">
                    <td v-for="(items, index) in templateTitle(props.templeteAr)">{{ item['code' + index] }}</td>
                </tr>
            </table>
        </div>
    </view>
</template>
