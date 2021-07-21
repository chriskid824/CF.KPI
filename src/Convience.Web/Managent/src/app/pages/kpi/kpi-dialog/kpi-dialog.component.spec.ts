import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDialogComponent } from './kpi-dialog.component';

describe('KpiDialogComponent', () => {
  let component: KpiDialogComponent;
  let fixture: ComponentFixture<KpiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
