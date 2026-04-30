import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios';

interface ResponseWrapper {
  status: string;
  rawResponse?: AxiosResponse<any>;
  errorResponse?: any;
}

const getHeaders = async (headers: { [key: string]: any }) => {
  //let token = localStorage.getItem("token");
  const token = sessionStorage.getItem("token");

  if(token) {
    const hdrs = {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      credentials: "include",
    };
    
    return hdrs;

  } else {
    const hdrs = {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      credentials: "include",
    };

    return hdrs;
  }
};

// REST CALL HELPER

export const getRequest = async (path: string, headers={}) => {
  let finalResponse: ResponseWrapper;
  const hdrs = await getHeaders(headers);
  try {
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      headers: hdrs.headers,
      url: path,
    };
    const rawResponse = await axios(requestConfig);
    finalResponse = {
      status: "success",
      rawResponse: rawResponse,
    };
  } catch (error) {
    console.log("getAsync catch", error);
    finalResponse = {
      status: "error",
      errorResponse: error,
    };
  }
  return finalResponse;
};

export const postRequest = async (path: string, data: any, headers: { [key: string]: any } = {}) => {
  let finalResponse: ResponseWrapper;
  const hdrs = await getHeaders(headers);

  try {
    const rawResponse = await axios.post(path, data, hdrs);
    finalResponse = {
      status: "success",
      rawResponse: rawResponse,
    };
  } catch (error) {
    finalResponse = {
      status: "error",
      errorResponse: error,
    };
  }
  return finalResponse;
};

export const putRequest = async (path: string, data: any, headers: { [key: string]: any } = {}) => {
  let finalResponse: ResponseWrapper;
  const hdrs = await getHeaders(headers);

console.log("headers : ", hdrs);
  try {
    const rawResponse = await axios.put(path, data, hdrs);
    finalResponse = {
      status: "success",
      rawResponse: rawResponse,
    };
  } catch (error) {
    finalResponse = {
      status: "error",
      errorResponse: error,
    };
  }
  return finalResponse;
};

export const deleteRequest = async (path: string, headers={}) => {
  let finalResponse: ResponseWrapper;
  const hdrs = await getHeaders(headers);
  try {
    const requestConfig: AxiosRequestConfig = {
      method: "delete",
      headers: hdrs.headers,
      url: path,
    };
    const rawResponse = await axios(requestConfig);
    finalResponse = {
      status: "success",
      rawResponse: rawResponse,
    };
  } catch (error) {
    finalResponse = {
      status: "error",
      errorResponse: error,
    };
  }
  return finalResponse;
};