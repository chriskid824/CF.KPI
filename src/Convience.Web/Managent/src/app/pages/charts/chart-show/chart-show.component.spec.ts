import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartShowComponent } from './chart-show.component';

describe('ChartShowComponent', () => {
  let component: ChartShowComponent;
  let fixture: ComponentFixture<ChartShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
