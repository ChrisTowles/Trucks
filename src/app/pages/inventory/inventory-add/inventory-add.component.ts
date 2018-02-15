import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.scss']
})
export class InventoryAddComponent implements OnInit, AfterViewInit {

  @ViewChild('stockNumber') vc: ElementRef;
  addForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.addForm = this.fb.group({ // <-- the parent FormGroup
      stockNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    });
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.vc.nativeElement.focus();
  }

  add() {
    if (this.addForm.valid) {
      this.activeModal.close(this.addForm.value);
    }
  }

}
