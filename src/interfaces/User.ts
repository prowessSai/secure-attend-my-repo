import { IPermissionMinDTO } from "./Roles";

export interface ILoginUserDetails{
    userId:number;
    name:string;
    email: string;
    empId:string;
    activatedAt:string;
    lastLogin:string;
    status:string;
    mobileNum:string;
    roleId:number;
    roleName:string;
    branchId:number;
    branchName:string;
    permissions:Array<IPermissionMinDTO>;
}
export interface ISendInvitationsDTO{
    name:string;
    empId:string;
    email:string;
    mobile:string;
    branchId:number;
    roleId:number;
}
export interface IEmployeeListDTO{
    empId:string;
    name:string;
    email:string;
    mobile:string;
    branchName:string;
    branchAddress:string;
    role:string;
    status:string;
}
export interface IEmployeeHistoryDTO{
    date:string;
    status:string;
    checkIn:string;
    checkOut:string;
    workingHours:number;
    outside:number;
    remarks:string;
}
export interface IEmployeeMonitoringDTO{
    empId:string;
    name:string;
    currentStatus:string;
    currentLatitude:number;
    currentLongitude:number;
    phoneNumber:string;
    email:string;
    totalWorkHours:number;
    outsideFenceTime:number;
    exitedTime:string;
}
export interface IDashboardListDTO{
    empId:string;
    employeeName:string;
    branchName:string;
    currentStatus:string;
    timeInOffice:number;
    outsideDuration:number;
    lastUpdate:string;
}
export interface IDashboardStatsDTO{
    totalEmployees:number;
    presentInOffice:number;
    outsideGeofence:number;
    notMarked:number;
}
export interface IBranchDailyStatsDTO{
    branchName:string;
    totalEmployees:number;
    insideCount:number;
    outsideCount:number;
    notMarked:number;
}
export interface IDashboardBranchesDTO{
    branchName:string;
    totalStaff:number;
    employeesPresent:number;
}
export interface IChangePasswordDTO{
    currentPassword:string;
    newPassword:string;
    confirmPassword:string;
}
export interface IResetPasswordDTO{
    password:string;
    confirmPassword:string;
}

