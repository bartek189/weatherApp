import {Component, computed, inject} from '@angular/core';
import {CityService} from "../city-service";
import {DecimalPipe} from '@angular/common';
import {WeatherInformation} from '../weatherInformation.model';


@Component({
    selector: 'app-weather-more-information',
    imports: [],
    templateUrl: './weather-more-information.component.html',
    styleUrl: './weather-more-information.component.css',
    providers: [DecimalPipe]

})
export class WeatherMoreInformationComponent {
    private cityService = inject(CityService);
    private decimalPipe = inject(DecimalPipe);

    cityData = computed<WeatherInformation>(() => {
        return this.cityService.weatherInfo();
    });

    infoBlocks = computed(() => [
        {
            label: 'max temperature',
            icon: 'max.png',
            value: `${this.decimalPipe.transform(this.cityData().maxTemp, '1.0-0')}°C`,
        },
        {
            label: 'min temperature',
            icon: 'min.png',
            value: `${this.decimalPipe.transform(this.cityData().minTemp, '1.0-0')}°C`,
        },
        {
            label: 'Humidity',
            icon: 'humity.png',
            value: `${this.cityData().humidity}%`
        },
        {
            label: 'Wind',
            icon: 'wind.png',
            value: `${this.decimalPipe.transform(this.cityData().wind, '1.0-0')} km/h`
        }
    ]);
}
