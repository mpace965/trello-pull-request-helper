const connection = chrome.runtime.connect({ name: 'trello-helper' })

initializePullRequest()

connection.onMessage.addListener(message => {
  if (message.action === 'inject-trello-card') {
    this.injectTrelloCard(message.trelloCardInfo)
  }
})

function initializePullRequest() {
  const thread = document.querySelector('[name="thread_id"]')

  if (thread) {
    const issue = document.getElementById(`issue-${thread.value}`)
    const commentBody = issue.getElementsByClassName('comment-body markdown-body markdown-format js-comment-body')[0]

    const trelloCardURL = this.trelloCardURL(commentBody)

    if (trelloCardURL) {
      const container = document.getElementsByClassName('container new-discussion-timeline experiment-repo-nav')[0]
      const issuesListing = container.getElementsByClassName('issues-listing')[0]
      const pullRequest = issuesListing.getElementsByClassName('clearfix js-issues-results')[0]
      const trelloDiv = issuesListing.appendChild(document.createElement('div'))

      container.classList.add('inject-container')
      issuesListing.classList.add('inject-issues-listing')
      pullRequest.classList.add('inject-pull-request')
      trelloDiv.classList.add('inject-trello-div')

      trelloDiv.id = "trelloCardMountPoint"

      connection.postMessage({ action: 'inject-stylesheet' })
      connection.postMessage({ action: 'inject-trello-card', trelloCardURL })
    }
  }
}

function injectTrelloCard(trelloCardInfo) {
  console.log(trelloCardInfo)
}

function trelloCardURL(commentBody) {
  const trelloCardElement = this.trelloCardElement(commentBody)

  if (trelloCardElement) {
    return trelloCardElement.innerHTML.match('https:\/\/trello\.com\/c\/[a-zA-z0-9]+\/[a-zA-z0-9-]+')[0]
  }

  return null
}

function trelloCardElement(commentBody) {
  for (let i = 0; i < commentBody.childNodes.length; i++) {
    element = commentBody.childNodes[i]

    if (element.nodeName != 'P') {
      continue
    }

    if (element.innerHTML.includes('trello.com/c/')) {
      return element
    }
  }

  return null
}
