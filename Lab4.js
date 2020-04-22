/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
const orGraf = {};
const loops = [];
const N = 11;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.font = '17px Times new Roman';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';




const A = [
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const r = 15;
const rloops = 3 * r / 4;
const arrr = 5;


const calcVertics = (n, P, x0, y0, obj) => {

  const step = P / n;
  const side = P / 3;
  let left = 0;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(x0, y0);

  ctx.lineTo(x0 + side / 2, y0 - side * Math.sin(Math.PI / 3));
  ctx.lineTo(x0 + side, y0);
  ctx.lineTo(x0, y0);
  ctx.stroke();

  ctx.setLineDash([]);

  for (let curMargin = 0; curMargin <= side; curMargin += step) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step * Math.cos(Math.PI / 3);
    newY += -step * Math.sin(Math.PI / 3);
    left = side - curMargin;
    vert++;
  }

  newX = x0 + side / 2;
  newY = y0 - side * Math.sin(Math.PI / 3);

  for (let curMargin = left; curMargin <= side; curMargin += step) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step * Math.cos(Math.PI / 3);
    newY += step * Math.sin(Math.PI / 3);
    left = side - curMargin;
    vert++;
  }

  newX = x0 + side;
  newY = y0;

  for (vert; vert <= n; vert++) {
    newX += -step;

    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
      },
      enumerable: true,
      writable: true
    });
  }
};

calcVertics(11, 1600, 50, 520, orGraf);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simple = [];
    obj[key].double = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        const names = [`vert${i + 1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simple.push(`vert${j + 1}`);
        } else {
          obj[names[0]].double.push(`vert${j + 1}`);
        }
      }
    }
  }
};
const center = (x0, y0, p) => {
  const x = x0 + p / 6;
  const y = y0 + p / 6;
  return {
    x,
    y
  };
};

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (const i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc) ** 2 + (obj[arr[i]].coords[1] - yc) ** 2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
};

function drawArrowhead(x0, y0, x1, y1, radius, fillStyle = 'white', strokestyle = 'black') {
  const xCenter = x1;
  const yCenter = y1;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  ctx.strokestyle = strokestyle;
  ctx.beginPath();
  angle = Math.atan2(y1 - y0, x1 - x0);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;

  ctx.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const readyCons = (x0, y0, x1, y1) => {
  const step = 1;
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  const dx = step * Math.cos(alpha);
  const dy = step * Math.sin(alpha);
  let x = x0;
  let y = y0;
  while (true) {
    x += dx;
    y += dy;
    if (Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2) < r + arrr) break;
  }
  const res = {
    x,
    y
  };
  return res;
};

function singleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r * 5) * Math.cos(Math.PI / 2 - alpha),
    dy: (r * 5) * Math.sin(Math.PI / 2 - alpha)
  };
}

function doubleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r * 4.6) * Math.cos(Math.PI / 2 - alpha),
    dy: (r * 2.1) * Math.sin(Math.PI / 2 - alpha)
  };
}

const singleDirected = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simple.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].simple[i]}`].coords[0];
      const toY = obj[`${obj[key].simple[i]}`].coords[1];


      if (Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === (Object.keys(obj).length - 1)) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(fromX, fromY, toX, toY, obj[`${obj[key].simple[i]}`].radius);
        drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
      } else {
        const { dx, dy } = singleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY, obj[`${obj[key].simple[i]}`].radius);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
      }
    }
  }
};

