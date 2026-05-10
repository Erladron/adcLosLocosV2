import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestUserPage } from './gest-user.page';

describe('GestUserPage', () => {
  let component: GestUserPage;
  let fixture: ComponentFixture<GestUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
