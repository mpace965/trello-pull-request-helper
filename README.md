# Trello Pull Request Helper
Chrome extension that inserts any linked Trello card inline with a GitHub pull request.

## Technology

I used [Extensionizr](http://extensionizr.com/) to get up and running quickly.

## Incomplete!

Warning, this repository is a work in progress!

**TODO**

* Create Trello authorization page
* Use Trello authorization to read linked cards
* Render Trello card inline
* Update icons

## Caveats

I've tried to make the script only get executed once when a pull request page loads. This is now the case
on a refresh of a pull request page, but not when you're navigating in and out of pull requests. If you can figure out
how to better limit the executing of the script, feel free to make a pull request here.
