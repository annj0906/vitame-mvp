import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/vitame/shop.js',import.meta.url),'utf8');
const binding=source.slice(source.indexOf('function bindShoppingRails(){'),source.indexOf('function bindShoppingVideo'));
const pressed=['true','false','false'];
const dots={querySelectorAll:()=>pressed.map((_,i)=>({setAttribute:(key,value)=>{pressed[i]=value;}}))};
function rail(carousel){return {events:{},parentElement:{querySelector:()=>dots},closest:()=>carousel?{querySelector:()=>dots}:null,children:[{offsetLeft:0},{offsetLeft:100}],clientWidth:100,scrollLeft:100,addEventListener(name,fn){this.events[name]=fn;}};}
const hero=rail(true),categories=rail(false),products=rail(false);
const ctx={document:{querySelectorAll:()=>[hero,categories,products]}};
vm.createContext(ctx);vm.runInContext(binding,ctx);ctx.bindShoppingRails();
categories.events.scroll();products.events.scroll();assert.deepEqual(pressed,['true','false','false'],'unrelated rails cannot change hero dots');
hero.events.scroll();assert.deepEqual(pressed,['false','true','false'],'hero still updates its own dots');
console.log('Shop rails: category/product scrolling isolated from hero indicators.');
