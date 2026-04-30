import { API_USER_SERVICE } from "../config/Constants";
import { getRequest, putRequest } from "./Rest";

export const getActiveViolations = async() => {
    const path = `${API_USER_SERVICE}/geofence/violations/active`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getHistoricalViolations = async() => {
    const path = `${API_USER_SERVICE}/geofence/violations/acknowledged`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const acknowledgeViolation = async(violationId:number) => {
    const path = `${API_USER_SERVICE}/geofence/violations/${violationId}/acknowledge`;
    const response = await putRequest(path,{});
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getViolationsStats = async() =>{
    const path = `${API_USER_SERVICE}/geofence/violations/stats`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};