document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type : 'mirrorInput', method: 'get' }, (response) => {
            document.getElementById('mirrorInput').checked = response.checked;
        });

        chrome.tabs.sendMessage(tabs[0].id, { type : 'speedInput', method: 'get' }, (response) => {
            document.getElementById('speedInput').value = response.value;

            document.getElementById("speedInputValue").textContent = response.value;
        });

        chrome.tabs.sendMessage(tabs[0].id, { type : 'loopInput', method: 'get' }, (response) => {
            document.getElementById('loopInput').checked = response.checked;

            if(response.checked) {
                document.getElementById('startTimeButton').disabled = true;
                document.getElementById('endTimeButton').disabled = true;
            }
            else {
                document.getElementById('startTimeButton').disabled = false;
                document.getElementById('endTimeButton').disabled = false;
            }
        });

        chrome.tabs.sendMessage(tabs[0].id, { type : 'startTimeButton', method: 'get' }, (response) => {
            document.getElementById('startTimeButton').value = response.value;
        });

        chrome.tabs.sendMessage(tabs[0].id, { type : 'endTimeButton', method: 'get' }, (response) => {
            document.getElementById('endTimeButton').value = response.value;

            if(document.getElementById('endTimeButton').value == '0:00') {
                document.getElementById('loopInput').disabled = true;
            }
            else {
                document.getElementById('loopInput').disabled = false;
            }
        });

        document.getElementById('mirrorInput').addEventListener('change', () => {
            chrome.tabs.sendMessage(tabs[0].id, { type : 'mirrorInput', method: 'set', checked: document.getElementById('mirrorInput').checked });
        });

        document.getElementById('speedInput').addEventListener('input', () => {
            console.log("change");
            document.getElementById('speedInputValue').textContent = document.getElementById('speedInput').value;

            chrome.tabs.sendMessage(tabs[0].id, { type : 'speedInput', method: 'set', value: document.getElementById('speedInput').value });
        });

        document.getElementById('loopInput').addEventListener('change', () => {
            chrome.tabs.sendMessage(tabs[0].id, { type : 'loopInput', method: 'set', checked: document.getElementById('loopInput').checked});

            if(document.getElementById('loopInput').checked) {
                document.getElementById('startTimeButton').disabled = true;
                document.getElementById('endTimeButton').disabled = true;
            }
            else {
                document.getElementById('startTimeButton').disabled = false;
                document.getElementById('endTimeButton').disabled = false;
            }
        });

        document.getElementById('startTimeButton').addEventListener('click', () => {
            chrome.tabs.sendMessage(tabs[0].id, { type : 'startTimeButton', method: 'set' }, (response) => {
                document.getElementById('startTimeButton').value = response.value;
            });
        });

        document.getElementById('endTimeButton').addEventListener('click', () => {
            chrome.tabs.sendMessage(tabs[0].id, { type : 'endTimeButton', method: 'set' }, (response) => {
                document.getElementById('endTimeButton').value = response.value;

                if(document.getElementById('endTimeButton').value == '0:00') {
                    document.getElementById('loopInput').disabled = true;
                }
                else {
                    document.getElementById('loopInput').disabled = false;
                }
            });
        });
    });

    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const messageKey = elem.getAttribute('data-i18n');
        const localizedMessage = chrome.i18n.getMessage(messageKey);
        if (localizedMessage) {
            elem.textContent = localizedMessage;
        }
    });
});