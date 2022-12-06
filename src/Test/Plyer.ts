import { Sprite } from "pixi.js";
import { senceContainer } from "./LoadScene";

let sp = Sprite.from("Packages/Sunset Inn/contents/sleepers/sleeper Pink Girl.png");
sp.zIndex = sp.y + 300;
senceContainer.addChild(sp);

let r:number =1;

window.addEventListener("keydown", e=> {
    switch (e.code) {
        case "ArrowUp":
            sp.y-=r;
            sp.zIndex = sp.y + 293;
            break;
        case "ArrowDown":
            sp.y+=r;
            sp.zIndex = sp.y + 293;
            break;
        case "ArrowLeft":
            sp.x-=r;
            break;
        case "ArrowRight":
            sp.x+=r;
            break;
        case "KeyZ":
            r=20
            break;
        case "KeyX":
            r=1
            break;
        default:
            break;
    }
})