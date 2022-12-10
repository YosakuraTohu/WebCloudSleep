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

    if (Math.abs(point.x - cur.position.x) === Math.abs(point.y - cur.position.y)) {
        score.G = 14 + cur.score.G;
    }
    else {
        score.G = 10 + cur.score.G;
    }
    score.H = (Math.abs(point.x - target.x) + Math.abs(point.y - target.y)) * 10;
    score.F = score.G + score.H;
    return score;
}

export const Astar = (starting_point: Position, target: Position) => {
    let _open_list: Array<PathNode> = [];
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

    while (true) {
        for(let i = cur.position.x - 1; i <= cur.position.x + 1; i++) {
            for(let j = cur.position.y - 1; j <= cur.position.y + 1; j++) {
                let sign = false;
                for (const ban of _close_list) {
                    if (ban.position.x === i && ban.position.y === j) {
                        sign = true
                    }
                }
                if (!(i === cur.position.x && j === cur.position.y) && !sign) {
                    const point_cache = {
                        position: {
                            x: i,
                            y: j,
                        },
                        parent: cur,
                        score: scoring({x: i, y: j}, cur, target),
                    }
                    if (point_cache.position.x === target.x && point_cache.position.y === target.y) {
                        return point_cache;
                        break;
                    }
                    _open_list.push(point_cache);
                }
            }
        }
        _open_list.sort((a, b) => a.score.F - b.score.F);
        _close_list.push(_open_list[0]);
        cur = {..._open_list[0]};
        _open_list.splice(0, 1);
    }
}