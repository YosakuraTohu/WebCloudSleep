import {
    Assets,
    Container,
    Graphics,
    Resource,
    Sprite,
    Texture,
} from 'pixi.js';
import { v4 as uuid } from 'uuid';
import { viewport } from '../Main';
import { map_judge } from './Reach';

interface SceneMap {
    layer: Layer;
    material_id: number;
    pos: {
        x: number;
        y: number;
    };
}

interface Offset {
    x: number;
    y: number;
}

interface Hitbox {
    ex: number;
    ey: number;
    ox: number;
    oy: number;
}

interface SceneAsset {
    texture: Promise<Texture<Resource>>;
}

interface SceneOffset {
    offset: Offset;
}

interface SceneHitbox {
    hitbox: Hitbox;
}

interface BackgroundsAsset extends SceneAsset {}

interface DecoratesAsset extends SceneAsset, SceneOffset, SceneHitbox {}

interface BedsAsset extends SceneAsset, SceneOffset, SceneHitbox {
    characters: Promise<Texture<Resource>>;
}

interface CharacterAsset extends SceneAsset, SceneOffset {
    emotions: Promise<Texture<Resource>>;
}

type MixedAsset = Object &
    (
        | SceneAsset
        | SceneOffset
        | SceneHitbox
        | BackgroundsAsset
        | DecoratesAsset
        | BedsAsset
        | CharacterAsset
    );

interface MixedAssets {
    [Layer.sleepers]: Array<Object & CharacterAsset>;
    [Layer.backgrounds]: Array<Object & BackgroundsAsset>;
    [Layer.decorates]: Array<Object & DecoratesAsset>;
    [Layer.beds]: Array<Object & BedsAsset>;
    [propName: string]: Array<MixedAsset>;
}

enum Layer {
    sleepers = 'sleepers',
    backgrounds = 'backgrounds',
    decorates = 'decorates',
    beds = 'beds',
}

interface PackageManifest {
    ipport: string;
    mainclient: string;
    mainclient_howtoget: string;
    compatibleclients: string;
    description: string;
    guid: string;
}

interface MapFix {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface MapInformation {
    fix_position: MapFix;
    default_background: number;
}

interface packageMeta {
    package_manifest: PackageManifest;
    map: Array<SceneMap>;
    map_information: MapInformation;
    assets: MixedAssets;
}

class Scene {
    private base_url: string;
    private package: string;
    private package_meta: packageMeta;
    constructor({
        package_name = 'Sunset Inn',
        base_url = 'Packages',
    }: { package_name?: string; base_url?: string } = {}) {
        this.package = package_name;
        this.base_url = base_url;
        this.package_meta = {} as packageMeta;
        this.package_meta.package_manifest = {} as PackageManifest;
        this.package_meta.map = [];
        this.package_meta.map_information = {} as MapInformation;
        this.package_meta.map_information.fix_position = {} as MapFix;
        this.package_meta.assets = {
            sleepers: [],
            backgrounds: [],
            decorates: [],
            beds: [],
        };
        this.Init();
    }

