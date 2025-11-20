// composables/useApiFetch.js
import { useToastMsg } from "./useToastMsg";

// Common options configuration function
const createFetchOptions = (authed, options = {}) => {
  const token = useCookie('auth')?.value?.user?.token || useCookie('token')?.value;
  const lang = useGlobalStore().lang;
  const config = useRuntimeConfig();
  const baseURL = options.baseURL || config.public.apiBase;

  const headers = {
    ...(authed ? { Authorization: `Bearer ${token}` } : {}),
    lang: lang,
    ...options.headers,
  };

  return {
    baseURL,
    headers,
    responseType: "json",
    ...options,
  };
};

// Unified fetch function using $fetch
const fetchData = async (url, authed = false, options = {}, method = "GET") => {
  try {
    const response = await $fetch(url, {
      ...createFetchOptions(authed, options),
      method,
      body: options.body || undefined,
    });
    return { data: response, error: null };
  } catch (error) {
    // $fetch throws an object with `data` and `status`
    return {
      data: null,
      error: {
        message: error?.data?.message || error?.message || 'Unknown error',
        status: error?.status || null,
      },
    };
  }
};

// For async GET requests
export const useApiAsyncData = (key, url, authed = false, showToastMsg = false , options = {}) => {
  const { 
    showErrorToast, 
    showSuccessToast,
  } = useToastMsg();


  return useAsyncData(
    key,
    async () => {
      const result = await fetchData(url, authed , options, 'GET');

      if (result.error) {
        // handle the error first
        const error = result.error;
        if (error.status === 401) {
          // handle unauthorized error
          useGlobalStore().switchLoading(false);
          handleNextRoute('/auth/login');
        } else {
          // show error message
          useGlobalStore().switchLoading(false);
          showErrorToast(error?.message || error || 'There is an error please try again later!!');
        }
        return result;
      }

      // if there is no error, continue the process
      if(showToastMsg){
        showSuccessToast('Data fetched successfully');
      }
      return result;
    },
    {
      // Make pending reactive for loading handling
      ...options,
    }
  );
};

// For POST / PUT / DELETE / form submissions
export const submitApiForm = async (url, authed = false, formData = {}, method = "POST", options = {}) => {
  return await fetchData(url, authed, { ...options, body: formData }, method);
};
