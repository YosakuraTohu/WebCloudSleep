import { Graphics, SCALE_MODES, settings } from 'pixi.js';
import { app } from '../Main';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

let bg = new Graphics();
bg.beginFill(0xffffff);
bg.drawRect(0, 0, app.view.width, app.view.height);
app.stage.addChild(bg);
