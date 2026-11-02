/* ---------- осмотр клиники (интерактив) ---------- */
(function(){
  var root=document.getElementById('cwRoot');
  if(!root) return;
  var d=document, w=window;

  /* РЕЕСТР КЛИНИКИ.
     items: x,y — % панорамы, h — высота в %; src — варианты (первый = первый визит);
            names — подписи; punish — триггер (строка или массив по вариантам);
            bill — сколько прибавляется к счёту; rose — жёсткий тон реплики.
     Добавить предмет = одна запись + один спрайт. */
  var CW_ROOMS={
    corridor:{ name:'КОРИДОР', img:'assets/img/clinic/corridor_plain.jpg', focus:0.36,
      items:[
        {id:'iv', x:24.0, y:63.0, h:34, src:['assets/img/clinic/obj_ivstand_named.png'], names:['КАПЕЛЬНИЦА'],
         punish:'Стойка капельницы. Я поставлю. Ты не заметишь, в какой момент уснул.', bill:2400},
        {id:'key', x:34.0, y:76.0, h:6, src:['assets/img/clinic/obj_key_named.png'], names:['КЛЮЧ ОТ ПАЛАТЫ'],
         punish:'Ключ от палаты — твой. Оплатишь смену. Не оплатишь — будешь спать в коридоре.', bill:800},
        {id:'jr', x:57.0, y:60.0, h:9, src:['assets/img/clinic/obj_journal_named.png'], names:['ЖУРНАЛ ПОСЕЩЕНИЙ'],
         punish:'Журнал посещений. Подпишись здесь. Каждый раз — отдельная строчка.', bill:900}
      ], doors:[], curtains:[],
      exits:[{to:'ward1',x:46,y:47,label:'палата 1'},{to:'ward2',x:57,y:43,label:'палата 2'},
             {to:'cabinet',x:52,y:64,label:'кабинет'}]},
    ward1:{ name:'ПАЛАТА №1', img:'assets/img/clinic/ward_one.jpg', focus:0.40,
      items:[
        {id:'pill1', x:20.8, y:46.2, h:6.6, src:['assets/img/clinic/obj_skopolamin.png','assets/img/clinic/obj_dimedrol.png'],
         names:['СКОПОЛАМИН','ДИМЕДРОЛ'], tip:'на тумбочке', bill:5000, rose:true,
         punish:['Сдой. Тихо, никому. И не спрашивай, зачем.',
                 'Спи. Снотворное начнёт действовать через двадцать минут. Разбудишься не ты.']},
        {id:'glass1', x:17.2, y:54.5, h:9, src:['assets/img/clinic/obj_stakan_named.png'], names:['ВОДА'], tip:'у кровати', bill:600,
         punish:'Выпей всё. И сядь обратно. Руки на колени.'},
        {id:'therm', x:31.5, y:59.5, h:9, src:['assets/img/clinic/obj_thermometer_named.png'], names:['ТЕРМОМЕТР'], bill:900,
         punish:'Температура в норме. Ты в порядке — настолько, что отдашь всё, о чём попросят.'},
        {id:'ice', x:24.5, y:56.5, h:10, src:['assets/img/clinic/obj_icepack_named.png'], names:['ПУЗЫРЬ СО ЛЬДОМ'], bill:1500,
         punish:'Лёд. Приложить к голове — или к бумажнику. Выбирай сам.'}
      ], doors:[], curtains:[], exits:[{to:'corridor',x:88,y:70,label:'в коридор'}]},
    ward2:{ name:'ПАЛАТА №2', img:'assets/img/clinic/ward_two.jpg', focus:0.42,
      items:[
        {id:'syr2', x:19.0, y:47.0, h:12, src:['assets/img/clinic/obj_syringe_named.png'], names:['ШПРИЦ'], bill:3000, rose:true,
         punish:'Уколись. Сам. Я подожду.'},
        {id:'belt2', x:48.5, y:45.0, h:8, src:['assets/img/clinic/obj_remen_named.png'], names:['РЕМНИ'], bill:1800, rose:true,
         punish:'Запястье к стулу. Не дёргайся — я не люблю, когда дёргаются.'},
        {id:'tetrad2', x:33.0, y:41.0, h:8, src:['assets/img/clinic/obj_tetrad_named.png'], names:['ИСТОРИЯ БОЛЕЗНИ'], bill:700,
         punish:'Запиши всё, что я скажу. Дословно. И перечитай вслух.'},
        {id:'steth', x:41.0, y:47.5, h:9, src:['assets/img/clinic/obj_stethoscope_named.png'], names:['ФОНЕНДОСКОП'], bill:1100,
         punish:'Дыши. Глубже. Теперь дышишь так, как скажу.'},
        {id:'pills', x:28.5, y:52.5, h:9, src:['assets/img/clinic/obj_pillbox_named.png'], names:['ТАБЛЕТКИ'], bill:450,
         punish:'Витамины. На память. Чтобы не забыл, сколько должен.'},
        {id:'basin', x:47.0, y:74.0, h:12, src:['assets/img/clinic/obj_basin_named.png'], names:['ТАЗ С ВОДОЙ'], bill:1200,
         punish:'Таз с водой. Отраженье. Посмотри, что от тебя останется, когда я закончу.'}
      ],
      curtains:[{id:'cur2',x:47.5,y:1,h:70,src:'assets/img/clinic/curtain.png', bill:600,
                  punish:'Сквозняк. Занавеску не закрывают — её сдувает.'}],
      doors:[], exits:[{to:'corridor',x:89,y:70,label:'в коридор'}]},
    cabinet:{ name:'КАБИНЕТ', img:'assets/img/clinic/clinic_office.jpg', focus:0.42,
      items:[
        {id:'pill', x:57.6, y:45.9, h:7.6, src:['assets/img/clinic/obj_skopolamin.png','assets/img/clinic/obj_dimedrol.png'],
         names:['СКОПОЛАМИН','ДИМЕДРОЛ'], tip:'на подносе', bill:5000, rose:true,
         punish:['Сдой. Тихо, никому. И не спрашивай, зачем.',
                 'Спи. Снотворное начнёт действовать через двадцать минут. Разбудишься не ты.']},
        {id:'syr', x:61.4, y:45.0, h:11.5, src:['assets/img/clinic/obj_syringe_named.png'], names:['ШПРИЦ'], tip:'на подносе', bill:3000, rose:true,
         punish:'Уколись. Сам. Я подожду.'},
        {id:'glass', x:57.4, y:61.2, h:11.5, src:['assets/img/clinic/obj_stakan_named.png'], names:['ВОДА'], tip:'нижняя полка', bill:600,
         punish:'Выпей всё. И сядь обратно. Руки на колени.'},
        {id:'belt', x:62.2, y:62.0, h:7, src:['assets/img/clinic/obj_remen_named.png'], names:['РЕМНИ'], tip:'нижняя полка', bill:1800, rose:true,
         punish:'Запястье к стулу. Не дёргайся.'},
        {id:'xray', x:42.0, y:30.0, h:22, src:['assets/img/clinic/obj_xray_named.png'], names:['СНИМОК'], bill:2600,
         punish:'Снимок. Смотри: там пусто. Я заполню — и подпишу, где деньги.'},
        {id:'mirror', x:27.0, y:28.0, h:18, src:['assets/img/clinic/obj_mirror_named.png'], names:['ЗЕРКАЛО'], bill:2200, rose:true,
         punish:'В зеркале ты — мой. И это не комплимент.'}
      ],
      doors:[{x:19,y:40,cls:'left narrow',label:'кабинет слева',act:'sleep'},
             {x:95.4,y:42,cls:'right narrow',label:'кабинет справа',act:'slap'}],
      curtains:[], exits:[{to:'corridor',x:50,y:74,label:'в коридор'}]}
  };

  var CW_START='corridor', cwRoom=CW_START, cwVisit=1;
  var CW_TOTAL=0, CW_ALL=[];
  Object.keys(CW_ROOMS).forEach(function(k){
    (CW_ROOMS[k].items||[]).forEach(function(it){ CW_ALL.push(it); CW_TOTAL+=it.bill||0; });
    (CW_ROOMS[k].curtains||[]).forEach(function(cu){ CW_ALL.push(cu); CW_TOTAL+=cu.bill||0; });
  });

  function cwGet(){ try{ return parseInt(localStorage.getItem('pb_clinic_visit')||'1',10)||1; }catch(e){ return 1; } }
  function cwSet(v){ try{ localStorage.setItem('pb_clinic_visit',String(v)); }catch(e){} }
  function cwFound(){
    try{ return JSON.parse(localStorage.getItem('pb_clinic_found')||'{}')||{}; }catch(e){ return {}; }
  }
  function cwSaveFound(o){ try{ localStorage.setItem('pb_clinic_found',JSON.stringify(o)); }catch(e){} }

  var elRoom=d.getElementById('cwRoom'), elPan=d.getElementById('cwPan'), elImg=d.getElementById('cwImg'),
      elLayer=d.getElementById('cwLayer'), elFade=d.getElementById('cwFade'), elBubble=d.getElementById('cwBubble'),
      elFly=d.getElementById('cwCwFly'), elFx=d.getElementById('cwFx'), elChips=d.getElementById('cwChips'),
      elBill=d.getElementById('cwBill'), elFound=d.getElementById('cwFound'), elBar=d.getElementById('cwBar'),
      elTotal=d.getElementById('cwTotal');
  var cwPos=0, cwDrag=false, cwSx=0, cwSp=0, cwState=cwFound();

  function cwImgW(){ return elPan.offsetWidth; }
  function cwMax(){ return Math.max(0, cwImgW()-elRoom.clientWidth); }
  function cwClamp(v){ return Math.min(0,Math.max(-cwMax(),v)); }
  function cwApply(){ elPan.style.transform='translate3d('+cwPos.toFixed(1)+'px,0,0)'; if(elRoom.scrollLeft) elRoom.scrollLeft=0; }
  function cwMoney(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' ₽'; }

  function cwScore(){
    var bill=0, found=0;
    CW_ALL.forEach(function(it){ if(cwState[it.id]){ bill+=it.bill||0; found++; } });
    if(elBill) elBill.textContent='счёт: '+cwMoney(bill);
    if(elFound) elFound.textContent='найдено '+found+' из '+CW_ALL.length;
    if(elBar) elBar.style.width=(CW_ALL.length? found/CW_ALL.length*100:0).toFixed(1)+'%';
    if(elTotal) elTotal.textContent='полный счёт '+cwMoney(CW_TOTAL);
  }

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
      el.className='cw-hot cw-item'+(cwState[it.id]?'':' cw-fresh');
      el.title=it.tip||'';
      el.style.left=it.x+'%'; el.style.top=it.y+'%'; el.style.height=it.h+'%';
      var arr=Array.isArray(it.src)?it.src:[it.src];
      var start=(arr.length>1 && cwVisit>1)?1:0;
      el.innerHTML='<img src="'+arr[start]+'" alt="'+it.names[start]+'">';
      el.addEventListener('click',function(e){ e.stopPropagation(); cwItem(el,it); });
      elLayer.appendChild(el);
    });
    (R.curtains||[]).forEach(function(cu){
      var el=d.createElement('div');
      el.className='cw-hot cw-curtain'+(cwState[cu.id]?'':' cw-fresh');
      el.style.left=cu.x+'%'; el.style.top=cu.y+'%'; el.style.height=cu.h+'%';
      el.innerHTML='<img src="'+cu.src+'" alt="Тюлевая занавеска">';
      el.addEventListener('click',function(e){ e.stopPropagation(); cwCurtain(el,cu); });
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
    cwChips(); cwScore();
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
  /* предмет: подмена + триггер + счёт */
  function cwItem(el,it){
    var arr=Array.isArray(it.src)?it.src:[it.src];
    var imgEl=el.querySelector('img');
    var idx=0;
    if(arr.length>1){
      idx=(imgEl.getAttribute('src')===arr[0])?1:0;
      imgEl.classList.remove('cw-swap'); void imgEl.offsetWidth;
      imgEl.src=arr[idx]; imgEl.classList.add('cw-swap');
      imgEl.alt=it.names[idx];
    }
    var first=!cwState[it.id];
    cwState[it.id]=1; cwSaveFound(cwState);
    el.classList.remove('cw-fresh');
    cwScore();
    var txt = it.punish;
    if(Array.isArray(txt)) txt=txt[idx];
    if(txt){
      cwSay(txt,!!it.rose,it.names[idx]);
      if(it.rose){ elRoom.classList.remove('cw-punish'); void elRoom.offsetWidth; elRoom.classList.add('cw-punish'); }
    } else if(arr.length>1){
      cwSay(idx? 'Второй визит — и на месте уже другое.' : 'Первый визит. Запомни это ощущение.',false,it.names[idx]);
    }
    if(first) cwCheckEnd();
  }
  /* занавеска: порыв ветра */
  function cwCurtain(el,cu){
    el.classList.remove('cw-gust'); void el.offsetWidth; el.classList.add('cw-gust');
    setTimeout(function(){ el.classList.remove('cw-gust'); },1600);
    var fx=d.getElementById('cwFx');
    fx.className='cw-fx wind'; void fx.offsetWidth; fx.className='cw-fx';
    if(!cwState[cu.id]){ cwState[cu.id]=1; cwSaveFound(cwState); el.classList.remove('cw-fresh'); cwScore(); }
    cwSay(cu.punish||'Сквозняк.',false,'ЗАНАВЕСКА');
    cwCheckEnd();
  }
  function cwCheckEnd(){
    var found=0; CW_ALL.forEach(function(it){ if(cwState[it.id]) found++; });
    if(found<CW_ALL.length) return;
    setTimeout(function(){
      cwSay('Приём завершён. Полный счёт выставлен: '+cwMoney(CW_TOTAL)+'. Теперь ты мой. Спи спокойно.',true,'ФИНАЛ');
      var fx=d.getElementById('cwFx');
      fx.className='cw-fx finale'; void fx.offsetWidth; fx.className='cw-fx';
    },700);
  }
  function cwDoor(dr){
    if(dr.act==='slap'){
      elFx.className='cw-fx slap'; void elFx.offsetWidth; elFx.className='cw-fx';
      elRoom.classList.remove('cw-shake'); void elRoom.offsetWidth; elRoom.classList.add('cw-shake');
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
  function cwSay(txt,rose,name){
    if(name){ elBubble.innerHTML='<span class="cw-bname">'+name+'</span><span class="cw-btext">'+txt+'</span>'; }
    else elBubble.textContent=txt;
    elBubble.classList.toggle('rose',!!rose);
    elBubble.classList.add('show');
    clearTimeout(cwTmr); cwTmr=setTimeout(function(){ elBubble.classList.remove('show'); },4600);
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
  d.getElementById('cwReset').onclick=function(){
    cwState={}; cwSaveFound(cwState); cwBuild();
    cwSay('Приём начинается заново. Ищи всё с нуля.',false,'НАЧАЛО');
  };
  cwVisit=cwGet();
  d.getElementById('cwVisit').textContent=(cwVisit<10?'0':'')+cwVisit;
  cwBuild();
  w.addEventListener('resize',function(){ cwPos=cwClamp(cwPos); cwApply(); });
})();
