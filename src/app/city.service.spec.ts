import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CityService} from './city-service';
import {ErrorService} from './shared/error.service';
import {WeatherApiResponse} from './WeatherApiResponse.model';
import {DestroyRef} from "@angular/core";

describe('CityService', () => {
    let service: CityService;
    let httpMock: HttpTestingController;
    let errorService: jasmine.SpyObj<ErrorService>;

    const mockWeatherResponse: WeatherApiResponse = {
        location: {
            name: 'Wroclaw'
        },
        current: {
            temp_c: 20,
            humidity: 65,
            wind_kph: 12
        },
        forecast: {
            forecastday: [
                {
                    date: '2025-03-24',
                    day: {
                        maxtemp_c: 25,
                        mintemp_c: 15
                    }
                }
            ]
        }
    };


    beforeEach(() => {
        const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['showError']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CityService,
                {provide: ErrorService, useValue: errorServiceSpy}
            ]
        });

        service = TestBed.inject(CityService);
        httpMock = TestBed.inject(HttpTestingController);
        errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', fakeAsync(() => {
        expect(service).toBeTruthy();
        const req = httpMock.expectOne(request =>
            request.url.includes('api.weatherapi.com/v1/forecast.json') &&
            request.url.includes('q=wroclaw')
        );
        req.flush(mockWeatherResponse);
        tick();
    }));

    it('should fetch weather data for default city on initialization', () => {
        const req = httpMock.expectOne(request =>
            request.url.includes('api.weatherapi.com/v1/forecast.json') &&
            request.url.includes('q=wroclaw')
        );
        expect(req.request.method).toBe('GET');

        req.flush(mockWeatherResponse);

        expect(service.weatherInfo()).toEqual({
            name: 'Wroclaw',
            temperature: 20,
            humidity: 65,
            wind: 12,
            minTemp: 15,
            maxTemp: 25
        });
    });

    it('should update city and fetch new weather data when setCity is called', fakeAsync(() => {
        httpMock.expectOne(request => request.url.includes('q=wroclaw'))
            .flush(mockWeatherResponse);

        service.setCity('Warsaw');

        const req = httpMock.expectOne(request =>
            request.url.includes('api.weatherapi.com/v1/forecast.json') &&
            request.url.includes('q=Warsaw')
        );
        expect(req.request.method).toBe('GET');

        const warsawResponse = {
            ...mockWeatherResponse,
            location: {name: 'Warsaw'},
            current: {
                temp_c: 18,
                humidity: 60,
                wind_kph: 10
            },
            forecast: {
                forecastday: [
                    {
                        day: {
                            maxtemp_c: 22,
                            mintemp_c: 12
                        }
                    }
                ]
            }
        };

        req.flush(warsawResponse);
        tick();

        expect(service.weatherInfo()).toEqual({
            name: 'Warsaw',
            temperature: 18,
            humidity: 60,
            wind: 10,
            minTemp: 12,
            maxTemp: 22
        });
    }));

    it('should handle error when fetching weather data fails', fakeAsync(() => {
        const initialReq = httpMock.expectOne(request =>
            request.url.includes('api.weatherapi.com/v1/forecast.json') &&
            request.url.includes('q=wroclaw')
        );
        initialReq.flush(mockWeatherResponse);
        tick();

        errorService.showError.calls.reset();

        service['cityData'].set(null);

        service['errorService'].showError('Failed to fetch weather data for wroclaw');

        expect(errorService.showError).toHaveBeenCalledWith('Failed to fetch weather data for wroclaw');

        expect(service.weatherInfo()).toEqual({
            name: '',
            temperature: 0,
            humidity: 0,
            wind: 0,
            minTemp: 0,
            maxTemp: 0
        });
    }));


    it('should return default weather info when no data is loaded', () => {
        httpMock.expectOne(request => request.url.includes('q=wroclaw'));

        expect(service.weatherInfo()).toEqual({
            name: '',
            temperature: 0,
            humidity: 0,
            wind: 0,
            minTemp: 0,
            maxTemp: 0
        });
    });

    it('should unsubscribe from HTTP requests on destroy', fakeAsync(() => {
        const destroyRef = TestBed.inject(DestroyRef);
        const destroySpy = spyOn(destroyRef, 'onDestroy').and.callThrough();

        service.setCity('London');

        expect(destroyRef.onDestroy).toHaveBeenCalled();

        httpMock.expectOne(request => request.url.includes('q=wroclaw')).flush(mockWeatherResponse);
        httpMock.expectOne(request => request.url.includes('q=London')).flush(mockWeatherResponse);
    }));
});
