import { Viewport } from 'pixi-viewport';
import { Application } from 'pixi.js';
import './Style.css';

export const app = new Application({
    backgroundColor: 'black',
    resolution: 1,
    antialias: true,
    hello: true,
});

export const viewport = new Viewport({
    divWheel: app.view as HTMLCanvasElement,
});

require('./Init');
