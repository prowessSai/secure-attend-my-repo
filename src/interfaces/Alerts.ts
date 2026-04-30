export interface IActiveAlertsListDTO{
    id:number;
    employeeName:string;
    employeeId:string;
    branchName:string;
    exitTime:string;
    outsideDurationMinutes:number;
    status:string;
}
export interface IHistoricalAlertsListDTO{
    employeeId:string;
    employeeName:string;
    branchName:string;
    exitTime:string;
    violationEndedTime:string;
    durationOutsideMinutes:number;
    resolvedByName:string;
    resolvedByempId:string;
}
export interface IViolationsStatsDTO{
    activeAlertsCount:number;
    totalGeofenceBreaches:number;
    averageOutsideTimeMinutes:number;
}

