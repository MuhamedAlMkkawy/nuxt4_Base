import { useRouter } from 'vue-router';
import { useGlobalStore } from '~/stores/globalStore';
import { useAuthStore } from '~/stores/authStore';
import { useToastMsg } from '@/composables/useToastMsg';
import { useApiAsyncData , submitApiForm } from '@/composables/useApiFetch';
import { ref } from 'vue';

export function useApiMethods() {
  // define global store
  const globalStore = useGlobalStore();

  // define auth store
  const auth = useAuthStore();

  // define router
  const router = useRouter();

  // define local route
  const localeRoute = useLocaleRoute()

  // define useToastMsg
  const { 
    showErrorToast, 
    showSuccessToast,
    showInfoToast,
    showWarnToast 
  } = useToastMsg();


  // define handle the next route 
  const handleNextRoute = (nextRoute) => {
    setTimeout(()=>{
      if(nextRoute == 'reload_page'){
        router.go(0);
      }else{
        router.push(localeRoute(nextRoute));
      }
    } , 500)
  }


  // define handle the toast message and its type
  const handleToastMsg = (type , message) => {
    // to stop the loading while showing the message
    if(type == 'success'){
      showSuccessToast(message);
    }else if(type == 'info'){
      showInfoToast(message);
    }else if(type == 'warn'){
      showWarnToast(message);
    }else{
      showErrorToast(message);
    }
  }


  // submit form function
  const submitResult = ref(null)
  const submitMethod = async (endPoint, authed , payload , method  , nextRoute , refetchApi) => {
    globalStore.switchLoading();
    const {data , error} = await submitApiForm(endPoint, authed ,  payload , method);
    
    // if (error) {
    //   handleToastMsg('error' , error?.response?._data?.message)
    //   if(
    //     error?.response?._data?.key == 'unauthenticated'||
    //     error?.response?._data?.key == 'unauthorized'||
    //     error?.response?._data?.key == 'not_approved' ||
    //     error?.response?._data?.key == 'blocked'
    //   ){
    //     useCookie('authStore').value = ''
    //     window.sessionStorage.clear();
    //     setTimeout(() => {
    //       handleNextRoute('/auth/login')
    //     }, 500);
    //   }
    //   else if(error?.response?._data?.key == 'needActive'){
    //     setTimeout(() => {
    //       handleNextRoute('/auth/activation_code')
    //     }, 500);
    //   }
    // } else {
    //   if (data.key == 'success' || data.key == 'needActive') {
    //     handleNextRoute(nextRoute);
    //     if (refetchApi) {
    //       getMethod(refetchApi , '' , authStore ? true : false , false)
    //     }
    //     if(
    //       endPoint == 'activate' || 
    //       endPoint == 'signin' || 
    //       endPoint == 'notify' || 
    //       endPoint == 'update-provider-profile'
    //     ){
    //       // console.log(data?.data)
    //       useCookie('authStore').value = data?.data
    //       window.sessionStorage.setItem('authStore' , JSON.stringify(data?.data))
    //       // authStore.handleUserData(data.data);
    //     }
    //   }else if (
    //     data.key == 'unauthenticated' || 
    //     data.key == 'not_approved'
    //   ){
    //     handleNextRoute('/')
    //     useCookie('authStore').value = ''
    //     window.sessionStorage.clear();
    //   }
    //   else if(data?.key == 'needActive'){
    //     setTimeout(() => {
    //       handleNextRoute('/auth/activation_code')
    //     }, 500);
    //   }
    //   submitResult.value = {data , endPoint};
    //   handleToastMsg(data?.key , data?.message)
    //   globalStore.switchLoading()
    // }
  };  


  return {
    submitMethod,
    submitResult,
    showErrorToast,
    handleNextRoute
  };
}