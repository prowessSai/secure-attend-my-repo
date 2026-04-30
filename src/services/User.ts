import { API_USER_SERVICE } from "../config/Constants";
import { IChangePasswordDTO, IResetPasswordDTO, ISendInvitationsDTO } from "../interfaces/User";
import { getRequest, postRequest, putRequest } from "./Rest";

export const sendInvitation = async(dto:ISendInvitationsDTO) =>{
    const path = `${API_USER_SERVICE}/invitation/send`;
    const response = await postRequest(path,dto);
    return response;
}
export const editEmployee = async(id:string,dto:ISendInvitationsDTO) =>{
    const path = `${API_USER_SERVICE}/invitation/update/${id}`;
    const response = await putRequest(path, dto);
    return response;
}
export const logIn = async(email: string, pwd: string ) => {
    const path = `${API_USER_SERVICE}/login`;
    const response = await postRequest(path, {email: email, password: pwd});
    console.log("Response signin Details: ", response);
    return response;
}
export const changePassword = async(dto:IChangePasswordDTO) =>{
    const path = `${API_USER_SERVICE}/user/change-password`;
    const response = await putRequest(path,dto);
    return response;
};
export const sendOTP = async(email:string) =>{
    const path = `${API_USER_SERVICE}/auth/forgot-password/send-otp`;
    const response = await postRequest(path, {email: email});
    return response;
};
export const validateOTP = async(email:string, otp:string) =>{
    const path = `${API_USER_SERVICE}/auth/forgot-password/verify-otp`;
    const response = await postRequest(path, {email: email, otp: otp});
    return response;
};
export const resendOTP = async(email:string) =>{
    const path = `${API_USER_SERVICE}/auth/forgot-password/resend-otp`;
    const response = await postRequest(path, {email: email});
    return response;
};
export const resetPassword = async(dto:IResetPasswordDTO) =>{
    const path = `${API_USER_SERVICE}/auth/reset-password`;
    const response = await postRequest(path, dto);
    return response;
};
export const getUserDetails = async () => {
    const path = `${API_USER_SERVICE}/user/profile`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    console.log("Response getUserDetails : ", dataResponse);
    return dataResponse;
};
export const getEmployeesList = async() =>{
    const path = `${API_USER_SERVICE}/user/employees`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const searchEmployee = async(searchTerm: string) =>{
    const path = `${API_USER_SERVICE}/user/employees/search?q=${searchTerm}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const filterEmployeeByBranch = async(branchId:number) =>{
    const path = `${API_USER_SERVICE}/user/employees/branch/${branchId}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const activateEmployee = async(userId:string,isActive:boolean) =>{
    const path = `${API_USER_SERVICE}/user/${userId}/status?active=${isActive}`;
    const response = await putRequest(path,{});
    return response;
  };
  export const deActivateEmployee = async(userId:string,isActive:boolean) =>{
    const path = `${API_USER_SERVICE}/user/${userId}/status?active=${isActive}`;
    const response = await putRequest(path,{});
    return response;
  };
  export const getEmployeeHistory = async(empId:string) =>{
    const path = `${API_USER_SERVICE}/attendance/report/${empId}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardLiveList = async() =>{
    const path = `${API_USER_SERVICE}/monitoring/recent-status-changes`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardLiveListAll = async() =>{
    const path = `${API_USER_SERVICE}/monitoring/view-all`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardLiveListAllByStatus = async(status:string) =>{
    const path = `${API_USER_SERVICE}/monitoring/view-all?status=${status}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardLiveListAllByBranch = async(id:number) =>{
    const path = `${API_USER_SERVICE}/monitoring/view-all?branchId=${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardLiveListAllByStatusAndBranch = async(status:string, id:number) =>{
    const path = `${API_USER_SERVICE}/monitoring/view-all?status=${status}&branchId=${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardLiveListAllBySearch = async(searchTerm: string) =>{
    const path = `${API_USER_SERVICE}/monitoring/view-all?search=${searchTerm}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardStats = async() =>{
    const path = `${API_USER_SERVICE}/monitoring/employee-stats`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashoardBranchStats = async() =>{
    const path = `${API_USER_SERVICE}/monitoring/branch-stats`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getDashboardBranchLiveStats = async() =>{
    const path = `${API_USER_SERVICE}/monitoring/branch-daily-stats`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
