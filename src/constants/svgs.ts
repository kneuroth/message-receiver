export const FIRE_SVG = `<!-- Fire icon (inline SVG) -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 64 64"
  role="img" aria-labelledby="fireTitle fireDesc"
  width="64" height="64"
  style="--fire: #ff6a00; --glow: #ffd166; --stroke: rgba(0,0,0,.2)">
  <title id="fireTitle">Fire symbol</title>
  <desc id="fireDesc">Stylized flame with inner ember</desc>

  <!-- outer flame -->
  <path
    d="M34 4c3 10-7 14-7 23 0 5 3 9 8 11 4-5 5-10 3-16 8 6 13 14 13 22 0 12-10 20-23 20S5 56 5 44c0-10 6-20 16-27-1 6 2 11 7 14 1-9 9-13 6-27Z"
    fill="var(--fire)" stroke="var(--stroke)" stroke-width="2" stroke-linejoin="round"/>

  <!-- inner flame -->
  <path
    d="M29 30c-2 4-3 7-3 10 0 7 6 12 12 12s12-5 12-12c0-5-3-9-7-12 1 4 0 7-2 10-6-2-10-5-12-8Z"
    fill="var(--glow)" opacity=".9" stroke="var(--stroke)" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;
