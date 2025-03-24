import {Component, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CityService} from "../city-service";

@Component({
    selector: 'app-search-bar',
    imports: [
        CommonModule, ReactiveFormsModule, FormsModule,
    ],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
    private cityService = inject(CityService);

    city = signal('');

    search() {
        const cityValue = this.city().trim();

        if (cityValue) {
            this.cityService.setCity(cityValue);
        }
    }
}
