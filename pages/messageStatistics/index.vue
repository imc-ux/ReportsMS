<script lang="ts" setup>
import { reactive, ref, provide } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import { ElTabs, ElTabPane, ElDatePicker, ElTable, ElTableColumn, ElLink } from 'element-plus';
import { getTemplateList, getUserTemplateList } from '@/api/messageStaticsApi';
import { useState, useRouter } from 'nuxt/app';
import { onMounted } from 'vue';
import { format, subDays } from "date-fns";
import { TemplateHistory } from '@/vo';
import {
    ChartComponent as EjsChart,
    SeriesCollectionDirective as ESeriesCollection,
    SeriesDirective as ESeries,
    Legend,
    LineSeries,
    Category,
    Tooltip,
} from '@syncfusion/ej2-vue-charts';
import { setWaiting, removeWaiting } from '@/utils/loadingUtil';
import TemplateMessage from '@/components/TemplateMessage.vue';
import Storage from '@/utils/Storage';

const router = useRouter();
const fitFlag = ref<boolean>(false);
const legendSettings = ref<any>({ visible: false });
const tabReportName = ref<string>('');
const tableDivWidth = ref<string>('width: 0px');
const chartDivWidth = ref<string>('0px');
const tableCode = ref<string>('A');
const timeCode = ref<number>(7);
const dateValue = ref<any>([subDays(new Date, 6), new Date()]);
const tableList = reactive<any[]>([{ name: '消息发送人数', code: 'A' }, { name: '消息发送次数', code: 'B' }, { name: '人均发送次数', code: 'C' }]);
const timeList = reactive<any[]>([{ name: '1日', code: 1 }, { name: '7日', code: 7 }, { name: '14日', code: 14 }, { name: '30日', code: 30 }]);
const templateList = ref<any[]>([]);
const tableMessageData = ref<any[]>([]);
const titleNames = ref<any[]>([]);
const seriesColumnsData = ref<any[]>([]);
const primaryXAxis = ref<any>({ valueType: 'Category', interval: 1 });
const tooltip = ref<any>({
    enable: true,
    format: "${point.x} : <b>${point.y}</b>"
});
const marker = ref<any>({ visible: true, width: 10, height: 10, shape: 'Diamond' });
const messageUserCount = ref<number>(0);
const messageCount = ref<number>(0);
const messagePerCount = ref<any>(0);
const showPage = ref<any>(true);
const templateMarkData = ref<any[]>([]);

provide('chart', [Category, Legend, Tooltip, LineSeries]);

onMounted(() => {
    let currentTheme = Storage.getLocalItem("svelte-theme") ?? "ux-green-light";
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    window.addEventListener("message", themeChangeHandler, false);
    templateSearchList();
});

function themeChangeHandler(e: MessageEvent) {
    if (e.data.type === "theme-changed") {
        document.documentElement.setAttribute("data-bs-theme", e.data.data);
    }
}

const templateSearchList = async () => {
    try {
        const info: any = {};
        const res: any = await getTemplateList(info);
        let result = JSON.parse(res.data.value);
        setWaiting();
        if (!result.error) {
            removeWaiting();
            templateList.value = result.data;
            if (result.data?.length > 0) {
                tabReportName.value = result.data[0].nid;
            }
        }
    } catch (error) {

    }
}

