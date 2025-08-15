<script lang="ts" setup>
import { ElDatePicker, ElSelect, ElOption, ElInput, ElButton, ElTable, ElTableColumn, ElPagination, ElCheckbox, ElConfigProvider } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, useState } from 'nuxt/app';
import { getUserList, getTemplateList, getUserTemplateList, deleteUserTemplate, getUserActivePermission, updateUserTemplate } from '@/api/messageApi';
import { TemplateHistory } from '@/vo';
import { ShowAlert } from '@/components/alert';
import { CommonAlert } from '@/constant/alert/base';
import { format, subWeeks, addDays } from "date-fns";
import { UserInfo } from "@/utils/Settings";
import { setWaiting, removeWaiting } from '@/utils/loadingUtil';
import { zhCn } from 'element-plus/es/locale';
import TemplateMessage from '@/components/TemplateMessage.vue';
import Storage from '@/utils/Storage';

const router = useRouter();
const route = useRoute();
const clearable = ref<boolean>(true);
const dateValue = ref<any>('');
const selectedModel = ref<string>('');
const selectedUser = ref<string>('');
const selectDeleteNid = ref<string>('');
const inputMessage = ref<string>('');
const tableData = ref<any>([]);
const modelTypes = ref<any[]>([]);
const userNames = ref<any[]>([]);
const iPageCount = 20;
const iPage = ref<number>(1);
const totalCount = ref<number>(0);
const templateData = ref<any>({});
const showIndex = ref<any>(true);
const count = ref<number>(0);
const userPermission = ref<string>('');
const checkedY = ref<boolean>(false);
const checkedN = ref<boolean>(true);
const showDeleteBtn = ref<boolean>(false);
const updateFlag = ref<boolean>(false);
const deleteInfo = ref<any>({});
const autoSearch = ref<boolean>(false);
const templateMessageData = useState<any>('templateMessageData', () => { });

const updatePageTemplate = async () => {
    try {
        const info: TemplateHistory = {};
        info.nid = deleteInfo.value.nid;
        info.isDelete = 'N';
        const res: any = await updateUserTemplate(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            ShowAlert(CommonAlert.RECOVER_DATA_SUCCESS, 0, recoverPageHandler);
        }
    } catch (error) {

    }
}

const updateTemplate = async () => {
    try {
        const info: TemplateHistory = {};
        info.nid = templateData.value.nid;
        info.isDelete = 'N';
        const res: any = await updateUserTemplate(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            templateData.value.isDelete = 'N';
            showDeleteBtn.value = false;
            updateFlag.value = true;
            ShowAlert(CommonAlert.RECOVER_DATA_SUCCESS, 0);
        }
    } catch (error) {

    }
}

const getUserPermission = async () => {
    try {
        const userId = UserInfo.userId;
        const res: any = await getUserActivePermission(userId);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            userPermission.value = result.data;
            if (userPermission.value.indexOf('T_B') >= 0) {
                dateValue.value = [new Date(), new Date()];
            } else {
                dateValue.value = [addDays(subWeeks(new Date(), 1), 1), new Date()];
            }
            overCount();
        }
    } catch (error) {

    }
}

const userList = async () => {
    try {
        const info: any = {};
        info.blockflag = "N";
        info.usertype = "U";
        info.iStart = 0;
        info.iPageCount = iPageCount;
        const res: any = await getUserList(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            overCount();
            userNames.value = result.data;
        }
    } catch (error) {

    }
};

