import { Assets, Container, Resource, Sprite, Texture } from 'pixi.js';
import { viewport } from '../Main';

type Offset = {
    x: number;
    y: number;
};

type SenceAsset = {
    texture: Texture<Resource>;
};

type SenceAssetWithOffset = SenceAsset & {
    offset: Offset;
};

type BackgroundsAsset = SenceAsset;

type DecoratesAsset = SenceAssetWithOffset;

type BedsAsset = SenceAssetWithOffset & {
    characters: Array<Texture<Resource>>;
};

type CharacterAsset = SenceAssetWithOffset & {
    emotions: Array<Texture<Resource>>;
};

type MixedAsset<V extends string> = Object & {
    [propName in V]:
        | SenceAsset
        | SenceAssetWithOffset
        | BackgroundsAsset
        | DecoratesAsset
        | BedsAsset
        | CharacterAsset;
};

type MaterialPosition = {
    xPos: number;
    yPos: number;
};

type MaterialScene<V extends string> = Object & {
    [propName in V]: Map<number, Array<MaterialPosition>>;
};

enum Scene {
    sleepers = 'sleepers',
    backgrounds = 'backgrounds',
    decorates = 'decorates',
    beds = 'beds',
}

let sence_processed: MaterialScene<Scene> = {
    sleepers: new Map(),
    backgrounds: new Map(),
    decorates: new Map(),
    beds: new Map(),
};

let sleepers: any;
let sleepers_assets: Array<CharacterAsset> = [];

let backgrounds: any;
let backgrounds_assets: Array<BackgroundsAsset> = [];

let decorates: any;
let decorates_assets: Array<DecoratesAsset> = [];

let beds: any;
let beds_assets: Array<BedsAsset> = [];

export let senceContainer = new Container();
senceContainer.sortableChildren = true;
viewport.addChild(senceContainer);

(async () => {
    await fetch('Packages/Sunset Inn/contents/scene.json')
        .then(r => r.json())
        .then(j => {
            j.sleepers.forEach((i: any) =>
                sence_processed.sleepers.set(i.materialId, [
                    ...(sence_processed.sleepers.get(i.materialId) ?? []),
                    { xPos: i.xPos, yPos: i.yPos },
                ]),
            );
            j.backgrounds.forEach((i: any) =>
                sence_processed.backgrounds.set(i.materialId, [
                    ...(sence_processed.backgrounds.get(i.materialId) ?? []),
                    { xPos: i.xPos, yPos: i.yPos },
                ]),
            );
            j.decorates.forEach((i: any) =>
                sence_processed.decorates.set(i.materialId, [
                    ...(sence_processed.decorates.get(i.materialId) ?? []),
                    { xPos: i.xPos, yPos: i.yPos },
                ]),
            );
            j.beds.forEach((i: any) =>
                sence_processed.beds.set(i.materialId, [
                    ...(sence_processed.beds.get(i.materialId) ?? []),
                    { xPos: i.xPos, yPos: i.yPos },
                ]),
            );
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
            sleepers_assets.push({
                texture: c,
                emotions: e,
                offset: { x: i.offset[0], y: i.offset[1] },
            });
        }

        for (const i of backgrounds.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/backgrounds/${i.filename}`,
            );
            backgrounds_assets.push({ texture: c });
        }

        for (const i of decorates.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/decorates/${i.filename}`,
            );
            decorates_assets.push({
                texture: c,
                offset: { x: i.offset[0], y: i.offset[1] },
            });
        }

        for (const i of beds.materials) {
            let c = await Assets.load(
                `Packages/Sunset Inn/contents/beds/${i.filename}`,
            );
            let e: Array<Texture<Resource>> = [];
            for (const k of i.sleepfilenames) {
                let nc = await Assets.load(
                    `Packages/Sunset Inn/contents/beds/bedsleep/${i.filename}/${k}`,
                );
                e.push(nc);
            }
            beds_assets.push({
                texture: c,
                characters: e,
                offset: { x: i.offset[0], y: i.offset[1] },
            });
        }
    })();

    sence_processed.backgrounds.forEach((v, k) => {
        v.forEach(p => {
            const sp = new Sprite(backgrounds_assets[k].texture);
            sp.x = p.xPos;
            sp.y = p.yPos;
            sp.zIndex = p.yPos - 300;
            senceContainer.addChild(sp);
        });
    });

    sence_processed.decorates.forEach((v, k) => {
        v.forEach(p => {
            const sp = new Sprite(decorates_assets[k].texture);
            sp.x = p.xPos - decorates_assets[k].offset.x + 159;
            sp.y = p.yPos - decorates_assets[k].offset.y + 145;
            sp.zIndex = p.yPos;
            senceContainer.addChild(sp);
        });
    });

    sence_processed.beds.forEach((v, k) => {
        v.forEach(p => {
            const sp = new Sprite(beds_assets[k].texture);
            sp.x = p.xPos - beds_assets[k].offset.x + 159;
            sp.y = p.yPos - beds_assets[k].offset.y + 145;
            sp.zIndex = p.yPos;
            senceContainer.addChild(sp);
        });
    });

    sence_processed.sleepers.forEach((v, k) => {
        v.forEach(p => {
            const sp = new Sprite(sleepers_assets[k].texture);
            sp.x = p.xPos - sleepers_assets[k].offset.x + 159;
            sp.y = p.yPos - sleepers_assets[k].offset.y + 145;
            sp.zIndex = p.yPos;
            senceContainer.addChild(sp);
        });
    });
})();