const searchInfo = async () => {
    try {
        const info: TemplateHistory = {};
        if (dateValue.value) {
            info.dateFrom = format(dateValue.value[0], "yyyy-MM-dd");
            info.dateTo = format(dateValue.value[1], "yyyy-MM-dd");
        }
        info.content = '';
        info.userId = '';
        info.templateId = (Number)(tabReportName.value);
        info.iPageCount = 100000;
        info.isDelete = 'N';
        info.iStart = 0;
        setWaiting();
        const res: any = await getUserTemplateList(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            removeWaiting();
            let times: string[] = [];
            let userMap: Map<string, any> = new Map<string, any>();
            let mapTimes: Map<string, any> = new Map<string, any>();
            let mapUserTimes: Map<string, any> = new Map<string, any>();
            result.data?.forEach((elem: any) => {
                elem.createDate = formatDate(elem.createTime);
                if (elem.userId) {
                    let key: string = elem.createDate;
                    let userIDKey: string = elem.userId;
                    let keyUser: string = elem.userId + '@' + elem.createDate;
                    if (!userMap.get(userIDKey)) {
                        let userInfo: any = {};
                        userInfo.code = elem.userId;
                        userInfo.name = elem.userName;
                        userMap.set(userIDKey, userInfo);
                    }
                    if (!mapTimes.get(key)) {
                        times.push(key);
                        let info: any = {};
                        info.createDate = key;
                        info.contents = [elem];
                        mapTimes.set(key, info);
                    } else {
                        mapTimes.get(key)?.contents.push(elem);
                    }
                    if (!mapUserTimes.get(keyUser)) {
                        let userInfo: any = {};
                        userInfo.createDate = elem.createDate;
                        userInfo.userId = elem.userId;
                        userInfo.contents = [elem];
                        mapUserTimes.set(keyUser, userInfo);
                    } else {
                        mapUserTimes.get(keyUser)?.contents.push(elem);
                    }
                }
            });
            let titles: any[] = [];
            times?.forEach((elem: any, index: number) => {
                let timeInfo: any = {};
                timeInfo.name = elem;
                timeInfo.code = 'time' + index;
                titles.push(timeInfo);
            })
            titles.sort(compare('name'));
            titleNames.value = titles;
            let tables: any[] = [];
            userMap?.forEach((elem: any) => {
                let tableInfo: any = {};
                tableInfo.userId = elem.code;
                tableInfo.userName = elem.name;
                titles?.forEach((info: any) => {
                    let key = elem.code + '@' + info.name;
                    if (mapUserTimes.get(key)) {
                        tableInfo[info.code] = mapUserTimes.get(key)?.contents?.length;
                    } else {
                        tableInfo[info.code] = 0;
                    }
                    tableInfo[info.code + 'contents'] = mapUserTimes.get(key)?.contents;
                })
                tables.push(tableInfo);
            })
            let tableTwoInfo: any = {};
            tableTwoInfo.userId = '';
            tableTwoInfo.userName = 'total';
            let messageTotal: number = 0;
            titles?.forEach((info: any) => {
                let key = info.name;
                if (mapTimes.get(key)) {
                    tableTwoInfo[info.code] = mapTimes.get(key)?.contents?.length;
                    messageTotal += mapTimes.get(key)?.contents?.length;
                } else {
                    tableTwoInfo[info.code] = 0;
                }
                tableTwoInfo[info.code + 'contents'] = mapTimes.get(key)?.contents;
            })
            tables.push(tableTwoInfo);
            //表格数据以及图表宽度
            tableMessageData.value = tables;
            tableDivWidth.value = 'width:' + (titles.length + 1) * 160 + 'px';
            //图表数据解析
            let chartDatas: any[] = [];
            titles.forEach((elem: any, index: number) => {
                let chartInfo: any = {};
                chartInfo.name = elem.name;
                let userIds: string[] = [];
                let userIdsMap: Map<string, any> = new Map<string, any>();
                if (mapTimes.get(elem.name)?.contents?.length > 0) {
                    mapTimes.get(elem.name)?.contents.forEach((info: any) => {
                        if (!userIdsMap.get(info.userId)) {
                            userIds.push(info.userId);
                            userIdsMap.set(info.userId, info.userId);
                        }
                    })
                }
                let total: number = mapTimes.get(elem.name)?.contents?.length ?? 0;
                let userCount: number = userIds.length ?? 0;
                chartInfo.y1Name = total;
                chartInfo.y2Name = userCount;
                chartInfo.y3Name = (total / userCount).toFixed(1);
                chartDatas.push(chartInfo);
            });
            seriesColumnsData.value = chartDatas;
            //图表宽度
            chartDivWidth.value = (titles.length + 1) * 160 + 'px';
            //消息发送人数
            messageUserCount.value = userMap.size;
            //消息发送次数
            messageCount.value = messageTotal;
            //人均发送次数
            messagePerCount.value = userMap.size !== 0 ? (messageTotal / userMap.size).toFixed(1) : 0;
        }
    } catch (error) {

    }
}

