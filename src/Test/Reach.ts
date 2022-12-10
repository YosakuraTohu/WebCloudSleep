import { Graphics } from "pixi.js";
import { Astar, PathNode, Position } from "./Astar";
import { sceneContainer } from "./Futures";

export interface Point {
    x: number;
    y: number;
}

export interface Rectangle {
    start_x: number;
    start_y: number;
    end_x: number;
    end_y: number;
}

export interface Line {
    start_point: number;
    end_point: number;
}

export type JudgeList = {
    [propName: number]: Array<Line>;
}

export class MapJudge {
    private MAX_WIDTH: number;
    private MAX_HEIGHT: number;

    private x_axis_judge_list: JudgeList;
    private y_axis_judge_list: JudgeList;

    constructor() {
        this.MAX_WIDTH = 0;
        this.MAX_HEIGHT = 0;
        this.x_axis_judge_list = {};
        this.y_axis_judge_list = {};
    }

    public addRectangle({start_x, start_y, end_x, end_y}: Rectangle) {
        if (!Array.isArray(this.x_axis_judge_list[start_y])) {
            this.x_axis_judge_list[start_y] = [];
        }
        if (!Array.isArray(this.x_axis_judge_list[end_y])) {
            this.x_axis_judge_list[end_y] = [];
        }
        if (!Array.isArray(this.y_axis_judge_list[start_x])) {
            this.y_axis_judge_list[start_x] = [];
        }
        if (!Array.isArray(this.y_axis_judge_list[end_x])) {
            this.y_axis_judge_list[end_x] = [];
        }

        this.x_axis_judge_list[start_y].push({start_point: start_x, end_point: end_x});
        this.x_axis_judge_list[end_y].push({start_point: start_x, end_point: end_x});
        this.y_axis_judge_list[start_x].push({start_point: start_y, end_point: end_y});
        this.y_axis_judge_list[end_x].push({start_point: start_y, end_point: end_y});

        if (end_x - start_x > this.MAX_WIDTH) {
            this.MAX_WIDTH = end_x - start_x;
        }
        if (end_y - start_y > this.MAX_HEIGHT) {
            this.MAX_HEIGHT = end_y - start_y;
        }
    }

    public judgePointOnLine({x, y}: Point): boolean {
        if (Array.isArray(this.x_axis_judge_list[y])) {
            for (const line of this.x_axis_judge_list[y]) {
                if (x >= line.start_point && x <= line.end_point) {
                    const hitbox = new Graphics();
                    hitbox.beginFill(0x000fff);
                    hitbox.drawRect(line.start_point, y,line.end_point - line.start_point, 10);
                    hitbox.zIndex = 40000;
                    sceneContainer.addChild(hitbox);
                    return true;
                }
            }
        }
        if (Array.isArray(this.y_axis_judge_list[x])) {
            for (const line of this.y_axis_judge_list[x]) {
                if (y >= line.start_point && y <= line.end_point) {
                    return true;
                }
            }
        }
        return false;
    }

    public judgePointInRectangle({x, y}: Point): boolean {
        for (let i = 0; i < this.MAX_WIDTH / 2 + 2; i++) {
            if (Array.isArray(this.y_axis_judge_list[x + i])) {
                for (const line of this.y_axis_judge_list[x + i]) {
                    if (y >= line.start_point && y <= line.end_point) {
                        for (const line_t of this.x_axis_judge_list[line.start_point]) {
                            if (x >= line_t.start_point && x <= line_t.end_point) {
                                return true;
                            }
                        }
                    }
                }
            }
            if (Array.isArray(this.y_axis_judge_list[x - i])) {
                for (const line of this.y_axis_judge_list[x - i]) {
                    if (y >= line.start_point && y <= line.end_point) {
                        for (const line_t of this.x_axis_judge_list[line.start_point]) {
                            if (x >= line_t.start_point && x <= line_t.end_point) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < this.MAX_HEIGHT / 2 + 2; i++) {
            if (Array.isArray(this.x_axis_judge_list[y + i])) {
                for (const line of this.x_axis_judge_list[y + i]) {
                    if (x >= line.start_point && x <= line.end_point) {
                        for (const line_t of this.y_axis_judge_list[line.start_point]) {
                            if (y >= line_t.start_point && y <= line_t.end_point) {
                                return true;
                            }
                        }
                    }
                }
            }
            if (Array.isArray(this.x_axis_judge_list[y - i])) {
                for (const line of this.x_axis_judge_list[y - i]) {
                    if (x >= line.start_point && x <= line.end_point) {
                        for (const line_t of this.y_axis_judge_list[line.start_point]) {
                            if (y >= line_t.start_point && y <= line_t.end_point) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}

export let map_judge = new MapJudge();

let path: Array<Position> = [];

let u = (p: PathNode): Array<Position> => {
    if (p.parent === null) {
        path.push(p.position);
        return path;
    }
    path.push(p.position);
    return u(p.parent);
}

console.log(u(Astar({x: 0, y: 0}, {x: 90, y: 12})))