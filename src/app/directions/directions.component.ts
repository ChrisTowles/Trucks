import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor() {
  }

  ngOnInit() {
  }

}
