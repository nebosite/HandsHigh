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
        return <div>MAIN PAGE</div>
    };

}
