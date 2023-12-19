<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { ElInput, ElText, ElTable, ElTableColumn, ElButton } from 'element-plus';
import { Search } from "@element-plus/icons-vue";
import { TemplateInfo } from "~/vo";
import { CommonAlert } from '~/constant/alert/base';
import { ShowAlert } from '~/components/alert';
import { getUserList } from '~/api/messageApi';
import { getTemplateList, deleteTemplate } from '~/api/templateApi';

const router = useRouter();
const title = ref<string>('');
const templateData = reactive<any[]>([{  //这种写死的都是模拟数据 测ui的时候用一下 不是正式代码 之后删除
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
  }]);

  const getTempList = async () => {
  try {
    const info: TemplateInfo = {};
    info.name = title.value;
    await getTemplateList(info);
  } catch (error) {
    //console.log(error);
  }
};


function onBtnSearchClickHandler() {
  // title.value
  getTempList()
}

function onBtnAddClickHandler() {
  router.push({path: '/template/detail'})
}

function onBtnEditClickHandler(index: number, row: any) {
  const json = "[{\"value\":\"1\",\"type\":\"input\"},{\"value\":\"2\",\"type\":\"input\"},{\"value\":\"3\",\"type\":\"input\"}]"
  const jsons = "[{\"value\":\"1\",\"type\":\"input\"},{\"value\":\"2\",\"type\":\"input\"},{\"value\":\"3\",\"type\":\"input\"},{\"value\":\"4\",\"type\":\"input\"}]"
  router.push({ path: '/template/detail', query: { name: '日报模板', title: json, element: jsons } })
}

function onBtnDeleteClickHandler() {
  ShowAlert(CommonAlert.DELETE_DATA_SUCCESS, 0)
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
.split-line-top {
  border-top: 1px solid #cacaca;
  text-align: right;
}

.main-search-input {
  display: inline-block;
  width: 20%;
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
</style>
