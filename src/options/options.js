function restoreOptions() {
  chrome.storage.sync.get({
    apiKey: ''
  }, items => {
    $('#apiKey').val(items.apiKey)
  })
}

function saveOptions() {
  const apiKey = $('#apiKey').val()

  chrome.storage.sync.set({
    apiKey
  }, animateSaveButton)
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

document.addEventListener('DOMContentLoaded', restoreOptions)
$('#saveButton').click(saveOptions)
