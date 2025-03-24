import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WeatherInformationComponent} from './weather-information.component';
import {CityService} from '../city-service';
import {DecimalPipe} from '@angular/common';
import {By} from '@angular/platform-browser';
import {signal} from '@angular/core';
import {WeatherInformation} from '../weatherInformation.model';

describe('WeatherInformationComponent', () => {
    let component: WeatherInformationComponent;
    let fixture: ComponentFixture<WeatherInformationComponent>;
    let cityServiceMock: jasmine.SpyObj<CityService>;
    let weatherInfoSignal: any;

    beforeEach(async () => {
        const mockWeatherInfo: WeatherInformation = {
            name: 'Wroclaw',
            temperature: 20,
            humidity: 65,
            wind: 12.5,
            minTemp: 15,
            maxTemp: 25
        };

        weatherInfoSignal = signal(mockWeatherInfo);

        cityServiceMock = jasmine.createSpyObj('CityService', [], {
            weatherInfo: weatherInfoSignal
        });

        await TestBed.configureTestingModule({
            imports: [WeatherInformationComponent, DecimalPipe],
            providers: [
                {provide: CityService, useValue: cityServiceMock}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(WeatherInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display city name correctly', () => {
        const locationElement = fixture.debugElement.query(By.css('.location'));
        expect(locationElement.nativeElement.textContent).toBe('Wroclaw');
    });

    it('should display temperature correctly', () => {
        const temperatureElement = fixture.debugElement.query(By.css('.temperature'));
        expect(temperatureElement.nativeElement.textContent).toBe('20°C');
    });

    it('should display hot image when temperature is above 7°C', () => {
        const imgElement = fixture.debugElement.query(By.css('img'));
        expect(imgElement.properties['src']).toBe('hot.png');
        expect(imgElement.properties['alt']).toBe('Pogoda');
    });

    it('should display cold image when temperature is 7°C or below', () => {
        const coldWeatherInfo: WeatherInformation = {
            name: 'Wroclaw',
            temperature: 5,
            humidity: 65,
            wind: 12.5,
            minTemp: 2,
            maxTemp: 8
        };
        weatherInfoSignal.set(coldWeatherInfo);
        fixture.detectChanges();

        const imgElement = fixture.debugElement.query(By.css('img'));
        expect(imgElement.properties['src']).toBe('cold.png');
        expect(imgElement.properties['alt']).toBe('Pogoda');
    });

    it('should update displayed values when weather data changes', () => {
        const updatedWeatherInfo: WeatherInformation = {
            name: 'Warsaw',
            temperature: 15,
            humidity: 70,
            wind: 10,
            minTemp: 12,
            maxTemp: 18
        };
        weatherInfoSignal.set(updatedWeatherInfo);
        fixture.detectChanges();

        const locationElement = fixture.debugElement.query(By.css('.location'));
        const temperatureElement = fixture.debugElement.query(By.css('.temperature'));

        expect(locationElement.nativeElement.textContent).toBe('Warsaw');
        expect(temperatureElement.nativeElement.textContent).toBe('15°C');
    });
});
