import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  titleUpdated = new Subject<string>();

  constructor(private title: Title, private router: Router, private activatedRoute: ActivatedRoute) {}

  init(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.setTitle();
    });
  }

  private setTitle(): void {
    const pageTitle = this.getPageTitle(this.activatedRoute.root);
    const baseTitle = `Supplya - The Ideal Trader's
    Marketplace`; // Your base title

    if (pageTitle) {
      const newTitle = `${pageTitle} > ${baseTitle}`;
      this.title.setTitle(newTitle);

      // Emit the updated title through the observable
      this.titleUpdated.next(newTitle);
    } else {
      this.title.setTitle(baseTitle);
      this.titleUpdated.next(baseTitle);
    }
  }

   getPageTitle(route: ActivatedRoute): string {
    let title = '';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data && route.snapshot.data['title']) {
        title += route.snapshot.data['title'];
      }
    }

    return title;
  }
}
