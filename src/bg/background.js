let shouldExecuteScript = true

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'add-classes':
      if (localStorage.trello_token) {
        sendResponse()
      }
      break
    case 'inject-stylesheet':
      chrome.tabs.insertCSS(null, { file: 'src/inject/inject.css' })
      break
    case 'inject-trello-card':
      const trelloCard = this.getTrelloCard(request.trelloCardURL)
      sendResponse({ trelloCard })
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

// TODO find out why passing this to inject.js doesn't work
function getTrelloCard(trelloCardURL) {
  const idWithSlashes = trelloCardURL.match('\/[a-zA-z0-9]{2,}\/')[0]
  const trelloCardId = idWithSlashes.substring(1, idWithSlashes.length - 1)
  const trelloCardHTML = `https://trello.com/c/${trelloCardId}.html`

  var trelloCard = document.createElement('iframe')
  trelloCard.src = trelloCardHTML

  return trelloCard
}
