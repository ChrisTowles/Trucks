import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit {

  constructor(private meta: Meta,
              private title: Title) {

    this.title.setTitle('Craigmyle Trucks - Directions');
    this.meta.addTags([
      {name: 'description', content: 'Directions Page for Craigmyle Trucks'},
      {name: 'og:title', content: 'Craigmyle Trucks - Directions'},
      {name: 'og:description', content: 'We’re approximately 50 minutes north of Louisville and about 45 minutes south of Cincinnati'},
      {name: 'og:type', content: 'website'}
    ]);
  }

  ngOnInit() {
  }

}
