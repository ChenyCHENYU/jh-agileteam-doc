/**
 * Waline 姓名和工号验证器
 */
import { ref, type Ref } from "vue";

export interface ValidatorConfig {
  namePattern?: RegExp;
  jobNumberPattern?: RegExp;
  nameHint?: string;
  jobNumberHint?: string;
}

export interface ToastState {
  visible: boolean;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
}

export function useWalineValidator(config?: ValidatorConfig) {
  const finalConfig = {
    namePattern: config?.namePattern || /^[\u4e00-\u9fa5]{2,4}$/,
    jobNumberPattern: config?.jobNumberPattern || /^\d{6}$/,
    nameHint: config?.nameHint || "请输入2-4个中文字符",
    jobNumberHint: config?.jobNumberHint || "请输入6位数字",
  };

  const toastState: Ref<ToastState> = ref({
    visible: false,
    type: "error",
    title: "",
    message: "",
  });

  let hideTimer: number | null = null;

  const showToast = (
    title: string,
    message: string,
    type: ToastState["type"] = "error",
    duration = 2000
  ) => {
    // 清除之前的定时器
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    toastState.value = {
      visible: true,
      type,
      title,
      message,
    };

    // 自动隐藏
    hideTimer = window.setTimeout(() => {
      toastState.value.visible = false;
      hideTimer = null;
    }, duration);
  };

  const validateName = (name: string): boolean => {
    const trimmed = (name || "").trim();

    if (!trimmed) {
      showToast("姓名不能为空", "请输入您的真实姓名");
      return false;
    }

    if (!finalConfig.namePattern.test(trimmed)) {
      showToast("姓名格式错误", finalConfig.nameHint);
      return false;
    }

    return true;
  };

  const validateEmail = (email: string): boolean => {
    const trimmed = (email || "").trim();

    if (!trimmed) {
      showToast("邮箱不能为空", "请输入您的邮箱地址");
      return false;
    }

    // 简单的邮箱格式验证
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      showToast("邮箱格式错误", "请输入正确的邮箱地址，例: user@example.com");
      return false;
    }

    return true;
  };

  const validateJobNumber = (jobNumber: string): boolean => {
    const trimmed = (jobNumber || "").trim();

    if (!trimmed) {
      showToast("工号不能为空", "请输入您的6位工号");
      return false;
    }

    if (!finalConfig.jobNumberPattern.test(trimmed)) {
      showToast("工号格式错误", finalConfig.jobNumberHint);
      return false;
    }

    return true;
  };

  /**
   * 组合验证：验证姓名、邮箱和工号
   */
  const validate = (
    name: string,
    email: string,
    jobNumber: string
  ): boolean => {
    if (!validateName(name)) return false;
    if (!validateEmail(email)) return false;
    if (!validateJobNumber(jobNumber)) return false;
    return true;
  };

  return {
    toastState,
    validate,
  };
}
