<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { ElInput, ElText, ElSelect, ElOption } from 'element-plus';
import { Plus, CloseBold } from "@element-plus/icons-vue";
import { TemplateInfo, ComponentlistInfo, SetContentInfo } from "~/vo";
import { CommonAlert } from '~/constant/alert/base';
import { ShowAlert } from '~/components/alert';
import { createTemplate, updateTemplate} from '~/api/templateApi';
import { getUserList } from '~/api/messageApi';

const router = useRouter();
const route = useRoute();
const title = ref<string>('');
const distinguish = ref<string>('区分');
const verticalColumn = ref<string>('');
const editType = ref<boolean>(false);
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

const userList = async () => {
  try {
    const info: any = {};
    info.blockflag = "N";
    info.usertype = "U";
    info.iStart = 0;
    info.iPageCount = 20;
    await getUserList(info);
  } catch (error) {
    //console.log(error);
  }
};

const createSaveTemplate = async () => {
  try {
    const info: TemplateInfo = {};
    info.name = title.value;
    info.title = transform(combinations);
    info.element = transform([{ value: verticalColumn.value, type: ['input'] }, ...inputLines]);
    info.creator = 'kangjiaqi';
    const res: any = await createTemplate(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      ShowAlert(CommonAlert.SAVE_DATA_SUCCESS, 0, () => onBtnBackClickHandler())
    }
  } catch (error) {
    //console.log(error);
  }
};

const editSaveTemplate = async () => {
  try {
    const info: TemplateInfo = {};
    info.nid = Number(route.query?.nid);
    info.name = title.value;
    info.title = transform(combinations);
    info.element = transform([{ value: verticalColumn.value, type: ['input'] }, ...inputLines]);
    info.changer = 'kangjiaqi';
    console.log(info)
    const res: any = await updateTemplate(info);
    let result = JSON.parse(res.data.value);
    if (!result.error) {
      ShowAlert(CommonAlert.SAVE_DATA_SUCCESS, 0, () => onBtnBackClickHandler())
    }
  } catch (error) {
    //console.log(error);
  }
};

onMounted(() => {
  // userList();
  if (JSON.stringify(route?.query) === '{}') {
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
  tempTitleArr.forEach((data: any) => {
    data.type = data.type.split(',')
  })
  combinations.splice(0, 2, ...tempTitleArr);
  tempElementArr.forEach((data: any) => {
    data.type = data.type.split(',');
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
  const tempArr: any[] = JSON.parse(JSON.stringify(arr));
  tempArr.forEach(data => {
    data.type = String(data.type)
  })
  return JSON.stringify(tempArr);
}

function onBtnAddLineClickHandler(type: string) {
  if (type === 'combination') {;
    combinations.push({ value: '', type: ['input'] });
  } else if (type === 'inputLine'){ 
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
  
}

</script>
<template>
  <client-only>
    <div class="split-line">
      <Button class='btn-icon' @click="onBtnBackClickHandler">返回</Button>
      <!-- <NuxtLink to="/template"><Button class='btn-icon' @click="onBtnBackClickHandler">返回</Button></NuxtLink> -->
      <Button class='btn-icon non-init-button' @click="onBtnSaveClickHandler">保存</Button>
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
                <el-input v-model="distinguish" disabled/>
              </div>
            </div>
            <div v-for="(combination, index) in combinations" :key="index" class="text-empty-margin changeable-input">
              <el-input v-model="combination.value" />
              <el-select class="component-multiple-select" v-model="combination.type" multiple>
                <el-option
                  class="options"
                  v-for="item in components"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <Button v-if="index > 1" class='delete-btn' :btnIcon="CloseBold" @click="onBtnDeleteLineClickHandler('combination', index)"></Button>
              <div v-else class='delete-btn-holder' />
            </div>
          </div>
          <Button class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler('combination')"></Button>
        </div>
        <div class="distinguish">
          <div>
            <div>
              <div class="title-text">
                <el-text>{{distinguish}}</el-text>
              </div>
              <div class="main-input">
                <el-input v-model="verticalColumn"/> 
              </div>
            </div>
            <div v-for="(inputLine, index) in inputLines" :key="index" class="main-input text-empty-margin">
              <el-input v-model="inputLine.value" />
              <Button v-if="index > 1" class='delete-btn' :btnIcon="CloseBold" @click="onBtnDeleteLineClickHandler('inputLine', index)"></Button>
            </div>
          </div>
          <Button class='add-types-btn' :btnIcon="Plus" @click="onBtnAddLineClickHandler('inputLine')"></Button>
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
.split-line {
  border-bottom: 1px solid #cacaca;
}

.non-init-button {
  margin-left: 3px;
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

.main-input {
  display: inline-block;
  width: 85%;
}

.settled-input {
  width: 47%;
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

.component-multiple-select {
  display: inline-block;
  width: 65%;
  margin-left: 20px;
  min-width: 220px;
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

.delete-btn {
  width: 32px;
  height: 32px;
  margin-top: 0px;
  margin-left: 10px;
}

.delete-btn:hover {
  width: 32px;
  height: 32px;
  margin-top: 0px;
  margin-left: 10px;
}

.delete-btn > span > i{
  margin-left: 0px;
}

.delete-btn-holder {
  width: 77px;
}
</style>
