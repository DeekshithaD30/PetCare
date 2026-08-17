const KEY = "petcare-passport-v1";

const demo = {
  user: { name: "Deekshitha" },
  pets: [{
    id: "goku",
    name: "Goku",
    species: "Dog",
    breed: "German Shepherd × Husky",
    dob: "2024-08-10",
    sex: "Male",
    weight: 28,
    colour: "Black & tan",
    about: "An energetic family dog with a growing health history.",
    photo: ""
  }],
  health: [
    {id:"h1",petId:"goku",type:"Vaccination",title:"Annual vaccination",date:"2026-08-15",next:"2027-08-15",vet:"Dr. Rao",clinic:"Green Paws",notes:"Annual vaccine recorded."},
    {id:"h2",petId:"goku",type:"Deworming",title:"Deworming",date:"2026-08-15",next:"2026-11-13",vet:"Dr. Rao",clinic:"Green Paws",notes:"Next date follows the configured owner/vet schedule."},
    {id:"h3",petId:"goku",type:"Flea/Tick",title:"Flea & tick treatment",date:"2026-08-01",next:"2026-09-01",vet:"",clinic:"",notes:"Routine preventive care."},
    {id:"h4",petId:"goku",type:"Vet visit",title:"Routine check-up",date:"2026-07-20",next:"",vet:"Dr. Rao",clinic:"Green Paws",notes:"General examination."}
  ],
  schedules: [
    {id:"s1",petId:"goku",title:"Flea & tick treatment",last:"2026-08-01",interval:31,next:"2026-09-01",active:true},
    {id:"s2",petId:"goku",title:"Annual vaccination",last:"2026-08-15",interval:null,next:"2027-08-15",active:true},
    {id:"s3",petId:"goku",title:"Deworming",last:"2026-08-15",interval:90,next:"2026-11-13",active:true},
    {id:"s4",petId:"goku",title:"Grooming",last:"2026-08-01",interval:60,next:"2026-09-30",active:true}
  ],
  incidents: [
    {id:"i1",petId:"goku",title:"Vomiting during travel",date:"2026-08-12",symptoms:"Vomiting, loose stool",trigger:"Long-distance car travel",vet:"Yes",treatment:"Vet consultation and prescribed care",outcome:"Recovered",notes:"Useful incident to discuss with a veterinarian if repeated.",published:true},
    {id:"i2",petId:"goku",title:"Diet change observation",date:"2026-05-18",symptoms:"Loose stool",trigger:"Food transition",vet:"Yes",treatment:"Diet reviewed with vet",outcome:"Settled",notes:"Transition was slowed down.",published:false}
  ],
  weights: [
    {id:"w1",petId:"goku",date:"2026-02-10",weight:25.2},
    {id:"w2",petId:"goku",date:"2026-04-10",weight:26.4},
    {id:"w3",petId:"goku",date:"2026-06-10",weight:27.1},
    {id:"w4",petId:"goku",date:"2026-08-10",weight:28}
  ],
  documents: [
    {id:"d1",petId:"goku",name:"Vaccination certificate.pdf",type:"PDF",date:"2026-08-15",size:"Demo document"}
  ],
  community: [
    {id:"c1",title:"Vomiting during long-distance travel",species:"Dog",breed:"German Shepherd",age:"2 years",tags:["travel","vomiting"],body:"An owner-recorded experience involving vomiting and loose stool during travel. Vet consultation was sought and the pet recovered.",date:"2026-08-12"},
    {id:"c2",title:"Managing a food transition",species:"Dog",breed:"Mixed breed",age:"1 year",tags:["food","digestion"],body:"An anonymized owner experience about slowing down a food transition after loose stool.",date:"2026-05-18"}
  ],
  notifications: []
};

let state = loadState();
let currentView = "dashboard";
let currentPetId = state.pets[0]?.id || null;

