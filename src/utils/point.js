/* eslint-disable require-jsdoc */
import * as THREE from 'three';

class CPoint extends THREE.Points {
  constructor(color = 0xff0000, size = 20) {
    super();
    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(new Float32Array(3), 3);
    geometry.setAttribute('position', positionAttr);

    const material = new THREE.PointsMaterial({
      color: color,
      size: size,
      transparent: true,
      depthTest: false,
      sizeAttenuation: false
    });
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4(diffuse, opactity);',
        `
        if(distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) discard;
        vec4 diffuseColor = vec4(diffuse, opacity);
        `
      );
    };

    this.geometry = geometry;
    this.material = material;
    this.renderOrder = 1;
    this.matrixAutoUpdate = false;
  }

  get pointsMaterial() {
    return this.material;
  }
}

export { CPoint };
