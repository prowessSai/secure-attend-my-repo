
import { API_USER_SERVICE } from "../config/Constants";
import { IRoleDTO } from "../interfaces/Roles";
import { getRequest, postRequest, putRequest } from "./Rest";

export const getPermissionsList = async() => {
    const path = `${API_USER_SERVICE}/permissions`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getAccessTypes = async() => {
    const path = `${API_USER_SERVICE}/access-types`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const createRole = async(dto:IRoleDTO) => {
    const path = `${API_USER_SERVICE}/roles`;
    const response = await postRequest(path,dto);
    const dataResponse = response?.rawResponse;
    return dataResponse;
};
export const getRolesMin = async() => {
    const path = `${API_USER_SERVICE}/roles/min`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const updateRole = async(dto:IRoleDTO, id:number) => {
    const path = `${API_USER_SERVICE}/roles/${id}`;
    const response = await putRequest(path, dto);
    const dataResponse = response?.rawResponse;
    return dataResponse;
};
export const getRolesList = async() =>{
    const path = `${API_USER_SERVICE}/roles`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
};
export const getRolesCounts = async() =>{
    const path = `${API_USER_SERVICE}/statistics`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    return dataResponse;
}