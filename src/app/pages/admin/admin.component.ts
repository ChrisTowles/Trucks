import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private afs: AngularFirestore,
              private meta: Meta,
              private title: Title) {

    this.title.setTitle('Craigmyle Trucks - Admin');
    this.meta.addTags([
      {name: 'description', content: 'Admin Page for Craigmyle Trucks'},
      {name: 'og:title', content: 'Craigmyle Trucks - Admin'},
      {name: 'og:description', content: 'Admin Page for Craigmyle Trucks'},
      {name: 'og:type', content: 'website'}
    ]);
  }

  ngOnInit() {

  }
}
