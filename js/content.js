var loop = {
  checked: false,
  startTime: 0,
  endTime: 0,
};

const video = document.querySelector(".html5-main-video");
const vid = document.querySelector("video");

function onTimeUpdate() {
  if (vid.currentTime >= loop.endTime || vid.currentTime < loop.startTime) {
    vid.currentTime = loop.startTime;
  }
}

function formatTimestamp(timestampInSeconds) {
  const minutes = Math.floor(timestampInSeconds / 60);
  const seconds = timestampInSeconds % 60;

  const formattedMinutes = minutes > 0 ? String(minutes) : "0";
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "mirrorInput": {
      if (message.method == "get") {
        sendResponse({ checked: video.classList.contains("mirrored") });
      } else if (message.method == "set") {
        message.checked
          ? video.classList.add("mirrored")
          : video.classList.remove("mirrored");
      }
      break;
    }
    case "speedInput": {
      if (message.method == "get") {
        sendResponse({ value: vid.playbackRate });
      } else if (message.method == "set") {
        vid.playbackRate = message.value;
      }

      break;
    }
    case "loopInput": {
      if (message.method == "get") {
        sendResponse({ checked: loop.checked });
      } else if (message.method == "set") {
        message.checked
          ? vid.addEventListener("timeupdate", onTimeUpdate)
          : vid.removeEventListener("timeupdate", onTimeUpdate);
        loop.checked = message.checked;
      }
      break;
    }
    case "startTimeButton": {
      if (message.method == "get") {
        sendResponse({ value: formatTimestamp(loop.startTime) });
      } else if (message.method == "set") {
        loop.startTime = Math.floor(vid.currentTime);

        sendResponse({ value: formatTimestamp(loop.startTime) });
      }
      break;
    }
    case "endTimeButton": {
      if (message.method == "get") {
        sendResponse({ value: formatTimestamp(loop.endTime) });
      } else if (message.method == "set") {
        loop.endTime = Math.floor(vid.currentTime);

        sendResponse({ value: formatTimestamp(loop.endTime) });
      }
      break;
    }
    default: {
      console.error("Unknown message type");
      break;
    }
  }
});
