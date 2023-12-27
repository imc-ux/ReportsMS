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
    close: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    message: '',
    icon: 0,
});

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
            <span class="dialog-footer">
                <Button class="alert-button" :showIcon="false" @click="onBtnCloseHandler()">确定</Button>
            </span>
        </template>
    </el-dialog>
</template>
