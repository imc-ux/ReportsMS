<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { ElInput, ElText, ElTable, ElTableColumn, ElButton } from 'element-plus';
import { Search } from "@element-plus/icons-vue";
import { TemplateInfo } from "../../vo";

const router = useRouter()
const title = ref<string>('')
const templateData = reactive<any[]>([{
  key: 1,
  title: '日报模板',
  creator: '康家旗',
  creatTime: '2023-12-07',
},
{
  key: 2,
  title: '周报模板',
  creator: '康家旗',
  creatTime: '2023-12-07',
}])


function onBtnSearchClickHandler() {

}

function onBtnAddClickHandler() {
  router.push({path: '/templateDetail', query: { value: '', key: 0, selected: ['input'] } })
}

function onBtnEditClickHandler(index: number, row: any) {
  console.log(index)
  console.log(row)
  // router.push({ path: '/templateDetail', query: { value: '', key: 0, selected: ['input'] } })
}

function onBtnDeleteClickHandler() {

}

</script>
<template>
  <client-only>
    <div>
      <div class="main-text">
        <el-text>标题</el-text>
      </div>
      <div class="main-search-input">
        <el-input v-model="title" />
      </div>
      <Button class='search-btn' :btnIcon="Search" @click="onBtnSearchClickHandler"></Button>
    </div>
    <div class="split-line-top">
      <div class="right-btn">
        <Button class='btn-icon' @click="onBtnAddClickHandler">创建模板</Button>
        <!-- <NuxtLink :to="{name: 'templateDetail', params: {com: combinations}}"><Button class='btn-icon' @click="onBtnAddClickHandler">创建模板</Button></NuxtLink> -->
      </div>
    </div>
    <div>
      <el-table :data="templateData" style="width: 100%" border>
      <el-table-column header-align="center" align="center" prop="key" label="序号" min-width="50" />
      <el-table-column header-align="center" align="center" prop="title" label="模板标题" min-width="200" />
      <el-table-column header-align="center" align="center" prop="creator" label="创建者" min-width="100" />
      <el-table-column header-align="center" align="center" prop="creatTime" label="创建时间" min-width="120" />
      <el-table-column header-align="center" align="center" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="onBtnEditClickHandler(scope.$index, scope.row)">编辑</el-button>
          <el-button link type="primary" @click="onBtnDeleteClickHandler" >删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </client-only>
</template>

<style>
.main-flex {
  display: flex;
}

.btn-icon > span > i{
  height: 0px;
  width: 0px;
}

.split-line-top {
  border-top: 1px solid #cacaca;
  text-align: right;
}

.main-text {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif, '微软雅黑';
  margin: 10px;
  width: 40px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
}

.main-search-input {
  display: inline-block;
  width: 20%;
}

.el-input {
  --el-input-text-color: #000;
  --el-input-border: #cacaca;
  --el-input-hover-border: #08ADAA;
  --el-input-focus-border: #08ADAA;
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: #cacaca;
  --el-input-border-radius: 0;
  --el-input-bg-color: #fff;
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: #08ADAA;
  --el-input-clear-hover-color: var(--el-text-color-secondary);
  --el-input-focus-border-color: #08ADAA;
  --el-input-width: 100%;
}

.right-btn {
  display: inline-block;
}

.search-btn {
  width: 32px;
  height: 32px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 10px;
}

.search-btn:hover {
  width: 32px;
  height: 32px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 10px;
}

.search-btn > span > i{
  margin-left: 0px;
}

.el-table__body, .el-table__footer, .el-table__header {
  table-layout: fixed;
  border-collapse: separate;
  font-size: 13px;
  font-weight: 400;
}

.el-table {
  --el-table-border-color: #e6e6e6;
  --el-table-border: 1px solid #e6e6e6;
  --el-table-text-color: #161616;
  --el-table-header-text-color: #FFF;
  --el-table-row-hover-bg-color: var(--el-fill-color-light);
  --el-table-current-row-bg-color: var(--el-color-primary-light-9);
  --el-table-header-bg-color: #08ADAA;
  --el-table-fixed-box-shadow: var(--el-box-shadow-light);
  --el-table-bg-color: var(--el-fill-color-blank);
  --el-table-tr-bg-color: var(--el-bg-color);
  --el-table-expanded-cell-bg-color: var(--el-fill-color-blank);
  --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-index: var(--el-index-normal);
}

.el-button--primary.is-link, .el-button--primary.is-plain, .el-button--primary.is-text {
  --el-button-text-color: #08ADAA;
}

.el-button.is-link:hover {
  color: #08ADAA;
}

.el-button.is-link:focus {
  color: #08ADAA;
}
</style>
