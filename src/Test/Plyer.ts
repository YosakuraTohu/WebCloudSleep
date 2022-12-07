import { Sprite } from 'pixi.js';
import { senceContainer } from './LoadScene';

let sp = Sprite.from(
    'Packages/Sunset Inn/contents/sleepers/sleeper Pink Girl.png',
);
sp.zIndex = sp.y - 9.5;
senceContainer.addChild(sp);

let r: number = 1;

window.addEventListener('keydown', e => {
    switch (e.code) {
        case 'ArrowUp':
            sp.y -= r;
            sp.zIndex = sp.y - 7.5;
            break;
        case 'ArrowDown':
            sp.y += r;
            sp.zIndex = sp.y - 7.5;
            break;
        case 'ArrowLeft':
            sp.x -= r;
            break;
        case 'ArrowRight':
            sp.x += r;
            break;
        case 'KeyZ':
            r = 20;
            break;
        case 'KeyX':
            r = 1;
            break;
        default:
            break;
    }
});
