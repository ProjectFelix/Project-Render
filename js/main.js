import {EffectComposer} from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import {BloomPass} from "/node_modules/three/examples/jsm/postprocessing/BloomPass.js";
import {UnrealBloomPass} from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {OrbitControls} from "/node_modules/three/examples/jsm/controls/OrbitControls.js";
var renderer, scene, camera, composer



function init() {
    var canvas = document.querySelector('#c');
    scene = new THREE.Scene();
    {
        const color = 0xFFFFFF;
        const intensity = 2;
        const light = new THREE.Light(color,intensity);
        light.position.set(-1,2,4);
        scene.add(light);
    }
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var controls = new OrbitControls(camera, canvas);
    controls.update();
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor(0x000000, 0.0);
    

    var starGeo = new THREE.SphereGeometry(1,20,20);
    var starGeo2 = new THREE.SphereGeometry(1,20,20);
    var textureLoader = new THREE.TextureLoader();
    var starTexture = textureLoader.load('images/sun_surface.png');
    var starMat = new THREE.MeshBasicMaterial({map: starTexture, color: 'orange'});
    var starMat2 = new THREE.MeshBasicMaterial({blendSrcAlpha: starTexture, color: 'orange'});
    var star2= new THREE.Mesh(starGeo2, starMat2);
    var star = new THREE.Mesh(starGeo, starMat);
    
    scene.add(star);
    //scene.add(star2);
    camera.position.z = 5;
    renderer.setSize( window.innerWidth, window.innerHeight );
    //document.body.appendChild(renderer.domElement);
    composer = new EffectComposer( renderer );
    var renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    var bloomPass = new UnrealBloomPass(1,3,1);
    bloomPass.renderToScreen = true;
    composer.addPass(bloomPass);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    let then = 0;
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        star.rotateY(0.002);
        star2.rotateY(-0.002)
    
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
          composer.setSize(canvas.width, canvas.height);
        }

        composer.render(deltaTime);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

init();
