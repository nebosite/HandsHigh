import { observable, action, makeObservable } from "mobx";

interface TimeNugget {
    utc_datetime: string
    // "abbreviation": "PST",
    // "client_ip": "50.35.127.71",
    // "datetime": "2022-12-12T13:10:56.852782-08:00",
    // "day_of_week": 1,
    // "day_of_year": 346,
    // "dst": false,
    // "dst_from": null,
    // "dst_offset": 0,
    // "dst_until": null,
    // "raw_offset": -28800,
    // "timezone": "America/Los_Angeles",
    // "unixtime": 1670879456,
    // "utc_datetime": "2022-12-12T21:10:56.852782+00:00",
    // "utc_offset": "-08:00",
    // "week_number": 50
}

const MS_PER_MINUTE = 60 * 1000;

export class MainModel {
    @observable  private _startTime = new Date(Date.now() + 60000);
    get startTime() {return this._startTime}
    set startTime(value) {action(()=>{this._startTime = value})()}

    @observable  private _secondsTilStart = 0;
    get secondsTilStart() {return this._secondsTilStart}
    set secondsTilStart(value) {action(()=>{this._secondsTilStart = value})()}

    get url() {return `flashmob?start=${this._startTime.valueOf()}`}
    
    
    
    get adjustedNow() { return Date.now() + this._timeDelta}
    private _timeDelta = 0;

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    constructor() {
        makeObservable(this);
        this.calibrateServerTimeOffset();

        setInterval(()=>{
            this.secondsTilStart = Math.floor((this.startTime.valueOf() -  this.adjustedNow)/100)/10
        },100)
    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    addTime(seconds: number) {
        this.startTime = new Date(Date.now() + seconds * 1000)
    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    calibrateServerTimeOffset = () => {
        let id = 0;
        let bestElapsed = 10000000;
        let backoff_ms = 100;
        let delta = 0;
        const maxServerPings = 10;
        const goodEnoughElapsedTime_ms = 12;
        
        const checkTime = async () => {
            const start = Date.now();
            const nugget = await this.restCall<TimeNugget>("http://worldtimeapi.org/api/timezone/America/Los_Angeles")
            const end = Date.now();
            const elapsed = end - start;
            if(elapsed < bestElapsed) {
                bestElapsed = elapsed;
                const serverTime = Date.parse(nugget.utc_datetime) - elapsed/2;
                delta = Math.floor(start - serverTime.valueOf());
            }
            id++;
            backoff_ms *= 1.5;

            let done = elapsed <= goodEnoughElapsedTime_ms;
            if(id >= maxServerPings) done = true;

            if(!done) {
                setTimeout(checkTime,backoff_ms)
            }
            else {
                this._timeDelta = delta;
                console.log(`Finished checking absolute time delta.  Tries: ${id} Best: ${bestElapsed} Delta: ${this._timeDelta}`)
            }
        }
        setTimeout(checkTime,100)

        // Do this check every 5 minutes
        setTimeout(this.calibrateServerTimeOffset, 5 * MS_PER_MINUTE);
    }

    // -------------------------------------------------------------------
    // _serverCall 
    // -------------------------------------------------------------------
    async restCall<T>(url: string, payload: any | undefined = undefined) {
        if(payload) {
            const response = await fetch(url, {
                method: "POST",
                headers: [
                    ['Content-Type', 'application/json']
                ],
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                return await response.json() as T
            } else {
                const responseBody = await response.text();
                throw new Error("Failed to connect to game: " + responseBody);
            }        
        }
        else {
            const response = await fetch(url, { method: "GET" });
            if (response.ok) {
                const streamText = await response.text();
                return await JSON.parse(streamText) as T
            } else {
                const responseBody = await response.text();
                throw new Error("Server call failed" + responseBody);
            }        
        }

    }
}