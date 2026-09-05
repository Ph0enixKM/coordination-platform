const fs = require('node:fs');
const sharp = require('sharp');
const root = require('node:path').resolve(__dirname, '../..');
const render=fs.readFileSync(`${__dirname}/logo-render.png`).toString('base64');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fff"/>
<image x="608" y="15" width="600" height="600" xlink:href="data:image/png;base64,${render}"/>
<text x="64" y="146" font-family="Arial" font-weight="bold" font-size="30" letter-spacing="-1" fill="#012141">coordination</text>
<rect x="64" y="210" width="42" height="5" rx="2.5" fill="#f2792d"/>
<g font-family="Arial" font-weight="bold" font-size="53" letter-spacing="-1.8" fill="#012141">
<text x="60" y="304">Rozwój firmy</text><text x="60" y="369">zaczyna się od</text><text x="60" y="434">dobrych decyzji.</text></g>




</svg>`;
fs.writeFileSync(`${__dirname}/coordination-og.svg`,svg);
(async()=>{for(const [size,name] of [[32,'icon-32.png'],[180,'apple-touch-icon.png']]) {
const logo=await sharp(`${root}/public/assets/logo.svg`).resize(Math.round(size*.72),Math.round(size*.72),{fit:'inside'}).png().toBuffer();
await sharp({create:{width:size,height:size,channels:4,background:'#ffffff'}}).composite([{input:logo,gravity:'centre'}]).png().toFile(`${root}/public/images/${name}`);
}})();
