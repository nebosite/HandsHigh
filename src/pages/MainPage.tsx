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

    // -------------------------------------------------------------------
    // render
    // -------------------------------------------------------------------
    render() {
        const {model} = this.props;
        if(!model) {
            return <div>No Model?</div>
        }

        return <div>
            <h2>MAIN PAGE</h2>
            <div>
            {
                model.syncStatusItems.map(i => {
                    return <div key={i.id}>{i.text}</div>
                })
            }

            </div>
        </div>
    };

}
