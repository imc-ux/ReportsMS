<script lang="ts" setup>
import { ElDialog, ElImage } from 'element-plus';
import icon_delete from '../public/images/alert_icon_delete.png';
import icon_question from '../public/images/alert_icon_question.png';
import icon_succeed from '../public/images/alert_icon_succeed.png';
import icon_warning from '../public/images/alert_icon_warning.png';
import { ref } from 'vue';

const alertVisible = ref(true);

interface Props {
    message?: string;
    icon?: number;
    confirmHandler?: () => void
    close: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    message: '',
    icon: 0,
});


function onBtnConfirmHandler() {
    alertVisible.value = false
    props.confirmHandler?.()
}

function onBtnCloseHandler() {
    alertVisible.value = false
    props.close()
}

</script>

<script lang="ts">
export default {
    name: 'component-alert',
};
</script>

<template>
    <el-dialog :model-value="alertVisible" :show-close="false" :close-on-click-modal="false" width="315px" draggable
        align-center>
        <div class="alert-content">
            <div v-if="icon === 0" class="icon-box">
                <el-image style="width: 40px; height: 40px" :src="icon_succeed" :fit="'fill'" />
            </div>
            <div v-else-if="icon === 1" class="icon-box">
                <el-image style="width: 40px; height: 40px" :src="icon_warning" :fit="'fill'" />
            </div>
            <div v-else-if="icon === 2" class="icon-box">
                <el-image style="width: 40px; height: 40px" :src="icon_question" :fit="'fill'" />
            </div>
            <div v-else="icon === 3" class="icon-box">
                <el-image style="width: 40px; height: 40px" :src="icon_delete" :fit="'fill'" />
            </div>
            <span class="alert-message">{{ props.message }}</span>
        </div>
        <template #footer>
            <span v-if="icon === 2" class="dialog-footer">
                <Button class="alert-button" :showIcon="false" @click="onBtnConfirmHandler()">Yes</Button>
            </span>
            <span v-if="icon === 2">
                <Button class="alert-button" :showIcon="false" @click="onBtnCloseHandler()">No</Button>
            </span>
            <span v-else>
                <Button class="alert-button" :showIcon="false" @click="onBtnConfirmHandler()">确定</Button>
            </span>
        </template>
    </el-dialog>
</template>


<style>
.el-dialog__header {
    height: 28px;
    background-color: #08adaa;
    padding: 0px;
    margin: 0px;
}

.alert-button {
    width: 66px;
    height: 24px;
    font-size: 13px;
    margin: auto;
    background-color: #08adaa;
    color: #fff;
}

.alert-button:hover {
    width: 66px;
    height: 24px;
    font-size: 13px;
    margin: auto;
    background-color: #08adaa;
    color: #fff;
}

.el-dialog__footer {
    height: 40px;
    padding: 0px;
    margin: auto;
    text-align: center;
}

.alert-content {
    display: flex;
    align-items: center;
    min-height: 70px;
    width: auto;
    padding: 0px 15px;
}

.alert-message {
    margin-left: 20px;
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif, "微软雅黑";
    color: #000;
}

.el-dialog__body {
    padding: 8px;
}

.icon-box {
    width: 40px;
    height: 40px;
}

.dialog-footer {
    margin-right: 60px;
}
</style>