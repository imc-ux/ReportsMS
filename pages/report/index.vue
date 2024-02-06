<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter, useState } from 'nuxt/app';
import { ElInput, ElText, ElSelect, ElOption, ElTabs, ElTabPane } from 'element-plus';
import { Plus, CloseBold } from "@element-plus/icons-vue";
import { TemplateInfo, TemplateHistory, SendMsgInfo, HeadersArrInfo } from "@/vo";
import { CommonAlert } from '@/constant/alert/base';
import { ShowAlert } from '@/components/alert';
import type { TabsPaneContext } from 'element-plus'
import { getTemplateList, createUserTemplate, sendTemplateMsg } from '~/api/templateApi';
import { getUserTemplateList } from '@/api/messageApi';
import { UserInfo } from "@/utils/Settings";
import { setWaiting, removeWaiting } from '@/utils/loadingUtil';
import { setSessionUserInfo } from '@/utils/Storage';

const router = useRouter();
const templateTitle = ref<string>('');
const templateElement = ref<string>('');
const reportName = ref<number>(0);
const elementsArr = reactive<any[]>([]);
const headersArr = reactive<HeadersArrInfo[]>([]);
const commonTemplate = ref<TemplateInfo>({});
const previewTemplate = ref<TemplateHistory>({});
const TemplateList = reactive<TemplateInfo[]>([]);

const getTempList = async () => {
  try {
    const info: TemplateInfo = {};
    info.name = '';
    const res: any = await getTemplateList(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      TemplateList.push(...result.data);
      reportName.value = TemplateList[0].nid as number;
      refreshTemplate(TemplateList[0]);
    }
  } catch (error) {
  }
};

const getLastReport = async () => {
  try {
    const info: TemplateHistory = {};
    info.content = '';
    info.userId = UserInfo.userId;
    info.templateId = reportName.value;
    info.iPageCount = 20;
    info.iStart = 0;
    const res: any = await getUserTemplateList(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      if (result.data.length === 0) {
        ShowAlert(CommonAlert.NO_LAST_MSG, 1)
      }
      const historyMsg = JSON.parse(result.data[0].content);
      elementsArr.forEach((data, index) => {
        for (let i = 0; i < historyMsg[index].list.length - 1; i++) {
          if (data.headersArr.length < historyMsg[index].list.length)
            data.headersArr.push(JSON.parse(JSON.stringify(headersArr)))
        }
      });
      elementsArr.forEach((data, index) => {
        data.headersArr.forEach((arr: HeadersArrInfo[], key: number) => {
          arr.forEach((ele, id) => {
            ele.inputValue = historyMsg[index].list[key][id];
          });
        });
      });
    }
  } catch (error) {
  }
}

const sendTemplate = async (nid: number) => {
  try {
    setWaiting();
    const res: any = await sendTemplateMsg(nid);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      removeWaiting();
      ShowAlert(CommonAlert.MSG_SEND_SUCCESS, 0, () => { router.push({ path: '/messageMain', query: { type: 'search' } }) })
    }
  } catch (error) {
  }
};

const saveReport = async () => {
  try {
    setWaiting();
    const res: any = await createUserTemplate(createReport());
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      removeWaiting();
      sendTemplate(result.data.nid)
    }
  } catch (error) {
  }
};

onMounted(() => {
  const urlString = new URL(window.location.href);
  const userSession: any = {};
  userSession.id = urlString.searchParams.get('userId');
  if (userSession.id) {
    setSessionUserInfo(userSession);
  }
  getTempList();
})

function onBtnSendClickHandler() {
  try {
    elementsArr.forEach(data => {
      data.headersArr.forEach((arr: HeadersArrInfo[]) => {
        try {
          arr.forEach((info, index) => {
            if (!info.inputValue && index === 0) {
              ShowAlert(`${data.value}中${info.value}未填写!`, 1)
              throw new Error();
            }
          });
        } finally {
        }
      });
    });
    saveReport();
  } catch (e) {
  }
}

