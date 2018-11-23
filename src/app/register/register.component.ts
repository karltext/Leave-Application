import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { LeaveRequest } from '../leave-request';
import { LeaveService } from '../leave.service';
import { Router } from "@angular/router"
import { Employee } from '../employee';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  validLeaveRequest = true
  validationMessage = ""

  employee: Employee

  requestTypes = {
    BUUUKHolidayLeave: "Holiday Leave",
    BUUKHalfDayHolidayLeave: "Half Day Holiday Leave",
    BUUKCreditForBankHoliday: "Credit for working on bank holiday",
    BUUKSickLeave: "Sick Leave",
    BUUKHalfDaySickLeave: "Half Day Sick Leave",
    BUUKLeaveWithoutPay: "Leave Without Pay",
    BUUKHalfDayLeaveWithoutPay: "Half Day Leave Without Pay",
    BUUKMaternityLeave: "Maternity Leave",
    BUUKPaternityLeave: "Paternity Leave",
    BUUKAdoptiveLeave: "Adoption Leave",
    BUUKLeaveWithoutPayParental: "Parental Leave",
    BUUKLeaveWithoutPayJury: "Jury Service Leave"
  }

  statusCodes = [
    "Pending", "Approved", "Rejected", "Pending Cancelation", "Cancelled"]

  initialStatusCode = this.statusCodes[0]


  dayPeriodField = false
  rowFilter = ""

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private app: AppComponent) {
  }

  ngOnInit() {
    this.getEmployee()
  }

  getEmployee() {
    this.leaveService.getEmployee().subscribe(emp => {
      this.employee = emp
    })
  }

  newLeaveRequest(leaveRequest: LeaveRequest) {

    this.validLeaveRequest = false

    if (leaveRequest.fromDate > leaveRequest.toDate) {
      this.validationMessage = "Invalid date range"
      return
    }
    if (leaveRequest.type == "") {
      this.validationMessage = "Please select the type of leave you require"
      return
    }
    if (leaveRequest.reason.length < 1) {
      this.validationMessage = "Reason for leave request is required."
      return
    }
    let validatedLeaveRequest = this.buildLeaveRequest(leaveRequest)
    if (validatedLeaveRequest.status == "Rejected") {
      this.validationMessage = "Leave request exceeds personal allowance."
      return
    }

    this.leaveService.newLeaveRequest(validatedLeaveRequest).subscribe(r => {
      this.validationMessage = r.displayMessage
      this.validLeaveRequest = true
      this.router.navigate(['/'])
    })
  }

  // TODO: is server size validation better?
  private buildLeaveRequest(leaveRequest: LeaveRequest): LeaveRequest {
    leaveRequest.status = this.initialStatusCode
    leaveRequest.fromDate = new Date(leaveRequest.fromDate)
    leaveRequest.toDate = new Date(leaveRequest.toDate)
    leaveRequest.length = 1 + this.daysDifference(leaveRequest.fromDate, leaveRequest.toDate)

    if (leaveRequest.length == 1 && leaveRequest.dayPeriod != "") {
      leaveRequest.length = .5
    }

    if (this.employee.availableLeave - leaveRequest.length < 0) {
      leaveRequest.status = "Rejected"
      return leaveRequest
    }

    // TODO: update so this is entered programatically. 
    leaveRequest.ID = -1
    leaveRequest.approver = "N/A"
    leaveRequest.employeeID = 99999
    return leaveRequest
  }

  private daysDifference(from: Date, to: Date) {
    const dayMilSecs = 1000 * 3600 * 24
    return Math.ceil(Math.abs(to.getTime() - from.getTime()) / dayMilSecs)
  }

  datePicker(from, to) {
    this.dayPeriodField = (from != "" && from == to)
  }
}
