import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface PediPose {
  turn: number;
  focus: number;
}

export interface PediSceneController {
  render(pose: PediPose): void;
  resize(): void;
  dispose(): void;
}

const MODEL_HEIGHT = 2.05;
const CAMERA_FOV = 30;
const CLOSE_FOV = 26;
const CAMERA_Y = 0.05;
const CLOSE_Y = 0.53;
const CLOSE_Z = 2.9;
const CLOSE_FRAMING_ASPECT = 1.25;

function disposeMaterial(material: THREE.Material): void {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) value.dispose();
  }
  material.dispose();
}

export async function createPediScene(canvas: HTMLCanvasElement, performanceLite: boolean): Promise<PediSceneController> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !performanceLite,
    powerPreference: performanceLite ? 'low-power' : 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceLite ? 1 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
  const modelRoot = new THREE.Group();
  scene.add(modelRoot);

  scene.add(new THREE.HemisphereLight(0xf8fbff, 0x17130c, performanceLite ? 2.1 : 2.5));

  const keyLight = new THREE.DirectionalLight(0xffffff, performanceLite ? 2.5 : 3.4);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffff23, performanceLite ? 1.5 : 2.2);
  rimLight.position.set(4, 2, -3);
  scene.add(rimLight);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  const gltf = await gltfLoader.loadAsync('/images/pedi.glb').finally(() => dracoLoader.dispose()).catch((error) => {
    renderer.dispose();
    throw error;
  });
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = MODEL_HEIGHT / size.y;

  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -bounds.min.y * scale - MODEL_HEIGHT / 2, -center.z * scale);
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = false;
    object.receiveShadow = false;
  });
  modelRoot.add(model);

  let baseCameraZ = 5.75;
  let closeCameraZ = CLOSE_Z;
  let activeFocus = 0;

  const updateCamera = (focus: number): void => {
    const y = THREE.MathUtils.lerp(CAMERA_Y, CLOSE_Y, focus);
    camera.position.set(0, y, THREE.MathUtils.lerp(baseCameraZ, closeCameraZ, focus));
    camera.fov = THREE.MathUtils.lerp(CAMERA_FOV, CLOSE_FOV, focus);
    camera.lookAt(0, y, 0);
    camera.updateProjectionMatrix();
  };

  const resize = (): void => {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    const isCompactDesktop = window.innerWidth >= 768 && window.innerWidth <= 1100;
    baseCameraZ = isCompactDesktop ? 7 : camera.aspect < 0.85 ? 6.25 : 5.75;
    closeCameraZ = CLOSE_Z * Math.max(1, CLOSE_FRAMING_ASPECT / camera.aspect);
    updateCamera(activeFocus);
  };

  const render = ({ turn, focus }: PediPose): void => {
    modelRoot.rotation.y = Math.PI + turn;
    modelRoot.position.y = 0;
    modelRoot.rotation.z = 0;
    activeFocus = focus;
    updateCamera(focus);

    renderer.render(scene, camera);
  };

  resize();

  return {
    render,
    resize,
    dispose() {
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(disposeMaterial);
      });
      renderer.dispose();
    },
  };
}
