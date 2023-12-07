<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { ElInput, ElText, ElSelect, ElOption } from 'element-plus';
import { Plus } from "@element-plus/icons-vue";

const title = ref<string>('')
const distinguish = ref<string>('区分')
const verticalColumn = ref<string>('')
const components = reactive<any[]>([{
  value: 'input',
  label: 'input',
},
{
  value: 'batchInput',
  label: 'batchInput',
}])
const combinations = reactive<any[]>([
  { value: '', key: Math.random() * 100, selected: ['input'] },
  { value: '', key: Math.random() * 100, selected: ['input'] }
])



function onBtnBackClickHandler() {

}

function onBtnSaveClickHandler() {
}

async function onBtnAddLineClickHandler() {
  combinations.push({ value: '', key: Math.random() * 100, selected: ['input'] })
}

function onBtnPreviewClickHandler() {

}

</script>
<template>
  <client-only>
    <div class="split-line">
      <Button class='btn-icon' @click="onBtnBackClickHandler">返回</Button>
      <Button class='btn-icon' @click="onBtnSaveClickHandler">保存</Button>
    </div>
    <div class="main-flex">
      <div class="content-border">
        <div class="title">
          <div class="main-text">
            <el-text>标题</el-text>
          </div>
          <div class="main-input">
            <el-input v-model="title" />
          </div>
        </div>
        <div class="gauge-outfit">
          <div>
            <div>
              <div class="main-text">
                <el-text>表头</el-text>
              </div>
              <div class="main-input settled-input">
                <el-input v-model="distinguish" disabled/>
              </div>
            </div>
            <div v-for="combination in combinations" :key="combination.key" class="text-empty-margin changeable-input">
              <el-input v-model="combination.value" />
              <el-select class="main-select" v-model="combination.selected" multiple>
                <el-option
                  class="options"
                  v-for="item in components"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <!-- <div class="text-empty-margin changeable-input">
              <el-input v-model="gaugeOutfit" />
              <el-select class="main-select" v-model="selected2" multiple>
                <el-option
                  v-for="item in components"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div> -->
          </div>
          <Button class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler"></Button>
        </div>
        <div class="distinguish">
          <div>
            <div>
              <div class="main-text">
                <el-text>{{distinguish}}</el-text>
              </div>
              <div class="main-input">
                <el-input v-model="verticalColumn"/>
              </div>
            </div>
            <div class="main-input text-empty-margin">
              <el-input v-model="verticalColumn" />
            </div>
            <div class="main-input text-empty-margin">
              <el-input v-model="verticalColumn" />
            </div>
          </div>
          <Button class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler"></Button>
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

.btn-icon > span > i{
  height: 0px;
  width: 0px;
}

.split-line {
  border-bottom: 1px solid #cacaca;
}

.content-border {
  height: 900px;
  width: 40%;
  border: 1px solid #cacaca;
  border-radius: 0;
  margin-top: 20px;
  display: inline-block;
}

.title {
  margin-bottom: 20px;
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

.main-input {
  display: inline-block;
  width: 85%;
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

.settled-input {
  width: 50%;
  margin-right: 20px;
  display: inline-block;
}

.changeable-input {
  width: 85%;
  margin-right: 20px;
  display: inline-block;
}

.settled-input-height {
  height: 32px;
}

.text-empty-margin {
  margin-left: 60px;
  height: 32px;
  display: flex;
  margin-bottom: 10px;
}

.text-with-select {
  margin-left: 60px;
  height: 40px;
}

.main-select {
  display: inline-block;
  width: 65%;
  margin-left: 20px;
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
  margin-left: 60px;
  margin-bottom: 10px;
}

.add-types-btn:hover {
  width: 30px;
  height: 30px;
  margin-left: 60px;
  margin-bottom: 10px;
}

.add-types-btn > span > i{
  margin-left: 0px;
}

.gauge-outfit {
  margin-bottom: 20px;
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
</style>
