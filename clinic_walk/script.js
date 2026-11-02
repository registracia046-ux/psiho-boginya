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
        {id:'iv', x:41.0, y:71.0, h:34, src:['assets/img/clinic/obj_ivstand.png'], names:['КАПЕЛЬНИЦА'],
         tip:'стоит у койки', bill:2400, punish:'Стойка капельницы. Я поставлю. Ты не заметишь, в какой момент уснул.'},
        {id:'key', x:19.0, y:67.0, h:5, src:['assets/img/clinic/obj_key.png'], names:['КЛЮЧ ОТ ПАЛАТЫ'],
         tip:'на койке', bill:800, punish:'Ключ от палаты — твой. Оплатишь смену. Не оплатишь — будешь спать в коридоре.'}
      ],
      containers:[
        {id:'cabA', x:59.0, y:6.0, w:11, h:78, label:'ШКАФ', hint:'открыть шкаф',
         item:{id:'jr', src:['assets/img/clinic/obj_journal.png'], names:['ЖУРНАЛ ПОСЕЩЕНИЙ'],
               reveal:{x:64.0,y:50.0,h:8}, bill:900,
               punish:'Журнал посещений. Подпишись здесь. Каждый раз — отдельная строчка.'}}
      ],
      doors:[], curtains:[],
      exits:[{to:'ward1',x:46,y:47,label:'палата 1'},{to:'ward2',x:57,y:43,label:'палата 2'},
             {to:'cabinet',x:52,y:64,label:'кабинет'}]},
    ward1:{ name:'ПАЛАТА №1', img:'assets/img/clinic/ward_one.jpg', focus:0.40,
      items:[
        {id:'glass1', x:15.0, y:58.0, h:9, src:['assets/img/clinic/obj_stakan.png'], names:['ВОДА'],
         tip:'на койке', bill:600, punish:'Выпей всё. Сядь обратно. Руки на колени. Потом сдоишь — и снова за мной.'},
        {id:'therm', x:24.0, y:56.0, h:8, src:['assets/img/clinic/obj_thermometer.png'], names:['ТЕРМОМЕТР'],
         tip:'у изголовья', bill:900, punish:'Температура в норме. Ты в порядке — настолько, что отдашь всё, о чём попросят.'},
        {id:'ice', x:51.0, y:61.0, h:10, src:['assets/img/clinic/obj_icepack.png'], names:['ПУЗЫРЬ СО ЛЬДОМ'],
         tip:'на стуле', bill:1500, punish:'Лёд. Приложить к голове — или к бумажнику. Выбирай сам.'}
      ],
      containers:[
        {id:'nightA', x:1.0, y:54.0, w:6, h:36, label:'ТУМБОЧКА', hint:'открыть тумбочку',
         item:{id:'pill1', src:['assets/img/clinic/obj_skopolamin.png','assets/img/clinic/obj_dimedrol.png'],
               names:['СКОПОЛАМИН','ДИМЕДРОЛ'], reveal:{x:4.0,y:52.0,h:6.5}, bill:5000, rose:true,
               punish:['Сдой. Тихо, никому. И не спрашивай, зачем.',
                       'Спи. Снотворное начнёт действовать через двадцать минут. Разбудишься не ты.']}}
      ],
      doors:[], curtains:[], exits:[{to:'corridor',x:88,y:70,label:'в коридор'}]},
    ward2:{ name:'ПАЛАТА №2', img:'assets/img/clinic/ward_two.jpg', focus:0.42,
      items:[
        {id:'syr2', x:31.0, y:51.0, h:11, src:['assets/img/clinic/obj_syringe.png'], names:['ШПРИЦ'],
         tip:'на койке', bill:3000, rose:true, punish:'Уколись. Сам. Я подожду.'},
        {id:'belt2', x:53.0, y:50.0, h:8, src:['assets/img/clinic/obj_remen.png'], names:['РЕМНИ'],
         tip:'привязан к стулу', bill:1800, rose:true, punish:'Запястье к стулу. Не дёргайся — я не люблю, когда дёргаются.'},
        {id:'tetrad2', x:16.5, y:72.0, h:8, src:['assets/img/clinic/obj_tetrad.png'], names:['ИСТОРИЯ БОЛЕЗНИ'],
         tip:'на полотенцах', bill:700, punish:'Запиши всё, что я скажу. Дословно. И перечитай вслух — про то, сколько ты должен.'},
        {id:'steth', x:66.0, y:49.0, h:9, src:['assets/img/clinic/obj_stethoscope.png'], names:['ФОНЕНДОСКОП'],
         tip:'на койке', bill:1100, punish:'Дыши. Глубже. Теперь дышишь так, как скажу.'},
        {id:'basin', x:56.0, y:74.0, h:12, src:['assets/img/clinic/obj_basin.png'], names:['ТАЗ С ВОДОЙ'],
         tip:'на полу', bill:1200, punish:'Смотри в таз, что от тебя останется, когда я закончу. И сдои мне, пока смотришь.'}
      ],
      containers:[
        {id:'cabB', x:27.0, y:2.0, w:8, h:50, label:'ШКАФ', hint:'открыть шкаф',
         item:{id:'pills', src:['assets/img/clinic/obj_pillbox.png'], names:['ТАБЛЕТКИ'],
               reveal:{x:31.0,y:34.0,h:9}, bill:450,
               punish:'Витамины. На память. Чтобы не забыл, сколько должен — и сколько раз сдоил.'}}
      ],
      curtains:[{id:'cur2',x:47.5,y:1,h:70,src:'assets/img/clinic/curtain.png', bill:600,
                  punish:'Сквозняк. Занавеску не закрывают — её сдувает.'}],
      doors:[], exits:[{to:'corridor',x:89,y:70,label:'в коридор'}]},
    cabinet:{ name:'КАБИНЕТ', img:'assets/img/clinic/clinic_office.jpg', focus:0.42,
      items:[
        {id:'pill', x:58.5, y:48.0, h:7.5, src:['assets/img/clinic/obj_skopolamin.png','assets/img/clinic/obj_dimedrol.png'],
         names:['СКОПОЛАМИН','ДИМЕДРОЛ'], tip:'на подносе', bill:5000, rose:true,
         punish:['Сдой. Тихо, никому. И не спрашивай, зачем.',
                 'Спи. Снотворное начнёт действовать через двадцать минут. Разбудишься не ты.']},
        {id:'syr', x:61.5, y:46.5, h:11, src:['assets/img/clinic/obj_syringe.png'], names:['ШПРИЦ'],
         tip:'на подносе', bill:3000, rose:true, punish:'Уколись. Сам. Я подожду.'},
        {id:'glass', x:57.5, y:58.5, h:9, src:['assets/img/clinic/obj_stakan.png'], names:['ВОДА'],
         tip:'на нижней полке', bill:600, punish:'Выпей всё. Сядь обратно. Руки на колени. Потом сдоишь — и снова за мной.'},
        {id:'belt', x:61.0, y:59.5, h:7, src:['assets/img/clinic/obj_remen.png'], names:['РЕМНИ'],
         tip:'на нижней полке', bill:1800, rose:true, punish:'Запястье к стулу. Не дёргайся.'},
        {id:'xray', x:29.0, y:25.0, h:22, src:['assets/img/clinic/obj_xray.png'], names:['СНИМОК'],
         tip:'на стене', bill:2600, punish:'Снимок. Смотри: там пусто. Я заполню — и подпишу, где деньги.'},
        {id:'mirror', x:46.0, y:22.0, h:18, src:['assets/img/clinic/obj_mirror.png'], names:['ЗЕРКАЛО'],
         tip:'на стене', bill:2200, rose:true, punish:'В зеркале ты — мой. И это не комплимент.'}
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
    (CW_ROOMS[k].containers||[]).forEach(function(ct){ CW_ALL.push(ct.item); CW_TOTAL+=ct.item.bill||0; });
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
      elTotal=d.getElementById('cwTotal'), elArrow=d.getElementById('cwArrow'), elOpenBtn=d.getElementById('cwOpen');
  var cwPos=0, cwDrag=false, cwSx=0, cwSp=0, cwState=cwFound();

  function cwImgW(){ return elPan.offsetWidth; }
  function cwMax(){ return Math.max(0, cwImgW()-elRoom.clientWidth); }
  function cwClamp(v){ return Math.min(0,Math.max(-cwMax(),v)); }
  function cwApply(){
    elPan.style.transform='translate3d('+cwPos.toFixed(1)+'px,0,0)';
    if(elRoom.scrollLeft) elRoom.scrollLeft=0;
    cwEdgeHint();
  }
  /* если шкаф спрятан или предмет не найден — он за краем кадра: показываем стрелку */
  function cwEdgeHint(){
    if(!elArrow) return;
    var R=CW_ROOMS[cwRoom], W=elRoom.clientWidth, right=0, left=0;
    (R.containers||[]).forEach(function(ct){
      var cx=cwImgW()*ct.x/100+cwPos;
      if(cx<30) left=1; else if(cx>W-30) right=1;
    });
    if(!right && !left){
      (R.items||[]).forEach(function(f){
        if(cwState[f.id]) return;
        var cx=cwImgW()*f.x/100+cwPos;
        if(cx<20) left=1; else if(cx>W-20) right=1;
      });
    }
    elArrow.className='cw-arrow'+(right?' right on':'')+(left?' left on':'');
    elArrow.textContent=(right&&left)?'↔':(left?'←':'→');
  }
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
    (R.containers||[]).forEach(function(ct){
      var el=d.createElement('div');
      el.className='cw-hot cw-cont'+(cwState['ct_'+ct.id]?' opened':'');
      el.style.left=ct.x+'%'; el.style.top=ct.y+'%';
      el.style.width=ct.w+'%'; el.style.height=ct.h+'%';
      el.innerHTML='<span class="cw-cap">'+ct.label+'</span>';
      el.title=ct.hint||'';
      el.addEventListener('click',function(e){ e.stopPropagation(); cwOpen(ct,el); });
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
    var ob=d.getElementById('cwOpen');
    if(ob){
      var hasC=(R.containers&&R.containers.length);
      ob.textContent=hasC?('Открыть '+(R.containers[0].label||'шкаф').toLowerCase()):'Тут пусто';
      ob.style.display=hasC?'':'none';
    }
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
  /* шкаф/тумбочка: достать спрятанный предмет */
  function cwOpen(ct,el){
    if(cwState['ct_'+ct.id]) return;
    cwState['ct_'+ct.id]=1; cwSaveFound(cwState);
    el.classList.add('opened');
    var it=ct.item, rv=it.reveal;
    var e2=d.createElement('div');
    e2.className='cw-hot cw-item cw-reveal';
    e2.style.left=rv.x+'%'; e2.style.top=rv.y+'%'; e2.style.height=rv.h+'%';
    var arr=Array.isArray(it.src)?it.src:[it.src];
    var start=(arr.length>1 && cwVisit>1)?1:0;
    e2.innerHTML='<img src="'+arr[start]+'" alt="'+it.names[start]+'">';
    e2.addEventListener('click',function(ev){ ev.stopPropagation(); cwItem(e2,it); });
    elLayer.appendChild(e2);
    /* подводим камеру к шкафу, чтобы предмет был в кадре */
    cwPos=cwClamp(-(cwImgW()*rv.x/100-elRoom.clientWidth/2));
    cwApply();
    cwSay('Открыто. '+it.names[start]+' — твой.',false,it.names[start]);
    cwScore();
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
  d.getElementById('cwOpen').onclick=function(){
    var R=CW_ROOMS[cwRoom], cts=R.containers||[];
    if(!cts.length){ cwSay('Здесь нечего открывать.'); return; }
    var ct=cts[0];
    cwPos=cwClamp(-(cwImgW()*ct.x/100-elRoom.clientWidth/2)); cwApply();
    setTimeout(function(){
      var el=elLayer.querySelector('.cw-cont');
      if(el && !el.classList.contains('opened')) el.click();
      else { var it=ct.item; cwSay('Уже открыто. '+it.names[0]+' — твой.',false,it.names[0]); }
    },420);
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
