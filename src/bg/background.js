chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'add-classes':
      sendResponse()
      break
    case 'inject-stylesheet':
      chrome.tabs.insertCSS(null, { file: 'src/inject/inject.css' })
      break
  }
})
