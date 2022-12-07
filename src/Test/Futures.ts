type SceneObject = {
    collection: string;
    material_id: number;
    position: {
        x: number;
        y: number;
    }
}

type SceneObjectProxy = ProxyHandler<SceneObject> & {
    get: (target: SceneObject, key: keyof SceneObject) => {};
    set: (target: SceneObject, key: keyof SceneObject, value: SceneObject[keyof SceneObject]) => {}
}

type SceneMap = Array<ProxyConstructor>

let scene_handler: SceneObjectProxy = {
    get: (target: SceneObject, key: keyof SceneObject) => target[key],
    set: (target: SceneObject, key: keyof SceneObject, value: SceneObject[keyof SceneObject]) => target[key]=value
}

let p = new Proxy({num: 0}, {
    get: target => {
        target.num++;
        return 0;
    }
})