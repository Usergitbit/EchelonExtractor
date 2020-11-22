import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EchelonCanvasComponent } from './echelon-canvas.component';

describe('EchelonCanvasComponent', () => {
  let component: EchelonCanvasComponent;
  let fixture: ComponentFixture<EchelonCanvasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EchelonCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchelonCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
