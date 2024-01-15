<script lang="ts" setup>
import { ElDatePicker, ElSelect, ElOption, ElInput, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, useState } from 'nuxt/app';
import { getUserList, getTemplateList, getUserTemplateList, deleteUserTemplate } from '@/api/messageApi';
import { TemplateHistory } from '@/vo';
import { ShowAlert } from '@/components/alert';
import { CommonAlert } from '@/constant/alert/base';
import MarkDownTable from '@/components/MarkDownTable.vue';
import { format } from "date-fns";
import { setWaiting, removeWaiting } from '@/utils/loadingUtil';

const router = useRouter();
const route = useRoute();
const clearable = ref<boolean>(true);
const dateValue = useState<any>('dateValue', () => '');
const selectedModel = useState<string>('selectedModel', () => '');
const selectedUser = useState<string>('selectedUser', () => '');
const selectDeleteNid = useState<string>('selectDeleteNid', () => '');
const inputMessage = useState<string>('inputMessage', () => '');
const tableData = useState<any>('tableData', () => []);
const modelTypes = useState<any[]>('modelTypes', () => []);
const userNames = useState<any[]>('userNames', () => []);
const iPageCount = 20;
const iPage = useState<number>('iPage', () => 1);
const totalCount = useState<number>('totalCount', () => 0);
const templateData = useState<any>('templateData', () => { });
const showIndex = useState<any>('showIndex', () => true);
const count = useState<number>('count', () => 0);

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
        info.userId = selectedUser.value;
        if (selectedModel.value) {
            info.templateId = (Number)(selectedModel.value);
        }
        info.iPageCount = iPageCount;
        info.iStart = (iPage.value - 1) * iPageCount;
        const res: any = await getUserTemplateList(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            overCount();
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
    if (route.query?.type === 'search') {
        count.value = 3;
        iPage.value = 1;
        searchInfo();;
    } else {
        count.value = 2;
    }
    userList();
    templateList();
    setWaiting();
});

function deletePageHandler() {
    showIndex.value = true;
    searchInfo();
}

function overCount() {
    count.value--;
    if (count.value === 0) {
        removeWaiting();
    }
}

function onSearchHandlerClick() {
    count.value = 1;
    iPage.value = 1;
    searchInfo();
    setWaiting();
}

function onResetHandlerClick() {
    dateValue.value = ''
    selectedModel.value = '';
    selectedUser.value = ''
    inputMessage.value = '';
}

function onNewMessageHandler() {
    router.push({ path: '/report' });
}

function onTabelDetailHandler(index: number, row: any) {
    templateData.value = row;
    showIndex.value = false;
}

function onReturnClickHandler() {
    showIndex.value = true;
}

function onTabelDeleteHandler(index: number, row: any) {
    selectDeleteNid.value = row.nid;
    ShowAlert(CommonAlert.WHETHER_DELETE_MESSAGE, 2, () => deleteTemplate());
}

function handleCurrentChange(val: number) {
    iPage.value = val;
    searchInfo();
}

function onDeleteTemplateMessageHandler() {
    selectDeleteNid.value = templateData.value.nid
    ShowAlert(CommonAlert.WHETHER_DELETE_MESSAGE, 2, () => deleteTemplate());
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
                    <div class="box-width-380">
                        <el-date-picker v-model="dateValue" type="daterange" range-separator="~">
                        </el-date-picker>
                    </div>
                </div>
                <div class="box-display-grow">
                    <div class="box-width-80">
                        <span>模板类型</span>
                    </div>
                    <div class="box-flex-margin">
                        <el-select v-model="selectedModel" placeholder="请选择" :clearable="clearable">
                            <el-option v-for="item in modelTypes" :key="item.nid" :label="item.name" :value="item.nid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="box-display-grow">
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
            </div>
            <div class="display-full-width">
                <div class="justify-flex">
                    <Button class='btn-icon' @click="onNewMessageHandler">新增消息</Button>
                </div>
                <div class="justify-flex-end">
                    <Button class='btn-icon' @click="onSearchHandlerClick">Search</Button>
                    <Button class='btn-icon' style="margin-left:5px;" @click="onResetHandlerClick">Reset</Button>
                </div>
            </div>
            <div>
                <el-table :data="tableData" border class="width-max" max-height="800">
                    <el-table-column header-align="center" align="center" prop="templateName" label="模板类型" />
                    <el-table-column header-align="center" align="center" prop="userName" label="发送人" />
                    <el-table-column header-align="center" align="center" prop="createTime" label="发送时间" />
                    <el-table-column header-align="center" align="center" label="操作">
                        <template #default="scope">
                            <el-button type="text" size="small"
                                @click="onTabelDetailHandler(scope.$index, scope.row)">详细</el-button>
                            <el-button type="text" size="small"
                                @click="onTabelDeleteHandler(scope.$index, scope.row)">删除</el-button>
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
                <el-button type="primary" @click="onReturnClickHandler">返回</el-button>
                <el-button type="primary" @click="onDeleteTemplateMessageHandler">删除</el-button>
            </div>
            <div height="100%" class="split">
                <MarkDownTable :templeteAr="templateData" />
            </div>
        </div>
    </client-only>
</template>

<style>
.justify-flex-end_bottom {
    justify-content: flex-end;
    display: flex;
    padding-bottom: 5px;
}

.font-size-large {
    font-size: x-large;
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
    border: 1px solid #cacaca;
    align-items: center;
}

.box-width {
    display: flex;
    width: 30rem;
}

.box-width-80 {
    width: 5rem;
    margin-left: 0.3125rem;
    margin-top: 0.25rem;
}

.box-width-380 {
    width: 23.75rem;
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

.box-margin-width-64 {
    width: 4rem;
    margin-left: 1.25rem;
    margin-top: 0.25rem
}

.box-margin-width-100 {
    width: 6.25rem;
    margin-left: 1.25rem;
    margin-top: 0.25rem
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
    min-width: 1267px
}
</style>
