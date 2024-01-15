import { ElLoading } from 'element-plus'

let loading: any;

export function setWaiting() {
    loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
}

export function removeWaiting() {
    loading?.close();
}