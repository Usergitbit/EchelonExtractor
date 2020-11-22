import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageSnackBarComponent } from './message-snack-bar.component';

describe('MessageSnackBarComponent', () => {
  let component: MessageSnackBarComponent;
  let fixture: ComponentFixture<MessageSnackBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSnackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
