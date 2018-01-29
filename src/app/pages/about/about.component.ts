import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private meta: Meta,
              private title: Title) {

    this.title.setTitle('Craigmyle Trucks - About Us');
    this.meta.addTags([
      {name: 'description', content: 'About Us Page for Craigmyle Trucks'},
      {name: 'og:title', content: 'Craigmyle Trucks - About Us'},
      {name: 'og:description', content: 'About Us Page for Craigmyle Trucks'},
      {name: 'og:type', content: 'website'}
    ]);
  }

  ngOnInit() {
  }

}
