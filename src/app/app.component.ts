import {Component} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  constructor(private title: Title,
              private meta: Meta,
              private router: Router) {

    this.title.setTitle('Angular Example App');
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.meta.updateTag({
              name: 'description',
              content: 'Angular Example app with Angular CLI, Angular Material and more'
            });
            break;
          case '/inventory' :
            this.title.setTitle('Inventory list');
            this.meta.updateTag({
              name: 'description',
              content: 'List of current inventory'
            });
            break;
        }
      }
    });

  }
}
