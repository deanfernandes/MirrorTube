var loop = {
  checked: false,
  startTime: 0,
  endTime: 0
};

function onTimeUpdate() {
  if (document.querySelector('video').currentTime >= loop.endTime || document.querySelector('video').currentTime < loop.startTime) {
    document.querySelector('video').currentTime = loop.startTime;
  }
}

function formatTimestamp(timestampInSeconds) {
  const minutes = Math.floor(timestampInSeconds / 60);
  const seconds = timestampInSeconds % 60;

  const formattedMinutes = minutes > 0 ? String(minutes) : '0';
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type == 'mirrorInput') {
    if (message.method == 'get') {
      sendResponse({ checked: document.getElementsByClassName('html5-main-video')[0].classList.contains('mirrored') });
    }
    else if (message.method == 'set') {
      if(message.checked) {
        document.getElementsByClassName('html5-main-video')[0].classList.add('mirrored');
      }
      else {
        document.getElementsByClassName('html5-main-video')[0].classList.remove('mirrored');
      }
    }
  }
  else if(message.type == 'speedInput') {
    if (message.method == 'get') {
      const video = document.querySelector('video');
      sendResponse({ value: video.playbackRate });
    }
    else if (message.method == 'set') {
      const video = document.querySelector('video');
      video.playbackRate = message.value;   
    }
  }
  else if(message.type == 'loopInput') {
    if (message.method == 'get') {
      sendResponse({ checked: loop.checked });
    }
    else if (message.method == 'set') {
      loop.checked = message.checked;

      if(message.checked) {
        loop.checked = true;

        document.querySelector('video').addEventListener('timeupdate', onTimeUpdate);
      }
      else {
        loop.checked = false;

        document.querySelector('video').removeEventListener('timeupdate', onTimeUpdate);
      }
    }
  }
  else if(message.type == 'startTimeButton') {
    if(message.method == 'get') {
      sendResponse({ value: formatTimestamp(loop.startTime) });
    }
    else if (message.method == 'set'){
      loop.startTime = Math.floor(document.querySelector('video').currentTime);

      sendResponse({ value: formatTimestamp(loop.startTime) });
    }
  }
  else if(message.type == 'endTimeButton') {
    if(message.method == 'get') {
      sendResponse({ value: formatTimestamp(loop.endTime) });
    }
    else if (message.method == 'set'){
      loop.endTime = Math.floor(document.querySelector('video').currentTime);

      sendResponse({ value: formatTimestamp(loop.endTime) });
    }
  }
});