//时间段排序升序 sort true 升序 false 降序
function compare(prop: string, sort: boolean = true) {
    return function (obj1: any, obj2: any) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return sort ? -1 : 1;
        } else if (val1 > val2) {
            return sort ? 1 : -1;
        } else {
            return 0;
        }
    }
}

function formatDate(str: string) {
    return str.substring(0, 10);
}

function onBtnTabDateChangeClickHandler(tab: TabsPaneContext) {
    let daySub = tab.props.name as number;
    dateValue.value = [subDays(new Date, daySub - 1), new Date()];
}

function onSearchHandlerClick() {
    searchInfo();
}

function onResetHandlerClick() {
    if (templateList.value?.length > 0) {
        tabReportName.value = templateList.value[0].nid;
    } else {
        tabReportName.value = '';
    }
    timeCode.value = 1;
    dateValue.value = [new Date(), new Date()];
    tableCode.value = 'A';
}

function onTabelDetailHandler(row: any, field: string) {
    templateMarkData.value = row[field + 'contents'];
    showPage.value = false;
}

function onReturnClickHandler() {
    showPage.value = true;
}

function onMessageHandler() {
    router.push({ path: '/messageMain' });
}

</script>

<template>
    <client-only>
        <div v-show="showPage" class="box-top">
            <div class="box-display">
                <span class="font-size-x-large">消息管理统计</span>
            </div>
            <div class="box-display-height-50">
                <div class="box-display-grow_border">
                    <div class="box-display-grow_item">
                        <span class="font-size-title-large">消息发送人数</span>
                    </div>
                    <div class="box-display-grow_item">
                        <span class="font-size-large-x">{{ messageUserCount }}</span>
                    </div>
                </div>
                <div class="box-display-grow_border">
                    <div class="box-display-grow_item">
                        <span class="font-size-title-large">消息发送次数</span>
                    </div>
                    <div class="box-display-grow_item">
                        <span class="font-size-large-x">{{ messageCount }}</span>
                    </div>
                </div>
                <div class="box-display-grow_height">
                    <div class="box-display-grow_item">
                        <span class="font-size-title-large">人均发送次数</span>
                    </div>
                    <div class="box-display-grow_item">
                        <span class="font-size-large-x">{{ messagePerCount }}</span>
                    </div>
                </div>
            </div>
            <div class="tabs_flex_direction">
                <div class="tabs_flex">
                    <span class="span_border" type="border-card">关键指标详解</span>
                    <el-tabs v-model="tableCode" type="card">
                        <el-tab-pane v-for="item in tableList" :key="item.code" :label="item.name" :name="item.code" />
                    </el-tabs>
                </div>
                <div class="box-display_border">
                    <span class="span_width">时间</span>
                    <div class="tabs_flex_two">
                        <el-tabs v-model="timeCode" type="card" @tab-click="onBtnTabDateChangeClickHandler">
                            <el-tab-pane v-for="item in timeList" :key="item.code" :label="item.name"
                                :name="item.code" />
                        </el-tabs>
                    </div>
                    <div class="box-width-380">
                        <el-date-picker v-model="dateValue" size="large" type="daterange" range-separator="至">
                        </el-date-picker>
                    </div>
                    <div class="tabs_flex_two">
                        <el-tabs v-model="tabReportName" type="card">
                            <el-tab-pane v-for="item in templateList" :key="item.nid" :label="item.name"
                                :name="item.nid" />
                        </el-tabs>
                    </div>
                </div>
                <div class="display-full-width">
                    <div class="justify-flex">
                        <Button class='btn-icon' @click="onMessageHandler">消息管理</Button>
                    </div>
                    <div class="justify-flex-end">
                        <Button class='btn-icon' @click="onSearchHandlerClick">Search</Button>
                        <Button class='btn-icon marginLeft' @click="onResetHandlerClick">Reset</Button>
                    </div>
                </div>
                <div v-if="tableMessageData.length > 1" class="full-width-padding-10">
                    <div v-if="tableMessageData.length > 1" :style="tableDivWidth">
                        <ejs-chart :width='chartDivWidth' height='300' :primaryXAxis="primaryXAxis" :tooltip="tooltip"
                            :legendSettings="legendSettings">
                            <e-series-collection>
                                <e-series v-if="tableCode === 'A'" :dataSource="seriesColumnsData" type="Line"
                                    xName="name" yName="y1Name" :marker="marker"></e-series>
                                <e-series v-if="tableCode === 'B'" :dataSource="seriesColumnsData" type="Line"
                                    xName="name" yName="y2Name" :marker="marker"></e-series>
                                <e-series v-if="tableCode === 'C'" :dataSource="seriesColumnsData" type="Line"
                                    xName="name" yName="y3Name" :marker="marker"></e-series>
                            </e-series-collection>
                        </ejs-chart>
                        <el-table :data="tableMessageData" border :fit='fitFlag'>
                            <el-table-column header-align="center" align="center" prop="userName" label="发送人"
                                width="160" />
                            <el-table-column v-for="item in titleNames" header-align="center" align="center"
                                :prop="item.code" :label="item.name" width="160">
                                <template #default="scope">
                                    <el-link v-if="scope.row[item.code] > 0" class="font-size-12" href="#"
                                        type="primary" @click="onTabelDetailHandler(scope.row, item.code)">{{
            scope.row[item.code]
        }}</el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="!showPage" class="width-min">
            <div class="box-display">
                <span class="font-size-x-large">消息管理统计详细</span>
            </div>
            <div class="justify-flex-end_bottom">
                <Button class='btn-icon' @click="onReturnClickHandler">返回</Button>
            </div>
            <div height="100%" class="tabs_flex_direction">
                <TemplateMessage v-for="item in templateMarkData" :templeteAr="item" :isShowName=true />
            </div>
        </div>
    </client-only>