    private async Init() {
        this.package_meta.package_manifest = await (
            await fetch(
                `${this.base_url}/${this.package}/${this.package}.cloudpack`,
            )
        ).json();
        await fetch(`${this.base_url}/${this.package}/contents/scene.json`)
            .then(res => res.json())
            .then(format_data => {
                this.package_meta.map_information.fix_position.left =
                    format_data.left;
                this.package_meta.map_information.fix_position.top =
                    format_data.top;
                this.package_meta.map_information.fix_position.right =
                    format_data.right;
                this.package_meta.map_information.fix_position.bottom =
                    format_data.bottom;
                this.package_meta.map_information.default_background =
                    format_data.defaultBackground;
                for (const layer of [
                    Layer.backgrounds,
                    Layer.beds,
                    Layer.decorates,
                    Layer.sleepers,
                ]) {
                    for (const sprite_info of Array.isArray(format_data[layer])
                        ? format_data[layer]
                        : []) {
                        this.package_meta.map.push({
                            layer: layer,
                            material_id: sprite_info.materialId,
                            pos: {
                                x: sprite_info.xPos,
                                y: sprite_info.yPos,
                            },
                        });
                    }
                }
            });
        for (const layer of [
            Layer.backgrounds,
            Layer.beds,
            Layer.decorates,
            Layer.sleepers,
        ]) {
            await fetch(
                `${this.base_url}/${this.package}/contents/${layer}.json`,
            )
                .then(res => res.json())
                .then(format_data => {
                    switch (layer) {
                        case Layer.sleepers:
                            for (const info of format_data.materials) {
                                this.package_meta.assets.sleepers.push({
                                    texture: Assets.load(
                                        `${this.base_url}/${this.package}/contents/${layer}/${info.filename}`,
                                    ) as Promise<Texture<Resource>>,
                                    emotions: info.emotefilenames.map(
                                        (split_name: string) =>
                                            Assets.load(
                                                `Packages/Sunset Inn/contents/${layer}/emotes/${info.filename}/${split_name}`,
                                            ),
                                    ),
                                    offset: {
                                        x: info.offset[0],
                                        y: info.offset[1],
                                    },
                                });
                            }
                            break;
                        case Layer.backgrounds:
                            for (const info of format_data.materials) {
                                this.package_meta.assets.backgrounds.push({
                                    texture: Assets.load(
                                        `${this.base_url}/${this.package}/contents/${layer}/${info.filename}`,
                                    ) as Promise<Texture<Resource>>,
                                });
                            }
                            break;
                        case Layer.decorates:
                            for (const info of format_data.materials) {
                                this.package_meta.assets.decorates.push({
                                    texture: Assets.load(
                                        `${this.base_url}/${this.package}/contents/${layer}/${info.filename}`,
                                    ) as Promise<Texture<Resource>>,
                                    offset: {
                                        x: info.offset[0],
                                        y: info.offset[1],
                                    },
                                    hitbox: {
                                        ex: info.hitbox[0],
                                        ey: info.hitbox[1],
                                        ox: info.hitbox[2],
                                        oy: info.hitbox[3],
                                    },
                                });
                            }
                            break;
                        case Layer.beds:
                            for (const info of format_data.materials) {
                                this.package_meta.assets.beds.push({
                                    texture: Assets.load(
                                        `${this.base_url}/${this.package}/contents/${layer}/${info.filename}`,
                                    ) as Promise<Texture<Resource>>,
                                    characters: info.sleepfilenames.map(
                                        (split_name: string) =>
                                            Assets.load(
                                                `Packages/${this.package}/contents/${layer}/bedsleep/${info.filename}/${split_name}`,
                                            ),
                                    ),
                                    offset: {
                                        x: info.offset[0],
                                        y: info.offset[1],
                                    },
                                    hitbox: {
                                        ex: info.hitbox[0],
                                        ey: info.hitbox[1],
                                        ox: info.hitbox[2],
                                        oy: info.hitbox[3],
                                    },
                                });
                            }
                            break;
                        default:
                            break;
                    }
                });
        }
        this.LoadScene();
        this.creatCharacter('Lopez', 0);
    }

