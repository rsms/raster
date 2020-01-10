class RasterGridElement extends HTMLElement {}
class RasterCellElement extends HTMLElement {}
window.customElements.define('r-grid', RasterGridElement, { extends: "div" })
window.customElements.define('r-cell', RasterCellElement, { extends: "div" })
