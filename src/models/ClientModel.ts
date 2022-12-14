import {  action, makeObservable, observable } from "mobx";

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

const testMusic = {
    instruments: [
        {
            name: "dong",
            note: "C4"
        }
    ],
    sections: [
        {
            signature: "2/4",
            tempo: 120,
            tracks: [
                {
                    instrument: "dong",
                    sequence: [
                        [0, "D5"],
                        [1, "C5+"],
                        [1.9375, "B4"],
                        [2, "A4"],
                        [3.5, "G4"],
                        [4, "F4+"],
                        [5, "E4"],
                        [6, "D4"],
                    ]
                },
                {
                    instrument: "dong",
                    sequence: [
                        [0, "F4+"],
                        [1, "A4"],
                        [1.9375, "G4"],
                        [2, "F4+"],
                        [3.5, "E4"],
                        [4, "D4"],
                        [5, "C4"],
                        [6, "D4"],
                    ]
                },
                {
                    instrument: "dong",
                    sequence: [
                        [0, "A3"],
                        [1, "D4"],
                        [1.9375, "D4"],
                        [2, "D4"],
                        [3.5, "B3"],
                        [4, "A3"],
                        [5, "A3"],
                        [5.5, "G3"],
                        [6, "F3+"],
                    ]
                },
                {
                    instrument: "dong",
                    sequence: [
                        [0, "D3"],
                        [1, "D3"],
                        [1.9375, "D3"],
                        [2, "D3"],
                        [3.5, "G2"],
                        [4, "A2"],
                        [5, "A2"],
                        [6, "D3"],
                    ]
                },

            ]
        },
    ]
}




const MS_PER_MINUTE = 60 * 1000;
export interface StatusItem {
    id: number,
    text: string
}


//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
// 
//--------------------------------------------------------------------------------------
export class ClientModel {

    semiToneMap = new Map<string,{name: string, semitone: number}>()
    public syncStatusItems: StatusItem[] = observable([] as StatusItem[])

    private _timeDelta = 0;
    private _startTime = Date.now() + 100000000;
    changeColor: (color: string) => void = ()=>{}
    playSound: (name: string, semitone: number, volume: number) => void = () => {}

    @observable  private _secondsToStart = 0
    get secondsToStart() {return this._secondsToStart}
    set secondsToStart(value) {
        if(value !== this._secondsToStart) {
            action(()=>{this._secondsToStart = value})()
        } 
    }
    

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    constructor() {
        makeObservable(this);
        console.log(`Fooligans`)
        this.calibrateServerTimeOffset();

        this.fillSemitones();


    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------  
    start() {
        this._startTime = Math.floor(Date.now()/1000) * 1000 + 6000 + this._timeDelta;
        const song = testMusic;
        const semiToneOffset = this.semiToneMap.get(song.instruments[0].note)!.semitone;
        const track = testMusic.sections[0].tracks[0];
        let position = 0;

        let nextPlay = this._startTime + this._timeDelta + 1000 * (track.sequence[position][0] as number);
        setInterval(()=>{
            this.secondsToStart =Math.floor((this._startTime - Date.now() + this._timeDelta)/1000);

            const adjustedNow = Date.now() + this._timeDelta;
            if(adjustedNow > nextPlay && position < track.sequence.length) {
                const note = track.sequence[position][1] as string;
                const noteInfo = this.semiToneMap.get(note.substring(0,2)) ?? {name: "A0", semitone: 0}
                let semiTone = noteInfo.semitone - semiToneOffset;
                if(note.length > 2) semiTone += (note[3] === "+" ? -1 : 1)

                //console.log(`PLAY ${note} ${semiTone} ${nextPlay}`)
                this.playSound("dong", semiTone, 1);
                position++;
                if(position < track.sequence.length) {
                    nextPlay = this._startTime + this._timeDelta + 1000 * (track.sequence[position][0] as number);
                }
            }
        },10)        
    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    fillSemitones() {
        let octave = 0;
        let letter = "A";
        let semitone = 0;
        while (octave < 9) {
            const name = letter + octave;
            this.semiToneMap.set(name, {name, semitone})
            //console.log(`SEMITONE ${name} ${semitone}`)
            switch(letter){
                case "A":
                    letter = "B";
                    semitone += 2;
                    break;
                case "B":
                    letter = "C";
                    semitone += 1;
                    octave++;
                    break;
                case "C":
                    letter = "D";
                    semitone += 2;
                    break;
                case "D":
                    letter = "E";
                    semitone += 2;
                    break;
                case "E":
                    letter = "F";
                    semitone += 1;
                    break;
                case "F":
                    letter = "G";
                    semitone += 2;
                    break;
                case "G":
                    letter = "A";
                    semitone += 2;
                    break;               
            }

        }
    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    calibrateServerTimeOffset() {
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