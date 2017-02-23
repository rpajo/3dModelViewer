
var scene, engine, canvas, parentMesh, modelLoader;
var modelPath = "./";
var floorMaterial;

var initScene = function() {
    console.log("init");

    scene = new BABYLON.Scene(engine);

    
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, new BABYLON.Vector3(0, 1, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 15, -10));
    camera.upperBetaLimit = 1.5;
    camera.upperRadiusLimit = 8;
    camera.lowerRadiusLimit = 3;
    camera.wheelPrecision = 50;
    camera.angularSensibilityX = 1000;
    camera.inertia = 0.7
    camera.panningSensibility = 0;;
    camera.attachControl(canvas, true, null); //null - dont move camera


    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .8;
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);
    light.groundColor = new BABYLON.Color3(0, 0, 0);
    
    var pointLight = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 1, 0), scene);
    pointLight.diffuse = new BABYLON.Color3(1, 1, 1);
    pointLight.specular = new BABYLON.Color3(1, 1, 1);
    pointLight.intensity = .8;


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
    var floor = BABYLON.Mesh.CreateGround("floor", 16, 16, 2, scene);
    floor.position.y = 0;
    floorMaterial = new BABYLON.StandardMaterial("floorMat", scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture("assets/floor/Beech_01/Beech_01.jpg", scene);
    floorMaterial.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    floorMaterial.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes
    floorMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5); // no ground reflection
    //floorMaterial.bumpTexture = new BABYLON.Texture("assets/floor/hardwood_normal.jpg", scene);
    floor.material = floorMaterial;

    //var box = BABYLON.Mesh.CreateSphere("sphere", 10.0, 1.0, scene, false,  BABYLON.Mesh.DEFAULTSIDE);

    //walls
    var wallN = BABYLON.MeshBuilder.CreatePlane("wallN", {size: 10, width: 16.0, height: 6, sideOrientation: 2}, scene);
    wallN.position.y += 2.5;
    wallN.position.z += 8;
    var wallS = BABYLON.MeshBuilder.CreatePlane("wallS", {size: 10, width: 16.0, height: 6, sideOrientation: 2}, scene);
    wallS.position.y += 2.5;
    wallS.position.z -= 8;
    var wallE = BABYLON.MeshBuilder.CreatePlane("wallE", {size: 10, width: 16.0, height: 6, sideOrientation: 2}, scene);
    wallE.position.y += 2.5;
    wallE.position.x += 8;
    wallE.rotation.y = Math.PI/2;
    var wallW = BABYLON.MeshBuilder.CreatePlane("wallW", {size: 10, width: 16.0, height: 6, sideOrientation: 2}, scene);
    wallW.position.y += 2.5;
    wallW.position.x -= 8;
    wallW.rotation.y = Math.PI/2;

    var walls = [wallN, wallS, wallE, wallW];
    var wallMat = new BABYLON.StandardMaterial("wallMat", scene);
    wallMat.alpha = 1;
    wallMat.diffuseColor = new BABYLON.Color3(1 , 1, 1);

    walls.forEach(function(wall) {
        wall.material = wallMat;
    }, this);

    BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;

};

var run = function() {
    console.log("render loop");
    engine.runRenderLoop(function () {
        scene.render();
    });
};



window.onload =  function () {

    console.log("window loaded");
    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
        // get file name and file path
        var file = fileInput.files[0];
        var reader = new FileReader();
        modelPath = file.name;
        var modelDir = modelPath.substring(0, modelPath.length-4);

        // new loader
        var loader = new BABYLON.AssetsManager(scene);
        
        if (modelLoader != null) {
            modelLoader.loadedMeshes.forEach(function(mesh) {
                mesh.dispose();
            });
        }

        modelLoader = loader.addMeshTask("model", "", "assets/models/" + modelDir + "/", modelPath);
        
        modelLoader.onSuccess = function(t) {
            console.log(t);
            t.loadedMeshes.forEach(function(m) {
                console.log(m);
                m.position.y += 0.0;
                m.position.z -= 1.5;
                m.rotation.x = -Math.PI/2;
            });
        }

        loader.load();
    });

    document.getElementById("floorSelect").addEventListener("change", function(e) {
        var newMat = document.querySelector('input:checked').value;
        console.log("assets/floor/" + newMat+ "/" + newMat +".jpg");
        floorMaterial.diffuseTexture = new BABYLON.Texture("assets/floor/" + newMat+ "/" + newMat +".jpg", scene);
    });


    // Run scene
    console.log("init scene");
    canvas = document.getElementById('canvas');
    engine = new BABYLON.Engine(canvas, true);
    initScene();
    run();
};