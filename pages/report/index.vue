<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { ElInput, ElText, ElSelect, ElOption, ElTabs, ElTabPane } from 'element-plus';
import { Plus, CloseBold } from "@element-plus/icons-vue";
import { TemplateInfo } from "../../vo";
import { CommonAlert } from '../../constant/alert/base';
import { ShowAlert } from '../../components/alert';
import type { TabsPaneContext } from 'element-plus'

const reportName  = ref<string>('');
const elementsArr = reactive<any[]>([]);
const headersArr = reactive<any[]>([]);






const TemplateList = [{
  nid: 1,
  name: '日报模板',
  title: "[{\"value\":\"项目\",\"type\":\"input\"},{\"value\":\"进行情况\",\"type\":\"input\"}]",
  element: "[{\"value\":\"昨日实际\",\"type\":\"input\"},{\"value\":\"今日计划\",\"type\":\"input\"},{\"value\":\"待办事项\",\"type\":\"input\"}]",
  creator: 'kangjiaqi',
  creatorName: '康家旗',
  }, {
  nid: 2,
  name: '周报模板',
  title: "[{\"value\":\"项目\",\"type\":\"input\"},{\"value\":\"进行情况\",\"type\":\"input\"},{\"value\":\"总进度\",\"type\":\"input\"}]",
  element: "[{\"value\":\"上周计划\",\"type\":\"input\"},{\"value\":\"本周计划\",\"type\":\"input\"},{\"value\":\"下周计划\",\"type\":\"input\"},{\"value\":\"BUGS\",\"type\":\"input\"}]",
  creator: 'kangjiaqi',
  creatorName: '康家旗',
}]

onMounted(() => {
  reportName.value = TemplateList[0].name;
  refreshTemplate(TemplateList[0]);
  console.log(elementsArr)
})

function onBtnSendClickHandler() {
  
}

function onBtnAddLineClickHandler(arr: any[]) {
  arr.push(JSON.parse(JSON.stringify(headersArr)));
}

function onBtnDeleteLineClickHandler(arr: any[], index: number) {
  arr.splice(index, 1);
}

function refreshTemplate(info: any) {
  elementsArr.push(...JSON.parse(info?.element));
  headersArr.push(...JSON.parse(info?.title));
  headersArr.forEach((data) => {
    data.inputValue = '';
    data.type = data.type.split(',');
    data.selectedType = data.type[0];
  })
  elementsArr.forEach(data => {
    data.headersArr = [JSON.parse(JSON.stringify(headersArr))];
  })
}

function onBtnTabChangeClickHandler(tab: TabsPaneContext) {
  elementsArr.length = 0;
  headersArr.length = 0;
  TemplateList.forEach(element => {
    if (element.name === tab.props.label)
      refreshTemplate(element);
  });
}

function onBtnPreviewClickHandler() {
  
}

</script>
<template>
  <client-only>
    <div class="header">
      <div class="tabs">
        <el-tabs
          v-model="reportName"
          type="card"
          @tab-click="onBtnTabChangeClickHandler"
        >
          <el-tab-pane v-for="item in TemplateList" :key="item.nid" :label="item.name" :name="item.name"/>
        </el-tabs>
      </div>
      <div class="right-btn">
        <Button class='btn-icon' @click="onBtnSendClickHandler">发送</Button>
      </div>
    </div>
    <div class="main-flex">
      <div class="content-border">
        <div v-for="(part, index) in elementsArr" :key="index" >
          <div>
            <div class="main-text">
              <el-text>{{ part.value }}</el-text>
            </div>
          </div>
          <div v-for="(content, index) in part.headersArr" :key="index" class="section-border">
            <div v-for="(unit, indexs) in content" :key="indexs" class="content-format">
              <div
                class="background_gray_border left_box content-format-com"
                horizontalAlign="left"
              >
                <el-text class="left_text">{{ `${unit.value}${index + 1}` }}</el-text>
              </div>
              <div class="content-format-com box-top-right">
                <el-input v-model="unit.inputValue" />
                <el-select class="main-select" v-model="unit.selectedType">
                  <el-option
                    class="options"
                    v-for="item in unit.type"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <Button v-if="indexs === 0 && index > 0" class='delete-btn' :btnIcon="CloseBold" @click="onBtnDeleteLineClickHandler(part.headersArr, index)"></Button>
              <div v-else class='delete-btn-holder' />
            </div>
            <Button v-if="index === (part.headersArr.length - 1)" class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler(part.headersArr)"></Button>
          </div>
        </div>
      </div>
      <div class='transform-btn-location'>
        <Button class='btn-icon transform-btn' @click="onBtnPreviewClickHandler">预览模板</Button>
      </div>
      <div class="preview-border">
        
      </div>
    </div>
  </client-only>
</template>

