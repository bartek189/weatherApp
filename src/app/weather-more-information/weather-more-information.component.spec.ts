import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WeatherMoreInformationComponent} from './weather-more-information.component';
import {CityService} from '../city-service';
import {DecimalPipe} from '@angular/common';
import {By} from '@angular/platform-browser';
import {WeatherInformation} from '../weatherInformation.model';

describe('WeatherMoreInformationComponent', () => {
    let component: WeatherMoreInformationComponent;
    let fixture: ComponentFixture<WeatherMoreInformationComponent>;
    let cityServiceMock: jasmine.SpyObj<CityService>;
    let mockWeatherInfo: WeatherInformation;

    beforeEach(async () => {
        mockWeatherInfo = {
            name: 'Wroclaw',
            temperature: 20,
            humidity: 65,
            wind: 12.5,
            minTemp: 15.3,
            maxTemp: 25.7
        };

        cityServiceMock = jasmine.createSpyObj('CityService', [], {
            weatherInfo: () => mockWeatherInfo
        });

        await TestBed.configureTestingModule({
            imports: [WeatherMoreInformationComponent],
            providers: [
                {provide: CityService, useValue: cityServiceMock},
                DecimalPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(WeatherMoreInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display "More Information" label', () => {
        const labelElement = fixture.debugElement.query(By.css('.more-info-label'));
        expect(labelElement.nativeElement.textContent).toBe('More Information');
    });

    it('should display 4 info blocks', () => {
        const infoBlocks = fixture.debugElement.queryAll(By.css('.info-block'));
        expect(infoBlocks.length).toBe(4);
    });

    it('should display max temperature correctly', () => {
        const infoBlocks = fixture.debugElement.queryAll(By.css('.info-block'));
        const maxTempBlock = infoBlocks[0];

        const label = maxTempBlock.query(By.css('.info-block-label span')).nativeElement.textContent;
        const value = maxTempBlock.query(By.css('.info-block-value')).nativeElement.textContent;

        expect(label).toBe('max temperature');
        expect(value).toBe('26°C');
    });

    it('should display min temperature correctly', () => {
        const infoBlocks = fixture.debugElement.queryAll(By.css('.info-block'));
        const minTempBlock = infoBlocks[1];

        const label = minTempBlock.query(By.css('.info-block-label span')).nativeElement.textContent;
        const value = minTempBlock.query(By.css('.info-block-value')).nativeElement.textContent;

        expect(label).toBe('min temperature');
        expect(value).toBe('15°C');
    });

    it('should display humidity correctly', () => {
        const infoBlocks = fixture.debugElement.queryAll(By.css('.info-block'));
        const humidityBlock = infoBlocks[2];

        const label = humidityBlock.query(By.css('.info-block-label span')).nativeElement.textContent;
        const value = humidityBlock.query(By.css('.info-block-value')).nativeElement.textContent;

        expect(label).toBe('Humidity');
        expect(value).toBe('65%');
    });

    it('should display wind correctly', () => {
        const infoBlocks = fixture.debugElement.queryAll(By.css('.info-block'));
        const windBlock = infoBlocks[3];

        const label = windBlock.query(By.css('.info-block-label span')).nativeElement.textContent;
        const value = windBlock.query(By.css('.info-block-value')).nativeElement.textContent;

        expect(label).toBe('Wind');
        expect(value).toBe('13 km/h');
    });

    it('should display correct icons for each info block', () => {
        const icons = fixture.debugElement.queryAll(By.css('.info-block-label img'));

        expect(icons[0].properties['src']).toBe('max.png');
        expect(icons[0].properties['alt']).toBe('max temperature');

        expect(icons[1].properties['src']).toBe('min.png');
        expect(icons[1].properties['alt']).toBe('min temperature');

        expect(icons[2].properties['src']).toBe('humity.png');
        expect(icons[2].properties['alt']).toBe('Humidity');

        expect(icons[3].properties['src']).toBe('wind.png');
        expect(icons[3].properties['alt']).toBe('Wind');
    });
});
