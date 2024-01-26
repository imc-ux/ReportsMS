<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter, useRoute } from 'nuxt/app';
import { ElInput, ElText, ElSelect, ElOption } from 'element-plus';
import { Plus, CloseBold } from "@element-plus/icons-vue";
import { TemplateInfo, ComponentlistInfo, SetContentInfo, TemplateHistory, HeadersArrInfo } from "@/vo";
import { CommonAlert } from '@/constant/alert/base';
import { ShowAlert } from '@/components/alert';
import { createTemplate, updateTemplate, getUserActivePermission } from '@/api/templateApi';
import { UserInfo } from "@/utils/Settings";
import { setWaiting, removeWaiting } from '@/utils/loadingUtil';

const router = useRouter();
const route = useRoute();
const title = ref<string>('');
const distinguish = ref<string>('区分');
const verticalColumn = ref<string>('');
const editType = ref<boolean>(false);
const previewTemplate = ref<TemplateHistory>({});
const userPermission = ref<string>('');
const components = reactive<ComponentlistInfo[]>([{
  value: 'input',
  label: 'input',
},
{
  value: 'batchInput',
  label: 'batchInput',
}]);
const combinations = reactive<SetContentInfo[]>([
  { value: '', type: ['input'] },
  { value: '', type: ['input'] }
]);
const inputLines = reactive<SetContentInfo[]>([
  { value: '', type: ['input'] },
  { value: '', type: ['input'] }
]);

const getUserPermission = async () => {
  try {
    const userId = UserInfo.userId;
    const res: any = await getUserActivePermission(userId);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      userPermission.value = result.data;
    }
  } catch (error) {

  }
}

const createSaveTemplate = async () => {
  try {
    const info: TemplateInfo = {};
    info.name = title.value;
    info.title = transform(combinations);
    info.element = transform([{ value: verticalColumn.value, type: ['input'] }, ...inputLines]);
    info.creator = UserInfo.userId;
    setWaiting();
    const res: any = await createTemplate(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      removeWaiting();
      ShowAlert(CommonAlert.SAVE_DATA_SUCCESS, 0, () => onBtnBackClickHandler())
    }
  } catch (error) {
  }
};

const editSaveTemplate = async () => {
  try {
    const info: TemplateInfo = {};
    info.nid = Number(route.query?.nid);
    info.name = title.value;
    info.title = transform(combinations);
    info.element = transform([{ value: verticalColumn.value, type: ['input'] }, ...inputLines]);
    info.changer = UserInfo.userId;
    setWaiting();
    const res: any = await updateTemplate(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      removeWaiting();
      ShowAlert(CommonAlert.SAVE_DATA_SUCCESS, 0, () => onBtnBackClickHandler())
    }
  } catch (error) {
  }
};

onMounted(() => {
  getUserPermission();
  if (!route.query.name) {
    return;
  } else {
    editType.value = true;
    initTemplate();
  }
})

function initTemplate() {
  title.value = route.query.name;
  const tempTitleArr = JSON.parse(route.query.title)
  const tempElementArr = JSON.parse(route.query.element)
  tempTitleArr.forEach((data: HeadersArrInfo) => {
    data.type = (data.type as string).split(',')
  })
  combinations.splice(0, 2, ...tempTitleArr);
  tempElementArr.forEach((data: HeadersArrInfo) => {
    data.type = (data.type as string).split(',');
  })
  verticalColumn.value = tempElementArr.shift().value;
  inputLines.splice(0, 2, ...tempElementArr);
}

function onBtnBackClickHandler() {
  router.push({ path: '/template' });
}

function onBtnSaveClickHandler() {
  if (!title.value) {
    ShowAlert(CommonAlert.TITLE_EMPTY, 1)
    return;
  }
  for (let i = 0; i < combinations?.length; i++) {
    if (!combinations[i].value) {
      ShowAlert(CommonAlert.HEADER_EMPTY, 1);
      return;
    }
    if (combinations[i].type.length === 0) {
      ShowAlert(CommonAlert.HEADER_COMPONENT_EMPTY, 1);
      return;
    }
  }
  const tempArr = [{ value: verticalColumn.value, type: ['input'] }, ...inputLines]
  for (let i = 0; i < tempArr?.length; i++) {
    if (!tempArr[i].value) {
      ShowAlert(CommonAlert.DISTINGUISH_EMPTY, 1);
      return;
    }
  }
  if (editType.value) {
    editSaveTemplate();
  } else {
    createSaveTemplate();
  }
}

function transform(arr: SetContentInfo[]) {
  const tempArr: SetContentInfo[] = JSON.parse(JSON.stringify(arr));
  tempArr.forEach(data => {
    data.type = String(data.type)
  })
  return JSON.stringify(tempArr);
}

function onBtnAddLineClickHandler(type: string) {
  if (type === 'combination') {
    combinations.push({ value: '', type: ['input'] });
  } else if (type === 'inputLine') {
    inputLines.push({ value: '', type: ['input'] });
  }
}

