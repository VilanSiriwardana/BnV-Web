const arrowBody = 'M4 4L58 24L38 32L54 49L48 55L32 38L24 58Z';

const arrowSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 64 64'>
<defs>
<linearGradient id='b' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#9a4a88'/><stop offset='.45' stop-color='#5a1f4e'/><stop offset='1' stop-color='#1c0b16'/></linearGradient>
<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#fff1b8'/><stop offset='.5' stop-color='#e8c46a'/><stop offset='1' stop-color='#b8892f'/></linearGradient>
</defs>
<path d='${arrowBody}' fill='#12080f' stroke='#12080f' stroke-width='4.5' stroke-linejoin='round'/>
<path d='${arrowBody}' fill='url(#b)'/>
<path d='M4 4L51 52L48 55L32 38L24 58Z' fill='#000' opacity='.3'/>
<path d='M11 9L50 23.5' stroke='url(#g)' stroke-width='3' stroke-linecap='round'/>
<path d='M9 11L23.5 50' stroke='url(#g)' stroke-width='3' stroke-linecap='round'/>
<path d='M41 34L51 45' stroke='url(#g)' stroke-width='2.4' stroke-linecap='round'/>
<path d='M8 8L49 51' stroke='#c8b6e2' stroke-width='2' stroke-linecap='round' opacity='.9'/>
<path d='M8 8L30 30' stroke='#fff' stroke-width='.9' stroke-linecap='round' opacity='.55'/>
<circle cx='36' cy='35' r='2.6' fill='#d8c9f0'/>
<circle cx='36' cy='35' r='4.5' fill='#c8b6e2' opacity='.3'/>
</svg>`;

const handShapes = `<rect x='22' y='3' width='12' height='38' rx='6'/>
<rect x='33' y='19' width='10' height='23' rx='5'/>
<rect x='42' y='22' width='9' height='21' rx='4.5'/>
<rect x='50' y='25' width='9' height='20' rx='4.5'/>
<rect x='6' y='27' width='12' height='26' rx='6' transform='rotate(-32 12 40)'/>
<rect x='14' y='35' width='45' height='26' rx='10'/>`;

const handSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 64 64'>
<defs>
<linearGradient id='h' x1='0' y1='0' x2='.8' y2='1'><stop offset='0' stop-color='#ffe9a0'/><stop offset='.25' stop-color='#e8b83a'/><stop offset='.65' stop-color='#b8861c'/><stop offset='1' stop-color='#6e4a0c'/></linearGradient>
<radialGradient id='s' cx='.35' cy='.3' r='.7'><stop offset='0' stop-color='#fff4c8' stop-opacity='.55'/><stop offset='1' stop-color='#fff4c8' stop-opacity='0'/></radialGradient>
</defs>
<g fill='#241b2e' stroke='#241b2e' stroke-width='4' stroke-linejoin='round'>${handShapes}</g>
<g fill='url(#h)'>${handShapes}</g>
<rect x='14' y='35' width='45' height='26' rx='10' fill='url(#s)'/>
<g stroke='#7a520e' stroke-width='1.5' stroke-linecap='round' fill='none'>
<path d='M33.5 23V37'/><path d='M42.5 26V37.5'/><path d='M50.5 29V38'/><path d='M21.5 39Q19 42.5 17.5 45'/>
</g>
<rect x='25' y='6' width='3.2' height='24' rx='1.6' fill='#fffbe6' opacity='.85'/>
<rect x='35.5' y='22' width='2.4' height='9' rx='1.2' fill='#fffbe6' opacity='.7'/>
<rect x='44.2' y='25' width='2.2' height='8' rx='1.1' fill='#fffbe6' opacity='.65'/>
<rect x='52.2' y='28' width='2.2' height='7' rx='1.1' fill='#fffbe6' opacity='.6'/>
</svg>`;

const toCursor = (svg: string, x: number, y: number, fallback: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ''))}") ${x} ${y}, ${fallback}`;

export const CURSOR_DEFAULT = toCursor(arrowSvg, 2, 2, 'auto');
export const CURSOR_POINTER = toCursor(handSvg, 14, 2, 'pointer');
