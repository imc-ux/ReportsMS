<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'nuxt/app';
import { ElInput, ElText, ElTable, ElTableColumn, ElButton } from 'element-plus';
import { Search } from "@element-plus/icons-vue";
import { TemplateInfo } from "@/vo";
import { CommonAlert } from '@/constant/alert/base';
import { ShowAlert } from '@/components/alert';
import { getTemplateList, deleteTemplate } from '@/api/templateApi';
import { setWaiting, removeWaiting } from '@/utils/loadingUtil';

const router = useRouter();
const title = ref<string>('');
const deleteId = ref<number>(0);
const templateData = reactive<TemplateInfo[]>([]);

const getTempList = async () => {
  try {
    const info: TemplateInfo = {};
    info.name = title.value;
    setWaiting();
    const res: any = await getTemplateList(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      templateData.length = 0;
      result.data.forEach((element: any, index: number) => {
        element.key = index + 1;
      })
      removeWaiting();
      templateData.push(...result.data);
    }
  } catch (error) {
  }
};

const deleteTempList = async () => {
  try {
    const info: TemplateInfo = {};
    info.nid = deleteId.value;
    setWaiting();
    const res: any = await deleteTemplate(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      removeWaiting();
      ShowAlert(CommonAlert.DELETE_DATA_SUCCESS, 0, () => onBtnSearchClickHandler())
    }
  } catch (error) {
  }
};

onMounted(() => {
  getTempList();
})

function onBtnSearchClickHandler() {
  getTempList();
}

function onBtnAddClickHandler() {
  router.push({ path: '/template/detail' })
}

function onBtnEditClickHandler(row: TemplateInfo) {
  router.push({ path: '/template/detail', query: row })
}

function onBtnDeleteClickHandler(row: TemplateInfo) {
  deleteId.value = row.nid as number;
  ShowAlert(CommonAlert.WHETHER_DELETE_TEMP, 2, () => deleteTempList())
}

</script>
<template>
  <client-only>
    <div>
      <div class="page-name">
        <span>模板管理</span>
      </div>
      <div class="search-condition">
        <div class="main-title-text">
          <el-text>标题</el-text>
        </div>
        <div class="main-search-input">
          <el-input v-model="title" />
        </div>
        <Button class='search-btn' :btnIcon="Search" @click="onBtnSearchClickHandler"></Button>
      </div>
    </div>
    <div class="split-line-top">
      <div class="right-btn">
        <Button class='btn-icon' @click="onBtnAddClickHandler">创建模板</Button>
      </div>
    </div>
    <div>
      <el-table :data="templateData" style="width: 100%" border>
        <el-table-column header-align="center" align="center" prop="key" label="序号" min-width="50" />
        <el-table-column header-align="center" align="center" prop="name" label="模板标题" min-width="200" />
        <el-table-column header-align="center" align="center" prop="creatorName" label="创建者" min-width="100" />
        <el-table-column header-align="center" align="center" prop="createTime" label="创建时间" min-width="120" />
        <el-table-column header-align="center" align="center" label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="primary" @click="onBtnEditClickHandler(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="onBtnDeleteClickHandler(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </client-only>
</template>

<style>
  .page-name {
    display: flex;
    margin-top: 0.3125rem;
    margin-bottom: 0.3125rem;
    width: 100%;
  }

  .page-name>span {
    font-size: x-large;
  }

  .main-title-text {
    color: #000;
    font-size: 1rem;
    font-weight: 600;
    font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif, "微软雅黑";
    margin-left: 0.625rem;
    width: 2.5rem;
    height: 1.875rem;
    line-height: 1.875rem;
    display: inline-block;
  }

  .main-search-input {
    display: inline-block;
    width: 20%;
  }

  .right-btn {
    display: inline-block;
  }

  .search-condition {
    display: flex; 
    height: 2.5rem; 
    border: 0.0625rem solid #cacaca; 
    padding-top: 0.625rem;
  }

  .search-btn {
    width: 2rem;
    height: 2rem;
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 0.625rem;
  }

  .search-btn:hover {
    width: 2rem;
    height: 2rem;
    margin-top: 0rem;
    margin-bottom: 0rem;
    margin-left: 0.625rem;
  }

  .search-btn>span>i {
    margin-left: 0rem;
  }
</style>