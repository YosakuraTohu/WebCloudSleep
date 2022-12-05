import { Assets, Container, Resource, Sprite, Texture } from 'pixi.js';
import { viewport } from '../Main';

type Offset = {
    x: number;
    y: number;
};

type Character = {
    texture: Texture<Resource>;
    emotions: Array<Texture<Resource>>;
};

let sence: any;

let sleepers: any;
let sleepers_assets: Array<Character> = [];
let sleepers_offsets: Array<Offset> = [];

let backgrounds: any;
let backgrounds_assets: Array<Texture<Resource>> = [];

let decorates: any;
let decorates_assets: Array<Texture<Resource>> = [];
let decorates_offsets: Array<Offset> = [];

let beds: any;
let beds_assets: Array<Texture<Resource>> = [];
let beds_offsets: Array<Offset> = [];

let senceContainer = new Container();
viewport.addChild(senceContainer);

(async () => {
    await fetch('Packages/Sunset Inn/contents/scene.json')
        .then(r => r.json())
        .then(j => {
            j.sleepers.sort((a: any, b: any) => a.yPos - b.yPos);
            j.backgrounds.sort((a: any, b: any) => a.yPos - b.yPos);
            j.decorates.sort((a: any, b: any) => a.yPos - b.yPos);
            j.beds.sort((a: any, b: any) => a.yPos - b.yPos);
            sence = j;
        });

    await fetch('Packages/Sunset Inn/contents/sleepers.json')
        .then(r => r.json())
        .then(j => (sleepers = j));

    await fetch('Packages/Sunset Inn/contents/backgrounds.json')
        .then(r => r.json())
        .then(j => (backgrounds = j));

    await fetch('Packages/Sunset Inn/contents/decorates.json')
        .then(r => r.json())
        .then(j => (decorates = j));

    await fetch('Packages/Sunset Inn/contents/beds.json')
        .then(r => r.json())
        .then(j => (beds = j));

    await (async () => {
        for (const i of sleepers.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/sleepers/${i.filename}`,
            );
            let e: Array<Texture<Resource>> = [];
            for (const k of i.emotefilenames) {
                let nc = await Assets.load(
                    `Packages/Sunset Inn/contents/sleepers/emotes/${i.filename}/${k}`,
                );
                e.push(nc);
            }
            sleepers_assets.push({ texture: c, emotions: e });
            sleepers_offsets.push({ x: i.offset[0], y: i.offset[1] });
        }

        for (const i of backgrounds.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/backgrounds/${i.filename}`,
            );
            backgrounds_assets.push(c);
        }

        for (const i of decorates.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/decorates/${i.filename}`,
            );
            decorates_assets.push(c);
            decorates_offsets.push({ x: i.offset[0], y: i.offset[1] });
        }

        for (const i of beds.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/beds/${i.filename}`,
            );
            beds_assets.push(c);
            beds_offsets.push({ x: i.offset[0], y: i.offset[1] });
        }
    })();

    sence.backgrounds.forEach((element: any) => {
        const sp = new Sprite(backgrounds_assets[element.materialId]);
        sp.x = element.xPos;
        sp.y = element.yPos;
        senceContainer.addChild(sp);
    });

    sence.decorates.forEach((element: any) => {
        const sp = new Sprite(decorates_assets[element.materialId]);
        sp.x = element.xPos - decorates_offsets[element.materialId].x + 150;
        sp.y = element.yPos - decorates_offsets[element.materialId].y + 150;
        senceContainer.addChild(sp);
    });

    sence.beds.forEach((element: any) => {
        const sp = new Sprite(beds_assets[element.materialId]);
        sp.x = element.xPos - beds_offsets[element.materialId].x + 150;
        sp.y = element.yPos - beds_offsets[element.materialId].y + 150;
        senceContainer.addChild(sp);
    });

    sence.sleepers.forEach((element: any) => {
        const sp = new Sprite(sleepers_assets[element.materialId].texture);
        sp.x = element.xPos - sleepers_offsets[element.materialId].x + 150;
        sp.y = element.yPos - sleepers_offsets[element.materialId].y + 150;
        senceContainer.addChild(sp);
    });
})();
