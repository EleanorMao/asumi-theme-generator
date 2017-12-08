const colorsMap = {
  '#53B6FF': '$primary$',
  '#2aa5ff': '$darkp$',
  '#ecf7ff': '$lightp$',
  '#7AD57D': '$success$',
  '#6ad06e': '$darks$',
  '#eefaef': '$lights$',
  '#FFCD36': '$warning$',
  '#ffc822': '$darkw',
  '#fff9e8': '$lightw$',
  '#BDBDBD': '$disabled$',
  '#f0f0f0': '$lighdw$',
  '#F75A36': '$error$',
  '#f64a22': '$darke$',
  '#fdd3c9': '$lighte$',
  '#F5F5F5': '$default$',
  '#ebebeb': '$darkdf$',
  '#fafafa': '$lightdf$'
}

const defaultColors = {}

Object.keys(colorsMap).forEach(c => {
  defaultColors[colorsMap[c]] = c
})

export { defaultColors, colorsMap }
