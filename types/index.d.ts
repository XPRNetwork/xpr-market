declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
declare namespace JSX {
  interface IntrinsicElements {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    ['model-viewer']: any;
  }
}
