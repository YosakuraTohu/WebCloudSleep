import { Graphics, SCALE_MODES, settings } from 'pixi.js';
import { app, viewport } from '../Main';

/* settings.SCALE_MODE = SCALE_MODES.NEAREST; */

let bg = new Graphics();
bg.beginFill(0xffffff);
bg.drawRect(-8000, -10000, 20000, 20000);
viewport.addChild(bg);
