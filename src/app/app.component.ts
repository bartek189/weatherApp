import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {WeatherInformationComponent} from "./weather-information/weather-information.component";
import {SearchBarComponent} from "./search-bar/search-bar.component";
import {WeatherMoreInformationComponent} from "./weather-more-information/weather-more-information.component";
import {ErrorService} from "./shared/error.service";
import {ErrorModalComponent} from "./shared/modal/error-modal/error-modal.component";

@Component({
    selector: 'app-root',
    imports: [CommonModule,
        WeatherInformationComponent,
        SearchBarComponent,
        WeatherMoreInformationComponent,
        ErrorModalComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    private errorService = inject(ErrorService);
    error = this.errorService.error;
}
