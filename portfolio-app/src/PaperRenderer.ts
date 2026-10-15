import {
  ACESFilmicToneMapping, BackSide, BufferAttribute, BufferGeometry, CanvasTexture,
  Color, DirectionalLight, DoubleSide, DynamicDrawUsage, FrontSide, Group,
  HemisphereLight, Mesh, MeshStandardMaterial, Object3D, PCFSoftShadowMap,
  PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene, SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import type { Project } from './projects';

const columns = 36;
const rows = 20;
const sheetWidth = 280;
const thickness = 0.48;
const curveSamples = 128;

function imageAt(url: string) {
  const image = new Image();
  image.src = url;
  return image.decode().then(() => image);
}

function textureFrom(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function printProject(canvas: HTMLCanvasElement, project: Project, image: HTMLImageElement, height: number, reverse: boolean, resolution: number) {
  const density = reverse ? 1.5 : resolution;
  canvas.width = Math.ceil(sheetWidth * density);
  canvas.height = Math.ceil(height * density);
  const context = canvas.getContext('2d')!;
  context.scale(density, density);
  context.fillStyle = reverse ? '#eee9de' : '#fffefb';
  context.fillRect(0, 0, sheetWidth, height);
  if (reverse) {
    context.textAlign = 'center';
    context.fillStyle = '#c06b3e';
    context.font = '500 25px Chakra';
    context.fillText('AB', 140, height * 0.36);
    context.fillStyle = '#625c51';
    context.font = '500 8px Chakra';
    context.fillText('N I L E S O F T  /  S E L E C T E D  W O R K', 140, height * 0.36 + 20);
    context.fillStyle = '#24221e';
    context.font = '600 16px Chakra';
    context.fillText(project.name, 140, height * 0.63, 240);
    context.fillStyle = '#746e62';
    context.font = '9px InterTight';
    context.fillText(project.category, 140, height * 0.63 + 18);
    context.fillStyle = '#c06b3e';
    context.fillRect(128, height * 0.82, 24, 1.2);
    return;
  }
  context.fillStyle = '#f6f4ee';
  context.fillRect(0, 0, sheetWidth, 17);
  context.fillStyle = '#b7b0a5';
  for (let dot = 0; dot < 3; dot++) {
    context.beginPath();
    context.arc(9 + dot * 5, 8.5, 1.5, 0, Math.PI * 2);
    context.fill();
  }
  context.textAlign = 'right';
  context.font = '6px InterTight';
  context.fillStyle = '#756f65';
  context.fillText(project.category, 272, 11);
  const imageHeight = Math.max(12, height - 62);
  const scale = Math.max(sheetWidth / image.naturalWidth, imageHeight / image.naturalHeight);
  context.save();
  context.beginPath();
  context.rect(0, 17, sheetWidth, imageHeight);
  context.clip();
  context.drawImage(image, (sheetWidth - image.naturalWidth * scale) / 2, 17, image.naturalWidth * scale, image.naturalHeight * scale);
  context.restore();
  context.textAlign = 'left';
  context.fillStyle = '#24221e';
  context.font = '600 12px Chakra';
  context.fillText(project.name, 10, height - 25, 236);
  context.fillStyle = '#797365';
  context.font = '8px InterTight';
  context.fillText(project.status, 10, height - 11);
  context.fillStyle = '#c06b3e';
  context.font = '18px InterTight';
  context.fillText('↗', 258, height - 17);
}

function grainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d')!;
  const pixels = context.createImageData(128, 128);
  let seed = 7281;
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const tone = 160 + (seed >>> 26);
    pixels.data.set([tone, tone, tone, 255], offset);
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 4);
  return texture;
}

