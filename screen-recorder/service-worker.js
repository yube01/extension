// check
const checkRecording = async () => {
  const recording = await chrome.storage.local.get(["recording", "type"]);
  const recordingStatus = recording.recording || false;
  const recordingType = recording.type || "";
  console.log("recording status", recordingStatus, recordingType);
  return [recordingStatus, recordingType];
};

// update recording state
const updateRecording = async (state, type) => {
  console.log("update recording", type);
  chrome.storage.local.set({ recording: state, type });
};

const startRecording = async (type) => {
  console.log("start recording", type);
  const currentstate = await checkRecording();
  console.log("current state", currentstate);
  updateRecording(true, type);
  // update the icon
  chrome.action.setIcon({ path: "icons/recording.png" });
  if (type === "tab") {
    recordTabState(true);
  }
  if (type === "screen") {
    recordScreen();
  }
};

const stopRecording = async () => {
  console.log("stop recording");
  updateRecording(false, "");
  // update the icon
  chrome.action.setIcon({ path: "icons/not-recording.png" });
  recordTabState(false);
};

// add listender for messages
chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log("message received", request, sender);

  switch (request.type) {
    case "open-tab":
      openTabWithVideo(request);
      break;
    case "start-recording":
      startRecording(request.recordingType);
      break;
    case "stop-recording":
      stopRecording();
      break;
    default:
      console.log("default");
  }

  return true;
});
