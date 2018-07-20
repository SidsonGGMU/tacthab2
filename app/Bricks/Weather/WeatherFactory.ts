import {Brick} from "../Brick";
import {Weather} from "./Weather";

class WeatherFactory extends Brick {
    private meteos: Weather[] = [];

    constructor() {
        super( {name: "Weather Brick Factory", id: "WeatherFactory"} );
        this.types.push( "WeatherFactory" );
    }

    createWeather(city: string): string {
        const weather = new Weather(city);
        this.meteos.push( weather );
        return weather.getID();
    }

    deleteWeather(id: string) {
        const weatherToDelete = this.meteos.find( B => B.getID() === id);
        if (weatherToDelete) {
            weatherToDelete.dispose();
            this.meteos = this.meteos.filter( B => B.getID() !== id );
        } else {
            throw `There is no Weather Brick identified by ${id}`;
        }
    }
}

export const weatherFactory = new WeatherFactory();
