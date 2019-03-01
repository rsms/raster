/*
Raster / Simple grid system / CSS generator


Example of grid with 4 major columns subdivided twice:

|                   |                   |                   |                   |
|         1         |         2         |         3         |         4         |
|                   |                   |                   |                   |
|                   |                   |                   |                   |
|    1    |    2    |    3    |    4    |    5    |    6    |    7    |    8    |
|         |         |         |         |         |         |         |         |
|         |         |         |         |         |         |         |         |
| 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |

<grid class="c8 debug">
  <c span="2">Column 1 spans two columns</c>
  <c span="3">Column 3 spans three columns</c>
  <c>Column 6 spans one column</c>
  <c span="2">Column 7 spans two columns</c>

  <c span="4">Column 1 spans four columns</c>
  <c span="4">Column 5 spans four columns</c>

  <c start="3" span="2">Column 3 spans two columns</c>
  <c start="3" span="3">Column 3 spans three columns</c>
</grid>

*/
(function(exports){

let generateCSS = exports.generateCSS = function generateCSS(props, writer) {
  // Configuration
  //
  //  local              user                      default
  let minColumns       = props.minColumns       || 1
  let maxColumns       = props.maxColumns       || minColumns
  let defaultColumns   = props.defaultColumns   || Math.min(4, props.maxColumns)
  let spanAttrNormal   = props.spanAttrNormal   || 'span'
  let spanAttrSmall    = props.spanAttrSmall    || 'span-s'
  let spanAttrLarge    = props.spanAttrLarge    || 'span-l'
  let colsAttrNormal   = props.colsAttrNormal   || 'columns'
  let colsAttrSmall    = props.colsAttrSmall    || 'columns-s'
  let colsAttrLarge    = props.colsAttrLarge    || 'columns-l'
  let smallScreenWidth = props.smallScreenWidth || (props.smallScreenWidth === undefined ? 600 : 0)
  let largeScreenWidth = props.largeScreenWidth || (props.largeScreenWidth === undefined ? 1600 : 0)
  let includeDebug     = props.includeDebug     || (props.includeDebug !== false)
  let version          = props.version          || ""

  // mstr takes a multi-line string and trims the start and end.
  // If the last line contains whitespace, that whitespace is trimmed from
  // all other lines as well.
  function mstr(s) {
    let m = /\n\s+$/.exec(s)
    if (m) {
      let il = s.length - m.index
      s = s.substring(0, m.index).replace(/\n\s+/gm, m => '\n' + m.substr(il))
    }
    return s.trim()
  }

  // output writer (w)
  let wbuf = null
  if (!writer) {
    wbuf = []
    writer = s => wbuf.push(s)
  }
  function w(s, indent="") {
    writer(indent + mstr(s).replace(/\n/gm, '\n' + indent))
  }

  w(`/* Raster grid subsystem (rsms.me/raster) */`)

  // grid
  w(`
    grid {
      display: grid;
      --grid-tc: repeat(${defaultColumns}, 1fr);
      grid-template-columns: var(--grid-tc);
      --grid-cs: 1; /* column start */
      --grid-ce: -1 /* column end */
    }
    `)

  // cell
  // min-width: 0 fixes firefox greedy grid cell
  w("")
  w(`
    /* c -- cell or column */
    grid > c { display: block; appearance: none; -webkit-appearance: none; min-width: 0; }
    `)

  // base/normal window size
  w("")
  genWidthDependent(spanAttrNormal, colsAttrNormal, w)

  // small window size
  if (smallScreenWidth > 0) {
    w("")
    w(`
      /* for window width <= ${smallScreenWidth} */
      @media only screen and (max-width: ${smallScreenWidth}px) {
      `)
    genWidthDependent(spanAttrSmall, colsAttrSmall, s => w(s, '  '))
    w(`}`)
  }

  // large window size
  if (largeScreenWidth) {
    w("")
    w(`
      /* for window width >= ${largeScreenWidth} */
      @media only screen and (min-width: ${largeScreenWidth-1}px) {
      `)
    genWidthDependent(spanAttrLarge, colsAttrLarge, s => w(s, '  '))
    w(`}`)
  }


  function genWidthDependent(attr, gattr, w) {

    for (let col = minColumns; col <= maxColumns; col++) {
      w(`grid[${gattr}="${col}"] { --grid-tc: repeat(${col}, 1fr) }`)
    }

    w("")
    w(`
      /* ${attr}=start... */
      grid > c[${attr}^="1"] { --grid-cs: 1 }
      `)
    for (let col = 2; col <= maxColumns; col++) {
      w(`grid > c[${attr}^="${col}"] { --grid-cs: ${col} }`)
    }

    w("")
    w(`
      /* ${attr}=...+width, ${attr}=...-end */
      grid > c[${attr}$="+1"], grid > c[${attr}="1"] { --grid-ce: 1 }
      `)
    for (let col = 2; col <= maxColumns; col++) {
      w(
        `grid > c[${attr}$="+${col}"], ` +
        `grid > c[${attr}$="-${col-1}"], ` +
        `grid > c[${attr}="${col}"] ` +
        `{ --grid-ce: ${col} }`
      )
    }
    if (maxColumns > 1) {
      w(
        `grid > c[${attr}$="-${maxColumns}"] ` +
        `{ --grid-ce: ${maxColumns+1} }`
      )
    }

    // w("")
    // w(`/* ${attr}=width */`)
    // for (let col = 1; col <= maxColumns; col++) {
    //   w(`grid > c[${attr}="${col}"] { grid-column: span ${col} }`)
    //   w(`grid > c[${attr}="${col}"] { --grid-ce: ${col} }`)
    // }

    w("")
    w(`
      /* connect vars */
      grid > c[${attr}] { grid-column-end: span var(--grid-ce) }
      `)
    w(`
      grid > c[${attr}*="+"], grid > c[${attr}*="-"], grid > c[${attr}*=".."] {
        grid-column-start: var(--grid-cs) }
      `)
    w(`
      grid > c[${attr}*="-"], grid > c[${attr}*=".."] {
        grid-column-end: var(--grid-ce) }
      `)
    w(`grid > c[${attr}="row"] { grid-column: 1 / -1 }`)
  }


  if (includeDebug) {
    let colors = [
      '248,110,91 ',  // red
      '103,126,208',  // blue
      '224,174,72 ',  // yellow
      '77, 214,115',  // green
      '217,103,219',  // purple
      '94, 204,211',  // teal
    ]
    let alpha = 0.3
    w("")
    w(`/* .debug can be added to a grid to visualize its effective cells */`)
    w(`
      grid.debug > * {
        --color: rgba(${colors[0]},${alpha});
        background-image:
          linear-gradient(to bottom, var(--color) 0%, var(--color) 100%);
      }
      `)
    let ncolors = Math.min(maxColumns, colors.length)
    for (let col = 1; col <= ncolors; col++) {
      w(`grid.debug > :nth-child(${ncolors}n+${col+1})` +
        ` { --color: rgba(${colors[col % colors.length]},${alpha}) }`)
    }
  }


  return wbuf ? wbuf.join('\n')+'\n' : null
}


// run as program
if (typeof process != 'undefined' && process.argv && module.id == '.') {
  let argv = process.argv
  if (argv[0].endsWith('/node')) {
    argv = argv.slice(1)
  }
  let props = {
    maxColumns: parseInt(argv[1]),
  }
  if (isNaN(props.maxColumns) || argv.indexOf('-h') != -1) {
    console.error(`usage: ${argv[0]} <maxcols> [-version <version>]`)
    process.exit(1)
  }
  let vi = argv.indexOf('-version')
  if (vi != -1) {
    props.version = argv[vi+1]
  }
  generateCSS(props, s => process.stdout.write(s + '\n'))
}


})(typeof exports == 'undefined' ?
  this['Raster'] = {} :
  exports
);
