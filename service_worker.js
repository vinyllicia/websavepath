chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    let url = new URL(downloadItem.finalUrl);
    let domain = url.hostname;
    let fileExtension = downloadItem.filename.split('.').pop().toLowerCase();

    chrome.storage.local.get("siteSettings", (data) => {
        let settings = data.siteSettings || {};
        let siteConfig = settings[domain];

        if (siteConfig) {
            let allowedTypes = siteConfig.fileTypes ? siteConfig.fileTypes.split(',').map(f => f.trim().toLowerCase()) : [];

            if (allowedTypes.length > 0 && !allowedTypes.includes(fileExtension)) {
                console.log(`Blocked ${downloadItem.filename} (Type not allowed)`);
                return; // Cancel download if not an allowed file type
            }

            let folder = siteConfig.folderName;
            let newFilename = `${folder}/${downloadItem.filename}`;
            suggest({ filename: newFilename });
        } else {
            suggest(); // Use default Chrome download location
        }
    });
});
