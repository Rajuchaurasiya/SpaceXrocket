import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadsComponent } from './launchpads.component';

describe('LaunchpadsComponent', () => {
  let component: LaunchpadsComponent;
  let fixture: ComponentFixture<LaunchpadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchpadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchpadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
