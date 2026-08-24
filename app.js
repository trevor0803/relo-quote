const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});

const glow=document.querySelector('.cursor-glow');
addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}},{passive:true});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -6%'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modal=document.getElementById('consultModal');
const closeBtn=document.getElementById('modalClose');
const openModal=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');closeBtn.focus()};
const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')};
document.querySelectorAll('.js-consult').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openModal()}));
closeBtn.addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()});

let step=0;
const steps=[...document.querySelectorAll('.form-step')];
const bars=[...document.querySelectorAll('.progress i')];
const values={projectType:'',timing:''};
const showStep=n=>{step=Math.max(0,Math.min(n,steps.length-1));steps.forEach((s,i)=>s.classList.toggle('active',i===step));bars.forEach((b,i)=>b.classList.toggle('active',i<=step));if(step===3)renderSummary()};
document.querySelectorAll('.choices').forEach(group=>{group.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');values[group.dataset.field]=btn.textContent.trim()}))});
document.querySelectorAll('.form-next').forEach(btn=>btn.addEventListener('click',()=>{if(step===0&&!values.projectType){alert('Choose the closest project type first.');return}if(step===2&&!values.timing){alert('Choose a timing option first.');return}showStep(step+1)}));
document.querySelectorAll('.form-back').forEach(btn=>btn.addEventListener('click',()=>showStep(step-1)));
function details(){return {project:values.projectType||'Not selected',placement:document.getElementById('placement').value||'Not provided',size:document.getElementById('size').value||'Not provided',idea:document.getElementById('idea').value||'Not provided',timing:values.timing||'Not selected',budget:document.getElementById('budget').value||'Not provided',name:`${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`.trim(),phone:document.getElementById('phone').value,email:document.getElementById('email').value}}
function summaryHTML(d){return [['Project',d.project],['Placement',d.placement],['Size',d.size],['Timing',d.timing],['Budget',d.budget]].map(([k,v])=>`<div class="summary-row"><span>${k}</span><span>${v}</span></div>`).join('')}
function renderSummary(){document.getElementById('summary').innerHTML=summaryHTML(details())}
document.getElementById('consultForm').addEventListener('submit',e=>{e.preventDefault();const d=details();if(!d.name||!d.phone||!d.email){alert('Name, phone and email are required.');return}if(!document.getElementById('consent').checked){alert('Please confirm that Jon’s team may contact you.');return}const body=`Application to get tattooed by Jon Nelson\n\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nProject: ${d.project}\nPlacement: ${d.placement}\nRough size: ${d.size}\nTiming: ${d.timing}\nBudget: ${d.budget}\n\nIdea:\n${d.idea}`;const subject=`Jon Nelson tattoo application — ${d.name}`;document.getElementById('formWrap').style.display='none';document.getElementById('successSummary').innerHTML=summaryHTML(d)+`<div class="summary-row"><span>Idea</span><span>${d.idea}</span></div>`;document.getElementById('successState').classList.add('active');document.getElementById('successState').dataset.copy=body;location.href=`mailto:jonnelsontattoos@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
document.getElementById('copySummary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('successState').dataset.copy);document.getElementById('copySummary').textContent='Copied'}catch{alert('Copy is unavailable in this browser.')}});