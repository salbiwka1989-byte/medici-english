import fs from 'node:fs';
let html=fs.readFileSync('public/index.html','utf8');
const auth=fs.readFileSync('public/auth.js','utf8');
function replace(a,b){if(!html.includes(a))throw Error('Missing expected source: '+a);html=html.replace(a,b)}
replace('</style>','label{display:block;font-weight:700;margin-bottom:16px}input{display:block;width:100%;font:inherit;padding:14px;border:1px solid #efc9d7;border-radius:12px;background:#fff9f6;margin-top:7px} .logout{background:#ffe8ec;border-radius:12px;padding:9px 12px;font-size:13px;font-weight:700} </style>');
replace("const save=()=>localStorage.setItem('mediciEnglishV1',JSON.stringify(state));","const legacyProgress=state;state={days:[],words:{},minutes:0};const save=()=>syncProgress();");
replace('<span class="pill">✦ A0</span>','${user?`<button class="logout" onclick="logout()">Выйти</button>`:`<span class="pill">✦ A0</span>`}');
replace("return '<header>","return `<header>");replace('</span>`}</header>\'}','</span>`}</header>`}');
replace('Привет, Мадина!','Привет, ${esc(user?.name||\'ученик\')}!');replace('Молодец, Мадина!','Молодец, ${esc(user?.name||\'ученик\')}!');
replace('render();if(\'serviceWorker\'in navigator)navigator.serviceWorker.register(\'./sw.js\').catch(()=>{});',auth+'\nboot();if(\'serviceWorker\'in navigator)navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));');
replace('</main>','</main><div id="syncNotice" role="status" style="text-align:center;color:#a52a60"></div>');
new Function(html.match(/<script>([\s\S]*)<\/script>/)[1]);
const assets={'/index.html':['text/html; charset=utf-8',html],'/manifest.json':['application/manifest+json',fs.readFileSync('public/manifest.json','utf8')],'/icon.svg':['image/svg+xml',fs.readFileSync('public/icon.svg','utf8')],'/sw.js':['application/javascript',"self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.registration.unregister()));"]};
fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});let worker=fs.readFileSync('worker/index.js','utf8').replace("import { assets } from './assets.js';",'const assets='+JSON.stringify(assets)+';');fs.writeFileSync('dist/server/index.js',worker);fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
