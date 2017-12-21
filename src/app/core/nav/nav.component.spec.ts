import {async, TestBed} from '@angular/core/testing';
import {NavComponent} from './nav.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {TruckService} from '../../trucks/shared/truck.service';
import {MaterialModule} from '../../shared/modules/material.module';
import {ProgressBarService} from '../progress-bar.service';
import {TestsModule} from '../../shared/modules/tests.module';

describe('NavComponent', () => {
  let fixture;
  let component;
  let progressBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        MaterialModule
      ],
      declarations: [
        NavComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        TruckService,
        ProgressBarService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    progressBarService = TestBed.get(ProgressBarService);
  }));

  it('should create nav component with constructor', (() => {
    const instance = new NavComponent(AppConfig, progressBarService);
    expect(instance).toBeTruthy();
  }));

  it('should create nav component', (() => {
    expect(component).toBeTruthy();
  }));

  it('should update progress bar', (() => {
    expect(component.progressBarMode).toBeUndefined();
    progressBarService.updateProgressBar$.emit('query');
    expect(component.progressBarMode).toBe('query');
  }));
});
