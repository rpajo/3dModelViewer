

var canvas = document.getElementById('canvas');
console.log(canvas);
var engine = new BABYLON.Engine(canvas, true);


var initScene = function() {
    console.log("init");

    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(0, 15, -10));
    camera.attachControl(canvas, true, null); //null - dont move camera


    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = .5;

    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);


    // model loader
    var loader = new BABYLON.AssetsManager(scene);

    var model = loader.addMeshTask("model", "", "./assets/", "VRCEK.obj");
    model.onSuccess = function(promise) {
        promise.loadedMeshes.forEach(function(mesh) {
            mesh.scaling = new BABYLON.Vector3(5,5,5);
            mesh.position.y += 1;
        });

    };

    loader.load();
    // Leave this function
    return scene;
}

var scene = initScene();

engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});