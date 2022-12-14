import HandsHighAssets from "assets/Assets";
import { MediaHelper } from "helpers/MediaHelper";
import { observer } from "mobx-react";
import { ClientModel } from "models/ClientModel";
import React from "react";



interface MainPageProps {
    model?: ClientModel
}

// -------------------------------------------------------------------
// LobbyComponent
// -------------------------------------------------------------------
@observer
export class MainPage extends React.Component<MainPageProps> {
    private _urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    media: MediaHelper;

    // -------------------------------------------------------------------
    // ctor
    // -------------------------------------------------------------------
    constructor(props: MainPageProps) {
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
                label.innerText = `Seconds to start: ${this.props.model?.secondsToStart}`
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
            <h2>MAIN PAGE</h2>
            <div id="FastPrinter" />
            <button onClick={()=>model.start()}>Click to start</button>
        </div>
    };

}
