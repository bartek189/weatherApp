export interface WeatherApiResponse {
    location: {
        name: string;
    };
    current: {
        temp_c: number;
        humidity: number;
        wind_kph: number;
    };
    forecast: {
        forecastday: Array<{
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
            }
        }>
    }
}

