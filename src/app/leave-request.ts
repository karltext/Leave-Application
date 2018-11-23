export interface LeaveRequest {
    ID?: number;
    employeeID?: number;
    type: string;
    fromDate: Date;
    toDate: Date;
    reason: string;
    approver: string;
    status?: string;
    length?: number;
    contact?: string;
    dayPeriod: string;
}
