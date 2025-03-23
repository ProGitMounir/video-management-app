import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelechargerVideoComponent } from './telecharger-video.component';

describe('TelechargerVideoComponent', () => {
  let component: TelechargerVideoComponent;
  let fixture: ComponentFixture<TelechargerVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelechargerVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelechargerVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
