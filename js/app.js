

var canvas = document.getElementById('canvas');

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

    
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 200.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    console.log("floor init");
    var floor = BABYLON.Mesh.CreateGround("floor", 10, 10, 2, scene);
    var floorMaterial = new BABYLON.StandardMaterial("floorMat", scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture("assets/floor/Beech_01/VizPeople_Beech_1_Diffuse_2.jpg", scene);
    floorMaterial.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    floorMaterial.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes
    floorMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5); // no ground reflection
    //floorMaterial.bumpTexture = new BABYLON.Texture("assets/floor/hardwood_normal.jpg", scene);
    floor.material = floorMaterial;

    // model loader
    var loader = new BABYLON.AssetsManager(scene);

    BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
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