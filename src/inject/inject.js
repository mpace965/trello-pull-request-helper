chrome.extension.sendMessage({}, response => {
	const readyStateCheckInterval = setInterval(() => {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval)

			console.log('Hello. This message was sent from scripts/inject.js')

		}
	}, 10)
})
