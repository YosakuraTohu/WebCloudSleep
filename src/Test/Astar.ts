import { Graphics } from "pixi.js";
import { MinHeap } from "../Lib/Heap";
import { Compare } from "../Lib/Util";
import { sceneContainer } from "./Futures";

export interface Position {
    x: number;
    y: number;
}

interface Score {
    F: number;
    G: number;
    H: number;
}

export interface PathNode {
    position: Position;
    parent: PathNode | null;
    score: Score;
}

const scoring = (point: Position, cur: PathNode, target: Position): Score => {
    let score: Score = {} as Score;

    if (Math.abs((point.x - cur.position.x)) === Math.abs((point.y - cur.position.y))) {
        score.G = 28 + cur.score.G;
    }
    else {
        score.G = 20 + cur.score.G;
    }
    score.H = (Math.abs((point.x - target.x)) + Math.abs((point.y - target.y)));
    score.F = score.G + score.H;
    return score;
}

const cmp = (a: PathNode, b: PathNode): number => {
    if (a.score.F === b.score.F) {
        return Compare.EQUALS;
    } else if (a.score.F > b.score.F) {
        return Compare.BIGGER_THAN;
    } else {
        return Compare.LESS_THAN;
    }
}

export const Astar = (starting_point: Position, target: Position, judge_func?: ({x, y}: Position) => boolean) => {
    let step: number = 0;
    let _open_list = new MinHeap<PathNode>(cmp);
    let _close_list: Array<PathNode> = [];
    let cur: PathNode = {
        position: starting_point,
        parent: null,
        score: {
            F: 0,
            G: 0,
            H: 0,
        },
    };
    _open_list.insert(cur);

    while (true) {
        if (_open_list.size() === 0 || step >= 100000) {
            break;
        }
        if (step !== 0) {
            cur = {..._open_list.findMinimum()};
        }
        _close_list.push(_open_list.extract());
        step++;
        for(let i = cur.position.x - 20; i <= cur.position.x + 20; i+=20) {
            for(let j = cur.position.y - 20; j <= cur.position.y + 20; j+=20) {
                let sign = false;
                if (typeof(judge_func) === "function") {
                    if (judge_func({x: i, y: j})) {
                        _close_list.push({
                            position: {
                                x: i,
                                y: j,
                            },
                            parent: null,
                            score: {
                                F: 0,
                                G: 0,
                                H: 0,
                            }
                        })
                    }
                }
                for (const ban of _close_list) {
                    if (ban.position.x === i && ban.position.y === j) {
                        sign = true;
                    }
                }
                for (const ban of _open_list.getIsArray()) {
                    if (ban.position.x === i && ban.position.y === j) {
                        sign = true;
                    }
                }
                if (!sign) {
                    const point_cache = {
                        position: {
                            x: i,
                            y: j,
                        },
                        parent: cur,
                        score: scoring({x: i, y: j}, cur, target),
                    }
                    const hitbox = new Graphics();
                    hitbox.beginFill(step);
                    hitbox.drawRect(i, j, 7, 7);
                    hitbox.zIndex = 40000;
                    sceneContainer.addChild(hitbox);
                    if ((point_cache.position.x-20<target.x&&target.x<=point_cache.position.x+20) && (point_cache.position.y-20<target.y&&target.y<=point_cache.position.y+20)) {
                        console.log(step);
                        return point_cache;
                        break;
                    }
                    _open_list.insert(point_cache);
                }
            }
        }
    }
}

export let to_path = (p: PathNode, path?: Array<Position>): Array<Position> => {
    if (path === undefined) {
        path = [];
    }
    if (p.parent === null) {
        path.push(p.position);
        return path;
    }
    path.push(p.position);
    return to_path(p.parent, path);
}