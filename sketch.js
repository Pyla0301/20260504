// Face Mesh Detection with ml5.js  
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh  
// https://youtu.be/R5UZsIwPbJA  

let video;
let faceMesh;
let faces = [];
let fireParticles = []; // 儲存火焰粒子的陣列
let fishes = []; // 儲存背景小魚的陣列

function mousePressed() {
  // Log detected face data tothe console
  console.log(faces);
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize FaceMesh model with a callback instead of preload
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true }, modelReady);

  // 隨機產生 30 隻背景小魚
  for (let i = 0; i < 30; i++) {
    fishes.push(new Fish());
  }
}

function modelReady() {
  console.log("FaceMesh model is loaded!");
  // Start detecting faces once the model is ready
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background('#4361ee'); // 將背景改為大海的藍色

  // 更新並繪製所有背景小魚
  for (let fish of fishes) {
    fish.update();
    fish.show();
  }

  // Ensure at least one face is detected
  if (faces.length > 0 && video.width > 0) {
    let face = faces[0];

    // 為了避免手機橫直向轉向時比例失真導致特徵點偏移，改用等比例縮放
    let scaleFactor = min((windowWidth * 0.5) / video.width, (windowHeight * 0.5) / video.height);
    let imgW = video.width * scaleFactor;
    let imgH = video.height * scaleFactor;
    let x = (windowWidth - imgW) / 2;
    let y = (windowHeight - imgH) / 2;

    // 臉部最外層輪廓 (Face Oval) 特徵點
    let faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

    push();
    translate(x, y);
    scale(scaleFactor);

    // --- 使用 clip() 遮罩，讓影像只顯示在臉部輪廓內 ---
    push();
    beginShape();
    for (let i = 0; i < faceOutline.length; i++) {
      let pt = face.keypoints[faceOutline[i]];
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    drawingContext.clip(); 
    // 將攝影機畫面繪製在被裁切的遮罩範圍內
    image(video, 0, 0, video.width, video.height);
    pop();

    // Draw keypoints on the detected face
    for (let i = 0; i < face.keypoints.length; i++) {
      let keypoint = face.keypoints[i];
      stroke(255, 255, 0);
      strokeWeight(2);
      point(keypoint.x, keypoint.y);
    }

    // 將指定的編號特徵點（如：嘴唇外輪廓）用紅線串接
    let targetIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    stroke(255, 0, 0);
    strokeWeight(1);
    for (let i = 0; i < targetIndices.length; i++) {
      let pt1 = face.keypoints[targetIndices[i]];
      let pt2 = face.keypoints[targetIndices[(i + 1) % targetIndices.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // 串接第二組指定的編號特徵點（內嘴唇）
    let targetIndices2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    for (let i = 0; i < targetIndices2.length; i++) {
      let pt1 = face.keypoints[targetIndices2[i]];
      let pt2 = face.keypoints[targetIndices2[(i + 1) % targetIndices2.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // 右眼外圈 (包含編號 247)
    let rightEyeOuter = [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25];
    stroke(0, 255, 0); // 綠色
    strokeWeight(1);
    for (let i = 0; i < rightEyeOuter.length; i++) {
      let pt1 = face.keypoints[rightEyeOuter[i]];
      let pt2 = face.keypoints[rightEyeOuter[(i + 1) % rightEyeOuter.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // 右眼內圈 (包含編號 246)
    let rightEyeInner = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
    stroke(0, 0, 255); // 藍色
    strokeWeight(1);
    for (let i = 0; i < rightEyeInner.length; i++) {
      let pt1 = face.keypoints[rightEyeInner[i]];
      let pt2 = face.keypoints[rightEyeInner[(i + 1) % rightEyeInner.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // 左眼外圈 (與右眼對稱)
    let leftEyeOuter = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
    stroke(0, 255, 0); // 綠色
    strokeWeight(1);
    for (let i = 0; i < leftEyeOuter.length; i++) {
      let pt1 = face.keypoints[leftEyeOuter[i]];
      let pt2 = face.keypoints[leftEyeOuter[(i + 1) % leftEyeOuter.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // 左眼內圈 (與右眼對稱)
    let leftEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];
    stroke(0, 0, 255); // 藍色
    strokeWeight(1);
    for (let i = 0; i < leftEyeInner.length; i++) {
      let pt1 = face.keypoints[leftEyeInner[i]];
      let pt2 = face.keypoints[leftEyeInner[(i + 1) % leftEyeInner.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // 臉部最外層輪廓 (Face Oval)
    stroke(255, 255, 255); // 使用白色線條
    strokeWeight(1);
    for (let i = 0; i < faceOutline.length; i++) {
      let pt1 = face.keypoints[faceOutline[i]];
      let pt2 = face.keypoints[faceOutline[(i + 1) % faceOutline.length]];
      line(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    // --- 噴火特效邏輯 ---
    // 取得上下嘴唇內側的特徵點 (13: 上嘴唇內側, 14: 下嘴唇內側)
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    
    // 計算嘴巴張開的距離
    let mouthDist = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);

    // 如果嘴巴張開超過一定距離 (這裡設定15)，就產生火焰粒子
    if (mouthDist > 15) {
      let mouthX = (upperLip.x + lowerLip.x) / 2;
      let mouthY = (upperLip.y + lowerLip.y) / 2;
      for (let i = 0; i < 5; i++) {
        fireParticles.push(new FireParticle(mouthX, mouthY));
      }
    }

    // 使用 ADD 混合模式，讓火焰重疊時有發光的效果
    blendMode(ADD);
    for (let i = fireParticles.length - 1; i >= 0; i--) {
      fireParticles[i].update();
      fireParticles[i].show();
      // 當粒子生命週期結束時將其移除
      if (fireParticles[i].life <= 0) {
        fireParticles.splice(i, 1);
      }
    }
    blendMode(BLEND); // 畫完火焰後恢復正常混合模式

    pop();
  }
}

// 當視窗大小改變（例如手機旋轉橫向/直向）時，自動重設畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- 火焰粒子類別 ---
class FireParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);   // 橫向隨機飄散
    this.vy = random(5, 12);   // 往下噴灑的速度
    this.life = 255;           // 生命週期（控制透明度）
    this.r = 255;              // 顏色 R
    this.g = random(50, 150);  // 顏色 G (讓它呈現紅橘黃的火光)
    this.b = 0;                // 顏色 B
    this.size = random(15, 35);// 粒子大小
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 10;           // 生命力衰減
    this.size *= 0.95;         // 粒子隨時間縮小
  }

  show() {
    noStroke();
    fill(this.r, this.g, this.b, this.life);
    circle(this.x, this.y, this.size);
  }
}

// --- 背景小魚類別 ---
class Fish {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(15, 40); // 魚的大小
    this.vx = random(1, 3) * (random() > 0.5 ? 1 : -1); // 隨機向左或向右游
    this.vy = random(-0.5, 0.5); // 微微的上下起伏
    // 隨機產生一些熱帶魚的顏色
    this.color = color(random(100, 255), random(100, 255), random(150, 255));
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 當魚游出螢幕邊界時，讓牠從另一邊繞回來
    if (this.x > width + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.y > height + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
  }

  show() {
    push();
    translate(this.x, this.y);
    if (this.vx < 0) scale(-1, 1); // 如果往左游，就水平翻轉影像
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.size, this.size * 0.6); // 魚的身體
    triangle(-this.size * 0.4, 0, -this.size * 0.8, -this.size * 0.3, -this.size * 0.8, this.size * 0.3); // 魚的尾巴
    pop();
  }
}
