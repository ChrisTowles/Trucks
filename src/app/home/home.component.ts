import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private meta: Meta, private title: Title) {

    this.title.setTitle('Craigmyle Trucks - Home');
    this.meta.addTags([
      {name: 'description', content: 'Home Page for Craigmyle Trucks'},
      {name: 'og:title', content: 'Craigmyle Trucks - Home'},
      {
        name: 'og:description',
        content: 'If you’re looking for a good deal on quality used trucks & trailers, you’ve come to the right place!'
      },
      {name: 'og:type', content: 'website'}
    ]);
  }

  ngOnInit() {
  }

}
