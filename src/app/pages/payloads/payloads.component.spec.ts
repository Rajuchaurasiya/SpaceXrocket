import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayloadsComponent } from './payloads.component';

describe('PayloadsComponent', () => {
  let component: PayloadsComponent;
  let fixture: ComponentFixture<PayloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayloadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