function createGeometry() {
  const front = new PlaneGeometry(sheetWidth, 200, columns, rows);
  const back = front.clone();
  for (const geometry of [front, back]) {
    (geometry.attributes.position as BufferAttribute).setUsage(DynamicDrawUsage);
    (geometry.attributes.normal as BufferAttribute).setUsage(DynamicDrawUsage);
  }
  const boundary: number[] = [];
  for (let column = 0; column <= columns; column++) boundary.push(column);
  for (let row = 1; row <= rows; row++) boundary.push(row * (columns + 1) + columns);
  for (let column = columns - 1; column >= 0; column--) boundary.push(rows * (columns + 1) + column);
  for (let row = rows - 1; row > 0; row--) boundary.push(row * (columns + 1));
  const edge = new BufferGeometry();
  edge.setAttribute('position', new BufferAttribute(new Float32Array(boundary.length * 6), 3).setUsage(DynamicDrawUsage));
  const indices: number[] = [];
  for (let index = 0; index < boundary.length; index++) {
    const current = index * 2;
    const next = ((index + 1) % boundary.length) * 2;
    indices.push(current, next, current + 1, next, next + 1, current + 1);
  }
  edge.setIndex(indices);
  return { front, back, edge, boundary };
}

type Sheet = ReturnType<typeof createGeometry> & {
  groups: Group[]; materials: MeshStandardMaterial[]; height: number; resolution: number;
  project: Project; image: HTMLImageElement; frontTexture: CanvasTexture; backTexture: CanvasTexture;
  bend: number; velocity: number; previousBend: number; previousAxis: number; previousRipple: number;
};

export class PaperRenderer {
  private renderers: WebGLRenderer[] = [];
  private scenes: Scene[] = [];
  private lights: DirectionalLight[] = [];
  private sheets: Sheet[] = [];
  private grain = grainTexture();
  private disposed = false;
  private curveX = new Float32Array(curveSamples + 1);
  private curveZ = new Float32Array(curveSamples + 1);
  private curveAngle = new Float32Array(curveSamples + 1);
  private lost: (event: Event) => void;

  private constructor(hosts: HTMLElement[], onFailure: () => void) {
    this.lost = event => { event.preventDefault(); onFailure(); this.dispose(); };
    try {
      hosts.forEach(host => {
        const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        this.renderers.push(renderer);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.domElement.className = 'paper-webgl';
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.addEventListener('webglcontextlost', this.lost);
        host.prepend(renderer.domElement);
        const scene = new Scene();
        scene.add(new HemisphereLight(0xfffaf0, 0x8b91a0, 1.25));
        const key = new DirectionalLight(0xfff4e2, 1.85);
        key.position.set(-420, 650, 850);
        key.castShadow = true;
        key.shadow.camera.left = key.shadow.camera.bottom = -850;
        key.shadow.camera.right = key.shadow.camera.top = 850;
        key.shadow.camera.near = 50;
        key.shadow.camera.far = 2500;
        key.shadow.normalBias = 0.8;
        key.shadow.bias = -0.00008;
        key.shadow.radius = 3;
        scene.add(key);
        const fill = new DirectionalLight(0xdce8ff, 0.65);
        fill.position.set(500, 100, -650);
        scene.add(fill);
        this.lights.push(key);
        this.scenes.push(scene);
      });
    } catch (error) { this.dispose(); throw error; }
  }

  static async create(hosts: HTMLElement[], projects: Project[], onFailure: () => void) {
    await document.fonts.ready;
    const images = await Promise.all(projects.map(project => imageAt(project.image)));
    const engine = new PaperRenderer(hosts, onFailure);
    try {
      projects.forEach((project, index) => engine.addSheet(project, images[index]));
      return engine;
    } catch (error) { engine.dispose(); throw error; }
  }

