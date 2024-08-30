const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  // faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  // faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(webCam);

function webCam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.log(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

  const tinyFaceDetectorOptions = new faceapi.TinyFaceDetectorOptions({
    inputSize: 160,  // Smaller size for faster detection (default is 320)
    scoreThreshold: 0.5, // Increase threshold for faster processing
  });

  setInterval(async () => {
    const detection = await faceapi
      .detectAllFaces(video, tinyFaceDetectorOptions)
      .withFaceLandmarks()
      // .withFaceExpressions()
      // .withAgeAndGender();

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const resizedResults = faceapi.resizeResults(detection, {
      height: video.height,
      width: video.width,
    });

    faceapi.draw.drawDetections(canvas, resizedResults);
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
    // faceapi.draw.drawFaceExpressions(canvas, resizedResults);

    resizedResults.forEach((detection) => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        // label: detection.gender,
      });
      drawBox.draw(canvas);
    });

    console.log(detection);
  }, 50); // Reduced interval for quicker detection
});

<<<<<<< HEAD
=======

>>>>>>> 60d7b26e8d52219bd6fef9a027efa84b4cc92bcd
