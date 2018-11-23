import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { LeaveService } from '../leave.service';
import { LeaveRequest } from '../leave-request';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  leaveRequests: LeaveRequest[]
  employee: Employee
  displayMessage: String = ""

  constructor(private leaveService: LeaveService, private appComponent: AppComponent) {

  }

  statusCodes = [
    "Pending", "Approved", "Rejected", "Pending Cancelation", "Cancelled"]

  ngOnInit() {
    if (!this.employee) {
      this.getEmployee()
    }
    if (!this.leaveRequests) {
      this.getLeaveRequests()
    }
  }

  getEmployee() {
    this.leaveService.getEmployee().subscribe(emp => {
      this.employee = emp
    })
  }

  getLeaveRequests(): void {
    this.leaveService.getLeaveRecord()
      .subscribe(r => {
        this.leaveRequests = r
      })
  }

  cancelLeaveRequest(i: number) {
    this.leaveService.cancelLeaveRequest(i)
      .subscribe(r => {
        this.displayMessage = r.displayMessage
        this.getLeaveRequests()
        this.getEmployee()
      })
  }

  rowStatus(status): string {
    switch (status) {
      case "Rejected":
        return "table-danger"
      case "Approved":
        return "table-success"
      case "Pending":
        return "table-warning"
      default:
        return ""
    }
  }

}
