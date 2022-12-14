import { observer } from "mobx-react";
import React from "react";
import styles from './MainPage.module.css';
import DateTimePicker from 'react-datetime-picker';
import { MainModel } from "models/MainModel";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FlashMobModel } from "models/FlashMobModel";
import { FlashMob } from "./FlashMob";


interface PickerViewProps {
    model?: MainModel
}


@observer
export class PickerView extends React.Component<PickerViewProps> {
    // -------------------------------------------------------------------
    // render
    // -------------------------------------------------------------------
    render() {
        const {model} = this.props;
        if(!model) {
            return <div>No Model?</div>
        }

        const timeChange = (newTime: Date) => {
            model.startTime = newTime;
        }
        const url = window.location.toString() + model.url
        return <div>
            <div className={styles.FeatureSection}>
                    <h4>Flash Mob</h4>
                    <button onClick={() => model.addTime(30)}>30 seconds</button>
                    <button onClick={() => model.addTime(300)}>5 min</button>
                    <button onClick={() => model.addTime(1800)}>30 min</button>
                    <br/>
                    <DateTimePicker onChange={timeChange} value={model.startTime} />
                    <div>Seconds til start: {model.secondsTilStart.toFixed(1)}</div>
                    <div>URL: <a href={url}>{url}</a></div>
                </div>            
        </div> 
    }
}

interface MainPageProps {
    model?: MainModel
}

// -------------------------------------------------------------------
// LobbyComponent
// -------------------------------------------------------------------
@observer
export class MainPage extends React.Component<MainPageProps> {
    private _urlParams: URLSearchParams = new URLSearchParams(window.location.search);

    // -------------------------------------------------------------------
    // render
    // -------------------------------------------------------------------
    render() {
        const {model} = this.props;
        if(!model) {
            return <div>No Model?</div>
        }

        const makeFlashMobModel = () => {
            return new FlashMobModel(
                model,
                Number.parseInt(this._urlParams.get("start") ?? `${model.startTime}`)
            )
        }

        return  (
            <div className={styles.MainPage}> 
                <div><a href="/">Hands High!</a></div>
                <Router>
                    <Routes>
                        <Route path="/flashmob">
                            <Route index  element={<FlashMob      model={makeFlashMobModel()} />}/>
                        </Route>
                        <Route path="/">
                            <Route index  element={<PickerView    model={model} />} />
                        </Route>
                    </Routes>
                </Router>         
            </div>
        )      
    }
} 
