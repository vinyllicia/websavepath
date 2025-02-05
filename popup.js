document.addEventListener("DOMContentLoaded", () => {
    loadSavedSites();

    document.getElementById("save").addEventListener("click", () => {
        let website = document.getElementById("websiteURL").value.trim();
        let folder = document.getElementById("folderName").value.trim();
        let fileTypes = document.getElementById("fileTypes").value.trim();

        if (!website || !folder) {
            alert("Please enter both a website and a folder name.");
            return;
        }

        website = website.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];

        chrome.storage.local.get("siteSettings", (data) => {
            let settings = data.siteSettings || {};
            settings[website] = { folderName: folder, fileTypes };

            chrome.storage.local.set({ siteSettings: settings }, () => {
                loadSavedSites();
                alert(`Saved: ${website} at ${folder} (Allowed: ${fileTypes || "All"})`);
            });
        });
    });
});

function loadSavedSites() {
    chrome.storage.local.get("siteSettings", (data) => {
        let settings = data.siteSettings || {};
        let siteList = document.getElementById("siteList");
        siteList.innerHTML = "";

        Object.keys(settings).forEach((site) => {
            let li = document.createElement("li");
            li.className = "p-2 bg-gray-800 rounded mb-1 flex justify-between items-center";
            
            let text = document.createElement("span");
            text.textContent = `${site} → ${settings[site].folderName} (${settings[site].fileTypes || "All"})`;

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.className = "ml-2 bg-red-500 hover:bg-red-600 px-2 py-1 rounded";
            deleteBtn.addEventListener("click", () => deleteSite(site));

            li.appendChild(text);
            li.appendChild(deleteBtn);
            siteList.appendChild(li);
        });
    });
}

function deleteSite(website) {
    chrome.storage.local.get("siteSettings", (data) => {
        let settings = data.siteSettings || {};
        delete settings[website];

        chrome.storage.local.set({ siteSettings: settings }, () => {
            loadSavedSites();
        });
    });
}
