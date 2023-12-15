import { Component, OnInit } from '@angular/core';
import { ToasterPosition, ToastyService } from 'ng-toasty';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

constructor(private notify: ToastyService){
  
}

  ngOnInit(): void {
   
  }
  title = 'supplya';
  ToasterPosition = ToasterPosition;

  // alert(){
  //   this.notify.success('Method not implemented.');
  // }
}
