const body = document.body;
const application = document.getElementById('application');
const form = document.getElementById('applicationForm');
const success = document.getElementById('applicationSuccess');
const cursor = document.querySelector('.cursor-ring');

function openForm(){
  application.classList.add('open');
  application.setAttribute('aria-hidden','false');
  body.classList.add('form-open');
  setTimeout(()=>application.querySelector('input')?.focus(),120);
}

function closeForm(){
  application.classList.remove('open');
  application.setAttribute('aria-hidden','true');
  body.classList.remove('form-open');
}

document.querySelectorAll('.js-open-form').forEach(el=>el.addEventListener('click',openForm));
document.querySelectorAll('[data-close-form]').forEach(el=>el.addEventListener('click',closeForm));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeForm(); });

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -6% 0px'});

document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

if(matchMedia('(pointer:fine)').matches && cursor){
  document.addEventListener('mousemove',e=>{
    cursor.style.left=e.clientX+'px';
    cursor.style.top=e.clientY+'px';
    cursor.style.opacity='1';
  });
  document.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('active'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('active'));
  });
}

form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  const data = new FormData(form);
  const first = data.get('firstName') || '';
  const last = data.get('lastName') || '';
  const email = data.get('email') || '';
  const phone = data.get('phone') || '';
  const idea = data.get('idea') || '';
  const placement = data.get('placement') || '';
  const scale = data.get('scale') || '';
  const subject = encodeURIComponent(`Consultation request — ${first} ${last}`);
  const message = encodeURIComponent([
    'Jon Nelson consultation request','',
    `Name: ${first} ${last}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Placement: ${placement}`,
    `Project scale: ${scale}`,'',
    'Idea:',idea
  ].join('\n'));
  form.hidden = true;
  success.hidden = false;
  window.location.href = `mailto:jonnelsontattoos@gmail.com?subject=${subject}&body=${message}`;
});
