import { API_USER_SERVICE } from "../config/Constants";
import { IBranchCreateDTO } from "../interfaces/Branches";
import { getRequest, postRequest, putRequest } from "./Rest";

export const getBranchesMin = async() => {
    const path = `${API_USER_SERVICE}/branches/min`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const createBranch = async(dto:IBranchCreateDTO) =>{
    const path = `${API_USER_SERVICE}/branches`;
    const response = await postRequest(path,dto);
    const dataResponse = response?.rawResponse;
    return dataResponse;
};
export const getBranchesList = async() =>{
    const path = `${API_USER_SERVICE}/branches/list`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getBranchById = async(id:number) =>{
    const path = `${API_USER_SERVICE}/branches/${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getbranchAnalyticsEmpStats = async(id:number) =>{
    const path = `${API_USER_SERVICE}/attendance/branch-summary/${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getbranchAnalyticsWorkStats = async(id:number) =>{
    const path = `${API_USER_SERVICE}/attendance/weekly-stats/${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getbranchAnalyticsLineChart = async(id:number) =>{
    const path = `${API_USER_SERVICE}/attendance/graph/seven-days/${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getbranchAnalyticsBarChart = async(id:number) =>{
    const path = `${API_USER_SERVICE}/attendance/work-hours-distribution/${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getBranchAnalticAttendenceRecords = async(id:number) =>{
    const path = `${API_USER_SERVICE}/attendance/recent-records/${id}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getBranchAnalticAttendenceRecordsByDate = async(id:number,date:string) =>{
    const path = `${API_USER_SERVICE}/attendance/recent-records/${id}?date=${date}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const updateBranch = async(id:number, dto:IBranchCreateDTO) =>{
    const path = `${API_USER_SERVICE}/branches/${id}`;
    const response = await putRequest(path, dto);
    const dataResponse = response?.rawResponse;
    return dataResponse;
};
export const liveTrackingAllBranches = async() =>{
    const path = `${API_USER_SERVICE}/monitoring/dashboard`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const liveTrackingByBranchId = async(branchId:number) =>{
    const path = `${API_USER_SERVICE}/monitoring/dashboard/branch/${branchId}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getliveEmployeeDetails = async(empId:string) =>{
    const path = `${API_USER_SERVICE}/monitoring/employee-info/${empId}`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};