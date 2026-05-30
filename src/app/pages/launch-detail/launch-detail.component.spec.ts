import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchDetailComponent } from './launch-detail.component';

describe('LaunchDetailComponent', () => {
  let component: LaunchDetailComponent;
  let fixture: ComponentFixture<LaunchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
