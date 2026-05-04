// Face Mesh Detection with ml5.js  
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh  
// https://youtu.be/R5UZsIwPbJA  

let video;
let faceMesh;
let faces = [];

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
}

function modelReady() {
  console.log("FaceMesh model is loaded!");
  // Start detecting faces once the model is ready
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background('#84a59d');

  let imgW = windowWidth * 0.5;
  let imgH = windowHeight * 0.5;
  let x = (windowWidth - imgW) / 2;
  let y = (windowHeight - imgH) / 2;

  image(video, x, y, imgW, imgH);

  // Ensure at least one face is detected
  if (faces.length > 0 && video.width > 0) {
    let face = faces[0];

    push();
    translate(x, y);
    scale(imgW / video.width, imgH / video.height);

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
    pop();
  }
}
