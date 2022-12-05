import { Graphics, SCALE_MODES, settings, Sprite } from 'pixi.js';
import { app } from '../Main';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

let sp = Sprite.from('assets/phone_bg.png');
sp.scale = { x: 0.4, y: 0.4 };
sp.alpha = 0.3;
sp.interactive = true;

let obj = new Graphics();
obj.beginFill(0xffffff);
obj.drawRect(0, 0, app.view.width, app.view.height);
obj.interactive = true;

app.stage.addChild(obj);
app.stage.addChild(sp);

let intervalID: NodeJS.Timer;
let timeSpeed: number;
sp.on('pointerover', (_) => {
    clearInterval(intervalID);
    timeSpeed = 0.01;
    intervalID = setInterval(() => {
        obj.alpha -= timeSpeed;
        timeSpeed += 0.001 + obj.alpha / 80;
        if (obj.alpha <= 0) {
            clearInterval(intervalID);
            obj.alpha = 0;
        }
    }, 16);
});
obj.on('pointerover', (_) => {
    clearInterval(intervalID);
    timeSpeed = 0.01;
    intervalID = setInterval(() => {
        obj.alpha += timeSpeed;
        timeSpeed += 0.001 + obj.alpha / 80;
        if (obj.alpha >= 1) {
            clearInterval(intervalID);
            obj.alpha = 1;
        }
    }, 16);
});
