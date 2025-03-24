import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, tap, throwError} from 'rxjs';
import {WeatherInformation} from "./weatherInformation.model";
import {WeatherApiResponse} from "./WeatherApiResponse.model";
import {ErrorService} from "./shared/error.service";


@Injectable({
    providedIn: 'root'
})
export class CityService {
    private apiKey = 'c02ed9a6fc514e0d848150916252203';
    private apiUrl = 'http://api.weatherapi.com/v1/forecast.json';
    private httpClient = inject(HttpClient);
    private errorService = inject(ErrorService);
    private destroy = inject(DestroyRef);

    private cityName = signal<string>('wroclaw');
    private cityData = signal<{ weatherInfo: WeatherInformation } | null>(null);

    private loadedCityData = this.cityData.asReadonly();

    private readonly DEFAULT_WEATHER: WeatherInformation = {
        name: '',
        temperature: 0,
        humidity: 0,
        wind: 0,
        minTemp: 0,
        maxTemp: 0,
    };

    weatherInfo = computed<WeatherInformation>(() => {
        return this.loadedCityData()?.weatherInfo || this.DEFAULT_WEATHER;
    });

    constructor() {
        this.fetchWeatherData(this.cityName());
    }

    setCity(newCity: string): void {
        this.cityName.set(newCity);
        this.fetchWeatherData(newCity);
    }

    private fetchWeatherData(city: string): void {
        const sub = this.httpClient.get<WeatherApiResponse>(`${this.apiUrl}?key=${this.apiKey}&q=${city}`)
            .pipe(
                tap({
                    next: (response) => {
                        this.cityData.set({
                            weatherInfo: {
                                name: response.location.name,
                                temperature: response.current.temp_c,
                                humidity: response.current.humidity,
                                wind: response.current.wind_kph,
                                maxTemp: response.forecast.forecastday[0].day.maxtemp_c,
                                minTemp: response.forecast.forecastday[0].day.mintemp_c,
                            }
                        });
                    }
                }),
                catchError((error) => {
                    console.error('Error fetching weather data:', error);
                    this.cityData.set(null);
                    this.errorService.showError('Failed to fetch weather data for ' + city);
                    return throwError(() => new Error('Failed to fetch weather data for ' + city));
                })
            ).subscribe();

        this.destroy.onDestroy(() => sub.unsubscribe());
    }
}
