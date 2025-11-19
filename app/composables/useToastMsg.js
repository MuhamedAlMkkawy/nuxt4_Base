import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../stores/globalStore';
export function useToastMsg() {
  const toast = useToast();
  // const { locale } = useI18n();

  const globalStore = useGlobalStore()


  const showToast = (severity, summary, detail, life = 2000) => {
    toast.add({ severity, summary, detail, life });
  };

  const showErrorToast = (message) => {
    const summary = globalStore?.lang == 'ar' ? 'حدث خطأ' : 'Error';
    showToast('error', summary, message);
  };

  const showSuccessToast = (message) => {
    const summary = globalStore?.lang == 'ar' ? 'تمت بـنجاح' : 'Success';
    showToast('success', summary, message);
  };

  const showInfoToast = (message) => {
    const summary = globalStore?.lang == 'ar' ? 'معلومة' : 'Info';
    showToast('info', summary, message);
  };

  const showWarnToast = (message) => {
    const summary = globalStore?.lang == 'ar' ? 'تحذير' : 'Warning';
    showToast('warn', summary, message);
  };

  return {
    toast,
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showWarnToast,
  };
}
