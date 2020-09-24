declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png';
declare module '*.webp';
