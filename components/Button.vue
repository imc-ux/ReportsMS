<script lang="ts" setup>
import { ElButton, ElIcon } from 'element-plus';

interface Props {
  btnIcon?: any;
  disabled?: boolean;
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  btnIcon: null,
  disabled: false,
  showIcon: true,
});

</script>

<template>
  <el-button class="btn" :disabled="props.disabled">
    <slot />
    <el-icon v-if="props.showIcon && props.btnIcon" class="el-icon--right">
      <props.btnIcon />
    </el-icon>
  </el-button>
</template>


