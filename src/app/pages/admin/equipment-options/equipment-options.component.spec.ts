import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentOptionsComponent } from './equipment-options.component';

describe('EquipmentOptionsComponent', () => {
  let component: EquipmentOptionsComponent;
  let fixture: ComponentFixture<EquipmentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
