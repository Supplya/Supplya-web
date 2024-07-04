import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-breadcrumb',
  templateUrl: './mini-breadcrumb.component.html',
  styleUrls: ['./mini-breadcrumb.component.scss'],
})
export class MiniBreadcrumbComponent {
  @Input()
  pageTitle = '';

  @Input()
  resetLink = ' ';

  @Input()
  HomeLink = 'Home';
  @Input()
  currentPageLink = '';
  @Input()
  currentPageLinkSmall = '';
  @Input()
  searchResult: any;
  @Input()
  previousLink = '';
}
