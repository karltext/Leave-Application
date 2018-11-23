import { Component } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { LeaveService } from './leave.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private location: Location, private leaveService: LeaveService) {}

  isRoot(): boolean {
    return this.location.isCurrentPathEqualTo("")
  }
}