function loadState() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : structuredClone(demo);
  } catch { return structuredClone(demo); }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function esc(v="") {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function uid(prefix="id") { return prefix + Math.random().toString(36).slice(2,9); }
function pet() { return state.pets.find(p => p.id === currentPetId) || state.pets[0]; }
function petHealth() { return state.health.filter(x => x.petId === currentPetId); }
function petSchedules() { return state.schedules.filter(x => x.petId === currentPetId && x.active !== false); }
function petIncidents() { return state.incidents.filter(x => x.petId === currentPetId); }
function petWeights() { return state.weights.filter(x => x.petId === currentPetId).sort((a,b)=>a.date.localeCompare(b.date)); }
function petDocs() { return state.documents.filter(x => x.petId === currentPetId); }
function daysUntil(d) {
  if (!d) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(d+"T00:00:00");
  return Math.round((target-today)/86400000);
}
function dueText(d) {
  const n = daysUntil(d);
  if (n === null) return "No due date";
  if (n < 0) return `Overdue by ${Math.abs(n)} days`;
  if (n === 0) return "Due today";
  if (n === 1) return "Due tomorrow";
  return `Due in ${n} days`;
}
function formatDate(d) {
  if (!d) return "—";
  return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}
function ageOf(dob) {
  if (!dob) return "—";
  const b = new Date(dob), now = new Date();
  let years = now.getFullYear()-b.getFullYear();
  let months = now.getMonth()-b.getMonth();
  if (now.getDate() < b.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  return years > 0 ? `${years} yr${years>1?"s":""}` : `${Math.max(months,0)} mo`;
}
function iconFor(type) {
  return ({Vaccination:"✦",Deworming:"◷","Flea/Tick":"◇",Medication:"＋","Vet visit":"⌁",Allergy:"!", "Medical condition":"•",Surgery:"✚",Grooming:"✿",Bath:"○"})[type] || "•";
}
function showToast(msg) {
  const root = document.getElementById("toast-root");
  const el = document.createElement("div"); el.className="toast"; el.textContent=msg; root.appendChild(el);
  setTimeout(()=>el.remove(),2600);
}
function setView(view) {
  currentView = view;
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  renderShell();
}
function enterApp(demoMode=true) {
  if (demoMode && !localStorage.getItem(KEY)) { state=structuredClone(demo); save(); }
  currentPetId = state.pets[0]?.id || null;
  setView("dashboard");
}
function renderShell() {
  renderPetSwitcher();
  document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  const titles={dashboard:"Dashboard",pets:"My pets",health:"Health records",care:"Care & reminders",incidents:"Incidents",timeline:"Timeline",documents:"Documents",community:"Community"};
  document.getElementById("header-title").textContent=titles[currentView] || "PetCare";
  const count = petSchedules().filter(s => { const n=daysUntil(s.next); return n !== null && n <= 30; }).length;
  document.getElementById("notification-count").textContent=count;
  renderView();
}
function renderPetSwitcher() {
  const wrap=document.getElementById("pet-switcher");
  if(!state.pets.length){wrap.innerHTML='<div class="empty">No pets yet.</div>';return;}
  wrap.innerHTML=`<div class="pet-switcher-inner"><div class="mini-avatar">${pet()?.photo?`<img src="${pet().photo}" alt="">`:esc((pet()?.name||"P").slice(0,1))}</div><select id="pet-select">${state.pets.map(p=>`<option value="${p.id}" ${p.id===currentPetId?"selected":""}>${esc(p.name)}</option>`).join("")}</select></div>`;
  document.getElementById("pet-select").onchange=e=>{currentPetId=e.target.value;renderShell();};
}
function renderView() {
  const root=document.getElementById("view-root");
  if(currentView==="dashboard") root.innerHTML=dashboardHTML();
  if(currentView==="pets") root.innerHTML=petsHTML();
  if(currentView==="health") root.innerHTML=healthHTML();
  if(currentView==="care") root.innerHTML=careHTML();
  if(currentView==="incidents") root.innerHTML=incidentsHTML();
  if(currentView==="timeline") root.innerHTML=timelineHTML();
  if(currentView==="documents") root.innerHTML=documentsHTML();
  if(currentView==="community") root.innerHTML=communityHTML();
  bindViewEvents();
}
function pageHead(title,sub,actionText="",action="") {
  return `<div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div>${actionText?`<div class="page-actions"><button class="btn btn-dark btn-sm" data-action="${action}">${actionText}</button></div>`:""}</div>`;
}
function dashboardHTML() {
  const p=pet(), schedules=petSchedules().sort((a,b)=>a.next.localeCompare(b.next)), soon=schedules.filter(s=>daysUntil(s.next)>=0&&daysUntil(s.next)<=30), overdue=schedules.filter(s=>daysUntil(s.next)<0);
  const incidents=petIncidents().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4), weights=petWeights();
  return `${pageHead(`Good morning, ${esc(state.user.name)}`,`Here's what is happening with ${esc(p.name)} today.`,"Add care event","add-care")}
    <div class="profile-summary panel" style="margin-bottom:15px">
      <div class="profile-photo">${p.photo?`<img src="${p.photo}" alt="${esc(p.name)}">`:`<span class="initial">${esc(p.name.slice(0,1))}</span>`}</div>
      <div style="flex:1"><h2>${esc(p.name)}</h2><p>${esc(p.breed||p.species)} · ${esc(p.sex)} · ${ageOf(p.dob)}</p><span class="tag">${esc(p.about||"Pet health passport")}</span></div>
      <button class="btn btn-light btn-sm" data-view="pets">View profile</button>
    </div>
    <div class="grid-4">
      <div class="stat-card"><div class="stat-label">UPCOMING CARE</div><div class="stat-value">${soon.length}</div><div class="stat-note">Within 30 days</div></div>
      <div class="stat-card"><div class="stat-label">OVERDUE</div><div class="stat-value">${overdue.length}</div><div class="stat-note">${overdue.length?"Needs attention":"Everything is current"}</div></div>
      <div class="stat-card"><div class="stat-label">HEALTH RECORDS</div><div class="stat-value">${petHealth().length}</div><div class="stat-note">Vaccines, visits & more</div></div>
      <div class="stat-card"><div class="stat-label">CURRENT WEIGHT</div><div class="stat-value">${p.weight||0}</div><div class="stat-note">kg · ${weights.length} measurements</div></div>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><h2>Upcoming care</h2><button class="link-btn" data-view="care">View all</button></div>
        ${schedules.length?`<div class="care-list">${schedules.slice(0,6).map(careRow).join("")}</div>`:`<div class="empty">No care schedules yet. Add the first one.</div>`}
      </section>
      <section class="panel"><div class="panel-head"><h2>Pet snapshot</h2><button class="link-btn" data-view="timeline">Timeline</button></div>
        <div class="mini-list">
          <div class="mini-list-row"><span>Born</span><span>${formatDate(p.dob)}</span></div>
          <div class="mini-list-row"><span>Breed</span><span>${esc(p.breed||"Not recorded")}</span></div>
          <div class="mini-list-row"><span>Vaccinations</span><span>${petHealth().filter(x=>x.type==="Vaccination").length}</span></div>
          <div class="mini-list-row"><span>Incidents</span><span>${petIncidents().length}</span></div>
          <div class="mini-list-row"><span>Documents</span><span>${petDocs().length}</span></div>
        </div>
      </section>
    </div>
    <div class="grid-2" style="margin-top:15px">
      <section class="panel"><div class="panel-head"><h2>Weight trend</h2><button class="link-btn" data-view="health">Details</button></div>${weightChart(weights)}</section>
      <section class="panel"><div class="panel-head"><h2>Recent incidents</h2><button class="link-btn" data-view="incidents">View all</button></div>${incidents.length?`<div class="care-list">${incidents.map(i=>`<div class="care-row"><div class="care-main"><div class="care-icon">⌁</div><div><strong>${esc(i.title)}</strong><span>${formatDate(i.date)} · ${esc(i.outcome||"Outcome not recorded")}</span></div></div></div>`).join("")}</div>`:`<div class="empty">No incidents recorded.</div>`}</section>
    </div>
    <button class="ai-fab" data-action="open-ai">✦ Ask PetCare AI</button>`;
}
function careRow(s) {
  const n=daysUntil(s.next), cls=n<0?"overdue":n<=30?"soon":"";
  return `<div class="care-row"><div class="care-main"><div class="care-icon">${iconFor(s.title)}</div><div><strong>${esc(s.title)}</strong><span>${formatDate(s.next)} · ${s.interval?`Every ${s.interval} days`:"Scheduled date"}</span></div></div><span class="due-badge ${cls}">${dueText(s.next)}</span></div>`;
}
function weightChart(weights) {
  if(!weights.length) return `<div class="empty">Add weight measurements to see a trend.</div>`;
  const max=Math.max(...weights.map(x=>x.weight)), min=Math.min(...weights.map(x=>x.weight)), range=Math.max(max-min,1);
  return `<div class="chart-wrap">${weights.slice(-8).map(w=>{const h=30+((w.weight-min)/range)*60;return `<div class="bar-col"><div class="bar" style="height:${h}%"></div><span>${new Date(w.date+"T00:00:00").toLocaleDateString("en-IN",{month:"short"})}</span></div>`}).join("")}</div>`;
}
function petsHTML() {
  return `${pageHead("My pets","Manage your pets and keep each health passport separate.","Add pet","add-pet")}
    <div class="pet-grid">${state.pets.map(p=>`<article class="pet-card"><div class="pet-card-cover">${p.photo?`<img src="${p.photo}" alt="${esc(p.name)}">`:`<span class="initial">${esc(p.name.slice(0,1))}</span>`}</div><div class="pet-card-body"><h3>${esc(p.name)}</h3><p>${esc(p.breed||p.species)} · ${ageOf(p.dob)}</p><div class="pet-card-meta"><div><span>Weight</span><strong>${p.weight||0} kg</strong></div><div><span>Records</span><strong>${state.health.filter(x=>x.petId===p.id).length}</strong></div><div><span>Incidents</span><strong>${state.incidents.filter(x=>x.petId===p.id).length}</strong></div></div><div style="margin-top:15px"><button class="btn btn-dark btn-sm" data-action="select-pet" data-id="${p.id}">Open passport</button></div></div></article>`).join("")}</div>`;
}
function healthHTML() {
  const rows=petHealth().sort((a,b)=>b.date.localeCompare(a.date)), p=pet();
  return `${pageHead(`${esc(p.name)}'s health records`,"Vaccinations, treatments, visits and other important health information.","Add record","add-record")}
    <div class="record-list">${rows.length?rows.map(r=>`<article class="record-card"><div class="record-icon">${iconFor(r.type)}</div><div><h3>${esc(r.title)}</h3><p>${esc(r.type)} · ${formatDate(r.date)}${r.vet?` · ${esc(r.vet)}`:""}</p><p>${esc(r.notes||"No notes")}</p></div><time>${r.next?`Next: ${formatDate(r.next)}`:""}</time></article>`).join(""):`<div class="empty">No health records yet.</div>`}</div>
    <section class="panel" style="margin-top:15px"><div class="panel-head"><h2>Weight history</h2><button class="btn btn-light btn-sm" data-action="add-weight">Add measurement</button></div>${weightChart(petWeights())}</section>`;
}
function careHTML() {
  const rows=petSchedules().sort((a,b)=>a.next.localeCompare(b.next));
  return `${pageHead("Care & reminders","Preventive care is configurable. Confirm schedules with your veterinarian.","Add schedule","add-care")}
    <div class="grid-2">${rows.length?rows.map(s=>`<article class="care-card panel"><div class="panel-head"><h2>${esc(s.title)}</h2><span class="due-badge ${daysUntil(s.next)<0?"overdue":daysUntil(s.next)<=30?"soon":""}">${dueText(s.next)}</span></div><div class="mini-list"><div class="mini-list-row"><span>Last completed</span><span>${formatDate(s.last)}</span></div><div class="mini-list-row"><span>Next due</span><span>${formatDate(s.next)}</span></div><div class="mini-list-row"><span>Repeat</span><span>${s.interval?`${s.interval} days`:"One scheduled date"}</span></div></div><div class="modal-actions"><button class="btn btn-light btn-sm" data-action="complete-care" data-id="${s.id}">Mark completed</button><button class="btn btn-light btn-sm" data-action="delete-care" data-id="${s.id}">Remove</button></div></article>`).join(""):`<div class="empty">No schedules yet.</div>`}</div>`;
}
function incidentsHTML() {
  const rows=petIncidents().sort((a,b)=>b.date.localeCompare(a.date));
  return `${pageHead("Incident journal","Preserve important experiences, symptoms, vet visits and outcomes.","Add incident","add-incident")}
    <div class="incident-grid">${rows.length?rows.map(i=>`<article class="incident-card"><div class="incident-top"><h3>${esc(i.title)}</h3><span class="incident-date">${formatDate(i.date)}</span></div><p><strong>Symptoms:</strong> ${esc(i.symptoms||"Not recorded")}</p><p><strong>Situation:</strong> ${esc(i.trigger||"Not recorded")}</p><p><strong>Outcome:</strong> ${esc(i.outcome||"Not recorded")}</p><div class="incident-meta"><span class="tag">${i.vet==="Yes"?"Vet consulted":"No vet recorded"}</span>${i.published?'<span class="tag">Shared anonymously</span>':''}</div><div class="modal-actions"><button class="btn btn-light btn-sm" data-action="edit-incident" data-id="${i.id}">Edit</button>${!i.published?`<button class="btn btn-dark btn-sm" data-action="publish-incident" data-id="${i.id}">Share anonymously</button>`:""}</div></article>`).join(""):`<div class="empty">No incidents yet.</div>`}</div>`;
}
function timelineHTML() {
  const p=pet(), events=[
    ...petHealth().map(x=>({date:x.date,type:x.type,title:x.title,details:x.notes||""})),
    ...petIncidents().map(x=>({date:x.date,type:"Incident",title:x.title,details:x.symptoms||x.outcome||""})),
    ...petWeights().map(x=>({date:x.date,type:"Weight",title:`Weight recorded · ${x.weight} kg`,details:""}))
  ].sort((a,b)=>b.date.localeCompare(a.date));
  return `${pageHead(`${esc(p.name)}'s timeline`,"A chronological view of the pet's health history.","Add event","add-record")}
    <div class="panel"><div class="timeline">${events.length?events.map(e=>`<div class="timeline-item"><span class="timeline-dot"></span><div class="timeline-date">${formatDate(e.date)} · ${esc(e.type)}</div><h3>${esc(e.title)}</h3><p>${esc(e.details)}</p></div>`).join(""):`<div class="empty">No events recorded.</div>`}</div></div>`;
}
function documentsHTML() {
  const docs=petDocs();
  return `${pageHead("Document vault","Keep certificates, prescriptions and reports with your pet.","Upload document","upload-document")}
    <div class="doc-grid">${docs.length?docs.map(d=>`<article class="doc-card"><div class="doc-icon">${esc(d.type||"FILE")}</div><h3>${esc(d.name)}</h3><p>${formatDate(d.date)} · ${esc(d.size||"Stored locally")}</p></article>`).join(""):`<div class="empty">No documents uploaded yet.</div>`}</div>
    <div class="panel" style="margin-top:15px"><p style="color:var(--muted);font-size:11px;margin:0">This free GitHub Pages version stores selected document data in the browser. Do not use it as a secure medical-record repository until a private backend and encrypted storage are added.</p></div>`;
}
function communityHTML() {
  const posts=state.community;
  return `<div class="community-hero"><span class="eyebrow" style="color:#b9d8cd">ANONYMIZED EXPERIENCES</span><h1>Learn from real pet experiences.</h1><p>Community posts are personal experiences, not diagnoses or veterinary advice. In this static version, publishing and search happen locally in your browser.</p><div class="search-box"><input id="community-search" placeholder="Search travel, vomiting, food, grooming..."><button class="btn btn-dark" style="background:#fff;color:var(--ink)" data-action="search-community">Search</button></div></div>
    <div id="community-results" class="grid-2">${posts.map(postCard).join("")}</div>`;
}
function postCard(x) {
  return `<article class="post-card"><span class="tag">${esc(x.species)} · ${esc(x.breed)}</span><h3 style="margin-top:14px">${esc(x.title)}</h3><p>${esc(x.body)}</p><div class="post-footer"><span>${esc(x.tags.join(" · "))}</span><span>${formatDate(x.date)}</span></div></article>`;
}

function bindViewEvents() {
  document.querySelectorAll("[data-view]").forEach(el=>el.onclick=e=>{e.preventDefault();setView(el.dataset.view);});
  document.querySelectorAll("[data-action]").forEach(el=>el.onclick=()=>handleAction(el.dataset.action,el.dataset));
  const search=document.getElementById("community-search");
  if(search) search.oninput=()=>filterCommunity(search.value);
}
function filterCommunity(q) {
  const term=q.toLowerCase();
  const found=state.community.filter(x=>(x.title+" "+x.body+" "+x.tags.join(" ")+" "+x.breed).toLowerCase().includes(term));
  document.getElementById("community-results").innerHTML=found.length?found.map(postCard).join(""):'<div class="empty">No matching experiences found.</div>';
}
function handleAction(action,data) {
  if(action==="enter-app"||action==="demo-app") enterApp(true);
  if(action==="open-menu") document.querySelector(".sidebar").classList.add("open");
  if(action==="close-menu") document.querySelector(".sidebar").classList.remove("open");
  if(action==="reset-demo"){ if(confirm("Reset all local data to the demo?")){state=structuredClone(demo);save();currentPetId=state.pets[0].id;renderShell();showToast("Demo data restored");}}
  if(action==="add-pet") openPetModal();
  if(action==="select-pet"){currentPetId=data.id;setView("dashboard");}
  if(action==="add-record") openRecordModal();
  if(action==="add-care") openCareModal();
  if(action==="add-incident") openIncidentModal();
  if(action==="edit-incident") openIncidentModal(data.id);
  if(action==="add-weight") openWeightModal();
  if(action==="complete-care") completeCare(data.id);
  if(action==="delete-care") deleteCare(data.id);
  if(action==="publish-incident") publishIncident(data.id);
  if(action==="upload-document") openDocumentModal();
  if(action==="open-ai") openAIModal();
  if(action==="show-notifications") showNotifications();
}
function openModal(title,body) {
  const root=document.getElementById("modal-root");
  root.innerHTML=`<div class="modal-backdrop" data-close-modal><div class="modal"><div class="modal-head"><h2>${title}</h2><button class="icon-btn" data-close>×</button></div><div class="modal-body">${body}</div></div></div>`;
  root.querySelector("[data-close]").onclick=closeModal;
  root.querySelector(".modal-backdrop").onclick=e=>{if(e.target.classList.contains("modal-backdrop"))closeModal();};
}
function closeModal(){document.getElementById("modal-root").innerHTML="";}
function openPetModal() {
  openModal("Create a pet profile",`<form id="pet-form"><div class="form-grid">
    <div class="form-group"><label>Name</label><input name="name" required></div>
    <div class="form-group"><label>Species</label><select name="species"><option>Dog</option><option>Cat</option><option>Other</option></select></div>
    <div class="form-group"><label>Breed</label><input name="breed"></div>
    <div class="form-group"><label>Sex</label><select name="sex"><option>Unknown</option><option>Male</option><option>Female</option></select></div>
    <div class="form-group"><label>Date of birth</label><input type="date" name="dob"></div>
    <div class="form-group"><label>Weight (kg)</label><input type="number" step=".1" name="weight"></div>
    <div class="form-group full"><label>About</label><textarea name="about"></textarea></div>
    <div class="form-group full"><label>Photo</label><input type="file" name="photo" accept="image/*"></div>
    </div><div class="modal-actions"><button type="button" class="btn btn-light" data-cancel>Cancel</button><button class="btn btn-dark">Create pet</button></div></form>`);
  document.querySelector("[data-cancel]").onclick=closeModal;
  document.getElementById("pet-form").onsubmit=async e=>{
    e.preventDefault(); const f=new FormData(e.target), photo=await fileData(f.get("photo"));
    const p={id:uid("p"),name:f.get("name"),species:f.get("species"),breed:f.get("breed"),sex:f.get("sex"),dob:f.get("dob"),weight:Number(f.get("weight")||0),colour:"",about:f.get("about"),photo};
    state.pets.push(p);currentPetId=p.id;save();closeModal();renderShell();showToast(`${p.name} added`);
  };
}
function openRecordModal() {
  openModal("Add health record",`<form id="record-form"><div class="form-grid">
    <div class="form-group"><label>Type</label><select name="type"><option>Vaccination</option><option>Deworming</option><option>Flea/Tick</option><option>Medication</option><option>Vet visit</option><option>Allergy</option><option>Medical condition</option><option>Surgery</option><option>Grooming</option><option>Other</option></select></div>
    <div class="form-group"><label>Title</label><input name="title" required></div>
    <div class="form-group"><label>Date</label><input type="date" name="date" value="${new Date().toISOString().slice(0,10)}" required></div>
    <div class="form-group"><label>Next due date</label><input type="date" name="next"></div>
    <div class="form-group"><label>Veterinarian</label><input name="vet"></div>
    <div class="form-group"><label>Clinic</label><input name="clinic"></div>
    <div class="form-group full"><label>Notes</label><textarea name="notes"></textarea></div>
    </div><div class="modal-actions"><button type="button" class="btn btn-light" data-cancel>Cancel</button><button class="btn btn-dark">Save record</button></div></form>`);
  document.querySelector("[data-cancel]").onclick=closeModal;
  document.getElementById("record-form").onsubmit=e=>{
    e.preventDefault();const f=new FormData(e.target), r={id:uid("h"),petId:currentPetId,type:f.get("type"),title:f.get("title"),date:f.get("date"),next:f.get("next"),vet:f.get("vet"),clinic:f.get("clinic"),notes:f.get("notes")};
    state.health.push(r);
    if(r.next) state.schedules.push({id:uid("s"),petId:currentPetId,title:r.title,last:r.date,interval:null,next:r.next,active:true});
    save();closeModal();renderShell();showToast("Health record saved");
  };
}
function openCareModal() {
  openModal("Create care schedule",`<form id="care-form"><div class="form-grid">
    <div class="form-group full"><label>Care item</label><input name="title" placeholder="Deworming, grooming, bath..." required></div>
    <div class="form-group"><label>Last completed</label><input type="date" name="last" value="${new Date().toISOString().slice(0,10)}"></div>
    <div class="form-group"><label>Repeat interval (days)</label><input type="number" name="interval" min="1" placeholder="90"></div>
    <div class="form-group full"><label>Next due date</label><input type="date" name="next" required></div>
    <div class="form-group full"><label>Note</label><textarea name="note" placeholder="Use the schedule recommended for this pet by the veterinarian."></textarea></div>
    </div><div class="modal-actions"><button type="button" class="btn btn-light" data-cancel>Cancel</button><button class="btn btn-dark">Create schedule</button></div></form>`);
  document.querySelector("[data-cancel]").onclick=closeModal;
  document.getElementById("care-form").onsubmit=e=>{
    e.preventDefault();const f=new FormData(e.target);
    state.schedules.push({id:uid("s"),petId:currentPetId,title:f.get("title"),last:f.get("last"),interval:f.get("interval")?Number(f.get("interval")):null,next:f.get("next"),active:true});
    save();closeModal();renderShell();showToast("Reminder added");
  };
}
function openIncidentModal(id=null) {
  const old=id?state.incidents.find(x=>x.id===id):null;
  openModal(old?"Edit incident":"Add health incident",`<form id="incident-form"><div class="form-grid">
    <div class="form-group full"><label>Incident title</label><input name="title" value="${esc(old?.title||"")}" required></div>
    <div class="form-group"><label>Date</label><input type="date" name="date" value="${old?.date||new Date().toISOString().slice(0,10)}"></div>
    <div class="form-group"><label>Vet consulted?</label><select name="vet"><option ${old?.vet==="No"?"selected":""}>No</option><option ${old?.vet==="Yes"?"selected":""}>Yes</option><option ${old?.vet==="Not sure"?"selected":""}>Not sure</option></select></div>
    <div class="form-group full"><label>Symptoms</label><textarea name="symptoms">${esc(old?.symptoms||"")}</textarea></div>
    <div class="form-group full"><label>Situation / possible trigger</label><textarea name="trigger">${esc(old?.trigger||"")}</textarea></div>
    <div class="form-group full"><label>Treatment / actions</label><textarea name="treatment">${esc(old?.treatment||"")}</textarea></div>
    <div class="form-group full"><label>Outcome</label><textarea name="outcome">${esc(old?.outcome||"")}</textarea></div>
    <div class="form-group full"><label>Notes</label><textarea name="notes">${esc(old?.notes||"")}</textarea></div>
    </div><div class="modal-actions"><button type="button" class="btn btn-light" data-cancel>Cancel</button><button class="btn btn-dark">Save incident</button></div></form>`);
  document.querySelector("[data-cancel]").onclick=closeModal;
  document.getElementById("incident-form").onsubmit=e=>{
    e.preventDefault();const f=new FormData(e.target), obj={id:id||uid("i"),petId:currentPetId,title:f.get("title"),date:f.get("date"),symptoms:f.get("symptoms"),trigger:f.get("trigger"),vet:f.get("vet"),treatment:f.get("treatment"),outcome:f.get("outcome"),notes:f.get("notes"),published:old?.published||false};
    if(old) Object.assign(old,obj); else state.incidents.push(obj);
    save();closeModal();renderShell();showToast("Incident saved");
  };
}
function openWeightModal() {
  openModal("Add weight measurement",`<form id="weight-form"><div class="form-grid"><div class="form-group"><label>Weight (kg)</label><input type="number" step=".1" min=".1" name="weight" value="${pet().weight||""}" required></div><div class="form-group"><label>Date</label><input type="date" name="date" value="${new Date().toISOString().slice(0,10)}"></div></div><div class="modal-actions"><button type="button" class="btn btn-light" data-cancel>Cancel</button><button class="btn btn-dark">Save measurement</button></div></form>`);
  document.querySelector("[data-cancel]").onclick=closeModal;
  document.getElementById("weight-form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),w=Number(f.get("weight"));state.weights.push({id:uid("w"),petId:currentPetId,date:f.get("date"),weight:w});pet().weight=w;save();closeModal();renderShell();showToast("Weight recorded");};
}
async function fileData(file) {
  if(!file || !file.size) return "";
  if(file.size > 1.5*1024*1024) { showToast("Photo is too large for local storage"); return ""; }
  return new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(file);});
}
function openDocumentModal() {
  openModal("Upload document",`<form id="doc-form"><div class="form-grid"><div class="form-group full"><label>File</label><input type="file" name="file" accept=".pdf,.png,.jpg,.jpeg" required></div><div class="form-group full"><label>Note</label><textarea name="note" placeholder="Vaccination certificate, prescription, report..."></textarea></div></div><div class="modal-actions"><button type="button" class="btn btn-light" data-cancel>Cancel</button><button class="btn btn-dark">Save document</button></div></form><p style="color:var(--muted);font-size:10px;margin-top:14px">For this free static version, small files are stored in browser local storage. Use a private backend for real medical documents.</p>`);
  document.querySelector("[data-cancel]").onclick=closeModal;
  document.getElementById("doc-form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),file=f.get("file");if(file.size>900000){showToast("Keep demo files under 900 KB");return;}const data=await fileData(file);state.documents.push({id:uid("d"),petId:currentPetId,name:file.name,type:file.name.split(".").pop().toUpperCase(),date:new Date().toISOString().slice(0,10),size:`${Math.round(file.size/1024)} KB`,data,note:f.get("note")});save();closeModal();renderShell();showToast("Document saved locally");};
}
function completeCare(id) {
  const s=state.schedules.find(x=>x.id===id);if(!s)return;
  const today=new Date().toISOString().slice(0,10);s.last=today;
  if(s.interval) { const d=new Date(today+"T00:00:00");d.setDate(d.getDate()+Number(s.interval));s.next=d.toISOString().slice(0,10); }
  else { s.active=false; }
  save();renderShell();showToast(s.active?`Next due ${formatDate(s.next)}`:"Care item completed");
}
function deleteCare(id){state.schedules=state.schedules.filter(x=>x.id!==id);save();renderShell();showToast("Schedule removed");}
function publishIncident(id) {
  const i=state.incidents.find(x=>x.id===id);if(!i)return;
  i.published=true;
  state.community.unshift({id:uid("c"),title:i.title,species:pet().species,breed:pet().breed||"Not specified",age:ageOf(pet().dob),tags:(i.symptoms||"pet experience").split(",").map(x=>x.trim()).filter(Boolean).slice(0,3),body:`An anonymized owner experience. Symptoms: ${i.symptoms||"Not recorded"}. Situation: ${i.trigger||"Not recorded"}. Outcome: ${i.outcome||"Not recorded"}.`,date:i.date});
  save();renderShell();showToast("Incident shared anonymously in this browser");
}
function showNotifications() {
  const rows=petSchedules().filter(s=>{const n=daysUntil(s.next);return n!==null&&n<=30;}).sort((a,b)=>a.next.localeCompare(b.next));
  openModal("Upcoming notifications",rows.length?`<div class="care-list">${rows.map(careRow).join("")}</div><p style="color:var(--muted);font-size:10px;margin-top:16px">Browser-only version: reminders are displayed when you open the site. Background push/email notifications require a backend service.</p>`:`<div class="empty">No care reminders within the next 30 days.</div>`);
}
function aiAnswer(q) {
  const text=q.toLowerCase(), p=pet(), schedules=petSchedules(), incidents=petIncidents(), weights=petWeights();
  if(text.includes("next")&&(text.includes("deworm")||text.includes("worm"))) {
    const s=schedules.find(x=>x.title.toLowerCase().includes("deworm"));
    return s?`${p.name}'s recorded next deworming date is ${formatDate(s.next)}. The stored schedule is ${s.interval?`every ${s.interval} days`:"a manually entered date"}.`:`I don't see a deworming schedule for ${p.name}.`;
  }
  if(text.includes("vaccin")) {
    const v=petHealth().filter(x=>x.type==="Vaccination").sort((a,b)=>b.date.localeCompare(a.date))[0];
    return v?`The latest recorded vaccination is ${formatDate(v.date)}${v.next?`, with the next recorded date on ${formatDate(v.next)}`:""}.`:`There is no vaccination record yet.`;
  }
  if(text.includes("incident")||text.includes("happen")) return `${p.name} has ${incidents.length} recorded health incident${incidents.length===1?"":"s"}. The latest is ${incidents[0]?`"${incidents[0].title}" on ${formatDate(incidents[0].date)}`:"not available"}.`;
  if(text.includes("weight")) return weights.length?`${p.name}'s recorded weight changed from ${weights[0].weight} kg on ${formatDate(weights[0].date)} to ${weights.at(-1).weight} kg on ${formatDate(weights.at(-1).date)}.`:`There are no weight measurements yet.`;
  if(text.includes("due")||text.includes("reminder")) {
    const s=schedules.filter(x=>daysUntil(x.next)>=0).sort((a,b)=>a.next.localeCompare(b.next)).slice(0,3);
    return s.length?`The next recorded care items are ${s.map(x=>`${x.title} on ${formatDate(x.next)}`).join(", ")}.`:"There are no future care dates recorded.";
  }
  return `I can search ${p.name}'s stored records for vaccinations, deworming, incidents, weight and upcoming care. I only use the information saved in this browser. I do not diagnose pets or replace veterinary advice.`;
}
function openAIModal() {
  openModal("PetCare AI",`<div class="ai-chat"><div class="ai-messages" id="ai-messages"><div class="chat-bubble ai">Hi. I can search ${esc(pet().name)}'s stored records. Try: “When is the next deworming?”, “Show vaccination history”, “What incidents are recorded?”, or “How has weight changed?”</div></div><form class="ai-input" id="ai-form"><input id="ai-question" placeholder="Ask about your pet's records..." autocomplete="off"><button class="btn btn-dark">Send</button></form></div>`);
  document.getElementById("ai-form").onsubmit=e=>{e.preventDefault();const input=document.getElementById("ai-question"),q=input.value.trim();if(!q)return;const box=document.getElementById("ai-messages");box.innerHTML+=`<div class="chat-bubble user">${esc(q)}</div><div class="chat-bubble ai">${esc(aiAnswer(q))}</div>`;input.value="";box.scrollTop=box.scrollHeight;};
}
document.addEventListener("click",e=>{
  const view=e.target.closest("[data-view]"); if(view && !view.closest(".side-nav")) { e.preventDefault(); setView(view.dataset.view); }
});
document.querySelectorAll("[data-action]").forEach(el=>el.addEventListener("click",()=>handleAction(el.dataset.action,el.dataset)));
