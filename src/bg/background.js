const appName = 'Trello Pull Request Helper'
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
      this.getTrelloCardInfo(request.trelloCardURL, sendResponse)
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

function loadFromStorage(key, callback) {
  let retrieve = {}
  retrieve[key] = key

  chrome.storage.sync.get(retrieve, items => {
    if (items[key]) {
      return items[key]
    } else {
      return null
    }
  })
}

function getTrelloCardInfo(trelloCardURL, sendResponse) {
  const idWithSlashes = trelloCardURL.match('\/[a-zA-z0-9]{2,}\/')[0]
  const trelloCardId = idWithSlashes.substring(1, idWithSlashes.length - 1)

  chrome.storage.sync.get({ apiKey: '' }, items => {
    if (items.apiKey) {
      Trello.setKey(items.apiKey)
      Trello.authorize({
        name: appName,
        expiration: 'never',
        interactive: false
      })

      Trello.cards.get(trelloCardId,
      trelloCardInfo => { // Success
        sendResponse({ trelloCardInfo })
      },
      () => { // Error
        sendResponse(null)
      })
    }
  })
}