    async LoadScene() {
        for (const split of this.package_meta.map) {
            const tex = await this.package_meta.assets[split.layer][
                split.material_id
            ].texture;
            const split_sprite = new Sprite(tex);
            if (split.layer !== Layer.backgrounds) {
                split_sprite.x =
                    split.pos.x -
                    this.package_meta.assets[split.layer][split.material_id]
                        .offset.x +
                    159;
                split_sprite.y =
                    split.pos.y -
                    this.package_meta.assets[split.layer][split.material_id]
                        .offset.y +
                    145;
            } else {
                split_sprite.x = split.pos.x;
                split_sprite.y = split.pos.y;
            }
            split_sprite.zIndex =
                split.pos.y + (split.layer === Layer.backgrounds ? -300 : 0);
            sceneContainer.addChild(split_sprite);
            if (split.layer === Layer.decorates || split.layer === Layer.beds) {
                const hitarea =
                    this.package_meta.assets[split.layer][split.material_id]
                        .hitbox;
                const hitbox = new Graphics();
                if (split.layer === Layer.beds) {
                    hitbox.beginFill(0x00ff00);
                } else {
                    if ([0, 1, 2, 3, 11, 20].includes(split.material_id)) {
                        hitbox.beginFill(0x0000ff);
                    } else {
                        hitbox.beginFill(0xff0000);
                    }
                }
                hitbox.drawRect(
                    split.pos.x-this.package_meta.assets[split.layer][split.material_id].offset.x+159+hitarea.ex,
                    split.pos.y-this.package_meta.assets[split.layer][split.material_id].offset.y+145+hitarea.ey,
                    hitarea.ox - hitarea.ex,
                    hitarea.oy - hitarea.ey,
                );
                map_judge.addRectangle({
                    start_x: split.pos.x-this.package_meta.assets[split.layer][split.material_id].offset.x+159+hitarea.ex - 13,
                    start_y: split.pos.y-this.package_meta.assets[split.layer][split.material_id].offset.y+145+hitarea.ey - 19,
                    end_x: split.pos.x-this.package_meta.assets[split.layer][split.material_id].offset.x+159+hitarea.ox + 15,
                    end_y: split.pos.y-this.package_meta.assets[split.layer][split.material_id].offset.y+145+hitarea.oy - 5,
                })
                hitbox.zIndex = split.pos.y-this.package_meta.assets[split.layer][split.material_id].offset.y+300;
                hitbox.alpha = 0.4;
                sceneContainer.addChild(hitbox);
            }
        }
    }

    async creatCharacter(name: string, type: number) {
        const id = uuid();
        let character = new Sprite(
            await this.package_meta.assets[Layer.sleepers][type].texture,
        );
        character.zIndex = character.y - 7.5;
        sceneContainer.addChild(character);

        const hitbox = new Graphics();
        hitbox.beginFill(0xffffff);
        hitbox.alpha = 0.5;
        hitbox.drawRect(64,124,30,16);
        character.addChild(hitbox);

        let speed = 1;
        window.addEventListener('keydown', e => {
            switch (e.code) {
                case 'ArrowUp':
                    if (!map_judge.judgePointInRectangle({x: character.x + this.package_meta.assets[Layer.sleepers][type].offset.x, y: character.y - speed + this.package_meta.assets[Layer.sleepers][type].offset.y - 8})) {
                        character.y -= speed;
                        character.zIndex = character.y - 7.5;
                    }
                    break;
                case 'ArrowDown':
                    if (!map_judge.judgePointInRectangle({x: character.x + this.package_meta.assets[Layer.sleepers][type].offset.x, y: character.y + speed + this.package_meta.assets[Layer.sleepers][type].offset.y - 8})) {
                        character.y += speed;
                        character.zIndex = character.y - 7.5;
                    }
                    break;
                case 'ArrowLeft':
                    if (!map_judge.judgePointInRectangle({x: character.x - speed + this.package_meta.assets[Layer.sleepers][type].offset.x, y: character.y + this.package_meta.assets[Layer.sleepers][type].offset.y - 8})) {
                        character.x -= speed;
                    }
                    break;
                case 'ArrowRight':
                    if (!map_judge.judgePointInRectangle({x: character.x + speed + this.package_meta.assets[Layer.sleepers][type].offset.x, y: character.y + this.package_meta.assets[Layer.sleepers][type].offset.y - 8})) {
                        character.x += speed;
                    }
                    break;
                case 'KeyZ':
                    speed = 20;
                    break;
                case 'KeyX':
                    speed = 1;
                    break;
                default:
                    break;
            }
        });
    }
}

export let sceneContainer = new Container();
sceneContainer.sortableChildren = true;
viewport.addChild(sceneContainer);

new Scene();
