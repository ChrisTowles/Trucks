import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  navbarCollapsed = true;
  searchForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              public authService: AuthService) {
    // this.progressBarService.updateProgressBar$.subscribe((mode: string) => {
    //   this.progressBarMode = mode;
    // });
    this.createForm();
  }


  search() {
    const text = this.searchForm.value.searchText;
    this.searchForm.setValue({searchText: ''});
    this.router.navigate(['/inventory'], {queryParams: {search: text}});
  }


  createForm() {
    this.searchForm = this.fb.group({ // <-- the parent FormGroup
      searchText: ['', Validators.required],
    });
  }


  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((res) => {
        this.router.navigate(['']);
      })
      .catch((err) => console.log(err));
  }
}
