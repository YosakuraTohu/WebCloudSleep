import { Application } from 'pixi.js';
import './Style.css';

export let app = new Application({
    width: 1920,
    height: 1080,
    backgroundColor: 'black',
});

document.body.appendChild(app.view as HTMLCanvasElement);

require('./Init');
