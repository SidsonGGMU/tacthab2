import * as io from "socket.io-client";
import {Brick, BrickJSON} from "../Brick";
import {WeatherDescription} from "./WEATHER.data";
import {WeatherInterface } from "./Weather.interface";
import * as fetch from "node-fetch";

/* Some constants declarations for the HTTP Request*/
const requestHeader = "http://api.openweathermap.org/data/2.5/weather?q="; 
const openWeatherAPIKey = "0fc5126d7b78ddff6c1da686b674de0d";
const units = "units=metric"; 

export interface WeatherJSON extends BrickJSON {
    weatherDescription: WeatherDescription;
}

export class Weather extends Brick implements WeatherInterface {
    private weatherDescription : WeatherDescription;
    private socket;
    constructor(city : string) {
        super({ name: city });

        this.types.push("BrickWeather");

        /* Fetching data from OpenWeather */
        this.fetchData(city);
       
    }

    call(c: {weatherID: string, method: string, arguments: any[]}) {
        this.socket.emit("call", c);
    }

    /* Fetching data from OpenWeather API */
    fetchData(city : string) {
        fetch(requestHeader+city+'&APPID='+openWeatherAPIKey+'&'+units)
        .then((res) => {
            if (res.ok) {
                return res.json();
              } else {
                throw new Error(res.json());
            }
        })
        .then((data) => {
            this.weatherDescription = data;        
            this.subjectEvents.next({
                attribute: "weatherDescription",
                data: this.weatherDescription
            });
            console.log ('Success'); 
        })
        .catch((error) => {
            this.weatherDescription = error.json();        
            this.subjectEvents.next({
                attribute: "weatherDescription",
                data: error.json()
            });
            console.log("Mdr: " +error.json())});
        }


    dispose() {
        super.dispose()
    }
    /*
    updateDescription(update: {[key: string]: any}) {
        this.WeatherDescription.city = this.WeatherDescription.city;
        this.subjectEvents.next({
            attribute: "updateState",
            data: update
        });
    }*/

    toJSON() {
        return {
            ...super.toJSON(),
            weatherDescription: this.weatherDescription
        };
    }
}