function onBtnBackClickHandler() {
  router.push({ path: '/messageMain' });
}

function onBtnFillUpClickHandler() {
  getLastReport();
}

function onBtnAddLineClickHandler(arr: HeadersArrInfo[]) {
  arr.push(JSON.parse(JSON.stringify(headersArr)));
}

function onBtnDeleteLineClickHandler(arr: HeadersArrInfo[], index: number) {
  arr.splice(index, 1);
}

function createReport() {
  const info: TemplateHistory = {};
  info.userId = UserInfo.userId;
  info.templateId = reportName.value;
  const sendContent: SendMsgInfo[] = [];
  elementsArr.forEach(data => {
    const contentInfo: SendMsgInfo = {};
    const listsArr: string[][] = [];
    contentInfo.type = data.value;
    data.headersArr.forEach((arr: HeadersArrInfo[]) => {
      const inputValueArr: string[] = [];
      arr.forEach(info => {
        inputValueArr.push(info.inputValue as string);
      });
      listsArr.push(inputValueArr)
    });
    contentInfo.list = listsArr;
    sendContent.push(contentInfo)
  });
  info.content = JSON.stringify(sendContent);
  info.templateTitle = templateTitle.value;
  info.templateElement = templateElement.value;
  return info;
}

function refreshTemplate(info: TemplateInfo) {
  previewTemplate.value = {};
  elementsArr.length = 0;
  headersArr.length = 0;
  commonTemplate.value = info;
  templateTitle.value = info.title as string;
  templateElement.value = info.element as string;
  elementsArr.push(...JSON.parse(info.element as string));
  headersArr.push(...JSON.parse(info.title as string));
  headersArr.forEach((data) => {
    data.inputValue = '';
    data.type = (data.type as string).split(',');
    data.selectedType = data.type[0];
  })
  elementsArr.forEach(data => {
    data.headersArr = [JSON.parse(JSON.stringify(headersArr))];
  })
}

function onBtnTabChangeClickHandler(tab: TabsPaneContext) {
  TemplateList.forEach(element => {
    if (element.nid === tab.props.name)
      refreshTemplate(element);
  });
}

function onBtnPreviewClickHandler() {
  previewTemplate.value = createReport();
}

</script>
<template>
  <client-only>
    <div class="header">
      <div class="tabs">
        <el-tabs v-model="reportName" type="card" @tab-click="onBtnTabChangeClickHandler">
          <el-tab-pane v-for="(item, index) in TemplateList" :key="index" :label="item.name" :name="item.nid" />
        </el-tabs>
      </div>
      <div class="right-btn">
        <Button class='btn-icon' @click="onBtnBackClickHandler">返回</Button>
        <!-- <Button class='btn-icon' @click="onBtnFillUpClickHandler">填充上次消息</Button> -->
        <!-- <Button class='btn-icon' @click="onBtnSendClickHandler">发送</Button> -->
      </div>
    </div>
    <div class="main-flex">
      <div class="content-border">
        <div v-for="(part, index) in elementsArr" :key="index">
          <div>
            <div class="reoprt-element-text">
              <el-text>{{ part.value }}</el-text>
            </div>
          </div>
          <div v-for="(content, index) in part.headersArr" :key="index" class="section-border">
            <div v-for="(unit, indexs) in content" :key="indexs" class="content-format">
              <div class="background_gray_border left_box content-format-com" horizontalAlign="left">
                <el-text class="left_text">{{ `${unit.value}${index + 1}` }}</el-text>
              </div>
              <div class="content-format-com box-top-right">
                <el-input v-if="unit.selectedType === 'input'" v-model="unit.inputValue" />
                <el-input v-if="unit.selectedType === 'batchInput'" v-model="unit.inputValue"
                  :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
                <el-select class="component-select" v-model="unit.selectedType" :disabled="unit.type.length === 1">
                  <el-option class="options" v-for="item in unit.type" :key="item" :label="item" :value="item" />
                </el-select>
              </div>
              <Button v-if="indexs === 0 && index > 0" class='delete-btn' :btnIcon="CloseBold"
                @click="onBtnDeleteLineClickHandler(part.headersArr, index)"></Button>
              <div v-else class='delete-btn-holder' />
            </div>
            <Button v-if="index === (part.headersArr.length - 1)" class='add-types-btn' :btnIcon="Plus"
              @click="onBtnAddLineClickHandler(part.headersArr)"></Button>
          </div>
        </div>
      </div>
      <div class='transform-btn-location'>
        <div>
          <Button class='btn-icon operate-btn' @click="onBtnFillUpClickHandler">填充上次消息</Button>
        </div>
        <div>
          <Button class='btn-icon operate-btn' @click="onBtnPreviewClickHandler">预览消息</Button>
        </div>
        <div>
          <Button class='btn-icon operate-btn' @click="onBtnSendClickHandler">发送</Button>
        </div>
      </div>
      <div class="preview-border">
        <MarkDownTable :templeteAr="previewTemplate" />
      </div>
    </div>
  </client-only>