const bothDirected = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].double.length; i++) {

      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].double[i]}`].coords[0];
      const toY = obj[`${obj[key].double[i]}`].coords[1];

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
      let newX = (fromX + toX) / 2;
      let newY = (fromY + toY) / 2;
      newX += dx;
      newY -= dy;
      ctx.lineTo(newX, newY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      const coordinates = readyCons(newX, newY, toX, toY, obj[key].radius);
      drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
    }
  }
};
const drawNewVertex = obj => {
  for (const key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.font = '13px Times new Roman';
    ctx.strokeStyle = 'white';
    ctx.strokeText(obj[key].num + ',' + obj[key].number, obj[key].coords[0], obj[key].coords[1]);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
};


const drawVertex = obj => {
  for (const key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.font = '17px Times new Roman';
    ctx.strokeStyle = 'white';
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
};









function drawCircle(context, x, y, r, fillStyle, strokeStyle) {
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;
  context.arc(x, y, r, 0, Math.PI * 2);
  context.stroke();
  if (fillStyle) context.fill();
  context.closePath();
}


makeCons(A, orGraf);


const starty = 'vert1';
const dfsArray = [starty];
const dfsFull = [starty];

const dfs = (vertics, current, prev = 1) => {
  const cons = vertics[current].simple.concat(vertics[current].double);
  cons.sort();
  cons.forEach(val => {
    if (!dfsArray.includes(val)) {
      dfsArray.push(val);
      dfsFull.push(val);
      dfs(vertics, val, current);
    }
  });
  dfsFull.push(prev);
};

dfs(orGraf, starty);
for (let i = 0; i < dfsArray.length; i++) {
  orGraf[dfsArray[i]].number = i + 1;
}
orGraf['vert11'].number = 11;
const iter = dfsFull[Symbol.iterator]();
let prev = 0;
const visited = [];

const halt = () => {
  const currVal = iter.next().value;
  visited.forEach(x => {
    ctx.beginPath();
    drawCircle(ctx, orGraf[`${x}`].coords[0], orGraf[`${x}`].coords[1], r, '#0000FF', 'black');
    { //text
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(orGraf[`${x}`].number, orGraf[`${x}`].coords[0], orGraf[`${x}`].coords[1]);
      ctx.fillText(orGraf[`${x}`].number, orGraf[`${x}`].coords[0], orGraf[`${x}`].coords[1]);
    }
  });
  const currVert = `${currVal}`;
  const prevVert = `${prev}`;
  ctx.beginPath();
  drawCircle(ctx, orGraf[currVert].coords[0], orGraf[currVert].coords[1], r, 'red', 'black');
  { //text
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.strokeText(orGraf[`${currVal}`].number, orGraf[currVert].coords[0], orGraf[currVert].coords[1]);
    ctx.fillText(orGraf[`${currVal}`].number, orGraf[currVert].coords[0], orGraf[currVert].coords[1]);
  }
  if (prev) {
    ctx.beginPath();
    drawCircle(ctx, orGraf[prevVert].coords[0], orGraf[prevVert].coords[1], r, 'green', 'black');

    { //text
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(orGraf[`${prev}`].number, orGraf[prevVert].coords[0], orGraf[prevVert].coords[1]);
      ctx.fillText(orGraf[`${prev}`].number, orGraf[prevVert].coords[0], orGraf[prevVert].coords[1]);
    }
  }
  visited.push(currVal);
  prev = currVal;
};


const numMatrix = [];
for (let i = 0; i < N; i++) {
  numMatrix[i] = [];
  for (let j = 0; j < N; j++) {
    numMatrix[i][j] = 0;
  }
}




const treeMatrix = [];
for (let i = 0; i < N; i++) {
  treeMatrix[i] = [];
  for (let j = 0; j < N; j++) {
    treeMatrix[i][j] = 0;
  }
}
for (let i = 0; i < N; i++) {
  numMatrix[orGraf[`vert${i + 1}`].number - 1][orGraf[`vert${i + 1}`].num - 1] = 1;
}


let treeObj = {};
for (let i = 0; i < dfsFull.length - 2; i++) {
  const curr = orGraf[dfsFull[i]].num;
  const next = orGraf[dfsFull[i + 1]].num;
  if (treeObj[next] !== curr) {
    treeObj[curr] = next;
    treeMatrix[curr - 1][next - 1] = 1;

  }
}
const treeMatrixPrint = [];
for (let i = 0; i < N; i++) {
  treeMatrixPrint[i] = [];
  for (let j = 0; j < N; j++) {
    treeMatrixPrint[i][j] = 0;
  }
}

let treeObjPrint = {};
for (let i = 0; i < dfsFull.length - 2; i++) {
  const curr = orGraf[dfsFull[i]].number;
  const next = orGraf[dfsFull[i + 1]].number;
  if (treeObjPrint[next] !== curr) {
    treeObjPrint[curr] = next;
    treeMatrixPrint[curr - 1][next - 1] = 1;

  }
}

{
  const n = A.length;
  const x = 900;
  const y = 325;
  const r = 230;
  const alpha = 2 * Math.PI / n;

  const vertics = {};
  let i = 1;

  for (let angle = 0; i <= n; angle += alpha) {
    const newX = x + r * Math.cos(angle);
    const newY = y + r * Math.sin(angle);
    vertics[`vert${i}`] = {};
    vertics[`vert${i}`].coords = [];
    vertics[`vert${i}`].coords.push(newX);
    vertics[`vert${i}`].coords.push(newY);
    vertics[`vert${i}`].num = orGraf[`vert${i}`].number;
    i++;
  }
  treeObj = vertics;
}
makeCons(treeMatrix, treeObj);

const drawNewOrSimpleCons = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simple.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      //console.log(obj[`${obj[key].simple[i]}`].number);
      const toX = obj[`${obj[key].simple[i]}`].coords[0];
      const toY = obj[`${obj[key].simple[i]}`].coords[1];
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.strokeStyle = 'black';
      ctx.lineTo(toX, toY);
      ctx.stroke();
      const coordinates = readyCons(fromX, fromY, toX, toY, r);
      drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
    }
  }
};


ctx.font = '22px Times new Roman';
ctx.fillText('Renumbering matrix', 250, 600);
for (let i = 0; i < numMatrix.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(numMatrix[i], 250, 600 + (i + 1) * 25);
}

ctx.font = '22px Times new Roman';
ctx.fillText('Adjacency matrix of tree', 750, 600);
for (let i = 0; i < treeMatrixPrint.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(treeMatrixPrint[i], 750, 600 + (i + 1) * 25);
}






drawNewOrSimpleCons(treeObj);

drawVertex(treeObj);
drawLoops(loops, orGraf, 75, 100);
singleDirected(orGraf);
bothDirected(orGraf);
drawNewVertex(orGraf);





