document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const statusText = document.getElementById("status");
  const hexInput = document.getElementById("hexColor");
  const applyBtn = document.getElementById("apply");
  const currcolorText = document.getElementById("currcolorText");
  const currcolorBox = document.getElementById("currcolorBox");

    chrome.storage.sync.get(["enabled", "color"], ({enabled, color}) =>{
        toggle.checked = enabled || false;
        statusText.textContent = enabled ? "bg is ON" : "bg is OFF";

        if(color){
            hexInput.value = color;
            currcolorText.textContent = color;
            currcolorBox.backgroundColor = color;
        }
    });

    toggle.addEventListener("change", () => {
        const enabled = toggle.checked;
        chrome.storage.sync.set({enabled});
        statusText.textContent = enabled ? "bg is ON" : "bg is OFF";

        chrome.runtime.sendMessage({action:"toggle", enabled});
    });

    applyBtn.addEventListener("click", () => {
        const color = hexInput.value;
        if (/^#[0-9A-F]{6}$/i.test(color)){
            chrome.storage.sync.set({color});
            currcolorText.textContent=color;
            currcolorBox.backgroundColor=color;

            chrome.runtime.sendMessage({action: "setColor", color});
        } else {
            alert("hex code invalid");
        }
    });

});