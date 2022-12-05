import { Assets, Container, Resource, Sprite, Texture } from 'pixi.js';
import { app } from '../Main';

type Offset = {
    x: number;
    y: number;
};

let sence: any;
let backgrounds: any;
let backgrounds_assets: Array<Promise<Texture<Resource>>> = [];
let decorates: any;
let decorates_assets: Array<Promise<Texture<Resource>>> = [];
let decorates_offsets: Array<Offset> = [];
let beds: any;
let beds_assets: Array<Promise<Texture<Resource>>> = [];
let beds_offsets: Array<Offset> = [];

let scale: number = 0.5;

let senceContainer = new Container();
senceContainer.interactive = true;

app.stage.addChild(senceContainer);

(async () => {
    await fetch('Packages/Sunset Inn/contents/scene.json')
        .then((r) => {
            return r.json();
        })
        .then((j) => {
            sence = j;
        });

    await fetch('Packages/Sunset Inn/contents/backgrounds.json')
        .then((r) => {
            return r.json();
        })
        .then((j) => {
            backgrounds = j;
        });

    await fetch('Packages/Sunset Inn/contents/decorates.json')
        .then((r) => {
            return r.json();
        })
        .then((j) => {
            decorates = j;
        });

    await fetch('Packages/Sunset Inn/contents/beds.json')
        .then((r) => {
            return r.json();
        })
        .then((j) => {
            beds = j;
        });

    await backgrounds.materials.forEach(async (element: any) => {
        backgrounds_assets.push(
            Assets.load(
                `Packages/Sunset Inn/contents/backgrounds/${element.filename}`,
            ) as Promise<Texture<Resource>>,
        );
    });

    await decorates.materials.forEach(async (element: any) => {
        decorates_assets.push(
            Assets.load(
                `Packages/Sunset Inn/contents/decorates/${element.filename}`,
            ) as Promise<Texture<Resource>>,
        );
        decorates_offsets.push({ x: element.offset[0], y: element.offset[1] });
    });

    await beds.materials.forEach(async (element: any) => {
        beds_assets.push(
            Assets.load(
                `Packages/Sunset Inn/contents/beds/${element.filename}`,
            ) as Promise<Texture<Resource>>,
        );
        beds_offsets.push({ x: element.offset[0], y: element.offset[1] });
    });

    await sence.backgrounds.forEach(async (element: any) => {
        const sp = new Sprite(await backgrounds_assets[element.materialId]);
        sp.x = element.xPos;
        sp.y = element.yPos;
        senceContainer.addChild(sp);
    });

    await sence.decorates.forEach(async (element: any) => {
        const sp = new Sprite(await decorates_assets[element.materialId]);
        sp.x = element.xPos - decorates_offsets[element.materialId].x + 150;
        sp.y = element.yPos - decorates_offsets[element.materialId].y + 150;
        senceContainer.addChild(sp);
    });

    await sence.beds.forEach(async (element: any) => {
        const sp = new Sprite(await beds_assets[element.materialId]);
        sp.x = element.xPos - beds_offsets[element.materialId].x + 150;
        sp.y = element.yPos - beds_offsets[element.materialId].y + 150;
        senceContainer.addChild(sp);
    });
})();

senceContainer.x = 700;
senceContainer.y = 400;

senceContainer.scale = { x: scale, y: scale };

let flag: boolean = false;
let Gx: number;
let Gy: number;

senceContainer.on('pointerdown', () => {
    flag = true;
});
senceContainer.on('pointerleave', () => {
    flag = false;
});
senceContainer.on('pointerup', () => {
    flag = false;
});
senceContainer.on('pointerout', () => {
    flag = false;
});

senceContainer.on('pointermove', (e) => {
    if (flag) {
        Gx = e.global.x;
        Gy = e.global.y;

        console.log(e.global.x);
    }
});
