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
      'Lucida Grande, Lucida Sans Unicode, Verdana, Helvetica, sans-serif, GNU Unifont',
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
    const headings = document.querySelectorAll('#workskin .heading')
    const blockquotes = document.querySelectorAll(
      'blockquote[class="userstuff"]'
    )
    const title = document.querySelector('h3[class="title"]')
    const paragraphs = document.querySelectorAll('.userstuff p')
    const links = document.querySelectorAll('#workskin a')

    if (work) {
      work.style.setProperty('box-sizing', 'border-box')

      if (settings.fontfamily === 'Default') {
        setFont(settings.defaultFontFamily)
        setHeadingFont(settings.defaultHeadingFontFamily)
      } else {
        setFont(settings.fontfamily)
        setHeadingFont(settings.fontfamily)
      }

      work.style.setProperty(
        'font-size',
        ((Number(settings.fontSize) / 100) * 1.08).toString() + 'em'
      )

      paragraphs.forEach((paragraph) => {
        paragraph.style.setProperty('line-height', settings.lineSpacing)
        paragraph.style.setProperty('text-indent', settings.indent + 'em')
      })

      work.style.setProperty('width', settings.width + '%')

      work.style.setProperty('padding', '0 2%')
      const [background, text] = settings.themeList
        .find((theme) => theme[0] === settings.theme)
        .slice(-2)
      work.style.setProperty('background', background)
      work.style.setProperty('color', text)
      links.forEach((link) => {
        link.style.setProperty('color', text)
      })
    }

    function setFont(font) {
      work.style.setProperty('font-family', font)
      blockquotes.forEach((blockquote) => {
        blockquote.style.setProperty('font-family', font)
      })
    }

    function setHeadingFont(font) {
      headings.forEach((heading) => {
        heading.style.setProperty('font-family', font)
      })
      if (title) {
        title.style.setProperty('font-family', font)
      }
    }
  })
}
