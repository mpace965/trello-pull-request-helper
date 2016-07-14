chrome.extension.sendMessage({ action: 'add-classes' }, response => {
	const readyStateCheckInterval = setInterval(() => {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval)

			const container = document.getElementsByClassName('container new-discussion-timeline experiment-repo-nav')[0]
			const issuesListing = container.getElementsByClassName('issues-listing')[0]
			const pullRequest = issuesListing.getElementsByClassName('clearfix js-issues-results')[0]
			const trelloDiv = issuesListing.appendChild(document.createElement('div'))

			container.classList.add('inject-container')
			issuesListing.classList.add('inject-issues-listing')
			pullRequest.classList.add('inject-pull-request')
			trelloDiv.classList.add('inject-trello-div')
		}
	}, 10)
})

chrome.extension.sendMessage({ action: 'inject-stylesheet' })
