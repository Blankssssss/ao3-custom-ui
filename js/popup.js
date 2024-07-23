const fontFamily = document.querySelector('#font-family'),
  fontSize = document.querySelector('#font-size'),
  width = document.querySelector('#width'),
  lineSpacing = document.querySelector('#line-spacing'),
  indent = document.querySelector('#indent'),
  theme = document.querySelector('#theme'),
  custom = document.querySelector('#custom'),
  background = document.querySelector('#background'),
  text = document.querySelector('#text'),
  reset = document.querySelector('#reset')

// Load saved settings to popup when open extension
window.onload = function () {
  chrome.storage.sync.get('ao3CustomUI', (data) => {
    const settings = data.ao3CustomUI
    fillDropdown(fontFamily, settings.fontFamilyList)
    const themeNameList = settings.themeList.map((theme) => theme[0])
    fillDropdown(theme, themeNameList)

    applySettingsToPopup(settings)
  })

  function fillDropdown(element, list) {
    for (let i = 0; i < list.length; i++) {
      var option = document.createElement('option')
      option.value = option.innerHTML = list[i]
      element.appendChild(option)
    }
  }
}

fontFamily.addEventListener('change', () => {
  const chosenFont = fontFamily.options[fontFamily.selectedIndex].value
  changeSettings('fontfamily', chosenFont)
})

fontSize.addEventListener('input', () => {
  const chosenSize = fontSize.value
  if (Number(chosenSize) >= 50 && Number(chosenSize) <= 200) {
    fontSize.style.background = 'inherit'
    changeSettings('fontSize', chosenSize)
  } else {
    fontSize.style.background = '#FFC2C2'
  }
})

width.addEventListener('input', () => {
  const chosenWidth = width.value
  if (Number(chosenWidth) >= 50 && Number(chosenWidth) <= 100) {
    width.style.background = 'inherit'
    changeSettings('width', chosenWidth)
  } else {
    width.style.background = '#FFC2C2'
  }
})

lineSpacing.addEventListener('input', () => {
  const chosenLine = lineSpacing.value
  if (Number(chosenLine) >= 1 && Number(chosenLine) <= 3) {
    lineSpacing.style.background = 'inherit'
    changeSettings('lineSpacing', chosenLine)
  } else {
    lineSpacing.style.background = '#FFC2C2'
  }
})

indent.addEventListener('input', () => {
  const chosenIndent = indent.value
  if (Number(chosenIndent) >= 0 && Number(chosenIndent) <= 5) {
    indent.style.background = 'inherit'
    changeSettings('indent', chosenIndent)
  } else {
    indent.style.background = '#FFC2C2'
  }
})

theme.addEventListener('change', () => {
  const chosenTheme = theme.options[theme.selectedIndex].value
  changeSettings('theme', chosenTheme)
  displayCustomColors(chosenTheme)
})

background.addEventListener('change', () => {
  const chosenBackground = background.value
  changeSettings('background', chosenBackground)
})

text.addEventListener('change', () => {
  const chosenText = text.value
  changeSettings('text', chosenText)
})

reset.addEventListener('click', () => {
  applySettingsToPage(defaultSettings.ao3CustomUI)
  applySettingsToPopup(defaultSettings.ao3CustomUI)
})

function applySettingsToPopup(settings) {
  fontFamily.value = settings.fontfamily
  fontSize.value = settings.fontSize
  width.value = settings.width
  lineSpacing.value = settings.lineSpacing
  indent.value = settings.indent
  theme.value = settings.theme
  displayCustomColors(theme.value)
  background.value = settings.themeList[3][1]
  text.value = settings.themeList[3][2]
  width.style.background =
    lineSpacing.style.background =
    indent.style.background =
      'inherit'
}

function displayCustomColors(theme) {
  if (theme === 'Custom') {
    custom.disabled = background.disabled = text.disabled = false
    custom.classList.remove('read-only')
  } else {
    custom.disabled = background.disabled = text.disabled = true
    custom.classList.add('read-only')
  }
}

function changeSettings(key, value) {
  chrome.storage.sync.get('ao3CustomUI', (data) => {
    const settings = data.ao3CustomUI
    if (key === 'background') {
      settings.themeList[3][1] = value
    } else if (key === 'text') {
      settings.themeList[3][2] = value
    } else {
      settings[key] = value
    }
    applySettingsToPage(settings)
  })
}

function applySettingsToPage(settings) {
  // Call background.js to set settings to storage
  chrome.runtime.sendMessage({ settings: settings }, (response) => {
    if (response === 'Success') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: modifyHTML,
        })
      })
    }
  })
}
