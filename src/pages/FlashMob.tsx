import HandsHighAssets from "assets/Assets";
import { MediaHelper } from "helpers/MediaHelper";
import { observer } from "mobx-react";
import { FlashMobModel } from "models/FlashMobModel";
import React from "react";



interface FlashMobProps {
    model?: FlashMobModel
}

// -------------------------------------------------------------------
// LobbyComponent
// -------------------------------------------------------------------
@observer
export class FlashMob extends React.Component<FlashMobProps> {
    media: MediaHelper;

    // -------------------------------------------------------------------
    // ctor
    // -------------------------------------------------------------------
    constructor(props: FlashMobProps) {
        super(props);

        this.media = new MediaHelper();
        for(let soundName in HandsHighAssets.sounds)
        {
            this.media.loadSound((HandsHighAssets.sounds as any)[soundName]);
        }

        if(props.model) {
            props.model.playSound = (name, semiTone, volume) => {
                const sound = (HandsHighAssets.sounds as any)[name];
                if(sound) {
                    const rateAdjust = this.media.soundHelper.getRateAdjust(semiTone)
                    this.media.playSound(sound, {volume, rateAdjust});
                }
            }            
        }
    }

    //--------------------------------------------------------------------------------------
    // 
    //--------------------------------------------------------------------------------------
    componentDidMount(): void {
        const label = document.getElementById("FastPrinter")  
        const background = document.getElementById("ThePage")
        const colors= ["#a0a0a0", "#a8a8a8", "#afafaf", "#a8a8a8"]
        let colorIndex = 0;

        setInterval(()=>{
            if(label) {
                label.innerText = `Seconds to start: ${this.props.model?.secondsToStart.toFixed(1)}`
            }
            if(background) {
                background.style.backgroundColor = colors[colorIndex++ % 4]
            }
        },200)
    }

    // -------------------------------------------------------------------
    // render
    // -------------------------------------------------------------------
    render() {
        const {model} = this.props;
        if(!model) {
            return <div>No Model?</div>
        }

        return <div id="ThePage" style={{height: "100%"}}>
            <div>Playback...</div>
            <div id="FastPrinter" />
            <div>
                Start Track: 
                <button onClick={()=>model.start(0)}>1</button>
                <button onClick={()=>model.start(1)}>2</button>
                <button onClick={()=>model.start(2)}>3</button>
                <button onClick={()=>model.start(3)}>4</button>
            </div>
        </div>
    };

}
