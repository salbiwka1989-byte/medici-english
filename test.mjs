import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import worker from './dist/server/index.js';
const sqlite=new DatabaseSync(':memory:');sqlite.exec(fs.readFileSync('drizzle/0000_accounts.sql','utf8'));
const DB={prepare(sql){const q=sqlite.prepare(sql);return {bind(...p){return {first:async()=>q.get(...p)||null,run:async()=>q.run(...p)}}}}};
async function call(path,body,cookie){const r=await worker.fetch(new Request('https://example.com/api/'+path,{method:body===undefined?'GET':'POST',headers:{Origin:'https://example.com','Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}),{DB});return {status:r.status,data:await r.json(),cookie:r.headers.get('Set-Cookie')?.split(';')[0]}};
const a=await call('register',{name:'Test A',login:'test_a',password:'TestPass123!'});assert.equal(a.status,200);const b=await call('register',{name:'Test B',login:'test_b',password:'TestPass123!'});assert.equal(b.status,200);
assert.equal((await call('progress',{days:['2026-11-27'],words:{0:{score:1,last:Date.now()}}},a.cookie)).status,200);assert.equal((await call('me',undefined,b.cookie)).data.progress.days.length,0);assert.equal((await call('me',undefined,a.cookie)).data.progress.days.length,1);assert.equal((await call('me')).status,401);assert.equal((await call('login',{login:'test_a',password:'Incorrect123'})).status,401);const l=await call('login',{login:'test_a',password:'TestPass123!'});assert.equal(l.data.progress.days.length,1);assert.equal((await call('logout',{},l.cookie)).status,200);assert.equal((await call('me',undefined,l.cookie)).status,401);console.log('Registration, login, logout, isolated progress and persistence passed.');
