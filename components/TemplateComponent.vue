<script lang="ts" setup>

interface Props {
    templeteAr?: any;
}

const props = withDefaults(defineProps<Props>(), {
    templeteAr: {},
});

function templateTitle(info: any) {
    if (info && info.templateTitle) {
        let tempArr = JSON.parse(JSON.parse(JSON.stringify(info.templateTitle)));
        let infos: any[] = [{ value: '区分', code0: '' }];
        for (let i = 0; i < tempArr.length; i++) {
            let info: any = {};
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

<style scoped>
.content {
    display: flex;
    flex-direction: column;
}

.table {
    margin: 0px 10px;
    width: auto;
    text-align: center;
    background-color: white;
}

.table table {
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    /* 设置边缘间距0 */
    border-spacing: 0;
    table-layout: fixed;
    /* 用于表格属性, 表示表格的两边框合并为一条 */
    border-collapse: collapse;
}

.table table td {
    border-left: 1px solid #000;
    border-top: 1px solid #000;
    font-size: 12px;
    border-right: 1px solid #000;
}

.table table tr td {
    width: 450px;
    word-break: break-all;
    padding-left: 2px;
}

.table table tr td:first-child {
    background-color: rgb(218, 238, 243);
    width: 200px;
    font-weight: bold;
    text-align: center;
    word-break: break-all;
}

.table table tr td:nth-child(2) {
    width: 200px;
    word-break: break-all;
}

.table table tr:nth-child(1) td:nth-child(1) {
    background-color: rgb(49, 134, 155);
    font-weight: bold;
}

.table table tr:first-child {
    background-color: rgb(49, 134, 155);
    font-weight: bold;
    text-align: center;
}

.table table tr:not(first-child) {
    text-align: left;
}
</style>