  private addSheet(project: Project, image: HTMLImageElement) {
    const geometry = createGeometry();
    const frontTexture = textureFrom(document.createElement('canvas'));
    const backTexture = textureFrom(document.createElement('canvas'));
    backTexture.repeat.x = -1;
    backTexture.offset.x = 1;
    const materials: MeshStandardMaterial[] = [];
    const groups = this.scenes.map(scene => {
      const group = new Group();
      group.visible = false;
      [geometry.front, geometry.back, geometry.edge].forEach((surface, face) => {
        const texture = face === 0 ? frontTexture : face === 1 ? backTexture : null;
        const material = new MeshStandardMaterial({
          color: face === 2 ? 0xe4dccb : 0xffffff,
          map: texture, roughness: 0.91, metalness: 0,
          side: face === 0 ? FrontSide : face === 1 ? BackSide : DoubleSide,
          bumpMap: face < 2 ? this.grain : null, bumpScale: 0.14,
          emissive: new Color(0xffffff), emissiveMap: texture, emissiveIntensity: 0.025,
        });
        const flatPrint = { value: 0 };
        material.userData.flatPrint = flatPrint;
        material.onBeforeCompile = shader => {
          shader.uniforms.flatPrint = flatPrint;
          shader.fragmentShader = `uniform float flatPrint;\n${shader.fragmentShader}`.replace(
            '#include <tonemapping_fragment>',
            '#include <tonemapping_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb, flatPrint);',
          );
        };
        material.customProgramCacheKey = () => 'paper-print-docking-v1';
        const mesh = new Mesh(surface, material);
        mesh.frustumCulled = false;
        mesh.castShadow = face === 0;
        mesh.receiveShadow = face < 2;
        group.add(mesh);
        materials.push(material);
      });
      scene.add(group);
      return group;
    });
    this.sheets.push({ ...geometry, groups, materials, height: 0, resolution: 0, project, image, frontTexture, backTexture, bend: 0, velocity: 0, previousBend: NaN, previousAxis: NaN, previousRipple: NaN });
  }

