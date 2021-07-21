import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiMainComponent } from './kpi-main.component';

describe('KpiMainComponent', () => {
  let component: KpiMainComponent;
  let fixture: ComponentFixture<KpiMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
