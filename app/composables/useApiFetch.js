// Common options configuration function
const createFetchOptions = (authed , options = {}) => {
  const token = useAuthStore()?.userData?.token || JSON.parse(window.sessionStorage.getItem('authStore'))?.token; // You can fetch the actual token from auth storage
  const lang = useGlobalStore().lang;
  const config = useRuntimeConfig();
  const baseURL = options.baseURL || config.public.apiBase;
  const secretKey = config.public.secretKey;


  const headers = {
    ...(authed ? { authorization: `Bearer ${token}` } : {}),
    lang: lang,
    secretKey: secretKey,
    ...options.headers,
  };

  return {
    baseURL,
    headers,
    response_type: "json",
    ...options,
  };
};


// For data fetching with useFetch
export const useApiFetch = (url, authed ,options = {}) => {
  return useFetch(url, {
    params: options.params || {}, // Set default params if none provided
    ...createFetchOptions(authed , options),
    method: "GET",
  });
};

// Unified fetch function
const fetchData = async (url , authed , options = {}, method) => {
  try {
    const response = await $fetch(url, {
      ...createFetchOptions(authed , options),
      method,
      body: options.body || undefined, // Ensure body is included if it exists
    });

    // Directly return the response
    return { data: response, error: null };
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return { data: null, error };
  }
};

// For data fetching with $fetch
export const fetchApiData = (url, authed ,options = {}) => {
  return fetchData(url, authed ,options, "GET"); // Call the unified fetch with GET method
};

// For form submission or other requests with $fetch
export const submitApiForm = (url, authed , formData, method = "POST", options = {}) => {
  return fetchData(url, authed ,{ ...options, body: formData }, method); // Include formData and dynamic method in options
};