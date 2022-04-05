import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWallComponent } from './main-wall.component';

describe('MainWallComponent', () => {
  let component: MainWallComponent;
  let fixture: ComponentFixture<MainWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainWallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
