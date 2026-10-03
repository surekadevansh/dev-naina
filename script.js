const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const pre=$('#preloader'), status=$('#loaderStatus');
const statuses=['Collecting memories…','Finding the little things…','Remembering Kolkata…','Counting arguments…','Almost there…'];
let si=0; const statusTimer=setInterval(()=>{if(si<statuses.length-1)status.textContent=statuses[++si]},420);
window.addEventListener('load',()=>setTimeout(()=>{clearInterval(statusTimer);pre.classList.add('done');document.body.classList.add('loaded')},1900));

const progress=$('.progress span'), chapterPill=$('#chapterPill'), musicPlayer=$('#musicPlayer');
const chapters=[...document.querySelectorAll('main section[id]')];
function updateScrollUI(){const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(Math.max(0,Math.min(100,scrollY/h*100)))+'%';let active=chapters[0];for(const sec of chapters){if(sec.getBoundingClientRect().top<=innerHeight*.38)active=sec}if(active){const labels={intro:'THE BEGINNING',story:'ONE YEAR',meeting:'KOLKATA',notices:'THE LITTLE THINGS',distance:'THE DISTANCE',us:'US, BASICALLY',archive:'THE ARCHIVE',songs:'THE SOUNDTRACK',letter:'THE THING I NEED TO SAY',end:'NO SPECIAL OCCASION'};const idx=Math.max(1,chapters.indexOf(active)+1);chapterPill.querySelector('span').textContent=String(idx).padStart(2,'0');chapterPill.querySelector('b').textContent=labels[active.id]||active.dataset.chapter||'OUR STORY';chapterPill.classList.toggle('show',scrollY>180)}}
window.addEventListener('scroll',updateScrollUI,{passive:true});updateScrollUI();
setTimeout(()=>musicPlayer.classList.add('show'),2100);

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
const menu=$('#chapterMenu'); $('#menuBtn').onclick=()=>menu.classList.add('open'); $('#closeMenu').onclick=()=>menu.classList.remove('open'); $$('.chapter-menu a').forEach(a=>a.onclick=()=>menu.classList.remove('open'));

// Notice cards
const modal=$('#noteModal'), noteText=$('#noteText');
$$('.notice-card').forEach(c=>c.addEventListener('click',()=>{noteText.textContent=c.dataset.note;modal.classList.add('show')}));
$('#closeNote').onclick=()=>modal.classList.remove('show'); modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});

// Gallery lightbox
const light=$('#lightbox'), lightImg=$('#lightboxImg'), lightLabel=$('#lightboxLabel');
$$('.gallery-item').forEach(item=>item.addEventListener('click',()=>{lightImg.src=$('img',item).src;lightLabel.textContent=$('span',item).textContent;light.classList.add('show')}));
$('#lightboxClose').onclick=()=>light.classList.remove('show'); light.addEventListener('click',e=>{if(e.target===light)light.classList.remove('show')});

// Custom cursor
if(matchMedia('(pointer:fine)').matches){const dot=$('.cursor-dot'),ring=$('.cursor-ring');let mx=0,my=0,rx=0,ry=0;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});function tick(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)}tick();$$('button,a').forEach(x=>{x.addEventListener('mouseenter',()=>ring.classList.add('hover'));x.addEventListener('mouseleave',()=>ring.classList.remove('hover'))})}

// Music — the uploaded I Wanna Be Yours track powers the site's sound control.
const music=$('#bgMusic'), soundBtn=$('#soundBtn'), soundLabel=$('.sound-label');
music.volume=.58;
const musicPlay=$('#musicPlay'), musicCurrent=$('#musicCurrent'), musicDuration=$('#musicDuration'), musicFill=$('#musicFill');
function fmt(t){if(!Number.isFinite(t))return '0:00';return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')}
function setMusicLabel(on){soundBtn.classList.toggle('active',on);soundLabel.textContent=on?' ON':'SOUND';musicPlay.textContent=on?'Ⅱ':'▶';musicPlay.setAttribute('aria-label',on?'Pause music':'Play music')}
async function startMusic(){try{await music.play();setMusicLabel(true)}catch(err){setMusicLabel(false)}}
function stopMusic(){music.pause();setMusicLabel(false)}
function toggleMusic(){music.paused?startMusic():stopMusic()}
soundBtn.onclick=toggleMusic;musicPlay.onclick=toggleMusic;$('#songIWBYou')?.addEventListener('click',toggleMusic);
music.addEventListener('loadedmetadata',()=>{musicDuration.textContent=fmt(music.duration)});
music.addEventListener('timeupdate',()=>{musicCurrent.textContent=fmt(music.currentTime);musicFill.style.width=(music.duration?(music.currentTime/music.duration*100):0)+'%'});
music.addEventListener('play',()=>setMusicLabel(true));music.addEventListener('pause',()=>setMusicLabel(false));

// Secret final reveal
const secret=$('#secretReveal');$('#secretBtn').onclick=()=>secret.classList.add('show');$('#closeSecret').onclick=()=>secret.classList.remove('show');

// Easter egg: type NAINA anywhere.
let typed='';addEventListener('keydown',e=>{typed=(typed+e.key.toLowerCase()).slice(-5);if(typed==='naina'){document.body.classList.add('secret-mode');setTimeout(()=>document.body.classList.remove('secret-mode'),5000)}});
