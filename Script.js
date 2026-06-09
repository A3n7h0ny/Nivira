// ── CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
});
function animateRing(){
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animateRing);
}
animateRing();
document.querySelectorAll('a,button,.service-card,.project-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.classList.add('hover');ring.classList.add('hover');});
  el.addEventListener('mouseleave',()=>{cursor.classList.remove('hover');ring.classList.remove('hover');});
});

// ── NAVBAR SCROLL
const navbar=document.getElementById('navbar');
const scrollBar=document.getElementById('scrollProgress');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>50);
  if(scrollBar){
    const total=document.documentElement.scrollHeight-window.innerHeight;
    scrollBar.style.width=(window.scrollY/total*100)+'%';
  }
});

// ── HAMBURGER
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('navLinks');
hamburger.addEventListener('click',()=>{
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

// ── SCROLL REVEAL
const reveals=document.querySelectorAll('.reveal');
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.12});
reveals.forEach(r=>revealObs.observe(r));

// ── HERO TEXT SWAP
const swaps=['that convert.','that rank well.','that impress.','that perform.','that grow you.'];
let si=0;
const swapEl=document.getElementById('swapText');
function swapText(){
  swapEl.style.opacity='0';
  swapEl.style.transform='translateY(12px)';
  setTimeout(()=>{
    si=(si+1)%swaps.length;
    swapEl.textContent=swaps[si];
    swapEl.style.opacity='1';
    swapEl.style.transform='translateY(0)';
  },400);
}
swapEl.style.transition='opacity 0.4s ease,transform 0.4s ease';
setInterval(swapText,2800);

// ── COUNTER ANIMATION
function animateCounter(el,target){
  let start=0;
  const isPercent=el.textContent.includes('%');
  const duration=1800;
  const step=timestamp=>{
    if(!start)start=timestamp;
    const progress=Math.min((timestamp-start)/duration,1);
    const eased=1-Math.pow(1-progress,3);
    const val=Math.floor(eased*target);
    el.textContent=val+(isPercent?'%':'+');
    if(progress<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const target=parseInt(e.target.dataset.target);
      if(target)animateCounter(e.target,target);
      counterObs.unobserve(e.target);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.stat-num[data-target]').forEach(el=>counterObs.observe(el));

// ── CONTACT FORM
const form=document.getElementById('contactForm');
const success=document.getElementById('formSuccess');
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=form.querySelector('.form-submit');
    btn.innerHTML='<span>Sending…</span>';
    btn.disabled=true;
    try{
      const res=await fetch('/',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams(new FormData(form)).toString()
      });
      if(res.ok){
        form.style.display='none';
        success.style.display='block';
      } else throw new Error();
    }catch{
      const d=form.querySelector('[name=email]').value;
      const m=form.querySelector('[name=message]').value;
      window.location.href=`mailto:hello@nivira.co.za?subject=Project Enquiry&body=${encodeURIComponent(m)}`;
      btn.disabled=false;
      btn.innerHTML='<span>Send Message →</span>';
    }
  });
}

// ── SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-72,behavior:'smooth'});}
  });
});

// ── FAQ ACCORDION
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const isOpen = btn.getAttribute('aria-expanded')==='true';
    // close all
    document.querySelectorAll('.faq-question').forEach(b=>{
      b.setAttribute('aria-expanded','false');
      b.nextElementSibling.classList.remove('open');
    });
    // open clicked if it was closed
    if(!isOpen){
      btn.setAttribute('aria-expanded','true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

// ========================================
// Floating contact hub (WhatsApp / Email / Call)
// ========================================
(function () {
    const hubWrapper   = document.getElementById('floatingHub');
    const mainFab      = document.getElementById('mainFab');
   
    let menuOpen = false, reminderVisible = false;

    function openMenu()  { if (!hubWrapper) return; hubWrapper.classList.add('active');    menuOpen = true;  hideReminder(); }
    function closeMenu() { if (!hubWrapper) return; hubWrapper.classList.remove('active'); menuOpen = false; }
    

    // FAB click
    if (mainFab) {
        mainFab.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            menuOpen ? closeMenu() : openMenu();
        });
        mainFab.addEventListener('mouseenter', () => { if (!menuOpen && !reminderVisible) showReminder(); });
    }

   

    // Close on outside click / ESC
    document.addEventListener('click', (e) => { if (hubWrapper && !hubWrapper.contains(e.target) && menuOpen) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

    // Close options after selection
    document.querySelectorAll('.contact-action-btn').forEach(btn =>
        btn.addEventListener('click', () => setTimeout(closeMenu, 200))
    );

    
})();