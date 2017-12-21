import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventory-delete',
  templateUrl: './inventory-delete.component.html',
  styleUrls: ['./inventory-delete.component.scss']
})
export class InventoryDeleteComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {
  }

  delete() {
    this.activeModal.close('delete');
  }
}
