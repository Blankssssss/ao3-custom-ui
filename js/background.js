importScripts('common.js')

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.sync.set(defaultSettings)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.storage.sync.set({ ao3CustomUI: message.settings }, () => {
    sendResponse('Success')
  })
  return true
})
