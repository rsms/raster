namespace JSX {
  interface IntrinsicElements {
    grid: React.DetailedHTMLProps<React.HTMLAttributes<RasterGridElement>, RasterGridElement>,
    c: React.DetailedHTMLProps<React.HTMLAttributes<RasterColumnElement>, RasterColumnElement>,
  }
}

interface RasterGridElement extends HTMLElement {
  columns: string;
  columnsS: string;
  columnsL: string;
}

interface RasterColumnElement extends HTMLElement {
  span: string;
  spanS: string;
  spanL: string;
}
