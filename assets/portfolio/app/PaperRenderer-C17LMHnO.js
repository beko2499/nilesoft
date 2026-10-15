import { W as q, S as z, A as K, P as O, a as V, H as $, D as Y, G as J, M as Q, C as j, F as ee, B as te, b as se, c as oe, d as G, R as ne, e as ae, f as Z, g as re, h as ie } from "./main-Dgv_KltV.js";
const y = 36, X = 20, w = 280, E = 0.48, v = 128;
function le(u) {
  const s = new Image();
  return s.src = u, s.decode().then(() => s);
}
function L(u) {
  const s = new G(u);
  return s.colorSpace = z, s.anisotropy = 4, s;
}
function W(u, s, a, n, r, e) {
  const o = r ? 1.5 : e;
  u.width = Math.ceil(w * o), u.height = Math.ceil(n * o);
  const t = u.getContext("2d");
  if (t.scale(o, o), t.fillStyle = r ? "#eee9de" : "#fffefb", t.fillRect(0, 0, w, n), r) {
    t.textAlign = "center", t.fillStyle = "#c06b3e", t.font = "500 25px Chakra", t.fillText("AB", 140, n * 0.36), t.fillStyle = "#625c51", t.font = "500 8px Chakra", t.fillText("N I L E S O F T  /  S E L E C T E D  W O R K", 140, n * 0.36 + 20), t.fillStyle = "#24221e", t.font = "600 16px Chakra", t.fillText(s.name, 140, n * 0.63, 240), t.fillStyle = "#746e62", t.font = "9px InterTight", t.fillText(s.category, 140, n * 0.63 + 18), t.fillStyle = "#c06b3e", t.fillRect(128, n * 0.82, 24, 1.2);
    return;
  }
  t.fillStyle = "#f6f4ee", t.fillRect(0, 0, w, 17), t.fillStyle = "#b7b0a5";
  for (let f = 0; f < 3; f++)
    t.beginPath(), t.arc(9 + f * 5, 8.5, 1.5, 0, Math.PI * 2), t.fill();
  t.textAlign = "right", t.font = "6px InterTight", t.fillStyle = "#756f65", t.fillText(s.category, 272, 11);
  const h = Math.max(12, n - 62), i = Math.max(w / a.naturalWidth, h / a.naturalHeight);
  t.save(), t.beginPath(), t.rect(0, 17, w, h), t.clip(), t.drawImage(a, (w - a.naturalWidth * i) / 2, 17, a.naturalWidth * i, a.naturalHeight * i), t.restore(), t.textAlign = "left", t.fillStyle = "#24221e", t.font = "600 12px Chakra", t.fillText(s.name, 10, n - 25, 236), t.fillStyle = "#797365", t.font = "8px InterTight", t.fillText(s.status, 10, n - 11), t.fillStyle = "#c06b3e", t.font = "18px InterTight", t.fillText("↗", 258, n - 17);
}
function ce() {
  const u = document.createElement("canvas");
  u.width = u.height = 128;
  const s = u.getContext("2d"), a = s.createImageData(128, 128);
  let n = 7281;
  for (let e = 0; e < a.data.length; e += 4) {
    n = Math.imul(n, 1664525) + 1013904223 >>> 0;
    const o = 160 + (n >>> 26);
    a.data.set([o, o, o, 255], e);
  }
  s.putImageData(a, 0, 0);
  const r = new G(u);
  return r.wrapS = r.wrapT = ne, r.repeat.set(5, 4), r;
}
function ue() {
  const u = new ae(w, 200, y, X), s = u.clone();
  for (const e of [u, s])
    e.attributes.position.setUsage(Z), e.attributes.normal.setUsage(Z);
  const a = [];
  for (let e = 0; e <= y; e++) a.push(e);
  for (let e = 1; e <= X; e++) a.push(e * (y + 1) + y);
  for (let e = y - 1; e >= 0; e--) a.push(X * (y + 1) + e);
  for (let e = X - 1; e > 0; e--) a.push(e * (y + 1));
  const n = new re();
  n.setAttribute("position", new ie(new Float32Array(a.length * 6), 3).setUsage(Z));
  const r = [];
  for (let e = 0; e < a.length; e++) {
    const o = e * 2, t = (e + 1) % a.length * 2;
    r.push(o, t, o + 1, t, t + 1, o + 1);
  }
  return n.setIndex(r), { front: u, back: s, edge: n, boundary: a };
}
class H {
  renderers = [];
  scenes = [];
  lights = [];
  sheets = [];
  grain = ce();
  disposed = !1;
  curveX = new Float32Array(v + 1);
  curveZ = new Float32Array(v + 1);
  curveAngle = new Float32Array(v + 1);
  lost;
  constructor(s, a) {
    this.lost = (n) => {
      n.preventDefault(), a(), this.dispose();
    };
    try {
      s.forEach((n) => {
        const r = new q({ alpha: !0, antialias: !0, powerPreference: "low-power" });
        this.renderers.push(r), r.setClearColor(0, 0), r.outputColorSpace = z, r.toneMapping = K, r.toneMappingExposure = 1.05, r.shadowMap.enabled = !0, r.shadowMap.type = O, r.domElement.className = "paper-webgl", r.domElement.setAttribute("aria-hidden", "true"), r.domElement.addEventListener("webglcontextlost", this.lost), n.prepend(r.domElement);
        const e = new V();
        e.add(new $(16775920, 9146784, 1.25));
        const o = new Y(16774370, 1.85);
        o.position.set(-420, 650, 850), o.castShadow = !0, o.shadow.camera.left = o.shadow.camera.bottom = -850, o.shadow.camera.right = o.shadow.camera.top = 850, o.shadow.camera.near = 50, o.shadow.camera.far = 2500, o.shadow.normalBias = 0.8, o.shadow.bias = -8e-5, o.shadow.radius = 3, e.add(o);
        const t = new Y(14477567, 0.65);
        t.position.set(500, 100, -650), e.add(t), this.lights.push(o), this.scenes.push(e);
      });
    } catch (n) {
      throw this.dispose(), n;
    }
  }
  static async create(s, a, n) {
    await document.fonts.ready;
    const r = await Promise.all(a.map((o) => le(o.image))), e = new H(s, n);
    try {
      return a.forEach((o, t) => e.addSheet(o, r[t])), e;
    } catch (o) {
      throw e.dispose(), o;
    }
  }
  addSheet(s, a) {
    const n = ue(), r = L(document.createElement("canvas")), e = L(document.createElement("canvas"));
    e.repeat.x = -1, e.offset.x = 1;
    const o = [], t = this.scenes.map((h) => {
      const i = new J();
      return i.visible = !1, [n.front, n.back, n.edge].forEach((f, d) => {
        const p = d === 0 ? r : d === 1 ? e : null, c = new Q({
          color: d === 2 ? 14998731 : 16777215,
          map: p,
          roughness: 0.91,
          metalness: 0,
          side: d === 0 ? ee : d === 1 ? te : se,
          bumpMap: d < 2 ? this.grain : null,
          bumpScale: 0.14,
          emissive: new j(16777215),
          emissiveMap: p,
          emissiveIntensity: 0.025
        }), m = { value: 0 };
        c.userData.flatPrint = m, c.onBeforeCompile = (S) => {
          S.uniforms.flatPrint = m, S.fragmentShader = `uniform float flatPrint;
${S.fragmentShader}`.replace(
            "#include <tonemapping_fragment>",
            `#include <tonemapping_fragment>
gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb, flatPrint);`
          );
        }, c.customProgramCacheKey = () => "paper-print-docking-v1";
        const g = new oe(f, c);
        g.frustumCulled = !1, g.castShadow = d === 0, g.receiveShadow = d < 2, i.add(g), o.push(c);
      }), h.add(i), i;
    });
    this.sheets.push({ ...n, groups: t, materials: o, height: 0, resolution: 0, project: s, image: a, frontTexture: r, backTexture: e, bend: 0, velocity: 0, previousBend: NaN, previousAxis: NaN, previousRipple: NaN });
  }
  resize(s, a, n) {
    if (this.disposed) return;
    const r = Math.min(window.devicePixelRatio || 1, s < 700 ? 1.35 : 1.75);
    this.renderers.forEach((e) => {
      e.setPixelRatio(r), e.setSize(s, a);
    }), this.lights.forEach((e) => {
      const o = s < 700 ? 512 : 1024;
      e.shadow.mapSize.width !== o && (e.shadow.map?.dispose(), e.shadow.map = null, e.shadow.mapSize.set(o, o));
    }), this.sheets.forEach((e, o) => {
      const t = s < 700 ? 2 : 3;
      Math.abs(e.height - n[o]) < 0.1 && e.resolution === t || (e.height = n[o], e.resolution = t, e.previousBend = NaN, W(e.frontTexture.image, e.project, e.image, e.height, !1, t), W(e.backTexture.image, e.project, e.image, e.height, !0, t), e.frontTexture.needsUpdate = e.backTexture.needsUpdate = !0);
    });
  }
  update(s, a, n, r, e, o, t, h = a.position.z < 0 ? 0 : 1) {
    if (this.disposed) return;
    const i = this.sheets[s];
    if (i.groups.forEach((c, m) => {
      c.visible = m === h, c.position.copy(a.position), c.quaternion.copy(a.quaternion), c.scale.copy(a.scale);
    }), t && e < 0.999) {
      const c = Math.max(1, Math.ceil(o * 120)), m = o / c;
      for (let g = 0; g < c; g++)
        i.velocity += ((n - i.bend) * 28 - i.velocity * 8) * m, i.bend += i.velocity * m;
    } else
      i.bend = n, i.velocity = 0;
    const f = (0.26 + Math.sin(r * 0.17 + s * 1.1) * 0.22) * (1 - e), d = Math.sin(r * 0.8 + s * 1.7) * 0.12 * (1 - e);
    (i.bend !== i.previousBend || f !== i.previousAxis || d !== i.previousRipple) && (this.deform(i, i.bend, f, d), i.previousBend = i.bend, i.previousAxis = f, i.previousRipple = d);
    const p = Math.max(0, (e - 0.65) / 0.35);
    i.materials.forEach((c) => {
      c.userData.flatPrint.value = p * p * (3 - 2 * p), c.bumpScale = 0.14 * (1 - e);
    });
  }
  deform(s, a, n, r) {
    const e = Math.cos(n), o = Math.sin(n), t = Math.hypot(w / 2, s.height / 2), h = t * 2 / v;
    this.curveX[0] = this.curveZ[0] = 0;
    const i = (l) => a * l / w + r * Math.sin(l / t * Math.PI);
    for (let l = 0; l <= v; l++) {
      if (this.curveAngle[l] = i(-t + l * h), l === 0) continue;
      const b = i(-t + (l - 0.5) * h);
      this.curveX[l] = this.curveX[l - 1] + Math.cos(b) * h, this.curveZ[l] = this.curveZ[l - 1] + Math.sin(b) * h;
    }
    const f = this.curveX[v / 2], d = this.curveZ[v / 2], p = s.front.attributes.position, c = s.back.attributes.position, m = s.front.attributes.normal, g = s.back.attributes.normal, S = s.front.attributes.uv;
    for (let l = 0; l < p.count; l++) {
      const b = (S.getX(l) - 0.5) * w, I = (S.getY(l) - 0.5) * s.height, _ = b * e + I * o, N = -b * o + I * e, R = Math.max(0, Math.min(v - 1e-5, (_ + t) / h)), x = Math.floor(R), M = R - x, B = this.curveX[x] * (1 - M) + this.curveX[x + 1] * M - f, F = this.curveZ[x] * (1 - M) + this.curveZ[x + 1] * M - d, k = this.curveAngle[x] * (1 - M) + this.curveAngle[x + 1] * M, T = -Math.sin(k) * e, A = -Math.sin(k) * o, C = Math.cos(k), D = B * e - N * o, U = B * o + N * e;
      p.setXYZ(l, D + T * E / 2, U + A * E / 2, F + C * E / 2), c.setXYZ(l, D - T * E / 2, U - A * E / 2, F - C * E / 2), m.setXYZ(l, T, A, C), g.setXYZ(l, T, A, C);
    }
    p.needsUpdate = c.needsUpdate = m.needsUpdate = g.needsUpdate = !0;
    const P = s.edge.attributes.position;
    s.boundary.forEach((l, b) => {
      P.setXYZ(b * 2, p.getX(l), p.getY(l), p.getZ(l)), P.setXYZ(b * 2 + 1, c.getX(l), c.getY(l), c.getZ(l));
    }), P.needsUpdate = !0, s.edge.computeVertexNormals();
  }
  render(s) {
    return this.disposed ? !1 : (this.renderers.forEach((a, n) => a.render(this.scenes[n], s)), !0);
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.sheets.forEach((s) => {
      s.front.dispose(), s.back.dispose(), s.edge.dispose(), s.frontTexture.dispose(), s.backTexture.dispose(), s.materials.forEach((a) => a.dispose());
    }), this.grain.dispose(), this.lights.forEach((s) => s.shadow.dispose()), this.renderers.forEach((s) => {
      s.domElement.removeEventListener("webglcontextlost", this.lost), s.domElement.remove(), s.dispose(), s.forceContextLoss();
    }));
  }
}
export {
  H as PaperRenderer
};
