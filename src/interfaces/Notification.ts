import { API_USER_SERVICE } from "../config/Constants";
import { getRequest, putRequest } from "../services/Rest";

export const getUnreadNotificationsCount = async () => {
    const path = `${API_USER_SERVICE}/notifications/unread/count`;
    const response = await getRequest(path);
    const dataResponse = response?.rawResponse?.data;
    console.log("Response getUnreadNotificationscount : ", dataResponse);
    return dataResponse;
};
export const readAllNotification = async () => {
    const path = `${API_USER_SERVICE}/notifications/mark-all-read`;
    const response = await putRequest(path, {});
    console.log("Response readNotification : ", response);
    return response;
};