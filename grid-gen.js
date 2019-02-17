/*
grid with 4 major columns subdivided twice

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

Examples

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

exports.generateCSS = function(props, w) {
  let minColumns = props.minColumns || 2
  let maxColumns = props.maxColumns || minColumns
  let smallScreenWidth = props.smallScreenWidth || 600

  function mstr(s) {
    return s.replace(/^\s*\n\s*|\s*\n\s*$/g, '')
  }

  // w
  let wbuf = null
  if (!w) {
    wbuf = []
    w = function(s, indent="") {
      wbuf.push(indent + mstr(s))
    }
  }

  function range(n) {
    let a = new Array(n)
    for (let i = 0; i < n; i++) { a[i] = i }
    return a
  }

  w(`/* Raster Simple CSS Grid System */`)

  // grid
  w(`
grid {
  display: grid;
  grid-template-columns: repeat(${minColumns}, 1fr);
}`)

  // grid.cN
  for (let col = minColumns; col <= maxColumns; col++) {
    w(`grid[columns="${col}"] {`+
      ` grid-template-columns: repeat(${col}, 1fr) }`)
  }

  // cell
  w("")
  w(`
/* c -- cell or column */
grid > c {
  display: block;
  grid-column-end: span 1;
}
`)

  // @media only screen and (max-width: 600px) {
  //   c[span] { grid-column: initial }
  //   c[small-span="row"] { grid-column: 1 / -1 }
  // }

  // w(`/* for window width >= ${smallScreenWidth}px */`)
  // w(`@media only screen and (min-width: ${smallScreenWidth-1}px) {`)
  genWidthDependent('span', w)

  // w(`}`)
  w("")
  w(`/* for window width <= ${smallScreenWidth}px */`)
  w(`@media only screen and (max-width: ${smallScreenWidth}px) {`)
  genWidthDependent('span-s', s => w(s, '  '))
  w(`}`)


  function genWidthDependent(attr, w) {
    // c[span="{width}"]
    w("")
    w(`/* ${attr}="width" -- place automatically and span width columns */`)
    for (let col = 1; col <= maxColumns; col++) {
      w(`grid > c[${attr}="${col}"] { grid-column-end: span ${col} }`)
    }
    // w("")
    // w(`/* ${attr}="start+"* -- from start until last column (catch all) */`)
    // for (let start = 1; start <= maxColumns; start++) {
    //   w(`grid > c[${attr}^="${start}-"], grid > c[${attr}^="${start}+"] { grid-column: ${start} / -1 }`)
    // }

    // c[span="{start}+{width}"]
    w("")
    w(`/* ${attr}="start+width" -- from start plus width columns */`)
    for (let start = 1; start <= maxColumns; start++) {
      let maxSpan = maxColumns - start + 1
      for (let span = 1; span <= maxSpan; span++) {
        w(`grid > c[${attr}="${start}+${span}"] { grid-column: ${start} / span ${span} }`)
      }
    }

    // c[span="{startcol}-{endcol}"]
    w("")
    w(`/* ${attr}="start-end" -- column range ("end" is inclusive) */`)
    for (let start = 1; start <= maxColumns; start++) {
      let maxend = maxColumns
      for (let end = start; end <= maxend; end++) {
        w(`grid > c[${attr}="${start}-${end}"] { grid-column: ${start} / ${end + 1} }`)
      }
    }

    // c[span="{startcol}.."]
    w("")
    w(`/* ${attr}="start.." -- from start to end of row */`)
    w(`grid > c[${attr}="1.."], grid > c[${attr}="1..."], grid > c[${attr}="row"] { grid-column: 1 / -1 }`)
    for (let start = 2; start <= maxColumns; start++) {
      w(`grid > c[${attr}="${start}.."], grid > c[${attr}="${start}..."] { grid-column: ${start} / -1 }`)
    }
  }


  // debug
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
    w(
      `grid.debug > :nth-child(${ncolors}n+${col+1})`+
      ` { --color: rgba(${colors[col % colors.length]},${alpha}) }`
    )
  }


  return wbuf ? wbuf.join('\n')+'\n' : null
}



})(typeof exports == 'undefined' ?
  this['Raster'] = {} :
  exports
);
