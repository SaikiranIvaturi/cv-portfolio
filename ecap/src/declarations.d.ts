// Global type stubs — suppress missing @types/* errors.
// Proper fix: npm i --save-dev @types/react @types/react-dom

declare module 'react' {
  const React: any;
  export default React;
  export = React;
}
declare module 'react/jsx-runtime';
declare module 'react/jsx-dev-runtime';
declare module '@mui/material';
declare module '@mui/material/*';
declare module 'lucide-react';

// Allow all JSX intrinsic elements (Box, svg, circle, div, etc.)
declare namespace JSX {
  interface IntrinsicElements {
    [tag: string]: any;
  }
}