const getRandomNum = (max = 0, min = 0) => {
  Math.floor(Math.random() * (max + 1 - min)) + min;
};

const getPointMesh = (num, vels, type) => {
  const bufferGeometry = new THREE.BufferGeometry();
  const vertices = [];
  const velocities = [];
  const colors = [];
  const adjustSizes = [];
  const masses = [];
  const colorType = Math.random() > 0.3 ? 'single' : 'multiple';
  const singleColor = getRandomNum(100, 20) * 0.01;
  const multipleColor = () => getRandomNum(100, 1) * 0.01;
  let rgbType;
  const rgbTypeDice = Math.random();
  if (rgbTypeDice > 0.66) {
    rgbType = 'red';
  } else if (rgbTypeDice > 0.33) {
    rgbType = 'green';
  } else {
    rgbType = 'blue';
  }
  for (let i = 0; i < num; i++) {
    const pos = new THREE.Vector3(0, 0, 0);
    vertices.push(pos.x, pos,y, pos.z);
    velocities.push(vels[i].x, vels[i].y, vels[i].z);
    if(type === 'seed'){
      
    }
  }
};
export { getRandomNum };
