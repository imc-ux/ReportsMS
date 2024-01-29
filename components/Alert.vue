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
    <el-dialog :model-value="alertVisible" :show-close="false" :close-on-click-modal="false" width="19.6875rem" draggable
        align-center>
        <div class="alert-content">
            <div v-if="icon === 0" class="icon-box">
                <el-image class="image-width-style" :src="icon_succeed" :fit="'fill'" />
            </div>
            <div v-else-if="icon === 1" class="icon-box">
                <el-image class="image-width-style" :src="icon_warning" :fit="'fill'" />
            </div>
            <div v-else-if="icon === 2" class="icon-box">
                <el-image class="image-width-style" :src="icon_question" :fit="'fill'" />
            </div>
            <div v-else="icon === 3" class="icon-box">
                <el-image class="image-width-style" :src="icon_delete" :fit="'fill'" />
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
.image-width-style {
    width: 2.5rem;
    height: 2.5rem
}

.el-dialog__header {
    height: 1.75rem;
    background-color: #08adaa;
    padding: 0rem;
    margin: 0rem;
}

.alert-button {
    width: 4.125rem;
    height: 1.5rem;
    font-size: 0.8125rem;
    margin: auto;
    background-color: #08adaa;
    color: #fff;
}

.alert-button:hover {
    width: 4.125rem;
    height: 1.5rem;
    font-size: 0.8125rem;
    margin: auto;
    background-color: #08adaa;
    color: #fff;
}

.el-dialog__footer {
    height: 2.5rem;
    padding: 0rem;
    margin: auto;
    text-align: center;
}

.alert-content {
    display: flex;
    align-items: center;
    min-height: 4.375rem;
    width: auto;
    padding: 0rem 0.9375rem;
}

.alert-message {
    margin-left: 1.25rem;
    font-size: 0.875rem;
    font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif, "微软雅黑";
    color: #000;
}

.el-dialog__body {
    padding: 0.5rem;
}

.icon-box {
    width: 2.5rem;
    height: 2.5rem;
}

.dialog-footer {
    margin-right: 3.75rem;
}
</style>