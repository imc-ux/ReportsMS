import { h, render } from "vue";
import Alert from "./Alert.vue";

/**
 * message：提示显示的文字
 * icon: 0 succeed
 *       1 warning
 *       2 question
 *       3 delete
 **/
export function ShowAlert(
  message: string,
  icon: number = 0,
  onConfirm?: () => void
) {
  const vNode = h(
    Alert,
    {
      message,
      icon,
      confirmHandler: btnConfirmClickHandler,
      close: closeHandler,
    },
    {}
  );

  const container = document.createElement("div");
  document.body.appendChild(container);
  render(vNode, container);

  function btnConfirmClickHandler() {
    document.body.removeChild(container);
    onConfirm?.();
  }

  function closeHandler() {
    document.body.removeChild(container);
  }
}
