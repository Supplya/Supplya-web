import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private datePipe: DatePipe){
    
  }
  todayDate: Date = new Date();
  formattedDate = this.datePipe.transform(this.todayDate, 'd MMMM y | h:mm a');
}
