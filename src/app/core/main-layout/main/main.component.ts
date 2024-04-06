import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TitleService } from 'src/app/shared/services/title.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  pageTitle: any;
  breadcrumb: string = '';
  constructor( private route: ActivatedRoute,
    private router: Router, private titleService: TitleService) {
   
  }
  
ngOnInit(): void {
  // Initial title setting
  this.titleService.init();

  // Get the initial page title
  this.pageTitle = this.titleService.getPageTitle(this.route.root);


  // Subscribe to router events for dynamic updates
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.breadcrumb = this.extractBreadcrumb(this.route.root);
      this.pageTitle = this.titleService.getPageTitle(this.route.root);
      // console.log(this.pageTitle, 'page');
    });
}
  

  private extractBreadcrumb(route: ActivatedRoute): string {
    let breadcrumb = '';
    while (route.firstChild) {
      route = route.firstChild;
      const routeData = route.snapshot.data;
      if (routeData && routeData['breadcrumb']) {
        breadcrumb = routeData['breadcrumb'];
      }
    }
    return breadcrumb;
  }

}
