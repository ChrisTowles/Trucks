import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinToolComponent } from './vin-tool.component';

describe('VinToolComponent', () => {
  let component: VinToolComponent;
  let fixture: ComponentFixture<VinToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
