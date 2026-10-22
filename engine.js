export const LAST = 19;
export const STOPS = [6,12];
export const CELLS = ['start','task','choice','mark','task','partner','gate','task','choice','mark','task','partner','gate','task','choice','mark','task','partner','task','end'];
export const LABELS = {start:'出发',task:'任务',choice:'二选一',mark:'留印',partner:'对方决定',gate:'阶段站',end:'终点'};
export function createGame(names=['玩家一','玩家二']) {
  return {version:1,started:true,names:names.map((n,i)=>n.trim().slice(0,12)||`玩家${i+1}`),positions:[0,0],extra:[true,true],turn:0,stage:1,owners:{},status:'ready',roll:0,target:null,pending:null,round:1};
}
export function targetFor(from,steps){let to=Math.min(LAST,from+steps);return STOPS.find(x=>x>from&&x<=to)??to;}
export function prepareRoll(s,value){if(s.status!=='ready'||!Number.isInteger(value)||value<1||value>3)return s;return {...s,status:'moving',roll:value,target:targetFor(s.positions[s.turn],value)};}
export function land(s,useExtra=false){
 if(s.status!=='moving')return s;
 const p=s.turn,from=s.positions[p];
 // A checkpoint ends movement even when an extra step is requested.
 const extra=useExtra&&s.extra[p]&&!STOPS.includes(s.target)&&s.target<LAST;
 const to=targetFor(from,s.roll+(extra?1:0));
 const next={...s,positions:s.positions.map((v,i)=>i===p?to:v),extra:s.extra.map((v,i)=>i===p&&extra?false:v),target:null};
 if(to===LAST)return {...next,status:'ended',pending:null};
 const type=CELLS[to];
 if(type==='gate')return {...next,status:'gate',pending:{cell:to,type}};
 const owner=s.owners[to];const owners=type==='mark'&&owner===undefined?{...s.owners,[to]:p}:s.owners;
 const chooser=type==='partner'?1-p:type==='mark'&&owner!==undefined?owner:p;
 return {...next,owners,status:'task',pending:{cell:to,type,chooser,newMark:type==='mark'&&owner===undefined}};
}
export function finishTurn(s){if(!['task','gate'].includes(s.status))return s;return {...s,status:'ready',pending:null,roll:0,turn:1-s.turn,round:s.round+1};}
export function confirmGate(s,advance){if(s.status!=='gate')return s;return finishTurn({...s,stage:advance?Math.max(s.stage,s.pending.cell===6?2:3):s.stage});}
export function validGame(s){return !!s&&s.version===1&&s.started===true&&Array.isArray(s.names)&&s.names.length===2&&s.names.every(n=>typeof n==='string')&&Array.isArray(s.positions)&&s.positions.length===2&&s.positions.every(n=>Number.isInteger(n)&&n>=0&&n<=LAST)&&[0,1].includes(s.turn)&&[1,2,3].includes(s.stage)&&Array.isArray(s.extra)&&s.extra.length===2&&s.extra.every(v=>typeof v==='boolean')&&['ready','moving','task','gate','ended'].includes(s.status)&&!!s.owners&&Number.isInteger(s.round)&&s.round>0&&(s.status!=='moving'||(Number.isInteger(s.roll)&&s.roll>=1&&s.roll<=3&&Number.isInteger(s.target)))&&(!['task','gate'].includes(s.status)||!!s.pending);}
