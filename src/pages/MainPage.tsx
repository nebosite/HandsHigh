import { observer } from "mobx-react";
import { ClientModel } from "models/ClientModel";
import React from "react";
import styles from './MainPage.module.css';

interface MainPageProps {
    model?: ClientModel
}

// -------------------------------------------------------------------
// LobbyComponent
// -------------------------------------------------------------------
@observer
export class MainPage extends React.Component<MainPageProps> {

    // -------------------------------------------------------------------
    // render
    // -------------------------------------------------------------------
    render() {
        const {model} = this.props;
        if(!model) {
            return <div>No Model?</div>
        }

        return <div className={styles.MainPage}> 
            <h2>Hands High!</h2>
            <div>
                <h4>Flash Mob</h4>
            </div>
        </div>
    };

} 
