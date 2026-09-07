(()=>{let L=localStorage.L||'en',LV=localStorage.LV||'A1',qi=0,score=0;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function open(id){$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.open===id));scrollTo({top:document.querySelector('#'+id).offsetTop-80,behavior:'smooth'})}
function render(){const d=D[L];$('#langName').textContent=d.name;$('#lang').textContent=L==='en'?'🇬🇧 English':'🇩🇪 Deutsch';$('#level').value=LV;
$$('.language').forEach(x=>x.classList.toggle('active',x.dataset.l===L));$('#lessons').innerHTML=d.lessons[LV].map((x,i)=>`<article class=card><small>УРОК ${i+1}</small><h3>${x}</h3><p>${i?'Теория + практика':'Начало уровня'}</p><button>Открыть →</button></article>`).join('');
$('#storyLevel').value=LV.match(/A1|A2|B1|B2/)?.[0]||'B2';story();words();theory();resetQuiz();localStorage.L=L;localStorage.LV=LV}
function story(){let t=D.stories[L][$('#storyLevel').value];$('#storyMeta').textContent=(L==='en'?'English':'Deutsch')+' · '+$('#storyLevel').value;$('#storyText').innerHTML=t.split(/(\s+)/).map(x=>/\s+/.test(x)?x:`<button class=sw>${x}</button>`).join('');$$('.sw').forEach(b=>b.onclick=()=>lookup(b.textContent.replace(/[.,!?;:]/g,'')))}
function words(){let a=D.words[L];$('#words').innerHTML=a.map(x=>`<button class=word data-w="${x[0]}"><b>${x[0]}</b><span>${x[1]}</span><small>${x[2]}</small></button>`).join('');$$('.word').forEach(b=>b.onclick=()=>lookup(b.dataset.w))}
function lookup(q){let a=D.words[L],x=a.find(v=>v[0].toLowerCase()===q.toLowerCase())||a.find(v=>v[1]===q);if(!x)return;$('#mw').textContent=x[0];$('#mp').textContent=x[2];$('#mt').textContent=x[1];$('#modal').classList.add('show');$('#speak').onclick=()=>speak(x[0])}
function speak(t){if(!speechSynthesis)return;let u=new SpeechSynthesisUtterance(t);u.lang=L==='en'?'en-US':'de-DE';u.rate=.8;speechSynthesis.speak(u)}
function theory(){let a=D.theory[L];$('#topics').innerHTML=a.map((x,i)=>`<button data-i=${i}>${x[0]}</button>`).join('');$$('#topics button').forEach(b=>b.onclick=()=>note(+b.dataset.i));note(0)}
function note(i){let x=D.theory[L][i];$('#note').innerHTML=`<small>${L==='en'?'ENGLISH':'DEUTSCH'}</small><h2>${x[0]}</h2><h3>Когда используется</h3><p>${x[1]}</p><h3>Формула</h3><pre>${x[2]}</pre><h3>Пример</h3><p>${x[3]}</p>`;$$('#topics button').forEach((b,j)=>b.classList.toggle('on',j===i))}
function resetQuiz(){qi=0;score=0;quiz()}
function quiz(){let x=D.quiz[L][qi];$('#counter').textContent=`${qi+1} / ${D.quiz[L].length} · ${score} очков`,$('#question').textContent=x[0];$('#answers').innerHTML=x[1].map((a,i)=>`<button data-i=${i}>${a}</button>`).join('');$('#feedback').textContent='';$('#next').style.display='none';$$('#answers button').forEach(b=>b.onclick=()=>answer(+b.dataset.i))}
function answer(i){let x=D.quiz[L][qi];$$('#answers button').forEach(b=>b.disabled=true);if(i===x[2]){$('#feedback').textContent='✓ Правильно!';score++}else $('#feedback').textContent='✗ Правильный ответ: '+x[1][x[2]];$('#next').style.display='inline-block'}
$('#next').onclick=()=>{qi=(qi+1)%D.quiz[L].length;quiz()};
$$('.tab,[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open));$$('.language').forEach(b=>b.onclick=()=>{L=b.dataset.l;render()});$('#level').onchange=e=>{LV=e.target.value;render()};$('#storyLevel').onchange=story;
$('#find').onclick=()=>lookup($('#word').value);$('#word').onkeydown=e=>e.key==='Enter'&&lookup(e.target.value);$('#close').onclick=()=>$('#modal').classList.remove('show');$('#modal').onclick=e=>e.target===e.currentTarget&&e.currentTarget.classList.remove('show');
$('#theme').onclick=()=>document.body.classList.toggle('light');$('#lang').onclick=()=>{L=L==='en'?'de':'en';render()};
$('#form').onsubmit=async e=>{e.preventDefault();let m=$('#msg').value.trim();if(!m)return;$('#messages').innerHTML+=`<p class=user>${m}</p>`;$('#msg').value='';let p=document.createElement('p');p.className='bot';p.textContent='Думаю…';$('#messages').append(p);let r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:m,language:L,level:LV})});p.textContent=(await r.json()).reply};
$$('#suggest button').forEach(b=>b.onclick=()=>{$('#msg').value=b.textContent;$('#form').requestSubmit()});
render()})();
