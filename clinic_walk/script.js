/* ---------- осмотр клиники (интерактив) ---------- */
(function(){
  var root=document.getElementById('cwRoot');
  if(!root) return;
  var d=document, w=window;
  var CW_ROOMS={
    corridor:{ name:'КОРИДОР', img:'assets/img/clinic/corridor_plain.jpg', focus:0.36, items:[], doors:[],
      exits:[{to:'ward1',x:46,y:47,label:'палата 1'},{to:'ward2',x:57,y:43,label:'палата 2'},
             {to:'cabinet',x:52,y:64,label:'кабинет'}]},
    ward1:{ name:'ПАЛАТА №1', img:'assets/img/clinic/ward_one.jpg', focus:0.40,
      items:[{id:'pill1',x:20.8,y:46.2,h:6.6,src:['assets/img/clinic/obj_skopolamin.png','assets/img/clinic/obj_dimedrol.png'],
              names:['СКОПОЛАМИН','ДИМЕДРОЛ'],tip:'на тумбочке'},
             {id:'glass1',x:14.0,y:53.0,h:9.0,src:['assets/img/clinic/obj_stakan.png'],names:['Стакан'],tip:'у кровати'}],
      doors:[], exits:[{to:'corridor',x:88,y:70,label:'в коридор'}]},
    ward2:{ name:'ПАЛАТА №2', img:'assets/img/clinic/ward_two.jpg', focus:0.42,
      items:[{id:'syr2',x:19.0,y:47.0,h:12.0,src:['assets/img/clinic/obj_syringe.png'],names:['Шприц'],tip:'на кровати'},
             {id:'belt2',x:48.5,y:45.0,h:8.0,src:['assets/img/clinic/obj_remen.png'],names:['Ремни'],tip:'на полу'},
             {id:'tetrad2',x:33.0,y:41.0,h:8.0,src:['assets/img/clinic/obj_tetrad.png'],names:['Тетрадь'],tip:'на кровати'}],
      doors:[], exits:[{to:'corridor',x:89,y:70,label:'в коридор'}]},
    cabinet:{ name:'КАБИНЕТ', img:'assets/img/clinic/clinic_office.jpg', focus:0.42,
      items:[{id:'pill',x:57.6,y:45.9,h:7.6,src:['assets/img/clinic/obj_skopolamin.png','assets/img/clinic/obj_dimedrol.png'],
              names:['СКОПОЛАМИН','ДИМЕДРОЛ'],tip:'на подносе'},
             {id:'syr',x:61.4,y:45.0,h:11.5,src:['assets/img/clinic/obj_syringe.png'],names:['Шприц'],tip:'на подносе'},
             {id:'glass',x:57.4,y:61.2,h:11.5,src:['assets/img/clinic/obj_stakan.png'],names:['Стакан'],tip:'нижняя полка'},
             {id:'belt',x:62.2,y:62.0,h:7.0,src:['assets/img/clinic/obj_remen.png'],names:['Ремни'],tip:'нижняя полка'}],
      doors:[{x:19,y:40,cls:'left narrow',label:'кабинет слева',act:'sleep'},
             {x:95.4,y:42,cls:'right narrow',label:'кабинет справа',act:'slap'}],
      exits:[{to:'corridor',x:50,y:74,label:'в коридор'}]}
  };
  var CW_START='corridor', cwRoom=CW_START, cwVisit=1;
  function cwGet(){ try{ return parseInt(localStorage.getItem('pb_clinic_visit')||'1',10)||1; }catch(e){ return 1; } }
  function cwSet(v){ try{ localStorage.setItem('pb_clinic_visit',String(v)); }catch(e){} }

  var elRoom=d.getElementById('cwRoom'), elPan=d.getElementById('cwPan'), elImg=d.getElementById('cwImg'),
      elLayer=d.getElementById('cwLayer'), elFade=d.getElementById('cwFade'), elBubble=d.getElementById('cwBubble'),
      elFly=d.getElementById('cwCwFly'), elFx=d.getElementById('cwFx'), elChips=d.getElementById('cwChips');
  var cwPos=0, cwDrag=false, cwSx=0, cwSp=0;

  function cwImgW(){ return elPan.offsetWidth; }
  function cwMax(){ return Math.max(0, cwImgW()-elRoom.clientWidth); }
  function cwClamp(v){ return Math.min(0,Math.max(-cwMax(),v)); }
  function cwApply(){ elPan.style.transform='translate3d('+cwPos.toFixed(1)+'px,0,0)'; if(elRoom.scrollLeft) elRoom.scrollLeft=0; }

  function cwChips(){
    elChips.innerHTML='';
    Object.keys(CW_ROOMS).forEach(function(k){
      var c=d.createElement('button');
      c.className='cw-chip'+(k===cwRoom?' on':'');
      c.textContent=CW_ROOMS[k].name;
      c.onclick=function(){ cwGo(k); };
      elChips.appendChild(c);
    });
  }
  function cwBuild(){
    var R=CW_ROOMS[cwRoom];
    elImg.src=R.img;
    elLayer.innerHTML='';
    R.items.forEach(function(it){
      var el=d.createElement('div');
      el.className='cw-hot cw-item'; el.title=it.tip||'';
      el.style.left=it.x+'%'; el.style.top=it.y+'%'; el.style.height=it.h+'%';
      var arr=Array.isArray(it.src)?it.src:[it.src];
      var start=(arr.length>1 && cwVisit>1)?1:0;
      el.innerHTML='<img src="'+arr[start]+'" alt="">';
      el.addEventListener('click',function(e){ e.stopPropagation(); cwItem(el,it); });
      elLayer.appendChild(el);
    });
    R.doors.forEach(function(dr){
      var el=d.createElement('div');
      el.className='cw-hot cw-door '+dr.cls;
      el.style.left=dr.x+'%'; el.style.top=dr.y+'%';
      el.innerHTML='<span class="cw-cap">'+dr.label+'</span>';
      el.addEventListener('click',function(e){ e.stopPropagation(); cwDoor(dr); });
      elLayer.appendChild(el);
    });
    R.exits.forEach(function(ex){
      var el=d.createElement('div');
      el.className='cw-hot cw-exit';
      el.style.left=ex.x+'%'; el.style.top=ex.y+'%';
      el.innerHTML='<span class="cw-cap">'+ex.label+'</span>';
      el.addEventListener('click',function(e){ e.stopPropagation(); cwGo(ex.to); });
      elLayer.appendChild(el);
    });
    d.getElementById('cwWhere').textContent=R.name;
    cwChips();
    var sync=function(){
      var f=R.focus||0.4;
      cwPos=cwClamp(-(cwImgW()*f-elRoom.clientWidth/2));
      cwApply();
    };
    if(elImg.complete && elImg.naturalWidth) sync(); else elImg.addEventListener('load',sync);
    sync();
  }
  function cwGo(key){
    if(!CW_ROOMS[key]) return;
    elFade.classList.add('on');
    setTimeout(function(){
      cwRoom=key; cwBuild();
      var y=elRoom.getBoundingClientRect().top+w.scrollY-(w.innerHeight-elRoom.offsetHeight)/2;
      try{ w.scrollTo({top:y,behavior:'smooth'}); }catch(e){ w.scrollTo(0,y); }
      elFade.classList.remove('on');
    },520);
  }
  function cwItem(el,it){
    var arr=Array.isArray(it.src)?it.src:[it.src];
    if(arr.length<2) return;
    var imgEl=el.querySelector('img');
    var next=(imgEl.getAttribute('src')===arr[0])?1:0;
    imgEl.classList.remove('cw-swap'); void imgEl.offsetWidth;
    imgEl.src=arr[next]; imgEl.classList.add('cw-swap');
    cwSay(next? 'ДИМЕДРОЛ. Второй визит — и на месте уже другое.'
                : 'СКОПОЛАМИН. Первый визит. Запомни это ощущение.');
  }
  function cwDoor(dr){
    if(dr.act==='slap'){
      elFx.className='cw-fx slap'; void elFx.offsetWidth; elFx.className='cw-fx';
      elRoom.classList.remove('shake'); void elRoom.offsetWidth; elRoom.classList.add('shake');
      cwSay('Заходи без стука. Правая дверь — это про морду.',true);
    } else {
      elFx.className='cw-fx sleep'; void elFx.offsetWidth; elFx.className='cw-fx';
      elFly.style.left='58%'; elFly.style.top='46%';
      elFly.classList.remove('go'); void elFly.offsetWidth; elFly.classList.add('go');
      cwSay('Левая дверь — это про снотворное. Глаза закрываются сами.');
      setTimeout(function(){ elFly.classList.remove('go'); },1600);
    }
  }
  var cwTmr=null;
  function cwSay(txt,rose){
    elBubble.textContent=txt;
    elBubble.classList.toggle('rose',!!rose);
    elBubble.classList.add('show');
    clearTimeout(cwTmr); cwTmr=setTimeout(function(){ elBubble.classList.remove('show'); },4200);
  }
  elRoom.addEventListener('pointerdown',function(e){ cwDrag=true; cwSx=e.clientX; cwSp=cwPos; elRoom.classList.add('dragging'); });
  elRoom.addEventListener('pointermove',function(e){ if(!cwDrag) return; cwPos=cwClamp(cwSp+(e.clientX-cwSx)); cwApply(); });
  function cwEnd(){ cwDrag=false; elRoom.classList.remove('dragging'); }
  elRoom.addEventListener('pointerup',cwEnd);
  elRoom.addEventListener('pointercancel',cwEnd);
  elRoom.addEventListener('pointerleave',cwEnd);

  d.getElementById('cwLeft').onclick=function(){ cwPos=cwClamp(cwPos+elRoom.clientWidth*0.22); cwApply(); };
  d.getElementById('cwRight').onclick=function(){ cwPos=cwClamp(cwPos-elRoom.clientWidth*0.22); cwApply(); };
  d.getElementById('cwDLeft').onclick=function(){
    var dr=CW_ROOMS[cwRoom].doors.filter(function(x){return x.act==='sleep';})[0];
    if(!dr){ cwSay('В этой комнате левой двери нет.'); return; }
    cwPos=cwClamp(-(cwImgW()*dr.x/100-elRoom.clientWidth/2)); cwApply();
    setTimeout(function(){ cwDoor(dr); },320);
  };
  d.getElementById('cwDRight').onclick=function(){
    var dr=CW_ROOMS[cwRoom].doors.filter(function(x){return x.act==='slap';})[0];
    if(!dr){ cwSay('В этой комнате правой двери нет.'); return; }
    cwPos=cwClamp(-(cwImgW()*dr.x/100-elRoom.clientWidth/2)); cwApply();
    setTimeout(function(){ cwDoor(dr); },320);
  };
  d.getElementById('cwNext').onclick=function(){
    cwVisit=cwGet()+1; cwSet(cwVisit);
    d.getElementById('cwVisit').textContent=(cwVisit<10?'0':'')+cwVisit;
    cwBuild();
    cwSay(cwVisit===2? 'Второй раз зашёл. А на месте уже не то, что в первый.' : 'Визит '+cwVisit+'. Всё то же место, но ты уже другой.');
  };
  cwVisit=cwGet();
  d.getElementById('cwVisit').textContent=(cwVisit<10?'0':'')+cwVisit;
  cwBuild();
  w.addEventListener('resize',function(){ cwPos=cwClamp(cwPos); cwApply(); });
})();
