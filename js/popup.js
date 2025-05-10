let mirrorInput = document.getElementById("mirrorInput");
let speedInput = document.getElementById("speedInput");
let speedInputValue = document.getElementById("speedInputValue");
let loopInput = document.getElementById("loopInput");
let startTimeButton = document.getElementById("startTimeButton");
let endTimeButton = document.getElementById("endTimeButton");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "mirrorInput", method: "get" },
    (response) => {
      mirrorInput.checked = response.checked;
    }
  );

  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "speedInput", method: "get" },
    (response) => {
      speedInput.value = response.value;

      speedInputValue.textContent = response.value;
    }
  );

  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "loopInput", method: "get" },
    (response) => {
      loopInput.checked = response.checked;

      if (response.checked) {
        startTimeButton.disabled = true;
        endTimeButton.disabled = true;
      } else {
        startTimeButton.disabled = false;
        endTimeButton.disabled = false;
      }
    }
  );

  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "startTimeButton", method: "get" },
    (response) => {
      startTimeButton.value = response.value;
    }
  );

  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "endTimeButton", method: "get" },
    (response) => {
      endTimeButton.value = response.value;

      if (endTimeButton.value == "0:00") {
        loopInput.disabled = true;
      } else {
        loopInput.disabled = false;
      }
    }
  );

  mirrorInput.addEventListener("change", (e) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "mirrorInput",
      method: "set",
      checked: e.target.checked,
    });
  });

  speedInput.addEventListener("input", (e) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "speedInput",
      method: "set",
      value: e.target.value,
    });
    speedInputValue.textContent = e.target.value;
  });

  loopInput.addEventListener("change", (e) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "loopInput",
      method: "set",
      checked: e.target.checked,
    });

    if (loopInput.checked) {
      startTimeButton.disabled = true;
      endTimeButton.disabled = true;
    } else {
      startTimeButton.disabled = false;
      endTimeButton.disabled = false;
    }
  });

  startTimeButton.addEventListener("click", (e) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "startTimeButton", method: "set" },
      (response) => {
        e.target.value = response.value;
      }
    );
  });

  endTimeButton.addEventListener("click", (e) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "endTimeButton", method: "set" },
      (response) => {
        e.target.value = response.value;

        if (endTimeButton.value == "0:00") {
          loopInput.disabled = true;
        } else {
          loopInput.disabled = false;
        }
      }
    );
  });
});

document.querySelectorAll("[data-i18n]").forEach((elem) => {
  const messageKey = elem.getAttribute("data-i18n");
  const localizedMessage = chrome.i18n.getMessage(messageKey);
  if (localizedMessage) {
    elem.textContent = localizedMessage;
  }
});
