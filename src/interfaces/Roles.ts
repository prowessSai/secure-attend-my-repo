export interface IPermissionMinDTO{
    id:number;
    permissionName:string;
    description:string;
}
export interface IRoleDTO{
    id:number;
    name:string;
    description:string;
    platformType:string;
    permissionIds:number[];
    permissions:Array<IPermissionMinDTO>;
    userCount:number
}
export interface IRoleMInDTO{
    id:number;
    name:string;
}
export interface IRoleCountsDTO{
    totalRoles:number;
    totalUsers:number;
    webAccessUsers:number;
    mobileAccessUsers:number;
}