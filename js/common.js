const defaultSettings = {
  ao3CustomUI: {
    fontfamily: 'Default',
    fontFamilyList: [
      'Default',
      'Arial',
      'Comic Sans MS',
      'Courier New',
      'Garamond',
      'Georgia',
      'Times New Roman',
      'Tahoma',
      'Trebuchet MS',
      'Verdana',
    ],
    defaultFontFamily:
      "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif, 'GNU Unifont'",
    defaultHeadingFontFamily: 'Georgia, sans-serif',
    fontSize: '100',
    lineSpacing: '1.5',
    width: '100',
    indent: '0',
    theme: 'Default',
    themeList: [
      // Name, background, text
      ['Default', 'inherit', 'inherit'],
      ['Dark', '#333333', '#eeeeee'],
      ['Sepia', '#fbf0d9', '#5f4b32'],
      ['Custom', '#ffffff', '#2a2a2a'],
    ],
  },
}

function modifyHTML() {
  chrome.storage.sync.get('ao3CustomUI', (data) => {
    const settings = data.ao3CustomUI
    const work = document.getElementById('workskin')

    if (!work) return

    const headings = document.querySelectorAll('#workskin .heading')
    const blockquotes = document.querySelectorAll('#workskin blockquote')
    const title = document.querySelector('h3.title')
    const paragraphs = document.querySelectorAll('#workskin p')
    const links = document.querySelectorAll('#workskin a')

    applySettings()

    function applySettings() {
      work.style.setProperty('box-sizing', 'border-box')

      const font =
        settings.fontfamily === 'Default'
          ? settings.defaultFontFamily
          : settings.fontfamily
      work.style.setProperty('font-family', font)
      blockquotes.forEach((blockquote) => {
        blockquote.style.setProperty('font-family', font)
      })
      const headingFont =
        settings.fontfamily === 'Default'
          ? settings.defaultHeadingFontFamily
          : settings.fontfamily
      headings.forEach((heading) => {
        heading.style.setProperty('font-family', headingFont)
      })
      if (title) {
        title.style.setProperty('font-family', headingFont)
      }

      work.style.setProperty(
        'font-size',
        `${(Number(settings.fontSize) / 100) * 1.08}em`
      )

      work.style.setProperty('width', `${settings.width}%`)

      paragraphs.forEach((paragraph) => {
        paragraph.style.setProperty('line-height', settings.lineSpacing)
        paragraph.style.setProperty('text-indent', `${settings.indent}em`)
      })

      work.style.setProperty('padding', '0 2%')
      const [background, text] = settings.themeList
        .find((theme) => theme[0] === settings.theme)
        .slice(-2)
      work.style.setProperty('background', background)
      work.style.setProperty('color', text)

      // Filter out edit button
      Array.from(links)
        .filter((link) => !link.closest('li'))
        .forEach((link) => {
          link.style.setProperty(
            'color',
            settings.themeList.find((theme) => theme[0] === settings.theme)[2]
          )
        })
    }
  })
}