  resize(width: number, height: number, paperHeights: number[]) {
    if (this.disposed) return;
    const ratio = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.35 : 1.75);
    this.renderers.forEach(renderer => { renderer.setPixelRatio(ratio); renderer.setSize(width, height); });
    this.lights.forEach(light => {
      const size = width < 700 ? 512 : 1024;
      if (light.shadow.mapSize.width !== size) { light.shadow.map?.dispose(); light.shadow.map = null; light.shadow.mapSize.set(size, size); }
    });
    this.sheets.forEach((sheet, index) => {
      const resolution = width < 700 ? 2 : 3;
      if (Math.abs(sheet.height - paperHeights[index]) < 0.1 && sheet.resolution === resolution) return;
      sheet.height = paperHeights[index];
      sheet.resolution = resolution;
      sheet.previousBend = NaN;
      printProject(sheet.frontTexture.image, sheet.project, sheet.image, sheet.height, false, resolution);
      printProject(sheet.backTexture.image, sheet.project, sheet.image, sheet.height, true, resolution);
      sheet.frontTexture.needsUpdate = sheet.backTexture.needsUpdate = true;
    });
  }

  update(index: number, object: Object3D, targetBend: number, clock: number, amount: number, elapsed: number, active: boolean, renderLayer = object.position.z < 0 ? 0 : 1) {
    if (this.disposed) return;
    const sheet = this.sheets[index];
    sheet.groups.forEach((group, layer) => {
      group.visible = layer === renderLayer;
      group.position.copy(object.position);
      group.quaternion.copy(object.quaternion);
      group.scale.copy(object.scale);
    });
    if (active && amount < 0.999) {
      const steps = Math.max(1, Math.ceil(elapsed * 120));
      const step = elapsed / steps;
      for (let count = 0; count < steps; count++) {
        sheet.velocity += ((targetBend - sheet.bend) * 28 - sheet.velocity * 8) * step;
        sheet.bend += sheet.velocity * step;
      }
    } else { sheet.bend = targetBend; sheet.velocity = 0; }
    const axis = (0.26 + Math.sin(clock * 0.17 + index * 1.1) * 0.22) * (1 - amount);
    const ripple = Math.sin(clock * 0.8 + index * 1.7) * 0.12 * (1 - amount);
    if (sheet.bend !== sheet.previousBend || axis !== sheet.previousAxis || ripple !== sheet.previousRipple) {
      this.deform(sheet, sheet.bend, axis, ripple);
      sheet.previousBend = sheet.bend;
      sheet.previousAxis = axis;
      sheet.previousRipple = ripple;
    }
    const flatBlend = Math.max(0, (amount - 0.65) / 0.35);
    sheet.materials.forEach(material => {
      material.userData.flatPrint.value = flatBlend * flatBlend * (3 - 2 * flatBlend);
      material.bumpScale = 0.14 * (1 - amount);
    });
  }

  private deform(sheet: Sheet, bend: number, axis: number, ripple: number) {
    const cosine = Math.cos(axis);
    const sine = Math.sin(axis);
    const extent = Math.hypot(sheetWidth / 2, sheet.height / 2);
    const step = extent * 2 / curveSamples;
    this.curveX[0] = this.curveZ[0] = 0;
    const angleAt = (distance: number) => bend * distance / sheetWidth + ripple * Math.sin(distance / extent * Math.PI);
    for (let sample = 0; sample <= curveSamples; sample++) {
      this.curveAngle[sample] = angleAt(-extent + sample * step);
      if (sample === 0) continue;
      const midpointAngle = angleAt(-extent + (sample - 0.5) * step);
      this.curveX[sample] = this.curveX[sample - 1] + Math.cos(midpointAngle) * step;
      this.curveZ[sample] = this.curveZ[sample - 1] + Math.sin(midpointAngle) * step;
    }
    const centerX = this.curveX[curveSamples / 2];
    const centerZ = this.curveZ[curveSamples / 2];
    const front = sheet.front.attributes.position;
    const back = sheet.back.attributes.position;
    const frontNormal = sheet.front.attributes.normal;
    const backNormal = sheet.back.attributes.normal;
    const uv = sheet.front.attributes.uv;
    for (let vertex = 0; vertex < front.count; vertex++) {
      const originalX = (uv.getX(vertex) - 0.5) * sheetWidth;
      const originalY = (uv.getY(vertex) - 0.5) * sheet.height;
      const distance = originalX * cosine + originalY * sine;
      const transverse = -originalX * sine + originalY * cosine;
      const sample = Math.max(0, Math.min(curveSamples - 0.00001, (distance + extent) / step));
      const lower = Math.floor(sample);
      const blend = sample - lower;
      const curvedX = this.curveX[lower] * (1 - blend) + this.curveX[lower + 1] * blend - centerX;
      const curvedZ = this.curveZ[lower] * (1 - blend) + this.curveZ[lower + 1] * blend - centerZ;
      const angle = this.curveAngle[lower] * (1 - blend) + this.curveAngle[lower + 1] * blend;
      const normalX = -Math.sin(angle) * cosine;
      const normalY = -Math.sin(angle) * sine;
      const normalZ = Math.cos(angle);
      const horizontal = curvedX * cosine - transverse * sine;
      const vertical = curvedX * sine + transverse * cosine;
      front.setXYZ(vertex, horizontal + normalX * thickness / 2, vertical + normalY * thickness / 2, curvedZ + normalZ * thickness / 2);
      back.setXYZ(vertex, horizontal - normalX * thickness / 2, vertical - normalY * thickness / 2, curvedZ - normalZ * thickness / 2);
      frontNormal.setXYZ(vertex, normalX, normalY, normalZ);
      backNormal.setXYZ(vertex, normalX, normalY, normalZ);
    }
    front.needsUpdate = back.needsUpdate = frontNormal.needsUpdate = backNormal.needsUpdate = true;
    const edge = sheet.edge.attributes.position;
    sheet.boundary.forEach((vertex, index) => {
      edge.setXYZ(index * 2, front.getX(vertex), front.getY(vertex), front.getZ(vertex));
      edge.setXYZ(index * 2 + 1, back.getX(vertex), back.getY(vertex), back.getZ(vertex));
    });
    edge.needsUpdate = true;
    sheet.edge.computeVertexNormals();
  }

  render(camera: PerspectiveCamera) {
    if (this.disposed) return false;
    this.renderers.forEach((renderer, index) => renderer.render(this.scenes[index], camera));
    return true;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.sheets.forEach(sheet => {
      sheet.front.dispose(); sheet.back.dispose(); sheet.edge.dispose();
      sheet.frontTexture.dispose(); sheet.backTexture.dispose();
      sheet.materials.forEach(material => material.dispose());
    });
    this.grain.dispose();
    this.lights.forEach(light => light.shadow.dispose());
    this.renderers.forEach(renderer => {
      renderer.domElement.removeEventListener('webglcontextlost', this.lost);
      renderer.domElement.remove();
      renderer.dispose();
      renderer.forceContextLoss();
    });
  }
}
