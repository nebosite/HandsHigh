import Logger from 'js-logger';
import {createRoot} from 'react-dom/client'
import { GLOBALS } from './Globals';
import 'index.css'
import { MainPage } from 'pages/MainPage';
import { MainModel } from 'models/MainModel';

// Configure logging levels here
// TODO: While in production, set default log level to WARN/ERROR
// eslint-disable-next-line
Logger.useDefaults();
Logger.setLevel(Logger.DEBUG);
// if (process.env.REACT_APP_DEVMODE === 'development') {
//     Logger.setLevel(Logger.DEBUG);
// } else {
//     Logger.setLevel(Logger.WARN);
// }

const rootContainer = document.getElementById('root') as HTMLElement;
const root = createRoot(rootContainer);

document.title = GLOBALS.Title;

// auto-redirect http to http on the prod server
if (window.location.href.toLowerCase().startsWith('http://clusterfun.tv')) {
    window.location.replace(`https:${window.location.href.substring(5)}`);
}

Logger.info(`------- PAGE RELOAD -------------------`)

const model = new MainModel()
  
setTimeout(async() => { root.render( <MainPage model={model}/> );  },0)
root.render( <div>Loading stuff....</div> );     

