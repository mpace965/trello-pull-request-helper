const appName = 'Trello Pull Request Helper'
let shouldExecuteScript = true

chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name === 'trello-helper')

  port.onMessage.addListener(message => {
    if (message.action === 'inject-stylesheet') {
      chrome.tabs.insertCSS(null, { file: 'src/inject/inject.css' })
    } else if (message.action === 'inject-trello-card') {
      this.getTrelloCardInfo(message.trelloCardURL, port)
    }
  })
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

function getTrelloCardInfo(trelloCardURL, port) {
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
        port.postMessage({ action: 'inject-trello-card', trelloCardInfo })
      },
      () => { // Error
        port.postMessage({ action: 'inject-trello-card', trelloCardInfo: null })
      })
    }
  })
}
