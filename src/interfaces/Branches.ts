import { IEmployeeMonitoringDTO } from "./User";

export interface IBranchesMinDTO{
    id:number;
    branchName:string;
}
export interface IBranchCreateDTO{
    branchName:string;
    branchAddress:string;
    description:string;
    coordinates:string;
    fenceType:"CIRCLE" | "RECTANGLE" | "POLYGON";
    centerLatitude:number;
    centerLongitude:number;
    radiusMeters:number;
}
export interface IBranchListDTO{
    branchId:number;
    branchName:string;
    address:string;
    employeeCount:number;
    coordinates:string;
    geofenceRadius:number;
}
export interface IBranchAnalyticsEmpStatsDTO{
    totalEmployees:number;
    presentToday:number;
}
export interface IBranchAnalyticsWorkStatsDTO{
    averageWorkingHoursPerDay:number;
    lateArrivalsThisWeek:number;
}
export interface IBranchAnalyticsLineDTO{
    date:string;
    presentCount:number;
    onLeaveCount:number;
}
export interface IBranchAnalyticsBarDTO{
    date:string;
    lessThan6Hours:number;
    between6And7Hours:number;
    between7And8Hours:number;
    between8And9Hours:number;
    greaterThan9Hours:number;
}
export interface IBranchMonitoringDTO{
    id:number;
    name:string;
    coordinates:string;
    centerLatitude:string;
    centerLongitude:number;
    fenceType:string;
    radius:number;
}
export interface IMonitoringResponseDTO{
    branches:IBranchMonitoringDTO[];
    employees:IEmployeeMonitoringDTO[];
}
export interface ILiveEmployeeDetailsDTO{
    employeeId:string;
    employeeName:string;
    branchName:string;
}
export interface IBrnachEmployeeAttendanceRecordDTO{
    employeeId:string;
    employeeName:string;
    status:string;
    checkInTime:string;
    checkOutTime:string;
    totalWorkingHours:number;
    outsideTime:number;
}