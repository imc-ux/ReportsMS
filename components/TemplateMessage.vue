<script lang="ts" setup>

interface Props {
    templeteAr?: any;
    isShowName?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    templeteAr: {},
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

function handleCaleObjectDesc(data: string) {
    let ac: any[] = [];
    let datas = data.split('\n');
    datas.forEach(e => {
        if (e) {
            ac.push(e);
        }
    })
    return ac;
}


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
        <span v-show="isShowName" class="span_full_width_style">{{ showName(props.templeteAr) }}</span>
        <span v-show="isShowName" style="height: 2px;"></span>
        <div class="table">
            <table>
                <tr>
                    <td v-for="item in templateTitle(props.templeteAr)">{{ item.value }}</td>
                </tr>
                <template v-for="item in templateTable(props.templeteAr)">
                    <tr v-if="item.code0" class="border-one">
                        <td v-for="(items, index) in templateTitle(props.templeteAr)">
                            <p className='nowrap' v-for="(e, i) in handleCaleObjectDesc(item['code' + index])">{{ e }}
                            </p>
                        </td>
                    </tr>
                    <tr v-else="!item.code0" class="border-two">
                        <td v-for="(items, index) in templateTitle(props.templeteAr) ">
                            <p className='nowrap' v-for="(e, i) in handleCaleObjectDesc(item['code' + index])">{{ e }}
                            </p>
                        </td>
                    </tr>
                </template>
            </table>
        </div>
    </view>
</template>

<style scoped>
.span_full_width_style {
    width: 100%;
    padding-left: 1.25rem;
    color: var(--iux-theme-font-color);
}

.nowrap {
    width: 100%;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 0.3125rem;
}

.border-one {
    border-top: var(--iux-agGrid-border);
}

/*
.border-two {
    border-top: 1px solid #e6e6e6;
}
    */

.table {
    margin: 0rem 1.25rem;
    width: auto;
    background-color: var(--iux-agGrid-background-color);
    color: var(--iux-theme-font-color);
}

.table table {
    border-left: var(--iux-agGrid-border);
    border-top: var(--iux-agGrid-border);
    border-right: var(--iux-agGrid-border);
    border-bottom: var(--iux-agGrid-border);
    /* 设置边缘间距0 */
    border-spacing: 0;
    table-layout: fixed;
    /* 用于表格属性,表示表格的两边框合并为一条 */
    border-collapse: collapse;
}

.table table tr {
    height: 2.375rem;
}

.table table td {
    font-size: 0.75rem;
    border-right: var(--iux-agGrid-border);
}

.table table tr td:first-child {
    background-color: var(--iux-table-Tr-Td_first-child);
    width: 5.75rem;
    text-align: left;
    word-break: break-all;
    padding-left: 0.3125rem;
}

.table table tr:nth-child(1) td:nth-child(1) {
    background-color: var(--iux-agGrid-header-bg-color);
    text-align: center;
}

.table table tr:first-child {
    background-color: var(--iux-agGrid-header-bg-color);
    font-weight: bold;
    text-align: center;
    color: var(--iux-theme-font-color);
    font-weight: 400;
}

.table table tr:nth-child(1) td {
    font-size: medium;
}

.table table tr td:nth-child(2) {
    width: 9.375rem;
    padding-left: 0.3125rem;
    word-break: break-all;
}

.table table tr td:nth-child(3) {
    width: 30rem;
    padding-left: 0.3125rem;
    word-break: break-all;
}
</style>