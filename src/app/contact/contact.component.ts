import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {LocalStorageService} from 'angular-2-local-storage';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/forkJoin';
import {ActivatedRoute} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  private _success = new Subject<string>();
  successMessage: string;

  constructor(private fb: FormBuilder,
              private afs: AngularFirestore,
              private localStorageService: LocalStorageService,
              private activatedRoute: ActivatedRoute,
              private meta: Meta,
              private title: Title) {

    this.title.setTitle('Craigmyle Trucks - Contact Us');
    this.meta.addTags([
      {name: 'description', content: 'Contact Us Page for Craigmyle Trucks'},
      {name: 'og:title', content: 'Craigmyle Trucks - Contact Us'},
      {name: 'og:description', content: 'We look forward to hearing from you!'},
      {name: 'og:type', content: 'website'}
    ]);


    this.createForm();


    // Set subject if user got here from inventory
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.contactForm.patchValue({subject: params.subject || ''});
      });
  }

  ngOnInit() {

    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

    // Load values for form from storage so users can reuse it quickly
    this.contactForm.patchValue({
      firstName: this.localStorageService.get<string>('contact-firstName'),
      lastName: this.localStorageService.get<string>('contact-lastName'),
      email: this.localStorageService.get<string>('contact-email')
    });

  }

  createForm() {
    this.contactForm = this.fb.group({ // <-- the parent FormGroup
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      subject: ['', Validators.required],
      message: ['']
    });
  }

  contactSubmit(data) {

    this.afs.collection('messages').add({read: false, ...data}).then(() => {
      // this._success.next(`Message successfully sent.`);

      // Save user info to storage
      this.localStorageService.set('contact-firstName', data.firstName);
      this.localStorageService.set('contact-lastName', data.lastName);
      this.localStorageService.set('contact-email', data.email);
      this.contactForm.reset({firstName: data.firstName, lastName: data.lastName, email: data.email});
    });

  }
}
