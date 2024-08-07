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
    fillDropdown(
      theme,
      settings.themeList.map((theme) => theme[0])
    )
    applySettingsToPopup(settings)
  })
}

function fillDropdown(element, list) {
  for (let i = 0; i < list.length; i++) {
    var option = document.createElement('option')
    option.value = option.innerHTML = list[i]
    element.appendChild(option)
  }
}

// Apply settings
fontFamily.addEventListener('change', () => {
  changeSettings('fontfamily', fontFamily.value)
})

fontSize.addEventListener('input', () =>
  validateAndChangeSettings(fontSize, 'fontSize', 50, 200)
)

width.addEventListener('input', () =>
  validateAndChangeSettings(width, 'width', 50, 100)
)

lineSpacing.addEventListener('input', () =>
  validateAndChangeSettings(lineSpacing, 'lineSpacing', 1, 3)
)

indent.addEventListener('input', () =>
  validateAndChangeSettings(indent, 'indent', 0, 5)
)

theme.addEventListener('change', () => {
  changeSettings('theme', theme.value)
  displayCustomColors(theme.value)
})

background.addEventListener('change', () => {
  changeSettings('background', background.value)
})

text.addEventListener('change', () => {
  changeSettings('text', text.value)
})

reset.addEventListener('click', () => {
  applySettingsToPage(defaultSettings.ao3CustomUI)
  applySettingsToPopup(defaultSettings.ao3CustomUI)
})

function validateAndChangeSettings(element, key, min, max) {
  const value = Number(element.value)
  if (value >= min && value <= max) {
    element.style.background = 'inherit'
    changeSettings(key, element.value)
  } else {
    element.style.background = '#FFC2C2'
  }
}

function applySettingsToPopup(settings) {
  fontFamily.value = settings.fontfamily
  fontSize.value = settings.fontSize
  width.value = settings.width
  lineSpacing.value = settings.lineSpacing
  indent.value = settings.indent
  theme.value = settings.theme
  displayCustomColors(theme.value)
  const customThemeIndex = settings.themeList.findIndex(
    (theme) => theme[0] === 'Custom'
  )
  background.value = settings.themeList[customThemeIndex][1]
  text.value = settings.themeList[customThemeIndex][2]
  resetInputBackground([fontSize, width, lineSpacing, indent])
}

function displayCustomColors(theme) {
  const isCustom = theme === 'Custom'
  custom.disabled = background.disabled = text.disabled = !isCustom
  custom.classList.toggle('read-only', !isCustom)
}

function resetInputBackground(inputs) {
  inputs.forEach((input) => (input.style.background = 'inherit'))
}

function changeSettings(key, value) {
  chrome.storage.sync.get('ao3CustomUI', (data) => {
    const settings = data.ao3CustomUI
    const customThemeIndex = settings.themeList.findIndex(
      (theme) => theme[0] === 'Custom'
    )
    switch (key) {
      case 'background':
        settings.themeList[customThemeIndex][1] = value
        break
      case 'text':
        settings.themeList[customThemeIndex][2] = value
        break
      default:
        settings[key] = value
    }
    applySettingsToPage(settings)
  })
}

function applySettingsToPage(settings) {
  // Call background.js to set settings to storage
  chrome.runtime.sendMessage({ settings }, (response) => {
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
