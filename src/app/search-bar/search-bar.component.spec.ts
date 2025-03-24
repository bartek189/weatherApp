import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchBarComponent} from './search-bar.component';
import {CityService} from '../city-service';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

describe('SearchBarComponent', () => {
    let component: SearchBarComponent;
    let fixture: ComponentFixture<SearchBarComponent>;
    let cityServiceMock: jasmine.SpyObj<CityService>;

    beforeEach(async () => {
        cityServiceMock = jasmine.createSpyObj('CityService', ['setCity']);

        await TestBed.configureTestingModule({
            imports: [SearchBarComponent, FormsModule],
            providers: [
                {provide: CityService, useValue: cityServiceMock}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have empty city by default', () => {
        expect(component.city()).toBe('');
    });

    it('should display input field and search button', () => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        const buttonElement = fixture.debugElement.query(By.css('button'));

        expect(inputElement).toBeTruthy();
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.nativeElement.textContent).toBe('Search');
    });

    it('should update city signal when input value changes', () => {
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

        inputElement.value = 'London';
        inputElement.dispatchEvent(new Event('input'));

        expect(component.city()).toBe('London');
    });

    it('should call cityService.setCity when search button is clicked with valid city', () => {
        component.city.set('Berlin');
        fixture.detectChanges();

        const buttonElement = fixture.debugElement.query(By.css('button'));
        buttonElement.triggerEventHandler('click', null);

        expect(cityServiceMock.setCity).toHaveBeenCalledWith('Berlin');
    });

    it('should not call cityService.setCity when search button is clicked with empty city', () => {
        component.city.set('');
        fixture.detectChanges();

        const buttonElement = fixture.debugElement.query(By.css('button'));
        buttonElement.triggerEventHandler('click', null);

        expect(cityServiceMock.setCity).not.toHaveBeenCalled();
    });

    it('should trim whitespace from city name before calling setCity', () => {
        component.city.set('  Paris  ');
        fixture.detectChanges();

        const buttonElement = fixture.debugElement.query(By.css('button'));
        buttonElement.triggerEventHandler('click', null);

        expect(cityServiceMock.setCity).toHaveBeenCalledWith('Paris');
    });
});
