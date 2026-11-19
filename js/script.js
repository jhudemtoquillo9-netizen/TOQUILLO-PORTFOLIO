(function(){
  'use strict';
  const $ = (s,c=document)=>c.querySelector(s), $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();


  const nav = $('#nav'), menu = $('#menu'), btn = $('#menuBtn'), toTop = $('#toTop');
  btn.addEventListener('click',()=>{const o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  $$('#menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');btn.setAttribute('aria-expanded','false')}));
  addEventListener('scroll',()=>{
    nav.classList.toggle('solid',scrollY>40);
    toTop.classList.toggle('show',scrollY>500);
  },{passive:true});
  toTop.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

  const links = $$('#menu a'), sections = links.map(a=>$(a.getAttribute('href')));
  const spy = new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting) links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id));
  }),{rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s=>spy.observe(s));


  const roles = ['Web Developer','Cybersecurity Learner','Game Dev Explorer','Problem Solver'];
  const typed = $('#typed'); let r=0,c=0,del=false;
  (function tick(){
    const word = roles[r];
    if(reduce){typed.textContent=word;return}
    typed.textContent = word.slice(0,c);
    if(!del && c++===word.length){del=true;return setTimeout(tick,1400)}
    if(del && --c===0){del=false;r=(r+1)%roles.length}
    setTimeout(tick,del?45:95);
  })();


  $$('.panel').forEach(p=>p.classList.add('reveal'));
  const io = new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.skill',e.target).forEach(s=>$('b',s).style.width=s.dataset.level+'%');
    io.unobserve(e.target);
  }),{threshold:.15});
  $$('.reveal').forEach(el=>io.observe(el));


  $$('.tab').forEach(t=>t.addEventListener('click',()=>{
    $$('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
    const f=t.dataset.filter;
    $$('.card').forEach(card=>card.classList.toggle('hide',f!=='all' && card.dataset.type!==f));
  }));


  const modal=$('#modal');
  const closeM=()=>{modal.hidden=true};
  $$('.more').forEach(b=>b.addEventListener('click',()=>{
    const card=b.closest('.card'), box=$('.modal-box'), img=$('#mImg');
    $('#mTitle').textContent=card.dataset.title;
    $('#mDesc').textContent=card.dataset.desc;
    if(card.dataset.img){
      img.src=card.dataset.img; img.alt=card.dataset.title+' certificate';
      img.hidden=false; box.classList.add('wide');
    }else{
      img.hidden=true; img.removeAttribute('src'); box.classList.remove('wide');
    }
    modal.hidden=false; $('#closeModal').focus();
  }));
  $('#closeModal').addEventListener('click',closeM);
  modal.addEventListener('click',e=>{if(e.target===modal)closeM()});
  addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});


  const form=$('#contactForm'), msg=$('#formMsg');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const n=$('#fName').value.trim(), m=$('#fEmail').value.trim(), t=$('#fMsg').value.trim();
    msg.className='form-msg';
    if(!n||!m||!t){msg.textContent='Fill in your name, email and message.';msg.classList.add('err');return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){msg.textContent='Enter a valid email address.';msg.classList.add('err');return}
    const to='Jhudemtoquillo9@gmail.com'; // change to your email
    location.href=`mailto:${to}?subject=${encodeURIComponent('Portfolio message from '+n)}&body=${encodeURIComponent(t+'\n\nFrom: '+n+' ('+m+')')}`;
    msg.textContent='Opening your email app...';msg.classList.add('ok');form.reset();
  });


  const cv=$('#embers'), ctx=cv.getContext('2d'); let W,H,ps=[];
  function size(){W=cv.width=innerWidth;H=cv.height=innerHeight}
  addEventListener('resize',size);size();
  // mix of glowing bubbles (cool) and embers (warm)
  const make=(init)=>{
    const bubble=false;   // bubbles removed
    return {bubble,x:Math.random()*W,y:init?Math.random()*H:H+30,
      r:bubble?Math.random()*16+5:Math.random()*2.2+.6,
      v:bubble?Math.random()*.7+.25:Math.random()*.9+.3,
      d:Math.random()*2-1,a:Math.random()*.5+.35,ph:Math.random()*6.28};
  };
  for(let i=0;i<55;i++)ps.push(make(true));
  (function loop(){
    if(reduce) return;
    ctx.clearRect(0,0,W,H);
    ps.forEach((p,i)=>{
      p.y-=p.v; p.ph+=.02;
      p.x+=p.bubble?Math.sin(p.ph)*.5:Math.sin(p.y/40)*.4+p.d*.2;
      if(!p.bubble) p.a-=.0015;
      if(p.y<-30||p.a<=0){ps[i]=make(false);return}
      ctx.save();ctx.globalAlpha=p.a;
      if(p.bubble){
        const glow=.6+.4*Math.sin(p.ph*2);               // slow pulsing light
        ctx.shadowColor=`rgba(150,225,255,${glow})`;ctx.shadowBlur=18+p.r;
        const g=ctx.createRadialGradient(p.x-p.r*.35,p.y-p.r*.35,p.r*.05,p.x,p.y,p.r);
        g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,'rgba(170,230,255,.28)');
        g.addColorStop(.8,'rgba(150,170,255,.18)');g.addColorStop(1,'rgba(200,150,255,.6)');
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=g;ctx.fill();
        ctx.lineWidth=1.4;ctx.strokeStyle=`rgba(210,245,255,${.6+.3*glow})`;ctx.stroke();
        ctx.shadowBlur=0;                                 // shine spots
        ctx.beginPath();ctx.ellipse(p.x-p.r*.4,p.y-p.r*.45,p.r*.28,p.r*.15,-.6,0,6.283);
        ctx.fillStyle='rgba(255,255,255,.9)';ctx.fill();
        ctx.beginPath();ctx.arc(p.x+p.r*.45,p.y+p.r*.45,p.r*.1,0,6.283);
        ctx.fillStyle='rgba(255,255,255,.5)';ctx.fill();
      }else{
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);
        ctx.fillStyle=`rgb(255,${140+p.r*30|0},40)`;ctx.shadowColor='#ff7a1a';ctx.shadowBlur=10;ctx.fill();
      }
      ctx.restore();
    });
    requestAnimationFrame(loop);
  })();

  // purple lightning strikes
  const bc=document.createElement('canvas'); bc.id='bolts'; $('.scene').insertBefore(bc,cv);
  const bx=bc.getContext('2d'); let bolts=[],flash=0;
  const bsize=()=>{bc.width=innerWidth;bc.height=innerHeight}; addEventListener('resize',bsize); bsize();
  function path(x,y,ang,len,w){
    const pts=[[x,y]]; let d=0;
    while(d<len){const st=14+Math.random()*18; ang+=(Math.random()-.5)*.9; x+=Math.sin(ang)*st; y+=Math.cos(ang)*st; pts.push([x,y]); d+=st}
    return {pts,w};
  }
  function strike(){
    const H=bc.height, W=bc.width;
    const main=path(W*(.1+Math.random()*.8),0,(Math.random()-.5)*.3,H*(.45+Math.random()*.4),3), segs=[main];
    main.pts.forEach((p,i)=>{ if(i>3&&i%4===0&&Math.random()<.45)
      segs.push(path(p[0],p[1],(Math.random()<.5?-1:1)*(.5+Math.random()*.6),H*.18*Math.random()+40,1.6)) });
    bolts.push({segs,life:1}); flash=.3;
    if(Math.random()<.35) setTimeout(()=>{bolts.push({segs,life:.8});flash=.2},120);
  }
  function schedule(){ setTimeout(()=>{strike();schedule()},1800+Math.random()*3200) }
  if(!reduce){
    schedule();
    (function bloop(){
      bx.clearRect(0,0,bc.width,bc.height);
      if(flash>.005){bx.fillStyle=`rgba(140,70,255,${flash*.35})`;bx.fillRect(0,0,bc.width,bc.height);flash*=.86}
      bolts=bolts.filter(b=>b.life>0);
      bolts.forEach(b=>{
        b.life-=.035;
        const a=b.life>.5?(Math.random()>.25?1:.35):b.life*2;
        b.segs.forEach(s=>{
          [[s.w*5,`rgba(150,70,255,${a*.35})`],[s.w,`rgba(240,225,255,${a})`]].forEach(([lw,col])=>{
            bx.beginPath(); s.pts.forEach((p,i)=>i?bx.lineTo(p[0],p[1]):bx.moveTo(p[0],p[1]));
            bx.lineWidth=lw; bx.strokeStyle=col; bx.lineJoin='round';
            bx.shadowColor='#9b4dff'; bx.shadowBlur=28; bx.stroke();
          });
        });
      });
      requestAnimationFrame(bloop);
    })();
  }
})();
