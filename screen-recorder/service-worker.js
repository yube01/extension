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

const recordTabState = async (start = true) => {
  // setup our offscrene document
  const existingContexts = await chrome.runtime.getContexts({});
  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === "OFFSCREEN_DOCUMENT"
  );

  // If an offscreen document is not already open, create one.
  if (!offscreenDocument) {
    // Create an offscreen document.
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["USER_MEDIA", "DISPLAY_MEDIA"],
      justification: "Recording from chrome.tabCapture API",
    });
  }

  if (start) {
    // use the tapCapture API to get the stream
    // get the id of the active tab
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const tabId = tab[0].id;

    console.log("tab id", tabId);

    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId,
    });

    console.log("stream id", streamId);

    // send this to our offscreen document
    chrome.runtime.sendMessage({
      type: "start-recording",
      target: "offscreen",
      data: streamId,
    });
  } else {
    // stop
    chrome.runtime.sendMessage({
      type: "stop-recording",
      target: "offscreen",
    });
  }
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
