let shouldExecuteScript = true

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (shouldExecuteScript &&
        tab.status === 'complete' &&
        tab.url &&
        tab.url.match('https:\/\/github\.com\/[a-zA-z1-9]+\/[a-zA-z0-9]+\/pull\/[0-9]+')) {

    shouldExecuteScript = false

    chrome.tabs.executeScript(tab.id, { file: 'src/inject/inject.js', runAt: 'document_idle' }, result => {
      shouldExecuteScript = true
    })
  }
})