function onBtnDeleteLineClickHandler(type: string, index: number) {
  if (type === 'combination') {
    combinations.splice(index, 1);
  } else if (type === 'inputLine') {
    inputLines.splice(index, 1);
  }
}

function onBtnPreviewClickHandler() {
  const info: TemplateHistory = {};
  info.templateTitle = transform(combinations);
  info.templateElement = transform([{ value: verticalColumn.value, type: ['input'] }, ...inputLines]);
  info.content = JSON.stringify([]);
  previewTemplate.value = info;
}

</script>
<template>
  <client-only>
    <div class="split-line">
      <Button class='btn-icon' @click="onBtnBackClickHandler">返回</Button>
      <Button v-show="userPermission.indexOf('T_A') >= 0" class='btn-icon non-init-button'
        @click="onBtnSaveClickHandler">保存</Button>
    </div>
    <div class="main-flex">
      <div class="content-border">
        <div class="title">
          <div class="title-text">
            <el-text>标题</el-text>
          </div>
          <div class="main-input">
            <el-input v-model="title" />
          </div>
        </div>
        <div class="gauge-outfit">
          <div>
            <div>
              <div class="title-text">
                <el-text>表头</el-text>
              </div>
              <div class="main-input settled-input">
                <el-input v-model="distinguish" disabled />
              </div>
            </div>
            <div v-for="(combination, index) in combinations" :key="index" class="text-empty-margin changeable-input">
              <el-input v-model="combination.value" />
              <el-select class="component-multiple-select" v-model="combination.type" multiple>
                <el-option class="options" v-for="item in components" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
              <Button v-if="index > 1" class='delete-btn' :btnIcon="CloseBold"
                @click="onBtnDeleteLineClickHandler('combination', index)"></Button>
              <div v-else class='delete-btn-holder' />
            </div>
          </div>
          <Button class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler('combination')"></Button>
        </div>
        <div class="distinguish">
          <div>
            <div>
              <div class="title-text">
                <el-text>{{ distinguish }}</el-text>
              </div>
              <div class="main-input">
                <el-input v-model="verticalColumn" />
              </div>
            </div>
            <div v-for="(inputLine, index) in inputLines" :key="index" class="main-input text-empty-margin">
              <el-input v-model="inputLine.value" />
              <Button v-if="index > 1" class='delete-btn' :btnIcon="CloseBold"
                @click="onBtnDeleteLineClickHandler('inputLine', index)"></Button>
            </div>
          </div>
          <Button class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler('inputLine')"></Button>
        </div>
      </div>
      <div class='transform-btn-location'>
        <Button class='btn-icon transform-btn' @click="onBtnPreviewClickHandler">预览模板</Button>
      </div>
      <div class="preview-border">
        <MarkDownTable :templeteAr="previewTemplate" />
      </div>
    </div>
  </client-only>
</template>

<style>
.split-line {
  border-bottom: 0.0625rem solid #cacaca;
}

.non-init-button {
  margin-left: 0.1875rem;
}

.content-border {
  height: 53.75rem;
  width: 40%;
  border: 0.0625rem solid #cacaca;
  border-radius: 0;
  margin-top: 1.25rem;
  display: inline-block;
}

.title {
  margin-bottom: 1.25rem;
}

.title-text {
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif,
    "微软雅黑";
  margin: 0.625rem;
  width: 2.5rem;
  height: 1.875rem;
  line-height: 1.875rem;
  display: inline-block;
}

.main-input {
  display: inline-block;
  width: 85%;
}

.settled-input {
  width: 47%;
  margin-right: 1.25rem;
  display: inline-block;
}

.changeable-input {
  width: 85%;
  margin-right: 1.25rem;
  display: inline-block;
}

.settled-input-height {
  height: 2rem;
}

.text-empty-margin {
  margin-left: 3.75rem;
  height: 2rem;
  display: flex;
  margin-bottom: 0.625rem;
}

.text-with-select {
  margin-left: 3.75rem;
  height: 2.5rem;
}

.component-multiple-select {
  display: inline-block;
  width: 65%;
  margin-left: 1.25rem;
  min-width: 13.75rem;
}

.add-types-btn {
  width: 1.875rem;
  height: 1.875rem;
  margin-left: 3.75rem;
  margin-bottom: 0.625rem;
}

.add-types-btn:hover {
  width: 1.875rem;
  height: 1.875rem;
  margin-left: 3.75rem;
  margin-bottom: 0.625rem;
}

.add-types-btn>span>i {
  margin-left: 0rem;
}

.gauge-outfit {
  margin-bottom: 1.25rem;
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
  height: 53.75rem;
  width: 40%;
  border: 0.0625rem solid #cacaca;
  border-radius: 0;
  margin-top: 1.25rem;
  display: inline-block;
}

.delete-btn {
  width: 2rem;
  height: 2rem;
  margin-top: 0rem;
  margin-left: 0.625rem;
}

.delete-btn:hover {
  width: 2rem;
  height: 2rem;
  margin-top: 0rem;
  margin-left: 0.625rem;
}

.delete-btn>span>i {
  margin-left: 0rem;
}

.delete-btn-holder {
  width: 4.8125rem;
}
</style>