<style>
.main-flex {
  display: flex;
}

.header {
  display: flex;
  height: 20px;
  position: relative;
}

.tabs {
  display: inline-block;
}

.right-btn {
  display: inline-block;
  position: absolute;
  right: 0;
}

.btn-icon > span > i{
  height: 0px;
  width: 0px;
}

.section-border {
  border: 1px solid #cacaca;
  margin: 0 5px 3px;
}

.content-format {
  display: flex;
  margin: 1px;
}

.content-format-com {
  /* display: inline-block; */
  display: flex;
  line-height: 28px;
}

.background_gray_border {
  color: #fff;
  border-top: 1px solid #cacaca;
  border-bottom: 1px solid #cacaca;
  border-collapse: collapse;
  text-align: center;
}

.left_box {
  width: 120px;
  justify-content: center;
  overflow: hidden;
  font-size: 13px;
  background-color: #08ADAA;
}

.left_text {
  width: 100%;
  padding-left: 10px;
  text-align: left;
  color: #fff;
}

.box-top-right {
  width: 100%;
  margin-right: 3px;
}

.input-margin {
  width: 100%;
  display: inline-block;
}

.content-border {
  min-height: 900px;
  width: 40%;
  border: 1px solid #cacaca;
  border-radius: 0;
  margin-top: 20px;
  display: inline-block;
}

.main-text {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif, '微软雅黑';
  margin: 10px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: inline-block;
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

.el-select {
  --el-select-border-color-hover: #08ADAA;
  --el-select-font-size: 14px;
  --el-select-close-hover-color: #cacaca;
  --el-select-input-color: #000;
  --el-select-multiple-input-color: #000;
  --el-select-input-focus-border-color: #08ADAA;
  --el-select-input-font-size: 14px;
}

.add-types-btn {
  width: 30px;
  height: 30px;
  margin-left: 1px;
  margin-bottom: 1px;
}

.add-types-btn:hover {
  width: 30px;
  height: 30px;
  margin-left: 1px;
  margin-bottom: 1px;
}

.add-types-btn > span > i{
  margin-left: 0px;
}

.transform-btn-location {
  width: 20%;
  margin: auto;
}

.transform-btn {
  display: block;
  margin: 0 auto;
}

.preview-border {
  height: 900px;
  width: 40%;
  border: 1px solid #cacaca;
  border-radius: 0;
  margin-top: 20px;
  display: inline-block;
}

.el-select-dropdown .el-select-dropdown__item.is-disabled.selected {
  color:#08ADAA
}

.el-select-dropdown__empty {
  padding:10px 0;
  margin:0;
  text-align:center;
  color:var(--el-text-color-secondary);
  font-size:var(--el-select-font-size)
}

.el-select-dropdown__wrap {
  max-height:274px
}

.el-select-dropdown__list {
  list-style:none;
  padding:6px 0;
  margin:0;
  box-sizing:border-box
}

.el-select-dropdown__header {
  padding:10px;
  border-bottom:1px solid var(--el-border-color-light)
}

.el-select-dropdown__footer {
  padding:10px;
  border-top:1px solid var(--el-border-color-light)
}

.el-select {
  --el-select-border-color-hover:#08ADAA;
  --el-select-disabled-border:#cacaca;
  --el-select-font-size:14px;
  --el-select-close-hover-color:#cacaca;
  --el-select-input-color:#000;
  --el-select-multiple-input-color:#000;
  --el-select-input-focus-border-color:#08ADAA;
  --el-select-input-font-size:14px
}

.el-select {
  display:inline-block;
  position:relative;
  vertical-align:middle;
  line-height:32px
}

.el-select-dropdown__item.selected {
  color: #08ADAA!important;
}

.el-select-dropdown__item.hover {
  color: #08ADAA!important;
}

.delete-btn {
  width: 32px;
  height: 32px;
  margin-top: 0px;
  margin-left: auto;
  margin-bottom: 0px;
}

.delete-btn:hover {
  width: 32px;
  height: 32px;
  margin-top: 0px;
  margin-left: auto;
  margin-bottom: 0px;
}

.delete-btn > span > i{
  margin-left: 0px;
}

.delete-btn-holder {
  width: 40px;
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
  border-left: 1px solid #cacaca;
  border-top: 1px solid #cacaca;
  border-right: 1px solid #cacaca;
  border-radius: 0;
  box-sizing: border-box;
}

.el-tabs--card>.el-tabs__header {
  border-bottom: 0px;
  height: var(--el-tabs-header-height);
}

.el-tabs__item:hover {
  color: #000;
  cursor: pointer;
}

.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom: 0px;
    color: #fff;
    background-color: #08ADAA;
}

.el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0;
}

.main-select {
  display: inline-block;
  width: 120px;
  margin-left: 3px;
  min-width: 120px;
}
</style>
