import {Component, computed, inject} from '@angular/core';
import {CommonModule, DecimalPipe} from "@angular/common";
import {CityService} from "../city-service";
import {WeatherInformation} from "../weatherInformation.model";

@Component({
    selector: 'app-weather-information',
    imports: [
        DecimalPipe, CommonModule,
    ],
    templateUrl: './weather-information.component.html',
    styleUrl: './weather-information.component.css'
})
export class WeatherInformationComponent {
    cityService = inject(CityService);


    cityData = computed<WeatherInformation>(() => {
        return this.cityService.weatherInfo();
    });

}