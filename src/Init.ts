import './Test';

import { app, viewport } from './Main';
document.body.appendChild(app.view as HTMLCanvasElement);
app.stage.addChild(viewport);
viewport.drag().pinch().wheel().decelerate();

app.resizeTo = window;
viewport.resize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
    viewport.resize(window.innerWidth, window.innerHeight);
});
