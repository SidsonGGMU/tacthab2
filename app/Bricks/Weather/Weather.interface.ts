
export interface WeatherInterface {
    call(c: {weatherID: string, method: string, arguments: any[]});
}