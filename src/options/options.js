const appName = 'Trello Pull Request Helper'

function restoreOptions() {
  chrome.storage.sync.get({
    apiKey: ''
  }, items => {
    restoreApiKey(items.apiKey)
  })
}

function restoreApiKey(apiKey) {
  $('#apiKey').val(apiKey)

  if (localStorage.trello_token) {
    $.get({
      url: `http://api.trello.com/1/token/${localStorage.trello_token}`,
      data: { key: apiKey },
      error: response => {
        if (response.status === 404) {
          Trello.deauthorize()
          location.reload()
        }
      }
    })
  }

  authorizeTrello(apiKey, false)
}

function saveOptions() {
  const apiKey = $('#apiKey').val()

  chrome.storage.sync.set({
    apiKey
  }, animateSaveButton)

  authorizeTrello(apiKey, true)
}

function animateSaveButton() {
  const saveButton = $('#saveButton')
  saveButton.removeClass('btn-primary')
  saveButton.addClass('btn-success')
  saveButton.html('Saved!')

  setTimeout(() => {
    saveButton.removeClass('btn-success')
    saveButton.addClass('btn-primary')
    saveButton.html('Save')
  }, 1000)
}

function authorizeTrello(apiKey, interactive) {
  Trello.setKey(apiKey)

  Trello.authorize({
    name: appName,
    expiration: 'never',
    interactive
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
$('#saveButton').click(saveOptions)
