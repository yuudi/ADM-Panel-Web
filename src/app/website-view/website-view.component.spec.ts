import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteViewComponent } from './website-view.component';

describe('WebsiteViewComponent', () => {
  let component: WebsiteViewComponent;
  let fixture: ComponentFixture<WebsiteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
