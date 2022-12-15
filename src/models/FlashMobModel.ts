import {  action, makeObservable, observable } from "mobx";
import { MainModel } from "./MainModel";



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
                        [1.75, "B4"],
                        [2, "A4"],
                        [3.5, "G4"],
                        [4, "F4+"],
                        [5, "E4"],
                        [6, "D4"],
                        [7.5, "A4"],
                        [8, "B4"],
                        [9.5, "B4"],
                        [10, "C5+"],
                        [11.5, "C5+"],
                        [12, "D5"],

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
                        [7.5, "A4"],
                        [8, "G4"],
                        [9.5, "G4"],
                        [10, "E4"],
                        [11.5, "G4"],
                        [12, "F4+"],
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
                        [7.5, "D4"],
                        [8, "D4"],
                        [9.5, "D4"],
                        [10, "A3"],
                        [11.5, "A3"],
                        [12, "A3"],
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
                        [7.5, "F3+"],
                        [8, "G3"],
                        [9.5, "G3"],
                        [10, "A3"],
                        [11.5, "A3"],
                        [12, "D3"],
                    ]
                },

            ]
        },
    ]
}




export interface StatusItem {
    id: number,
    text: string
}


//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
// 
//--------------------------------------------------------------------------------------
export class FlashMobModel {

    semiToneMap = new Map<string,{name: string, semitone: number}>()
    public syncStatusItems: StatusItem[] = observable([] as StatusItem[])

    private _startTime = 0;
    changeColor: (color: string) => void = ()=>{}
    playSound: (name: string, semitone: number, volume: number) => void = () => {}

    @observable  private _secondsToStart = 0
    get secondsToStart() {return this._secondsToStart}
    set secondsToStart(value) {
        if(value !== this._secondsToStart) {
            action(()=>{this._secondsToStart = value})()
        } 
    }

    @observable  private _pickedTrack = -1
    get pickedTrack() {return this._pickedTrack}
    set pickedTrack(value) {action(()=>{this._pickedTrack = value})()}
    

    private _mainModel: MainModel;
    

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    constructor(mainModel: MainModel, startTime: number) {
        makeObservable(this);
        this._mainModel = mainModel;
        this._startTime = startTime;
        console.log(`START: ${startTime}`)
        this.fillSemitones();

        setInterval(()=>{
            this.secondsToStart =Math.floor((this._startTime - this._mainModel.adjustedNow)/100)/10;
        },100)   
    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------  
    start(trackId: number) {
        const song = testMusic;
        const semiToneOffset = this.semiToneMap.get(song.instruments[0].note)!.semitone;
        const tempoAdjust = .5;

        const track = testMusic.sections[0].tracks[trackId];
        let position = 0;
        this.pickedTrack = trackId;

        const getPlayEventTime = (beatOffset: number) => {
            return this._startTime + 1000 * beatOffset * tempoAdjust;
        }

        let getNextPlayTime = getPlayEventTime(track.sequence[position][0] as number);
        while(getNextPlayTime < this._mainModel.adjustedNow) {
            position++;
            if(position >= track.sequence.length) break;
            getNextPlayTime = getPlayEventTime(track.sequence[position][0] as number);
        }
        setInterval(()=>{
            const now = this._mainModel.adjustedNow;
            if(now > getNextPlayTime && position < track.sequence.length) {
                const note = track.sequence[position][1] as string;
                const noteInfo = this.semiToneMap.get(note.substring(0,2)) ?? {name: "A0", semitone: 0}
                let semiTone = noteInfo.semitone - semiToneOffset;
                if(note.length > 2) semiTone += (note[3] === "+" ? -1 : 1)

                //console.log(`PLAY ${note} ${semiTone} ${nextPlay}`)
                this.playSound("dong", semiTone, 1);
                position++;
                if(position < track.sequence.length) {
                    getNextPlayTime = getPlayEventTime(track.sequence[position][0] as number);
                }
            }
        },2)        
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


}