const templateList = async () => {
    try {
        const info: any = {};
        const res: any = await getTemplateList(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            overCount();
            modelTypes.value = result.data;
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
        info.content = inputMessage.value;
        if (userPermission.value.indexOf('T_B') >= 0) {
            info.userId = selectedUser.value;
        } else {
            info.userId = UserInfo.userId;
        }
        if (checkedY.value && checkedN.value) {
            info.isDelete = '';
        } else {
            if (checkedY.value) {
                info.isDelete = 'Y';
            }
            if (checkedN.value) {
                info.isDelete = 'N';
            }
        }
        if (selectedModel.value) {
            info.templateId = (Number)(selectedModel.value);
        }
        info.iPageCount = iPageCount;
        info.iStart = (iPage.value - 1) * iPageCount;
        const res: any = await getUserTemplateList(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            overCount();
            result.data?.forEach((elem: any) => {
                elem.createTimes = elem.createTime?.substring(0, 19);
            })
            tableData.value = result.data;
            if (result.data && result.data.length > 0) {
                totalCount.value = (Number)(result.data[0].totalCount);
            } else {
                totalCount.value = 0;
            }
        }
    } catch (error) {

    }
}

const deleteTemplate = async () => {
    try {
        const info: TemplateHistory = {};
        info.nid = (Number)(selectDeleteNid.value);
        setWaiting();
        const res: any = await deleteUserTemplate(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            removeWaiting();
            ShowAlert(CommonAlert.DELETE_DATA_SUCCESS, 0, deletePageHandler);
        }
    } catch (error) {

    }
}

onMounted(() => {
    let currentTheme = Storage.getLocalItem("svelte-theme") ?? "ux-green-light";
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    window.addEventListener("message", themeChangeHandler, false);
    count.value = 3;
    if (route.query?.type === 'search') {
        autoSearch.value = true;
    }
    userList();
    templateList();
    getUserPermission();
    setWaiting();
});

function themeChangeHandler(e: MessageEvent) {
    if (e.data.type === "theme-changed") {
        document.documentElement.setAttribute("data-bs-theme", e.data.data);
    }
}

function deletePageHandler() {
    showIndex.value = true;
    count.value = 1;
    setWaiting();
    searchInfo();
}

function recoverPageHandler() {
    count.value = 1;
    setWaiting();
    searchInfo();
}

function overCount() {
    count.value--;
    if (count.value === 0) {
        removeWaiting();
        if (autoSearch.value) {
            autoSearch.value = false;
            count.value = 1;
            iPage.value = 1;
            setWaiting();
            searchInfo();
        }
    }
}

function onSearchHandlerClick() {
    count.value = 1;
    iPage.value = 1;
    setWaiting();
    searchInfo();
}

function onResetHandlerClick() {
    if (userPermission.value.indexOf('T_B') >= 0) {
        dateValue.value = [new Date(), new Date()];
    } else {
        dateValue.value = [subWeeks(new Date(), 1), new Date()];
    }
    selectedModel.value = '';
    selectedUser.value = ''
    inputMessage.value = '';
    checkedY.value = false;
    checkedN.value = true;
}

function onNewMessageHandler() {
    router.push({ path: '/report' });
}

function onMessageStatisticsHandler() {
    router.push({ path: '/messageStatistics' });
}

function onTabelDetailHandler(_index: number, row: any) {
    templateData.value = row;
    if (row.isDelete === 'Y') {
        showDeleteBtn.value = true;
    } else {
        showDeleteBtn.value = false;
    }
    showIndex.value = false;
}

function onReturnClickHandler() {
    templateMessageData.value = {};
    if (updateFlag.value) {
        updateFlag.value = false;
        count.value = 1;
        setWaiting();
        searchInfo();
    }
    showIndex.value = true;
}

function onTabelDeleteHandler(index: number, row: any) {
    selectDeleteNid.value = row.nid;
    ShowAlert(CommonAlert.WHETHER_DELETE_MESSAGE, 2, () => deleteTemplate());
}

function onTabelResoreHandler(index: number, row: any) {
    deleteInfo.value = row;
    updatePageTemplate();
}

function handleCurrentChange(val: number) {
    iPage.value = val;
    count.value = 1;
    setWaiting();
    searchInfo();
}

function onDeleteTemplateMessageHandler() {
    selectDeleteNid.value = templateData.value.nid
    ShowAlert(CommonAlert.WHETHER_DELETE_MESSAGE, 2, () => deleteTemplate());
}

function onUpdateTemplateMessageHandler() {
    templateMessageData.value = templateData.value;
    router.push({ path: '/report' });
}

function onTemplateMessageHandler() {
    updateTemplate();
}

function deleteFlagYHandler() {
    if (!checkedN.value && !checkedY.value) {
        checkedY.value = true;
    }
}

function deleteFlagNHandler() {
    if (!checkedN.value && !checkedY.value) {
        checkedN.value = true;
    }
}

function onSelectDateClick() {
    if (Number(selectedModel.value) === 4) {
        dateValue.value = [addDays(subWeeks(new Date(), 1), 1), new Date()];
    } else if (Number(selectedModel.value) === 1) {
        dateValue.value = [new Date(), new Date()];
    }
}

</script>
<template>
    <client-only>
        <div v-show="showIndex" class="box-top">
            <div class="box-display">
                <span class="font-size-large">消息管理</span>
            </div>
            <div class="box-display-item">
                <div class="box-width">
                    <div class="box-width-80">
                        <span>发送时间</span>
                    </div>
                    <div class="box-width-260">
                        <el-config-provider :locale="zhCn">
                            <el-date-picker v-model="dateValue" type="daterange" range-separator="~">
                            </el-date-picker>
                        </el-config-provider>
                    </div>
                </div>
                <div class="box-display-grow">
                    <div class="box-margin-width-100">
                        <span>模板类型</span>
                    </div>
                    <div class="box-flex-margin">
                        <el-select v-model="selectedModel" placeholder="请选择" :clearable="clearable"
                            @change="onSelectDateClick">
                            <el-option v-for="item in modelTypes" :key="item.nid" :label="item.name" :value="item.nid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div v-show="userPermission.indexOf('T_B') >= 0" class="box-display-grow">
                    <div class="box-margin-width-64">
                        <span>发送人</span>
                    </div>
                    <div class="box-flex-margin">
                        <el-select v-model="selectedUser" placeholder="请选择" :clearable="clearable">
                            <el-option v-for="item in userNames" :key="item.nid" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="box-display-grow">
                    <div class="box-margin-width-100">
                        <span>发送内容</span>
                    </div>
                    <div class="main-input margin-left-right">
                        <el-input v-model="inputMessage" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                <div class="box-display-width-210">
                    <div class="box-margin-width-100">
                        <span>删除与否</span>
                    </div>
                    <div class="main-input margin-left-right">
                        <el-checkbox v-model="checkedY" @change="deleteFlagYHandler">Y</el-checkbox>
                        <el-checkbox v-model="checkedN" @change="deleteFlagNHandler">N</el-checkbox>
                    </div>
                </div>
            </div>
            <div class="display-full-width">
                <div class="justify-flex">
                    <Button class='btn-icon' @click="onNewMessageHandler">新增消息</Button>
                    <Button class='btn-icon' @click="onMessageStatisticsHandler">消息统计</Button>
                </div>
                <div class="justify-flex-end">
                    <Button class='btn-icon' @click="onSearchHandlerClick">Search</Button>
                    <Button class='btn-icon marginLeft' @click="onResetHandlerClick">Reset</Button>
                </div>
            </div>
            <div>
                <el-table :data="tableData" border class="width-max" max-height="800">
                    <el-table-column eader-align="center" align="center" prop="templateName" label="模板类型" />
                    <el-table-column header-align="center" align="center" prop="userName" label="发送人" />
                    <el-table-column header-align="center" align="center" prop="createTimes" label="发送时间" />
                    <el-table-column header-align="center" align="center" label="操作">
                        <template #default="scope">
                            <el-button type="text" size="small"
                                @click="onTabelDetailHandler(scope.$index, scope.row)">详细</el-button>
                            <el-button v-if="scope.row.isDelete === 'N'" type="text" size="small"
                                @click="onTabelDeleteHandler(scope.$index, scope.row)">删除</el-button>
                            <el-button v-if="scope.row.isDelete === 'Y'" type="text" size="small"
                                @click="onTabelResoreHandler(scope.$index, scope.row)">恢复</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" label="内容" type="expand">
                        <template #default="scope">
                            <TemplateMessage :templeteAr="scope.row" />
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="totalCount > 0" :page-size="iPageCount" :currentPage="iPage"
                    layout="total, prev, pager, next" :total="totalCount" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
        <div v-show="!showIndex" class="width-min">
            <div class="box-display">
                <span class="font-size-large">消息管理详细</span>
            </div>
            <div class="justify-flex-end_bottom">
                <Button v-show="!showDeleteBtn" class='btn-icon' @click="onUpdateTemplateMessageHandler">编辑</Button>
                <Button v-show="showDeleteBtn" class='btn-icon' @click="onTemplateMessageHandler">恢复</Button>
                <Button class='btn-icon' @click="onDeleteTemplateMessageHandler">删除</Button>
                <Button class='btn-icon' @click="onReturnClickHandler">返回</Button>
            </div>
            <div height="100%" class="split">
                <TemplateMessage :templeteAr="templateData" />
            </div>
        </div>
    </client-only>
</template>

<style>
.justify-flex-end_bottom {
    justify-content: flex-end;
    display: flex;
    padding-bottom: 0.3125rem;
}

.font-size-large {
    font-size: x-large;
    color: var(--iux-theme-font-color);
}

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

.box-display-item {
    display: flex;
    height: 2.5rem;
    border: var(--iux-agGrid-border);
    align-items: center;
}

.box-width {
    display: flex;
    width: 22.5rem;
}

.box-width-80 {
    width: 5rem;
    margin-left: 0.3125rem;
    margin-top: 0.25rem;
    color: var(--iux-theme-font-color);
}

.box-width-260 {
    width: 18rem;
    color: var(--iux-theme-font-color);
}

.box-flex-margin {
    margin-left: 0.3125rem;
    margin-right: 0.3125rem;
    flex-grow: 1;
}

.box-display-grow {
    display: flex;
    flex-grow: 1;
}

.box-display-width-210 {
    display: flex;
    width: 13.75rem;
    color: var(--iux-theme-font-color);
}

.box-margin-width-64 {
    width: 4rem;
    margin-left: 0.31rem;
    margin-top: 0.25rem;
    color: var(--iux-theme-font-color);
}

.box-margin-width-80 {
    width: 5rem;
    margin-left: 0.31rem;
    margin-top: 0.25rem;
    color: var(--iux-theme-font-color);
}

.box-margin-width-100 {
    width: 6.5rem;
    margin-left: 0.31rem;
    margin-top: 0.25rem;
    color: var(--iux-theme-font-color);
}

.margin-left-right {
    margin-left: 0.3125rem;
    margin-right: 0.3125rem;
}

.display-full-width {
    display: flex;
    width: 100%
}

.justify-flex {
    justify-content: flex-start;
    display: flex;
    flex-grow: 1
}

.justify-flex-end {
    justify-content: flex-end;
    display: flex;
}

.width-max {
    width: 100%;
}

.width-min {
    width: 100%;
    min-width: 79.1875rem;
}

.marginLeft {
    margin-left: 0.3125rem;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: var(--iux-checkbox-checked-bg);
    border-color: var(--iux-border-color);
}

.el-checkbox__input.is-checked+.el-checkbox__label {
    color: var(--iux-theme-font-color);
}

.el-select-dropdown__item.hover {
    background-color: var(--iux-theme-disabled-select-color) !important;
}
</style>