</template>

<style>
.box-top {
    width: 100%;
    min-width: 79.1875rem
}

.box-display {
    display: flex;
    margin-top: 0.3125rem;
    margin-bottom: 0.3125rem;
    width: 100%
}

.font-size-x-large {
    font-size: x-large;
    color: var(--iux-theme-font-color);
}

.font-size-title-large {
    font-size: 1.125rem;
    color: var(--iux-theme-font-color);
}

.font-size-large-x {
    font-size: 0.875rem;
    color: var(--iux-theme-font-color);
}

.box-display-height-50 {
    display: flex;
    height: 3.125rem;
    border: var(--iux-agGrid-border);
    align-items: center;
    margin-bottom: 0.3125rem;
}

.box-display-grow_border {
    display: flex;
    flex-grow: 1;
    border-right: var(--iux-agGrid-border);
    height: 3.125rem;
    flex-direction: column;
}

.box-display-grow_height {
    display: flex;
    flex-grow: 1;
    height: 3.125rem;
    flex-direction: column;
}

.box-display-grow_item {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
}

.header {
    display: flex;
    height: 1.25rem;
    position: relative;
}

.tabs_flex {
    display: flex;
}

.tabs_flex_direction {
    display: flex;
    flex-direction: column;
    border: var(--iux-agGrid-border);
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
}

.span_border {
    display: flex;
    font-size: 0.875rem;
    height: 2.5rem;
    border-top: var(--iux-agGrid-border);
    align-items: center;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    color: var(--iux-theme-font-color);
}

.box-display_border {
    display: flex;
    width: 100%;
    height: 2.8125rem;
    border-top: var(--iux-agGrid-border);
    border-bottom: var(--iux-agGrid-border);
    align-items: center;
}

.span_width {
    width: 3.125rem;
    font-size: 0.875rem;
    text-align: center;
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    color: var(--iux-theme-font-color);
}

.tabs_flex_two {
    display: flex;
    border-bottom: var(--iux-agGrid-border);
}

.box-width-380 {
    width: 23.75rem;
    padding-left: 1px;
}

.margin-left {
    margin-left: 0.3125rem;
}

.display-full-width {
    display: flex;
    width: 100%
}

.justify-flex {
    justify-content: flex-start;
    display: flex;
    flex-grow: 1;
    padding-left: 1px;
}

.justify-flex-end {
    justify-content: flex-end;
    display: flex;
    padding-right: 1px;
}

.font-size-12 {
    font-size: 0.75rem;
}

.justify-flex-end_bottom {
    justify-content: flex-end;
    display: flex;
    padding-bottom: 0.3125rem;
}

.full-width-padding-10 {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.625rem;
}
</style>
