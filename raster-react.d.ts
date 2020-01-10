namespace JSX {
  interface IntrinsicElements {
    grid: React.DetailedHTMLProps<RasterGridAttributes<RasterGridElement>, RasterGridElement>,
    c:    React.DetailedHTMLProps<RasterColumnAttributes<RasterColumnElement>, RasterColumnElement>,
  }
}

interface RasterGridAttributes<T> extends React.HTMLAttributes<T> {
  columns?: string;
  columnsS?: string;
  columnsL?: string;
}

interface RasterColumnAttributes<T> extends React.HTMLAttributes<T> {
  span?: string;
  spanS?: string;
  spanL?: string;
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
