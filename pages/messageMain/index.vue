<script lang="ts" setup>
import { ElDatePicker, ElSelect, ElOption, ElInput, ElButton, ElTable, ElTableColumn } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import { useState } from 'nuxt/app';
import { getUserList } from '~/api/messageApi';
import { json } from 'stream/consumers';

const clearable = ref<boolean>(true);
const dateValue = useState<any>('dateValue', () => '');
const selectedModel = useState<string>('selectedModel', () => '');
const selectedUser = useState<string>('selectedUser', () => '');
const inputMessage = useState<string>('inputMessage', () => '');
const tableData = useState<any>('tableData', () => null);
const modelTypes = reactive<any[]>([{
    value: 'a',
    label: '日报模板',
},
{
    value: 'b',
    label: '周报模板',
}])

const userNames = useState<any[]>('userNames', () => []);

const userList = async () => {
    try {
        const info: any = {};
        info.blockflag = "N";
        info.usertype = "U";
        info.iStart = 0;
        info.iPageCount = 20;
        const res: any = await getUserList(info);
        let result = JSON.parse(res.data.value);
        if (!result.error) {
            userNames.value = result.data;
        }
    } catch (error) {

    }
};




onMounted(() => {
    userList();
});

function onSearchHandlerClick() {

}

function onResetHandlerClick() {
    dateValue.value = ''
    selectedModel.value = '';
    selectedUser.value = ''
    inputMessage.value = '';
}

function onNewMessageHandler() {

}

</script>
<template>
    <client-only>
        <div style="width:100%">
            <div style="display: flex; height: 40px; border: 1px solid #cacaca; padding-top: 10px;">
                <div style="display: flex;width: 480px;">
                    <div style="width:80px;margin-left: 5px;">
                        <span>发送时间</span>
                    </div>
                    <div style="width:380px;">
                        <el-date-picker v-model="dateValue" type="daterange" range-separator="~">
                        </el-date-picker>
                    </div>
                </div>
                <div style="display: flex;flex-grow: 1;">
                    <div style="width:80px;margin-left: 5px;">
                        <span>模板类型</span>
                    </div>
                    <div style="margin-left: 5px;margin-right: 5px;flex-grow: 1;">
                        <el-select v-model="selectedModel" placeholder="请选择" :clearable="clearable">
                            <el-option v-for="item in modelTypes" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div style="display: flex;flex-grow: 1;">
                    <div style="width:64px;margin-left: 20px;">
                        <span>发送人</span>
                    </div>
                    <div style="margin-left: 5px;margin-right: 5px;flex-grow: 1;">
                        <el-select v-model="selectedUser" placeholder="请选择" :clearable="clearable">
                            <el-option v-for="item in userNames" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div style="display: flex;flex-grow: 1;">
                    <div style="width:100px;margin-left: 20px;">
                        <span>发送内容</span>
                    </div>
                    <div class="main-input" style="margin-left: 5px;margin-right: 5px;">
                        <el-input v-model="inputMessage" placeholder="请输入内容"></el-input>
                    </div>
                </div>
            </div>
        </div>
        <div style="display: flex;margin-top: 5px;width: 100%">
            <div style="justify-content: flex-start; display: flex; flex-grow: 1">
                <el-button type="primary" @click="onNewMessageHandler">新增消息</el-button>
            </div>
            <div style="justify-content: flex-end;display: flex;">
                <el-button type="primary" @click="onSearchHandlerClick">Search</el-button>
                <el-button type="primary" style="margin-left:5px;" @click="onResetHandlerClick">Reset</el-button>
            </div>
        </div>
    </client-only>
    <div style="margin-top: 5px">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column header-align="center" align="center" prop="date" label="模板类型" />
            <el-table-column header-align="center" align="center" prop="name" label="发送人" />
            <el-table-column header-align="center" align="center" prop="province" label="发送时间" />
            <el-table-column header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">详细</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style>
.main-input {
    display: inline-block;
    width: 85%;
}

.el-select {
    width: 100%;
}
</style>