</template>

<style>
.header {
  display: flex;
  height: 1.25rem;
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

.section-border {
  border: 0.0625rem solid #cacaca;
  margin: 0 0.3125rem 0.1875rem;
}

.content-format {
  display: flex;
  margin: 0.0625rem;
}

.content-format-com {
  display: flex;
  line-height: 1.75rem;
}

.background_gray_border {
  color: #fff;
  border-top: 0.0625rem solid #cacaca;
  border-bottom: 0.0625rem solid #cacaca;
  border-collapse: collapse;
  text-align: center;
}

.left_box {
  width: 7.5rem;
  justify-content: center;
  overflow: hidden;
  font-size: 0.8125rem;
  background-color: #08ADAA;
}

.left_text {
  width: 100%;
  padding-left: 0.625rem;
  text-align: left;
  color: #fff;
}

.box-top-right {
  width: 100%;
  margin-right: 0.1875rem;
}

.input-margin {
  width: 100%;
  display: inline-block;
}

.content-border {
  min-height: 53.75rem;
  width: 40%;
  border: 0.0625rem solid #cacaca;
  border-radius: 0;
  margin-top: 1.25rem;
  display: inline-block;
}

.add-types-btn {
  width: 1.875rem;
  height: 1.875rem;
  margin-left: 0.0625rem;
  margin-bottom: 0.0625rem;
}

.add-types-btn:hover {
  width: 1.875rem;
  height: 1.875rem;
  margin-left: 0.0625rem;
  margin-bottom: 0.0625rem;
}

.add-types-btn>span>i {
  margin-left: 0rem;
}

.transform-btn-location {
  width: 20%;
  margin-top: 1.25rem;
}

.transform-btn {
  display: block;
  margin: 0 auto;
}

.preview-border {
  height: 53.75rem;
  width: 40%;
  border: 0.0625rem solid #cacaca;
  border-radius: 0;
  margin-top: 1.25rem;
  display: inline-block;
}

.reoprt-element-text {
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif,
    "微软雅黑";
  margin: 0.625rem;
  width: 100%;
  height: 1.875rem;
  line-height: 1.875rem;
  display: inline-block;
}

.delete-btn {
  width: 2rem;
  height: 2rem;
  margin-top: 0rem;
  margin-left: auto;
  margin-bottom: 0rem;
}

.delete-btn:hover {
  width: 2rem;
  height: 2rem;
  margin-top: 0rem;
  margin-left: auto;
  margin-bottom: 0rem;
}

.delete-btn>span>i {
  margin-left: 0rem;
}

.delete-btn-holder {
  width: 2.5rem;
}

.component-select {
  display: inline-block;
  width: 7.5rem;
  margin-left: 0.1875rem;
  min-width: 7.5rem;
}

.operate-btn {
  margin: 0rem auto 0.5rem auto;
  display: block;
}

.operate-btn:hover {
  margin: 0rem auto 0.5rem auto;
}
</style>
