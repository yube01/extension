const cameraId = "yube-camera";

const camera = document.getElementById(cameraId);

if (camera) {
  console.log("Camera found", camera);
} else {
  const cameraElement = document.createElement("iframe");
  cameraElement.id = cameraId;
  cameraElement.setAttribute(
    "style",
    ` all: initial;
  position: fixed;
  width:200px;
  height:200px;
  top:10px;
  right:10px;
  border-radius: 100px;
  background: black;
  z-index: 999999;
  border:none;`
  );
  cameraElement.src = chrome.runtime.getURL("camera.html");
  // set permiissions on iframe - camera and microphone
  cameraElement.setAttribute("allow", "camera; microphone");

  document.body.appendChild(cameraElement);
}
