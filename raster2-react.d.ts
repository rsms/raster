namespace JSX {
  interface IntrinsicElements {
    "r-grid": React.DetailedHTMLProps<RasterGridAttributes<RasterGridElement>, RasterGridElement>,
    "r-cell": React.DetailedHTMLProps<RasterCellAttributes<RasterCellElement>, RasterCellElement>,
  }
}

interface RasterGridAttributes<T> extends React.HTMLAttributes<T> {
  columns?: string;
  columnsS?: string;
  columnsL?: string;
}

interface RasterCellAttributes<T> extends React.HTMLAttributes<T> {
  span?: string;
  spanS?: string;
  spanL?: string;
}

interface RasterGridElement extends HTMLElement {
  columns: string;
  columnsS: string;
  columnsL: string;
}

interface RasterCellElement extends HTMLElement {
  span: string;
  spanS: string;
  spanL: string;
}
