import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-data-available',
  templateUrl: './no-data-available.component.html',
  styleUrls: ['./no-data-available.component.scss']
})
export class NoDataAvailableComponent {
  constructor(private route: Router){

  }
  @Input()
  visible = false;
  @Input()
  notFoundMessage = "Oops! Nothing Found";
  @Input()
  resetLinkText = "Back To Home";
  @Input()
  resetLink = " ";

  @Input()
noButton: boolean = true;

back(){
  this.route.navigate(['']);
  window.scrollTo(0, 0);
    }
}
