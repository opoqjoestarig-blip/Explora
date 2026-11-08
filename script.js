/* EKSPLORA — alur akun dan penyimpanan data lokal. */
const $ = id => document.getElementById(id);
const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const uid = prefix => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const navMenu = $("navMenu");
$("year").textContent = new Date().getFullYear();
$("menuToggle").addEventListener("click", () => navMenu.classList.toggle("open"));
navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMenu.classList.remove("open")));

const accounts = [];
for (let i=1;i<=5;i++) accounts.push({username:`siswa${i}`,password:`siswa${i}`,role:"Siswa",org:"",name:`Siswa ${i}`,kelas:`${i}A`});
accounts.push({username:"kepsek",password:"kepsek",role:"Kepala Sekolah",org:"Sekolah",name:"Kepala Sekolah"});
accounts.push({username:"wakasek",password:"wakasek",role:"Wakasek Kesiswaan",org:"Sekolah",name:"Wakasek Kesiswaan"});
for (let i=1;i<=3;i++) accounts.push({username:`pembina${i}`,password:`pembina${i}`,role:"Guru Pembina",org:"Sekolah",name:`Guru Pembina ${i}`,coachOrgs:[["Pramuka"],["PMR"],["Paskibra","Basket","Seni Tari","Bola Voli"]][i-1]});
accounts.push({username:"operator",password:"operator",role:"Operator Sekolah",org:"Sekolah",name:"Operator Sekolah"});
for (let i=1;i<=5;i++) accounts.push({username:`orangtua${i}`,password:`orangtua${i}`,role:"Orang Tua",org:"",name:`Orang Tua ${i}`});
let accountNames = {};
try { accountNames = JSON.parse(localStorage.getItem("eksploraAccountNames")) || {}; } catch(e) { accountNames = {}; }
accounts.forEach(a => { if (accountNames[a.username]) a.name = accountNames[a.username]; });
let customAccounts=[];try{customAccounts=JSON.parse(localStorage.getItem("eksploraCustomAccounts")||"[]");}catch(e){customAccounts=[];}customAccounts.forEach(a=>{if(a?.username&&!accounts.some(x=>x.username===a.username))accounts.push({...a,custom:true});});

const defaultData = {
 version:5,
 orgs:[
  {id:"org_pramuka",name:"Pramuka",category:"Kepemimpinan",description:"Melatih kemandirian, kerja sama, dan kepemimpinan melalui kegiatan kepramukaan.",quota:40,coach:"Pembina Pramuka",schedule:"Sabtu, 15.30 WITA",location:"Lapangan sekolah",active:true,registrationOpen:true},
  {id:"org_pmr",name:"PMR",category:"Kemanusiaan",description:"Belajar kepedulian, kesehatan, dan pertolongan pertama dasar.",quota:30,coach:"Pembina PMR",schedule:"Jumat, 14.00 WITA",location:"Ruang UKS",active:true,registrationOpen:true},
  {id:"org_paskibra",name:"Paskibra",category:"Kedisiplinan",description:"Membangun disiplin, kekompakan, dan tanggung jawab.",quota:30,coach:"Pembina Paskibra",schedule:"Rabu, 15.00 WITA",location:"Lapangan sekolah",active:true,registrationOpen:false},
  {id:"org_basket",name:"Basket",category:"Olahraga",description:"Mengembangkan keterampilan, strategi, dan sportivitas.",quota:24,coach:"Pembina Basket",schedule:"Selasa, 15.30 WITA",location:"Lapangan basket",active:true,registrationOpen:true},
  {id:"org_tari",name:"Seni Tari",category:"Seni & Budaya",description:"Mengekspresikan kreativitas dan mengenal budaya.",quota:25,coach:"Pembina Seni Tari",schedule:"Kamis, 15.00 WITA",location:"Aula sekolah",active:true,registrationOpen:true},
  {id:"org_voli",name:"Bola Voli",category:"Olahraga",description:"Melatih teknik bermain, komunikasi, dan kerja sama tim.",quota:24,coach:"Pembina Bola Voli",schedule:"Senin, 15.30 WITA",location:"Lapangan voli",active:true,registrationOpen:true}
 ],
 members:[
  {id:"mem_siswa01_pramuka",name:"Siswa 1",username:"siswa1",kelas:"1A",org:"Pramuka",status:"Diterima",active:true,date:today()},
  {id:"mem_siswa02_pramuka",name:"Siswa 2",username:"siswa2",kelas:"2A",org:"Pramuka",status:"Diterima",active:true,date:today()}
 ],
 registrations:[],announcements:[{id:"ann_welcome",title:"Selamat datang di EKSPLORA",category:"Informasi umum",message:"Jelajahi ekstrakurikuler, periksa jadwal, dan pantau pengumuman terbaru di sini.",org:"Semua siswa",date:today(),active:true}],
 documentation:[],attendance:[],events:[],evaluations:[],reports:[],decisions:[],coaches:[],settings:{schoolName:"SMAN 1 ATHERION",schoolYear:"2026/2027"}
};
function normalizeData(raw){
 const d = raw && typeof raw === "object" ? raw : structuredClone(defaultData);
 d.orgs = Array.isArray(d.orgs) ? d.orgs : structuredClone(defaultData.orgs);
 d.orgs.forEach((o,i)=>{o.id ||= `org_migrasi_${i}_${String(o.name||"ekskul").toLowerCase().replace(/[^a-z0-9]+/g,"_")}`;o.description ||= `Informasi kegiatan ${o.name||"ekstrakurikuler"}.`;o.category ||= "Umum";o.coach ||= "Belum ditentukan";o.schedule ||= "Belum ditentukan";o.location ||= "Belum ditentukan";o.quota = Number(o.quota)||30;o.active = o.active !== false;o.registrationOpen = o.registrationOpen !== false;});
 d.members = Array.isArray(d.members) ? d.members : [];
 d.members.forEach((m,i)=>{m.id ||= `mem_migrasi_${i}_${m.username||"siswa"}_${String(m.org||"").replace(/\W/g,"")}`;m.active = m.active !== false && m.status !== "Nonaktif";m.status ||= "Diterima";});
 d.registrations = Array.isArray(d.registrations) ? d.registrations : [];
 d.registrations.forEach((r,i)=>{r.id ||= `reg_migrasi_${i}_${r.username||"siswa"}_${String(r.org||"").replace(/\W/g,"")}`;if(r.status==="Menunggu")r.status="Menunggu Verifikasi";if(!["Menunggu Verifikasi","Sedang Diproses","Diterima","Ditolak","Dibatalkan"].includes(r.status))r.status="Menunggu Verifikasi";r.date ||= today();});
 d.announcements = Array.isArray(d.announcements) ? d.announcements : [];
 d.announcements.forEach((n,i)=>{n.id ||= `ann_migrasi_${i}`;n.date ||= today();n.active = n.active !== false;if(!n.org || n.org==="Semua organisasi")n.org="Semua siswa";n.category ||= "Informasi umum";});
 d.documentation = Array.isArray(d.documentation)?d.documentation:[];d.attendance=Array.isArray(d.attendance)?d.attendance:[];d.events=Array.isArray(d.events)?d.events:[];d.evaluations=Array.isArray(d.evaluations)?d.evaluations:[];d.reports=Array.isArray(d.reports)?d.reports:[];d.decisions=Array.isArray(d.decisions)?d.decisions:[];d.coaches=Array.isArray(d.coaches)?d.coaches:[];d.settings ||= {schoolName:"SMAN 1 ATHERION",schoolYear:"2026/2027"};if(!d.settings.schoolName || d.settings.schoolName==="Sekolah") d.settings.schoolName="SMAN 1 ATHERION";d.version=6;return d;
}
function loadData(){try{const raw=localStorage.getItem("eksploraData");return raw?normalizeData(JSON.parse(raw)):structuredClone(defaultData)}catch(e){return structuredClone(defaultData)}}
let data = loadData(), currentUser = null, currentTab = "Dashboard", editingOrgId = null, selectedRole = null;
if(!data.coaches.length){data.coaches=accounts.filter(a=>a.role==="Guru Pembina").map(a=>({id:uid("coach"),name:a.name,username:a.username,orgs:(a.coachOrgs||[]).join(", "),phone:""}));save();}
function save(){try{localStorage.setItem("eksploraData",JSON.stringify(data));}catch(e){alert("Penyimpanan browser penuh atau tidak tersedia.")} updateSchoolNameDisplay()}
function updateSchoolNameDisplay(){const name=data?.settings?.schoolName||"SMAN 1 ATHERION";const publicName=$("schoolNameDisplay"),loginName=$("loginSchoolName");if(publicName)publicName.textContent=name;if(loginName)loginName.textContent=name;document.title=`EKSPLORA — ${name}`;}
function activeOrgs(){return data.orgs.filter(o=>o.active)}
function getOrg(name){return data.orgs.find(o=>o.name===name)}
function studentMemberships(username){return data.members.filter(m=>m.username===username&&m.active&&m.status==="Diterima"&&getOrg(m.org)?.active)}
function isMember(username,org){return studentMemberships(username).some(m=>m.org===org)}
function isStudent(){return currentUser?.role==="Siswa"}
function isOperator(){return currentUser?.role==="Operator Sekolah"}
function statusClass(s){if(s==="Diterima"||s==="Aktif")return "ok";if(s==="Ditolak")return "no";if(s==="Dibatalkan"||s==="Nonaktif")return "cancel";return "wait"}
function statusPill(s){return `<span class="status ${statusClass(s)}">${esc(s)}</span>`}
function activeApplications(username,org){return data.registrations.filter(r=>r.username===username&&r.org===org&&["Menunggu Verifikasi","Sedang Diproses","Diterima"].includes(r.status))}
function announcementVisible(n){if(!n.active)return false;if(n.org==="Semua siswa"||n.org==="Semua organisasi")return true;return isStudent() ? isMember(currentUser.username,n.org) : true}
function announcementList(){const list=data.announcements.filter(announcementVisible).sort((a,b)=>b.date.localeCompare(a.date));return `<div class="announcement-list">${list.map(n=>`<article><span class="announcement-mark">✦</span><div><b>${esc(n.title)}</b><p>${esc(n.message)}</p><small>${esc(n.category)} · ${esc(n.org)} · ${esc(n.date)}</small></div></article>`).join("")||'<p class="muted">Belum ada pengumuman yang dapat ditampilkan.</p>'}</div>`}
function scheduleTable(orgs,showMembers=false){return `<div class="table-wrap"><table><thead><tr><th>Ekstrakurikuler</th><th>Jadwal</th><th>Lokasi</th>${showMembers?"<th>Anggota/Kuota</th>":""}</tr></thead><tbody>${orgs.map(o=>`<tr><td><b>${esc(o.name)}</b><small>${esc(o.coach)}</small></td><td>${esc(o.schedule)}</td><td>${esc(o.location)}</td>${showMembers?`<td>${data.members.filter(m=>m.org===o.name&&m.active&&m.status==="Diterima").length}/${o.quota}</td>`:""}</tr>`).join("")||`<tr><td colspan="${showMembers?4:3}">Belum ada data ekstrakurikuler.</td></tr>`}</tbody></table></div>`}
function getAspirations(){try{const items=JSON.parse(localStorage.getItem("eksploraAspirations")||"[]");return Array.isArray(items)?items:[]}catch(e){return []}}
function aspirationRecipients(){return accounts.filter(a=>["Kepala Sekolah","Wakasek Kesiswaan","Guru Pembina","Operator Sekolah"].includes(a.role))}
function aspirationComposer(){const recipients=aspirationRecipients();return `<form id="aspirationForm" class="inline-form"><label class="form-wide">Kepada<select name="recipientUsername" required><option value="">Pilih penerima aspirasi</option><option value="all">Semua pihak sekolah</option>${recipients.map(a=>`<option value="${esc(a.username)}">${esc(a.name)} — ${esc(a.role)}</option>`).join("")}</select></label><label>Kategori<select name="category"><option>Saran</option><option>Kritik</option><option>Pertanyaan</option><option>Lainnya</option></select></label><label class="form-wide">Isi aspirasi<textarea name="message" required minlength="5" placeholder="Tuliskan aspirasi atau masukan"></textarea></label><button class="btn primary">Kirim Aspirasi</button></form>`}
function aspirationInbox(){const items=getAspirations().filter(a=>!a.recipientUsername||a.recipientUsername==="all"||a.recipientUsername===currentUser?.username).sort((a,b)=>(b.date||"").localeCompare(a.date||""));return `<div class="table-wrap"><table><thead><tr><th>Pengirim</th><th>Kepada</th><th>Tanggal</th><th>Kategori</th><th>Isi Aspirasi</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${items.map(a=>`<tr><td>${esc(a.sender)}<small>${esc(a.role||"")}</small></td><td>${esc(a.recipientName||"Pihak sekolah (pesan lama)")}</td><td>${esc(a.date||"—")}</td><td>${esc(a.category||"—")}</td><td>${esc(a.message||"")}</td><td>${a.read?"Telah Dibaca":"Belum Dibaca"}</td><td><div class="table-actions"><button class="table-action" data-mark-asp="${esc(a.id)}">Tandai dibaca</button><button class="table-action danger" data-delete-asp="${esc(a.id)}">Hapus</button></div></td></tr>`).join("")||'<tr><td colspan="7">Belum ada aspirasi yang ditujukan kepada akun ini.</td></tr>'}</tbody></table></div>`}
function coachOrgNames(){const assigned=currentUser?.coachOrgs||[];if(assigned.length)return assigned;const coach=data.coaches.find(c=>c.username===currentUser?.username);return coach?String(coach.orgs||"").split(",").map(x=>x.trim()).filter(Boolean):[]}
function renderActivityHistory(){const isStudentAccount=currentUser?.role==="Siswa",allowedOrgs=isStudentAccount?data.members.filter(m=>m.username===currentUser.username).map(m=>m.org):coachOrgNames();const history=data.events.filter(e=>e.date&&e.date<today()&&allowedOrgs.includes(e.org)).sort((a,b)=>b.date.localeCompare(a.date));const rows=history.map(e=>{const attendance=data.attendance.filter(a=>a.org===e.org&&a.date===e.date);const mine=attendance.find(a=>a.username===currentUser.username);const attendanceLabel=isStudentAccount?(mine?.status||"Belum dicatat"):`Hadir ${attendance.filter(a=>a.status==="Hadir").length} · Izin ${attendance.filter(a=>a.status==="Izin").length} · Sakit ${attendance.filter(a=>a.status==="Sakit").length} · Alpa ${attendance.filter(a=>a.status==="Alpa").length}`;const docs=data.documentation.filter(d=>d.org===e.org&&d.date===e.date);const docLinks=docs.map(d=>/^https?:\/\//i.test(d.url||"")?`<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.title||"Lihat dokumentasi")}</a>`:esc(d.title||"Dokumentasi tersedia")).join(", ")||"—";return `<tr><td><b>${esc(e.title||"Kegiatan Ekstrakurikuler")}</b><small>${esc(e.description||"")}</small></td><td>${esc(e.org)}</td><td>${esc(e.date)}</td><td>${esc(e.time||"—")}</td><td>${esc(e.location||"—")}</td><td>${esc(attendanceLabel)}</td><td>${docLinks}</td></tr>`}).join("");return `<div class="help-note">Riwayat dibuat otomatis dari Jadwal dan Agenda. Kegiatan akan muncul sehari setelah tanggal pelaksanaan lewat. Kegiatan hari ini dan yang akan datang tetap berada di jadwal.</div><div class="dash-section-title"><h3>Kegiatan yang telah berlangsung</h3><span>${history.length} kegiatan</span></div><div class="table-wrap"><table><thead><tr><th>Nama Kegiatan</th><th>Ekstrakurikuler</th><th>Tanggal</th><th>Waktu</th><th>Lokasi</th><th>${isStudentAccount?"Kehadiran Saya":"Rekap Kehadiran"}</th><th>Dokumentasi</th></tr></thead><tbody>${rows||'<tr><td colspan="7">Belum ada kegiatan yang masuk riwayat. Kegiatan akan tampil otomatis setelah tanggalnya lewat dan sesuai ekstrakurikuler yang diikuti/diampu.</td></tr>'}</tbody></table></div>`}

function renderPublicExkuls(){const grid=$("ekskulGrid");if(!grid)return;const q=($("searchInput")?.value||"").trim().toLowerCase();const list=activeOrgs().filter(o=>`${o.name} ${o.category} ${o.description} ${o.coach}`.toLowerCase().includes(q));grid.innerHTML=list.map((o,i)=>`<article class="ekskul-card" data-name="${esc((o.name+" "+o.category).toLowerCase())}"><div class="ekskul-banner ${["banner-blue","banner-red","banner-purple","banner-orange","banner-pink","banner-green"][i%6]}">${["⚑","♡","✦","◉","✿","◈"][i%6]}</div><div class="ekskul-body"><span class="category">${esc(o.category.toUpperCase())}</span><h3>${esc(o.name)}</h3><p>${esc(o.description)}</p><span class="ekskul-foot">${o.registrationOpen?"Pendaftaran dibuka":"Pendaftaran ditutup"}<b>↗</b></span></div></article>`).join("");$("emptyState").hidden=list.length!==0}
$("searchInput").addEventListener("input",renderPublicExkuls);

function openModal(role){selectedRole=role||null;$("modalBackdrop").hidden=false;$("loginFields").hidden=false;$("appDashboard").hidden=true;$("modalTitle").textContent=role?`Masuk sebagai ${role}`:"Masuk ke EKSPLORA";$("modalDescription").textContent="Masukkan akun untuk melanjutkan.";$("loginUsername").value="";$("loginPassword").value="";$("loginError").textContent="";$("accountList").hidden=true;$("loginUsername").focus()}
document.querySelectorAll(".role-card").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.role)));
document.querySelectorAll('a[href="#akses"]').forEach(a=>a.addEventListener("click",()=>{}));
function closeModal(){$("modalBackdrop").hidden=true}
$("modalClose").addEventListener("click",closeModal);
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("showAccounts").addEventListener("click",()=>{const box=$("accountList");box.hidden=!box.hidden;if(!box.hidden)box.innerHTML=`<b>Akun tersedia</b><p>Pilih salah satu akun yang tersedia di bawah.</p><div class="account-scroll">${accounts.filter(a=>!selectedRole||a.role===selectedRole).map(a=>`<div class="account-line"><span><b>${esc(a.username)}</b><small>${esc(a.role)} · ${esc(a.name)}</small></span><button data-user="${esc(a.username)}" class="use-account">Pilih</button></div>`).join("")}</div>`;box.querySelectorAll(".use-account").forEach(btn=>btn.addEventListener("click",()=>{const a=accounts.find(x=>x.username===btn.dataset.user);$("loginUsername").value=a.username;$("loginPassword").value=a.password;$("loginError").textContent=""}))});
$("loginButton").addEventListener("click",login);$("loginPassword").addEventListener("keydown",e=>{if(e.key==="Enter")login()});$("loginUsername").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
function login(){const u=$("loginUsername").value.trim(),p=$("loginPassword").value,a=accounts.find(x=>x.username===u&&x.password===p&&(!selectedRole||x.role===selectedRole));if(!a){$("loginError").textContent="Username atau kata sandi tidak sesuai. Silakan pilih akun.";return}currentUser={...a};$("loginFields").hidden=true;$("appDashboard").hidden=false;$("modalTitle").textContent="Dashboard EKSPLORA";$("modalDescription").textContent="Kelola kegiatan ekstrakurikuler sesuai peran akun.";$("welcomeUser").textContent=`Halo, ${a.name}!`;$("userRoleLabel").textContent=`${a.role}${a.role==="Siswa"?"":" · Sekolah"}`;renderDashboard("Dashboard")}
$("switchAccount").addEventListener("click",()=>{currentUser=null;openModal()});
function renderDashboard(tab){
 currentTab=tab;
 const student=isStudent(),operator=isOperator(), parent=currentUser?.role==="Orang Tua";
 const roleTabs={
  "Siswa":["Dashboard","Eksplorasi Ekstrakurikuler","Aktivitas Saya","Presensi Saya","Riwayat Kegiatan","Informasi dan Aspirasi","Profil Saya"],
  "Kepala Sekolah":["Dashboard","Monitoring Ekstrakurikuler","Monitoring Siswa dan Keanggotaan","Data Guru Pembina","Jadwal dan Presensi","Evaluasi dan Perkembangan","Laporan","Informasi dan Pengumuman","Aspirasi, Arahan dan Keputusan","Profil Saya"],
  "Wakasek Kesiswaan":["Dashboard","Data Ekstrakurikuler","Pendaftaran dan Keanggotaan","Jadwal dan Presensi","Evaluasi dan Perkembangan","Informasi dan Pengumuman","Laporan","Aspirasi dan Masukan","Monitoring Kegiatan","Profil Saya"],
  "Guru Pembina":["Dashboard","Ekstrakurikuler Binaan","Data Anggota","Jadwal dan Agenda","Presensi","Riwayat Kegiatan","Informasi dan Pengumuman","Laporan Kegiatan","Aspirasi dan Masukan","Profil Saya"],
  "Operator Sekolah":["Dashboard","Manajemen Akun","Data Ekstrakurikuler","Data Guru Pembina","Periode Pendaftaran","Informasi dan Pengumuman","Aspirasi dan Masukan","Pengaturan Sistem","Log Aktivitas","Profil Saya"],
  "Orang Tua":["Dashboard","Ekstrakurikuler","Pengumuman","Aspirasi dan Masukan","Profil Saya"]
 };
 const tabs=roleTabs[currentUser?.role]||roleTabs["Siswa"];
 if(!tabs.includes(tab))tab="Dashboard";currentTab=tab;
 $("dashboardNav").innerHTML=tabs.map(t=>`<button class="dash-tab ${t===tab?"active":""}" data-tab="${esc(t)}">${esc(t)}</button>`).join("");
 $("dashboardNav").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>renderDashboard(b.dataset.tab)));
 const content=$("dashboardContent"), allActive=activeOrgs(), myApps=data.registrations.filter(r=>r.username===currentUser.username), myMembers=studentMemberships(currentUser.username), allStudentAccounts=accounts.filter(a=>a.role==="Siswa");
 let html="";
 const crudPage=renderCrudPage(tab);
 if(crudPage){html=crudPage;}
 else if(tab==="Aktivitas Saya"){
  const historical=data.members.filter(m=>m.username===currentUser.username);
  html=`<div class="dash-section-title"><h3>Pendaftaran dan Status</h3></div><div class="table-wrap"><table><thead><tr><th>Ekstrakurikuler</th><th>Tanggal</th><th>Status</th><th>Informasi</th><th>Aksi</th></tr></thead><tbody>${myApps.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr><td>${esc(r.org)}</td><td>${esc(r.date)}</td><td>${statusPill(r.status)}</td><td>${esc(r.reason||"—")}</td><td>${["Menunggu Verifikasi","Sedang Diproses"].includes(r.status)?`<button class="table-action danger" data-cancel="${esc(r.id)}">Batalkan</button>`:"—"}</td></tr>`).join("")||'<tr><td colspan="5">Belum ada pengajuan.</td></tr>'}</tbody></table></div><div class="dash-section-title"><h3>Ekstrakurikuler Saya dan Badge</h3></div><div class="badge-row">${myMembers.map(m=>`<span class="membership-badge">✦ ${esc(m.org)}</span>`).join("")||'<span class="muted">Belum memiliki keanggotaan aktif.</span>'}</div><div class="content-cards">${historical.map(m=>`<article class="content-card"><h4>${esc(m.org)}</h4><p>Status: ${esc(m.active&&m.status==="Diterima"?"Aktif":"Riwayat")}</p></article>`).join("")}</div><div class="dash-section-title"><h3>Jadwal Kegiatan</h3></div>${scheduleTable(allActive.filter(o=>myMembers.some(m=>m.org===o.name)),false)}`;
 } else if(tab==="Riwayat Kegiatan"){
  html=renderActivityHistory();
 } else if(tab==="Informasi dan Aspirasi"){
  const aspirations=getAspirations();
  html=`<div class="dash-section-title"><h3>Informasi dan Pengumuman</h3></div>${announcementList()}<div class="dash-section-title"><h3>Aspirasi dan Masukan</h3></div>${aspirationComposer()}`;
 } else if(tab==="Monitoring Ekstrakurikuler"){
  html=`<div class="dash-section-title"><h3>Monitoring Ekstrakurikuler</h3></div>${scheduleTable(allActive,true)}`;
 } else if(tab==="Monitoring Siswa dan Keanggotaan"){
  html=`<div class="dash-section-title"><h3>Monitoring Siswa dan Keanggotaan</h3></div><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Kelas</th><th>Ekstrakurikuler</th><th>Status</th></tr></thead><tbody>${data.members.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.username)}</td><td>${esc(m.kelas||"-")}</td><td>${esc(m.org)}</td><td>${statusPill(m.active?"Aktif":"Riwayat")}</td></tr>`).join("")||'<tr><td colspan="5">Belum ada data anggota.</td></tr>'}</tbody></table></div>`;
 } else if(tab==="Jadwal dan Presensi"){
  html=`<div class="dash-section-title"><h3>Jadwal Kegiatan</h3></div>${scheduleTable(allActive,true)}<div class="dash-section-title"><h3>Rekap Presensi</h3></div><p class="muted">Rekap presensi akan tampil setelah pencatatan kehadiran diaktifkan.</p>`;
 } else if(tab==="Aspirasi, Arahan dan Keputusan"){
  html=`<div class="dash-section-title"><h3>Aspirasi dan Masukan</h3></div>${aspirationInbox()}<div class="dash-section-title"><h3>Arahan dan Keputusan</h3></div><div class="help-note">Ruang pencatatan arahan dan keputusan Kepala Sekolah.</div>`;
 } else if(tab==="Pendaftaran dan Keanggotaan"){
  html=`<div class="dash-section-title"><h3>Data Pendaftaran</h3></div><div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Ekskul</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>${data.registrations.map(r=>`<tr><td>${esc(r.name)}</td><td>${esc(r.org)}</td><td>${esc(r.date)}</td><td>${statusPill(r.status)}</td></tr>`).join("")||'<tr><td colspan="4">Belum ada pendaftaran.</td></tr>'}</tbody></table></div><div class="dash-section-title"><h3>Keanggotaan</h3></div>${scheduleTable(allActive,true)}`;
 } else if(tab==="Monitoring Kegiatan"){
  html=`<div class="dash-section-title"><h3>Monitoring Kegiatan</h3></div>${scheduleTable(allActive,true)}<div class="help-note">Ringkasan jadwal, lokasi, pembina, dan jumlah anggota setiap ekstrakurikuler.</div>`;
 } else if(tab==="Dashboard"){
  const stats=student?[
   [myMembers.length,"Keanggotaan aktif"],[myApps.filter(r=>["Menunggu Verifikasi","Sedang Diproses"].includes(r.status)).length,"Pendaftaran diproses"],[allActive.length,"Ekstrakurikuler aktif"],[data.announcements.filter(announcementVisible).length,"Pengumuman tersedia"]
  ]:[
   [allStudentAccounts.length,"Total siswa"],[allActive.length,"Ekstrakurikuler aktif"],[data.registrations.filter(r=>r.status==="Menunggu Verifikasi").length,"Menunggu verifikasi"],[data.registrations.filter(r=>r.status==="Sedang Diproses").length,"Sedang diproses"],[data.members.filter(m=>m.active&&m.status==="Diterima"&&getOrg(m.org)?.active).length,"Anggota aktif"],[data.announcements.filter(n=>n.active).length,"Pengumuman aktif"]
  ];
  html=`<div class="mini-stats">${stats.map(s=>`<div><b>${s[0]}</b><span>${esc(s[1])}</span></div>`).join("")}</div>`;
  if(student)html+=`<div class="dash-section-title"><h3>Badge keanggotaan</h3><span>Badge mengikuti data keanggotaan resmi</span></div><div class="badge-row">${myMembers.map(m=>`<span class="membership-badge">✦ ${esc(m.org)}</span>`).join("")||'<span class="muted">Belum ada keanggotaan aktif. Jelajahi ekstrakurikuler untuk mendaftar.</span>'}</div>`;
  html+=`<div class="dash-section-title"><h3>Pengumuman terbaru</h3></div>${announcementList()}`;
  if(operator)html+=`<div class="dash-section-title"><h3>Aksi cepat</h3></div><div class="quick-actions"><button class="quick-btn" data-quick="Data Ekstrakurikuler">+ Tambah Ekstrakurikuler ↗</button><button class="quick-btn" data-quick="Verifikasi dan Penerimaan">Lihat Pendaftaran ↗</button><button class="quick-btn" data-quick="Informasi dan Pengumuman">Buat Pengumuman ↗</button></div>`;
 } else if(tab==="Eksplorasi Ekstrakurikuler"){
  html=`<div class="dash-section-title"><h3>Eksplorasi Ekstrakurikuler</h3><span>Pilih sesuai ketertarikanmu</span></div><div class="help-note">Semua siswa dapat melihat ekstrakurikuler aktif. Tombol pendaftaran hanya tersedia jika pendaftaran dibuka.</div><div class="content-cards">${allActive.map((o,i)=>{const count=data.members.filter(m=>m.org===o.name&&m.active&&m.status==="Diterima").length,apps=activeApplications(currentUser.username,o.name),hasMember=isMember(currentUser.username,o.name);return `<article class="content-card"><span class="category">${esc(o.category.toUpperCase())}</span><h4>${esc(o.name)}</h4><p>${esc(o.description)}</p><p><b>Pembina:</b> ${esc(o.coach)}<br><b>Jadwal:</b> ${esc(o.schedule)}<br><b>Lokasi:</b> ${esc(o.location)}<br><b>Anggota:</b> ${count}${o.quota?`/${o.quota}`:""}</p><div class="badge-row">${o.registrationOpen?'<span class="status ok">Pendaftaran dibuka</span>':'<span class="status wait">Pendaftaran ditutup</span>'}${hasMember?'<span class="membership-badge">Anggota</span>':""}</div>${hasMember?'<button class="btn secondary small-btn" disabled>Sudah menjadi anggota</button>':apps.length?`<button class="btn secondary small-btn" disabled>${esc(apps[apps.length-1].status)}</button>`:o.registrationOpen&&count<o.quota?`<button class="btn primary small-btn" data-register="${esc(o.id)}">Daftar Sekarang</button>`:`<button class="btn secondary small-btn" disabled>${!o.registrationOpen?"Pendaftaran ditutup":"Kuota penuh"}</button>`}</article>`}).join("")||'<p class="muted">Belum ada ekstrakurikuler aktif.</p>'}</div>`;
 } else if(tab==="Pendaftaran"||tab==="Data Pendaftaran"||tab==="Verifikasi dan Penerimaan"){
  if(student){html=`<div class="dash-section-title"><h3>Riwayat Pendaftaran</h3><span>Pantau status pengajuanmu</span></div><div class="table-wrap"><table><thead><tr><th>Ekstrakurikuler</th><th>Tanggal</th><th>Status</th><th>Informasi</th><th>Aksi</th></tr></thead><tbody>${myApps.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr><td>${esc(r.org)}</td><td>${esc(r.date)}</td><td>${statusPill(r.status)}</td><td>${esc(r.reason||"—")}</td><td>${["Menunggu Verifikasi","Sedang Diproses"].includes(r.status)?`<button class="table-action danger" data-cancel="${esc(r.id)}">Batalkan</button>`:"—"}</td></tr>`).join("")||'<tr><td colspan="5">Belum ada pengajuan pendaftaran.</td></tr>'}</tbody></table></div><p class="muted">Pengajuan dapat dibatalkan sebelum keputusan diberikan. Pengajuan yang masih aktif tidak dapat dikirim ulang untuk ekstrakurikuler yang sama.</p>`}
  else {const list=data.registrations.slice().sort((a,b)=>b.date.localeCompare(a.date));html=`<div class="dash-section-title"><h3>${tab==="Data Pendaftaran"?"Data Pendaftaran":"Verifikasi dan Penerimaan"}</h3><span>Kelola status pengajuan siswa</span></div><div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Ekstrakurikuler</th><th>Tanggal</th><th>Status</th><th>Alasan/Catatan</th><th>Aksi</th></tr></thead><tbody>${list.map(r=>`<tr><td>${esc(r.name)}<small>${esc(r.username)}</small></td><td>${esc(r.org)}</td><td>${esc(r.date)}</td><td>${statusPill(r.status)}</td><td>${esc(r.reason||"—")}</td><td><div class="table-actions">${r.status==="Menunggu Verifikasi"?`<button class="table-action" data-process="${esc(r.id)}">Proses</button>`:""}${["Menunggu Verifikasi","Sedang Diproses"].includes(r.status)?`<button class="table-action" data-accept="${esc(r.id)}">Terima</button><button class="table-action danger" data-reject="${esc(r.id)}">Tolak</button>`:"—"}</div></td></tr>`).join("")||'<tr><td colspan="6">Belum ada pengajuan.</td></tr>'}</tbody></table></div><p class="muted">Penerimaan tercatat sebagai keanggotaan resmi dan menghasilkan badge pada akun siswa.</p>`}
 } else if(tab==="Ekstrakurikuler Saya"){
  const historical=data.members.filter(m=>m.username===currentUser.username);
  html=`<div class="dash-section-title"><h3>Ekstrakurikuler Saya</h3><span>Keanggotaan dan badge</span></div><div class="badge-row">${myMembers.map(m=>`<span class="membership-badge">✦ ${esc(m.org)}</span>`).join("")||'<span class="muted">Belum memiliki keanggotaan aktif.</span>'}</div><div class="content-cards">${historical.map(m=>{const o=getOrg(m.org),active=m.active&&m.status==="Diterima"&&o?.active;return `<article class="content-card"><h4>${esc(m.org)}</h4><p>${active?"Keanggotaan aktif":"Riwayat keanggotaan"}</p><div class="badge-row">${active?`<span class="membership-badge">✦ Anggota ${esc(m.org)}</span>`:`<span class="membership-badge history">Riwayat · ${esc(m.org)}</span>`}</div><p>${o?`${esc(o.schedule)} · ${esc(o.location)}`:"Ekstrakurikuler tidak lagi aktif."}</p></article>`}).join("")||'<p class="muted">Keanggotaan akan tampil di sini setelah pengajuan diterima.</p>'}</div>`;
 } else if(tab==="Data Siswa"){
  html=`<div class="dash-section-title"><h3>Data Siswa</h3><span>Daftar akun siswa — hanya untuk dilihat</span></div><div class="help-note">Menu ini bersifat baca-saja. Operator tidak menambah, mengedit, atau menghapus akun siswa dari menu ini.</div><div class="table-wrap"><table><thead><tr><th>Nama Siswa</th><th>Username</th><th>Kelas</th><th>Keanggotaan Aktif</th><th>Status Akun</th></tr></thead><tbody>${allStudentAccounts.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.username)}</td><td>${esc(a.kelas||"Belum diisi")}</td><td>${studentMemberships(a.username).map(m=>esc(m.org)).join(", ")||"Belum menjadi anggota"}</td><td>${statusPill("Aktif")}</td></tr>`).join("")}</tbody></table></div>`;
 } else if(tab==="Data Ekstrakurikuler"){
  const edit=editingOrgId?getOrgById(editingOrgId):null;
  html=`<div class="dash-section-title"><h3>Data Ekstrakurikuler</h3><span>Tambah, ubah, buka/tutup pendaftaran, dan nonaktifkan</span></div><form id="orgForm" class="inline-form"><input type="hidden" name="id" value="${esc(edit?.id||"")}"><label>Nama ekstrakurikuler<input name="name" required value="${esc(edit?.name||"")}" placeholder="Contoh: Jurnalistik"></label><label>Kategori<input name="category" required value="${esc(edit?.category||"")}" placeholder="Contoh: Literasi"></label><label class="form-wide">Deskripsi<textarea name="description" required placeholder="Jelaskan kegiatan dan tujuan ekstrakurikuler">${esc(edit?.description||"")}</textarea></label><label>Guru pembina<input name="coach" required value="${esc(edit?.coach||"")}" placeholder="Nama guru pembina"></label><label>Jadwal kegiatan<input name="schedule" required value="${esc(edit?.schedule||"")}" placeholder="Contoh: Jumat, 15.00 WITA"></label><label>Lokasi<input name="location" required value="${esc(edit?.location||"")}" placeholder="Lokasi kegiatan"></label><label>Kuota anggota<input name="quota" type="number" min="1" required value="${esc(edit?.quota||30)}"></label><label>Status pendaftaran<select name="registrationOpen"><option value="true" ${edit?.registrationOpen!==false?"selected":""}>Dibuka</option><option value="false" ${edit?.registrationOpen===false?"selected":""}>Ditutup</option></select></label><div class="button-row form-wide"><button class="btn primary">${edit?"Simpan Perubahan":"+ Tambah Ekstrakurikuler"}</button>${edit?'<button class="btn secondary" type="button" id="cancelEdit">Batal Edit</button>':""}</div></form><div class="dash-section-title"><h3>Daftar Ekstrakurikuler</h3><span>${data.orgs.length} data</span></div><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Status Ekskul</th><th>Pendaftaran</th><th>Anggota</th><th>Aksi</th></tr></thead><tbody>${data.orgs.map(o=>`<tr><td><b>${esc(o.name)}</b><small>${esc(o.category)} · ${esc(o.coach)}</small></td><td>${statusPill(o.active?"Aktif":"Nonaktif")}</td><td>${statusPill(o.registrationOpen?"Dibuka":"Ditutup")}</td><td>${data.members.filter(m=>m.org===o.name&&m.active&&m.status==="Diterima").length}</td><td><div class="table-actions"><button class="table-action" data-edit-org="${esc(o.id)}">Edit</button>${o.active?`<button class="table-action" data-toggle-reg="${esc(o.id)}">${o.registrationOpen?"Tutup daftar":"Buka daftar"}</button><button class="table-action danger" data-deactivate="${esc(o.id)}">Nonaktifkan</button>`:`<button class="table-action" data-reactivate="${esc(o.id)}">Aktifkan</button>`}</div></td></tr>`).join("")}</tbody></table></div><p class="muted">Ekstrakurikuler baru langsung tersedia di menu Eksplorasi siswa. Penonaktifan menghilangkan ekskul dari daftar aktif, menutup pendaftaran, dan tetap mempertahankan riwayat anggota serta pendaftaran.</p>`;
 } else if(tab==="Data Keanggotaan"){
  html=`<div class="dash-section-title"><h3>Data Keanggotaan</h3><span>Anggota aktif dan riwayat keanggotaan</span></div><div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Username</th><th>Kelas</th><th>Ekstrakurikuler</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>${data.members.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.username)}</td><td>${esc(m.kelas||"Belum diisi")}</td><td>${esc(m.org)}</td><td>${statusPill(m.active&&m.status==="Diterima"&&getOrg(m.org)?.active?"Aktif":"Riwayat")}</td><td>${esc(m.date||"—")}</td></tr>`).join("")||'<tr><td colspan="6">Belum ada data keanggotaan.</td></tr>'}</tbody></table></div>`;
 } else if(tab==="Kalender Kegiatan"){
  const orgs=student?allActive:allActive;
  html=`<div class="dash-section-title"><h3>Kalender Kegiatan</h3><span>Jadwal kegiatan ekstrakurikuler</span></div>${operator?`<form id="scheduleForm" class="inline-form"><label>Ekstrakurikuler<select name="org">${allActive.map(o=>`<option>${esc(o.name)}</option>`).join("")}</select></label><label>Jadwal<input name="schedule" required placeholder="Contoh: Jumat, 15.00 WITA"></label><label>Lokasi<input name="location" required placeholder="Lokasi kegiatan"></label><button class="btn primary">Simpan Jadwal</button></form>`:""}${scheduleTable(orgs,operator)}`;
 } else if(tab==="Informasi dan Pengumuman"){
  html=`<div class="dash-section-title"><h3>Informasi dan Pengumuman</h3><span>${student?"Informasi yang dapat kamu akses":"Terbitkan informasi untuk siswa"}</span></div>`;
  if(operator||currentUser?.role==="Wakasek Kesiswaan")html+=`<form id="announcementForm" class="inline-form"><input type="hidden" name="id" value=""><label>Judul pengumuman<input name="title" required placeholder="Judul informasi"></label><label>Kategori<select name="category"><option>Informasi umum</option><option>Lomba</option><option>Pelatihan</option><option>Kegiatan</option><option>Pendaftaran</option><option>Prestasi</option><option>Informasi internal</option></select></label><label>Sasaran informasi<select name="org"><option value="Semua siswa">Semua siswa</option>${allActive.map(o=>`<option value="${esc(o.name)}">Khusus anggota ${esc(o.name)}</option>`).join("")}</select></label><label class="form-wide">Isi pengumuman<textarea name="message" required placeholder="Tuliskan informasi yang perlu diketahui siswa"></textarea></label><button class="btn primary">Terbitkan Pengumuman</button></form><div class="dash-section-title"><h3>Kelola pengumuman</h3></div><div class="table-wrap"><table><thead><tr><th>Judul</th><th>Kategori</th><th>Sasaran</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${data.announcements.map(n=>`<tr><td>${esc(n.title)}</td><td>${esc(n.category)}</td><td>${esc(n.org)}</td><td>${esc(n.date)}</td><td>${statusPill(n.active?"Terbit":"Diarsipkan")}</td><td><div class="table-actions"><button class="table-action" data-edit-ann="${esc(n.id)}">Edit</button><button class="table-action" data-archive-ann="${esc(n.id)}">${n.active?"Arsipkan":"Terbitkan"}</button><button class="table-action danger" data-delete-ann="${esc(n.id)}">Hapus</button></div></td></tr>`).join("")||'<tr><td colspan="6">Belum ada pengumuman.</td></tr>'}</tbody></table></div>`;
  html+=`<div class="dash-section-title"><h3>${student?"Pengumuman untuk siswa":"Pratinjau pengumuman aktif"}</h3></div>${announcementList()}`;
 } else if(tab==="Dokumentasi Kegiatan"){
  html=`<div class="dash-section-title"><h3>Dokumentasi Kegiatan</h3><span>Foto atau tautan dokumentasi</span></div>${operator?`<form id="docForm" class="inline-form"><label>Judul kegiatan<input name="title" required></label><label>Ekstrakurikuler<select name="org">${allActive.map(o=>`<option>${esc(o.name)}</option>`).join("")}</select></label><label>Tanggal<input name="date" type="date" value="${today()}" required></label><label>Tautan dokumentasi<input name="url" type="url" placeholder="https://..."></label><label class="form-wide">Catatan<textarea name="note" placeholder="Keterangan kegiatan"></textarea></label><button class="btn primary">Simpan Dokumentasi</button></form>`:""}<div class="content-cards">${data.documentation.map(d=>`<article class="content-card"><span class="service-icon">▧</span><h4>${esc(d.title)}</h4><p>${esc(d.org)} · ${esc(d.date)}</p><p>${esc(d.note||"")}</p>${d.url?`<a href="${esc(d.url)}" target="_blank" rel="noopener">Buka dokumentasi ↗</a>`:""}</article>`).join("")||'<p class="muted">Belum ada dokumentasi kegiatan.</p>'}</div>`;
 } else if(tab==="Rekapitulasi dan Laporan"){
  html=`<div class="dash-section-title"><h3>Rekapitulasi dan Laporan</h3><span>Ringkasan data sistem</span></div><div class="mini-stats"><div><b>${allStudentAccounts.length}</b><span>Siswa</span></div><div><b>${allActive.length}</b><span>Ekstrakurikuler aktif</span></div><div><b>${data.registrations.length}</b><span>Total pengajuan</span></div><div><b>${data.members.filter(m=>m.active&&m.status==="Diterima").length}</b><span>Anggota aktif</span></div></div><div class="report-actions"><button class="btn primary" id="exportCsv">Unduh laporan CSV</button><button class="btn secondary" id="printReport">Cetak / Simpan PDF</button></div><p class="muted">Laporan berisi data pendaftaran, keanggotaan, dan ekstrakurikuler. Gunakan opsi “Simpan sebagai PDF” pada dialog cetak.</p>${scheduleTable(allActive,true)}`;
 } else if(tab==="Pengaturan Sistem"){
  html=`<div class="dash-section-title"><h3>Pengaturan Sistem</h3><span>Informasi dasar EKSPLORA</span></div><form id="settingsForm" class="inline-form"><label>Nama sekolah<input name="schoolName" required value="${esc(data.settings.schoolName||"Sekolah")}"></label><label>Tahun ajaran<input name="schoolYear" required value="${esc(data.settings.schoolYear||"2026/2027")}"></label><p class="muted form-wide">Buka/tutup pendaftaran diatur pada setiap ekstrakurikuler melalui menu Data Ekstrakurikuler.</p><button class="btn primary">Simpan Pengaturan</button></form><div class="help-note">Catatan: data tersimpan di browser yang digunakan dan belum tersinkronisasi antarperangkat.</div>`;
 } else if(tab==="Profil Saya"||tab==="Profil Akun"){
  html=`<div class="dash-section-title"><h3>${student?"Profil Saya":"Profil Akun"}</h3><span>Informasi akun yang sedang aktif</span></div><div class="profile-card"><div class="profile-avatar">${esc((currentUser.name||"E").charAt(0).toUpperCase())}</div><div><h3>${esc(currentUser.name)}</h3><p>${esc(currentUser.role)}</p><span class="status ok">${esc(currentUser.username)}</span></div></div><form id="profileForm" class="inline-form"><label>Nama tampilan<input name="name" required value="${esc(currentUser.name)}"></label>${student?`<label>Kelas<input name="kelas" value="${esc(currentUser.kelas||accounts.find(a=>a.username===currentUser.username)?.kelas||"")}"></label>`:""}<label>Username<input value="${esc(currentUser.username)}" disabled></label><button class="btn primary">Simpan Profil</button></form><p class="muted">Perubahan nama tampilan tersimpan di browser ini. Penggunaan nyata memerlukan autentikasi server yang aman.</p>`;
 }
 if(!html){
  const role=currentUser?.role||"Pengguna";
  const summaries={
   "Data Siswa dan Anggota":"Memantau data siswa, anggota aktif, dan riwayat keanggotaan seluruh ekstrakurikuler.",
   "Data Guru Pembina":"Melihat daftar Guru Pembina dan ekstrakurikuler yang menjadi tanggung jawabnya.",
   "Presensi":"Memantau rekapitulasi kehadiran siswa pada kegiatan ekstrakurikuler.",
   "Evaluasi dan Perkembangan":"Meninjau perkembangan kegiatan dan memberikan evaluasi sesuai kewenangan akun.",
   "Laporan":"Memeriksa laporan kegiatan dan memberikan penilaian pengawasan.",
   "Arahan dan Keputusan":"Mencatat arahan Kepala Sekolah sebagai pimpinan tertinggi dalam urusan kesiswaan.",
   "Aspirasi dan Masukan":"Melihat aspirasi pengguna. Informasi pengirim dan status pembacaan ditampilkan tanpa fitur balasan atau penerusan.",
   "Ekstrakurikuler Binaan":"Menampilkan ekstrakurikuler yang ditugaskan kepada Guru Pembina.",
   "Data Anggota":"Melihat data anggota ekstrakurikuler binaan.",
   "Jadwal dan Agenda":"Melihat dan mengatur jadwal kegiatan ekstrakurikuler binaan.",
   "Riwayat Kegiatan":"Menampilkan riwayat kegiatan ekstrakurikuler.",
   "Laporan Kegiatan":"Menyusun dan meninjau laporan kegiatan ekstrakurikuler binaan.",
   "Data Guru Pembina":"Melihat data dan penugasan Guru Pembina.",
   "Periode Pendaftaran":"Mengatur periode penerimaan anggota ekstrakurikuler.",
   "Manajemen Akun":"Administrasi akun pengguna berdasarkan peran. Pengelolaan akun lengkap memerlukan penyimpanan server agar data konsisten antarperangkat.",
   "Log Aktivitas":"Riwayat aktivitas pengguna dan perubahan data.",
   "Ekstrakurikuler":"Jelajahi daftar ekstrakurikuler, pembina, tujuan, anggota, jadwal, dan riwayat kegiatan.",
   "Pengumuman":"Pengumuman sekolah yang dapat dibaca oleh Orang Tua.",
   "Presensi Saya":"Riwayat kehadiran pribadi berdasarkan tanggal dan kegiatan.",
   "Riwayat Kegiatan":"Daftar kegiatan ekstrakurikuler yang pernah diikuti.",
   "Jadwal Kegiatan":"Jadwal, waktu, lokasi, dan agenda ekstrakurikuler."
  };
  const desc=summaries[tab]||"Informasi dan pengelolaan sesuai hak akses akun.";
  let body="";
  if(["Data Siswa dan Anggota","Data Anggota"].includes(tab)){
   body=`<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Ekstrakurikuler</th><th>Status</th></tr></thead><tbody>${data.members.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.username)}</td><td>${esc(m.org)}</td><td>${statusPill(m.active?"Aktif":"Riwayat")}</td></tr>`).join("")||'<tr><td colspan="4">Belum ada data anggota.</td></tr>'}</tbody></table></div>`;
  } else if(["Data Guru Pembina"].includes(tab)){
   body=`<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Penugasan</th></tr></thead><tbody>${accounts.filter(a=>a.role==="Guru Pembina").map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.username)}</td><td>${esc((a.coachOrgs||[]).join(", ")||"Belum ditentukan")}</td></tr>`).join("")}</tbody></table></div>`;
  } else if(["Ekstrakurikuler","Ekstrakurikuler Binaan"].includes(tab)){
   const allowed=tab==="Ekstrakurikuler Binaan"?(currentUser.coachOrgs||[]):null;
   body=`<div class="content-cards">${allActive.filter(o=>!allowed||allowed.includes(o.name)).map(o=>`<article class="content-card"><h4>${esc(o.name)}</h4><p>${esc(o.description)}</p><p><b>Pembina:</b> ${esc(o.coach)}<br><b>Jadwal:</b> ${esc(o.schedule)}<br><b>Lokasi:</b> ${esc(o.location)}</p></article>`).join("")||'<p class="muted">Belum ada data ekstrakurikuler.</p>'}</div>`;
  } else if(["Jadwal Kegiatan","Jadwal dan Agenda"].includes(tab)){
   const allowed=currentUser.role==="Guru Pembina"?(currentUser.coachOrgs||[]):null;
   body=scheduleTable(allActive.filter(o=>!allowed||allowed.includes(o.name)),false);
  } else if(tab==="Presensi Saya"){
   body='<p class="muted">Riwayat presensi pribadi akan tampil setelah Guru Pembina mencatat kehadiran melalui sistem.</p>';
  } else if(tab==="Presensi"){
   body='<p class="muted">Rekap presensi akan tampil setelah pencatatan kehadiran diaktifkan untuk kegiatan ekstrakurikuler.</p>';
  } else if(tab==="Aspirasi dan Masukan"){
   body=student||parent?aspirationComposer():aspirationInbox();
  } else if(tab==="Manajemen Akun"){
   body=`<div class="help-note">Daftar akun awal EKSPLORA. Untuk produksi, pembuatan dan penghapusan akun harus dihubungkan ke server dengan validasi keamanan.</div><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Peran</th></tr></thead><tbody>${accounts.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.username)}</td><td>${esc(a.role)}</td></tr>`).join("")}</tbody></table></div>`;
  } else if(tab==="Pengumuman"){
   body=announcementList();
  } else if(tab==="Laporan"||tab==="Laporan Kegiatan"){
   body=`<div class="mini-stats"><div><b>${data.orgs.length}</b><span>Total ekstrakurikuler</span></div><div><b>${data.members.length}</b><span>Data anggota</span></div><div><b>${data.registrations.length}</b><span>Data pendaftaran</span></div></div>${scheduleTable(allActive,true)}`;
  } else {
   body=`<div class="help-note">${esc(desc)}</div>`;
  }
  html=`<div class="dash-section-title"><h3>${esc(tab)}</h3><span>${esc(role)}</span></div><p class="muted">${esc(desc)}</p>${body}`;
 }
 content.innerHTML=html;
 bindCrudPage();
 if(currentUser?.role==="Kepala Sekolah"){
   const form=content.querySelector("#orgForm");if(form)form.remove();
   content.querySelectorAll("[data-edit-org],[data-toggle-reg],[data-deactivate],[data-reactivate]").forEach(el=>el.remove());
 }
 if(currentUser?.role==="Guru Pembina"){
   content.querySelectorAll("[data-edit-org],[data-toggle-reg],[data-deactivate],[data-reactivate]").forEach(el=>el.remove());
 }
 content.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click",()=>renderDashboard(b.dataset.quick)));
 content.querySelectorAll("[data-register]").forEach(b=>b.addEventListener("click",()=>registerFor(b.dataset.register)));
 content.querySelectorAll("[data-cancel]").forEach(b=>b.addEventListener("click",()=>cancelRegistration(b.dataset.cancel)));
 content.querySelectorAll("[data-process]").forEach(b=>b.addEventListener("click",()=>changeRegistration(b.dataset.process,"Sedang Diproses")));
 content.querySelectorAll("[data-accept]").forEach(b=>b.addEventListener("click",()=>acceptRegistration(b.dataset.accept)));
 content.querySelectorAll("[data-reject]").forEach(b=>b.addEventListener("click",()=>rejectRegistration(b.dataset.reject)));
 content.querySelectorAll("[data-edit-org]").forEach(b=>b.addEventListener("click",()=>{editingOrgId=b.dataset.editOrg;renderDashboard("Data Ekstrakurikuler");}));
 content.querySelectorAll("[data-toggle-reg]").forEach(b=>b.addEventListener("click",()=>{const o=getOrgById(b.dataset.toggleReg);if(!o)return;o.registrationOpen=!o.registrationOpen;save();renderDashboard("Data Ekstrakurikuler")}));
 content.querySelectorAll("[data-deactivate]").forEach(b=>b.addEventListener("click",()=>deactivateOrg(b.dataset.deactivate)));
 content.querySelectorAll("[data-reactivate]").forEach(b=>b.addEventListener("click",()=>{const o=getOrgById(b.dataset.reactivate);if(o){o.active=true;o.registrationOpen=false;save();renderDashboard("Data Ekstrakurikuler")}}));
 content.querySelectorAll("[data-archive-ann]").forEach(b=>b.addEventListener("click",()=>{const n=data.announcements.find(n=>n.id===b.dataset.archiveAnn);if(n){n.active=!n.active;save();renderDashboard("Informasi dan Pengumuman")}}));
 bindForms();
}
/* CRUD terintegrasi untuk halaman gabungan dan modul operasional. */
const CRUD_DEFS={
 "Data Guru Pembina":{key:"coaches",title:"Data Guru Pembina",fields:[ ["name","Nama Pembina","text"],["username","Username","text"],["orgs","Ekstrakurikuler Binaan","text"],["phone","Nomor Kontak","text"] ],canCreate:["Operator Sekolah","Wakasek Kesiswaan"],canEdit:["Operator Sekolah","Wakasek Kesiswaan"],canDelete:["Operator Sekolah"]},
 "Jadwal dan Agenda":{key:"events",title:"Jadwal dan Agenda",fields:[["title","Nama Kegiatan","text"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["time","Waktu","text"],["location","Lokasi","text"],["description","Keterangan","textarea"]]},
 "Kalender Kegiatan":{key:"events",title:"Kalender Kegiatan",fields:[["title","Nama Kegiatan","text"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["time","Waktu","text"],["location","Lokasi","text"],["description","Keterangan","textarea"]]},
 "Presensi":{key:"attendance",title:"Presensi Kegiatan",fields:[["username","Username Siswa","student"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["status","Kehadiran","attendanceStatus"],["note","Catatan","text"]]},
 "Presensi Saya":{key:"attendance",title:"Presensi Saya",fields:[["username","Username Siswa","student"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["status","Kehadiran","attendanceStatus"],["note","Catatan","text"]],personal:true,readOnly:true},
 "Jadwal dan Presensi":{key:"attendance",title:"Pencatatan dan Rekap Presensi",fields:[["username","Username Siswa","student"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["status","Kehadiran","attendanceStatus"],["note","Catatan","text"]]},
 "Evaluasi dan Perkembangan":{key:"evaluations",title:"Evaluasi dan Perkembangan",fields:[["org","Ekstrakurikuler","org"],["student","Nama/Username Siswa","text"],["date","Tanggal Evaluasi","date"],["score","Nilai/Skor","number"],["progress","Perkembangan","textarea"],["recommendation","Rekomendasi","textarea"]]},
 "Laporan Kegiatan":{key:"reports",title:"Laporan Kegiatan",fields:[["title","Judul Laporan","text"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["participants","Jumlah Peserta","number"],["summary","Ringkasan Kegiatan","textarea"],["result","Hasil Kegiatan","textarea"]]},
 "Laporan":{key:"reports",title:"Laporan Kegiatan",fields:[["title","Judul Laporan","text"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["participants","Jumlah Peserta","number"],["summary","Ringkasan Kegiatan","textarea"],["result","Hasil Kegiatan","textarea"]]},
 "Arahan dan Keputusan":{key:"decisions",title:"Arahan dan Keputusan",fields:[["title","Judul Arahan/Keputusan","text"],["date","Tanggal","date"],["target","Tujuan/Penerima","text"],["content","Isi Arahan atau Keputusan","textarea"],["status","Status","decisionStatus"]]},
 "Aspirasi, Arahan dan Keputusan":{key:"decisions",title:"Aspirasi, Arahan dan Keputusan",fields:[["title","Judul Arahan/Keputusan","text"],["date","Tanggal","date"],["target","Tujuan/Penerima","text"],["content","Isi Arahan atau Keputusan","textarea"],["status","Status","decisionStatus"]]},
 "Dokumentasi Kegiatan":{key:"documentation",title:"Dokumentasi Kegiatan",fields:[["title","Judul Dokumentasi","text"],["org","Ekstrakurikuler","org"],["date","Tanggal","date"],["url","Tautan Dokumentasi","url"],["note","Keterangan","textarea"]]},
 "Data Anggota":{key:"members",title:"Data Anggota dan Keanggotaan",fields:[["name","Nama Siswa","text"],["username","Username","student"],["kelas","Kelas","text"],["org","Ekstrakurikuler","org"],["status","Status Keanggotaan","memberStatus"],["date","Tanggal","date"]]},
 "Data Keanggotaan":{key:"members",title:"Data Keanggotaan",fields:[["name","Nama Siswa","text"],["username","Username","student"],["kelas","Kelas","text"],["org","Ekstrakurikuler","org"],["status","Status Keanggotaan","memberStatus"],["date","Tanggal","date"]]}
};
function roleCan(list){return (list||["Operator Sekolah","Wakasek Kesiswaan","Guru Pembina"]).includes(currentUser?.role)}
function renderCrudField(field,value){const [key,label,type]=field;const v=esc(value??"");if(type==="textarea")return `<label class="form-wide">${label}<textarea name="${key}" required>${v}</textarea></label>`;if(type==="org")return `<label>${label}<select name="${key}" required>${data.orgs.map(o=>`<option value="${esc(o.name)}" ${value===o.name?"selected":""}>${esc(o.name)}</option>`).join("")}</select></label>`;if(type==="student")return `<label>${label}<select name="${key}" required>${accounts.filter(a=>a.role==="Siswa").map(a=>`<option value="${esc(a.username)}" ${value===a.username?"selected":""}>${esc(a.username)} — ${esc(a.name)}</option>`).join("")}</select></label>`;if(type==="attendanceStatus")return `<label>${label}<select name="${key}"><option ${value==="Hadir"?"selected":""}>Hadir</option><option ${value==="Izin"?"selected":""}>Izin</option><option ${value==="Sakit"?"selected":""}>Sakit</option><option ${value==="Alpa"?"selected":""}>Alpa</option></select></label>`;if(type==="memberStatus")return `<label>${label}<select name="${key}"><option ${value==="Diterima"?"selected":""}>Diterima</option><option ${value==="Nonaktif"?"selected":""}>Nonaktif</option></select></label>`;if(type==="decisionStatus")return `<label>${label}<select name="${key}"><option ${value==="Berlaku"?"selected":""}>Berlaku</option><option ${value==="Selesai"?"selected":""}>Selesai</option><option ${value==="Dibatalkan"?"selected":""}>Dibatalkan</option></select></label>`;return `<label>${label}<input name="${key}" type="${type}" ${type==="number"?"min=0":""} value="${v}" ${type==="url"?"":"required"}></label>`}
function renderCrudPage(tab){
 if(tab==="Manajemen Akun")return renderAccountsCrudPage();
 const def=CRUD_DEFS[tab];
 if(tab==="Informasi dan Pengumuman")return null; // modul ini memiliki alur sasaran pembaca tersendiri
 if(tab==="Kalender Kegiatan"&&["Siswa","Orang Tua"].includes(currentUser?.role))return null;
 if(tab==="Aspirasi dan Masukan")return null; // aspirasi siswa tetap menggunakan formulir pengiriman
 if(!def)return null;
 const canEdit=roleCan(def.canEdit),canCreate=roleCan(def.canCreate),canDelete=roleCan(def.canDelete),editId=window.__crudEdit?.key===def.key?window.__crudEdit.id:null,edit=editId?data[def.key].find(x=>x.id===editId):null;
 let rows=data[def.key]||[];if(def.personal)rows=rows.filter(r=>r.username===currentUser?.username);if(currentUser?.role==="Guru Pembina"&&currentUser.coachOrgs)rows=rows.filter(r=>!r.org||currentUser.coachOrgs.includes(r.org));
 const cols=def.fields.map(f=>f[0]);
 const table=`<div class="table-wrap"><table><thead><tr>${def.fields.map(f=>`<th>${f[1]}</th>`).join("")}${canEdit||canDelete?"<th>Aksi</th>":""}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(k=>`<td>${esc(r[k]??"—")}</td>`).join("")}${canEdit||canDelete?`<td><div class="table-actions">${canEdit?`<button class="table-action" data-crud-edit="${esc(r.id)}" data-crud-key="${def.key}">Edit</button>`:""}${canDelete?`<button class="table-action danger" data-crud-delete="${esc(r.id)}" data-crud-key="${def.key}">Hapus</button>`:""}</div></td>`:""}</tr>`).join("")||`<tr><td colspan="${def.fields.length+(canEdit||canDelete?1:0)}">Belum ada data.</td></tr>`}</tbody></table></div>`;
 const form=canCreate||edit?`<div class="dash-section-title"><h3>${edit?"Edit":"Tambah"} ${def.title}</h3><span>Formulir CRUD</span></div><form class="inline-form" id="genericCrudForm" data-crud-key="${def.key}"><input type="hidden" name="id" value="${esc(edit?.id||"")}">${def.fields.map(f=>renderCrudField(f,edit?.[f[0]]??(f[0]==="date"?today():f[0]==="status"?"Hadir":""))).join("")}<div class="button-row form-wide"><button class="btn primary">${edit?"Simpan Perubahan":"Tambah Data"}</button>${edit?'<button class="btn secondary" type="button" id="cancelCrudEdit">Batal</button>':""}</div></form>`:"";
 let combined="";
 if(tab==="Aspirasi, Arahan dan Keputusan") {const items=getAspirations().filter(a=>!a.recipientUsername||a.recipientUsername==="all"||a.recipientUsername===currentUser?.username);combined=`<div class="dash-section-title"><h3>Aspirasi dan Masukan</h3><span>${items.length} masukan untuk akun ini</span></div>${aspirationInbox()}`;}
 if(tab==="Jadwal dan Presensi")combined=`<div class="dash-section-title"><h3>Jadwal Ekstrakurikuler</h3></div>${scheduleTable(activeOrgs(),true)}`;
 return `<div class="dash-section-title"><h3>${def.title}</h3><span>${rows.length} data</span></div>${canCreate||canEdit?form:""}${table}${combined}<p class="muted">Data tersimpan di penyimpanan browser pada perangkat ini. CRUD berlaku sesuai hak akses akun.</p>`;
}
function renderAccountsCrudPage(){
 const canManage=currentUser?.role==="Operator Sekolah",edit=window.__accountEdit?accounts.find(a=>a.username===window.__accountEdit&&a.custom):null;
 const fields=`<label>Nama Lengkap<input name="name" required value="${esc(edit?.name||"")}"></label><label>Username<input name="username" required value="${esc(edit?.username||"")}" ${edit?"readonly":""}></label><label>Kata Sandi<input name="password" required value="${esc(edit?.password||"")}"></label><label>Peran<select name="role" required>${["Siswa","Kepala Sekolah","Wakasek Kesiswaan","Guru Pembina","Operator Sekolah","Orang Tua"].map(r=>`<option ${edit?.role===r?"selected":""}>${r}</option>`).join("")}</select></label><label>Kelas (khusus siswa)<input name="kelas" value="${esc(edit?.kelas||"")}"></label><label>Ekstrakurikuler Binaan (username pembina, pisahkan koma)<input name="coachOrgs" value="${esc((edit?.coachOrgs||[]).join(", "))}"></label>`;
 return `<div class="dash-section-title"><h3>Manajemen Akun</h3><span>${accounts.length} akun</span></div>${canManage?`<form id="accountCrudForm" class="inline-form"><input type="hidden" name="oldUsername" value="${esc(edit?.username||"")}">${fields}<div class="button-row form-wide"><button class="btn primary">${edit?"Simpan Perubahan":"Tambah Akun"}</button>${edit?'<button class="btn secondary" type="button" id="cancelAccountEdit">Batal</button>':""}</div></form>`:"<p class=\"muted\">Akun ditampilkan sesuai hak akses. Hanya Operator Sekolah yang dapat mengelola akun.</p>"}<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Peran</th><th>Kelas/Penugasan</th>${canManage?"<th>Aksi</th>":""}</tr></thead><tbody>${accounts.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.username)}</td><td>${esc(a.role)}</td><td>${esc(a.kelas||((a.coachOrgs||[]).join(", "))||"—")}</td>${canManage?`<td>${a.custom?`<div class="table-actions"><button class="table-action" data-account-edit="${esc(a.username)}">Edit</button><button class="table-action danger" data-account-delete="${esc(a.username)}">Hapus</button></div>`:"Akun bawaan"}</td>`:""}</tr>`).join("")}</tbody></table></div><p class="muted">Akun demo bawaan dilindungi. Akun tambahan dapat dibuat, diedit, dan dihapus oleh Operator. Data akun tersimpan lokal pada browser ini.</p>`;
}
function bindCrudPage(){
 const accountForm=$("accountCrudForm");if(accountForm)accountForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(accountForm),old=f.get("oldUsername"),username=String(f.get("username")).trim();if(!old&&accounts.some(a=>a.username.toLowerCase()===username.toLowerCase())){alert("Username sudah digunakan.");return;}const values={name:String(f.get("name")).trim(),username,password:String(f.get("password")),role:f.get("role"),kelas:String(f.get("kelas")||"").trim(),coachOrgs:String(f.get("coachOrgs")||"").split(",").map(x=>x.trim()).filter(Boolean),custom:true};if(old){const a=accounts.find(x=>x.username===old&&x.custom);if(a)Object.assign(a,values)}else accounts.push(values);customAccounts=accounts.filter(a=>a.custom).map(({custom,...a})=>a);localStorage.setItem("eksploraCustomAccounts",JSON.stringify(customAccounts));window.__accountEdit=null;save();renderDashboard("Manajemen Akun")});
 const cancelAccount=$("cancelAccountEdit");if(cancelAccount)cancelAccount.addEventListener("click",()=>{window.__accountEdit=null;renderDashboard("Manajemen Akun")});
 document.querySelectorAll("[data-account-edit]").forEach(b=>b.addEventListener("click",()=>{window.__accountEdit=b.dataset.accountEdit;renderDashboard("Manajemen Akun")}));
 document.querySelectorAll("[data-account-delete]").forEach(b=>b.addEventListener("click",()=>{if(!confirm("Hapus akun tambahan ini?"))return;const u=b.dataset.accountDelete;const i=accounts.findIndex(a=>a.username===u&&a.custom);if(i>=0)accounts.splice(i,1);customAccounts=accounts.filter(a=>a.custom).map(({custom,...a})=>a);localStorage.setItem("eksploraCustomAccounts",JSON.stringify(customAccounts));save();renderDashboard("Manajemen Akun")}));
 const form=$("genericCrudForm");if(form)form.addEventListener("submit",e=>{e.preventDefault();const key=form.dataset.crudKey,fd=new FormData(form),id=fd.get("id"),item={};for(const [k,v] of fd.entries())if(k!=="id")item[k]=k==="participants"||k==="score"?Number(v):String(v).trim();if(key==="coaches")item.orgs=item.orgs.split(",").map(x=>x.trim()).filter(Boolean).join(", ");if(key==="members")item.active=item.status==="Diterima";if(!item.id)item.id=uid(key);if(id){const idx=data[key].findIndex(x=>x.id===id);if(idx>=0)data[key][idx]={...data[key][idx],...item,id}}else data[key].unshift(item);window.__crudEdit=null;save();renderDashboard(currentTab)});
 const cancel=$("cancelCrudEdit");if(cancel)cancel.addEventListener("click",()=>{window.__crudEdit=null;renderDashboard(currentTab)});
 document.querySelectorAll("[data-crud-edit]").forEach(btn=>btn.addEventListener("click",()=>{window.__crudEdit={key:btn.dataset.crudKey,id:btn.dataset.crudEdit};renderDashboard(currentTab)}));
 document.querySelectorAll("[data-crud-delete]").forEach(btn=>btn.addEventListener("click",()=>{if(!confirm("Hapus data ini? Tindakan ini tidak dapat dibatalkan."))return;const key=btn.dataset.crudKey;data[key]=data[key].filter(x=>x.id!==btn.dataset.crudDelete);save();renderDashboard(currentTab)}));
}

function getOrgById(id){return data.orgs.find(o=>o.id===id)}
function registerFor(orgId){const o=getOrgById(orgId);if(!o||!o.active||!o.registrationOpen){alert("Pendaftaran ekstrakurikuler ini sedang ditutup.");return}if(isMember(currentUser.username,o.name)){alert("Anda sudah menjadi anggota ekstrakurikuler ini.");return}if(activeApplications(currentUser.username,o.name).length){alert("Anda sudah memiliki pengajuan aktif untuk ekstrakurikuler ini.");return}const count=data.members.filter(m=>m.org===o.name&&m.active&&m.status==="Diterima").length;if(count>=o.quota){alert("Kuota anggota sudah penuh.");return}data.registrations.push({id:uid("reg"),name:currentUser.name,username:currentUser.username,org:o.name,date:today(),status:"Menunggu Verifikasi",reason:""});save();renderDashboard("Pendaftaran")}
function cancelRegistration(id){const r=data.registrations.find(r=>r.id===id&&r.username===currentUser.username);if(!r||!["Menunggu Verifikasi","Sedang Diproses"].includes(r.status))return;if(confirm("Batalkan pengajuan pendaftaran ini? Riwayat tetap disimpan.")){r.status="Dibatalkan";r.reason="Dibatalkan oleh siswa";save();renderDashboard("Pendaftaran")}}
function changeRegistration(id,status){const r=data.registrations.find(r=>r.id===id);if(!r||!["Menunggu Verifikasi","Sedang Diproses"].includes(r.status))return;r.status=status;save();renderDashboard("Verifikasi dan Penerimaan")}
function acceptRegistration(id){const r=data.registrations.find(r=>r.id===id);if(!r||!["Menunggu Verifikasi","Sedang Diproses"].includes(r.status))return;const o=getOrg(r.org);if(!o){alert("Data ekstrakurikuler tidak ditemukan.");return}if(!o.active){alert("Ekstrakurikuler sudah dinonaktifkan. Pengajuan tidak dapat diterima.");return}const count=data.members.filter(m=>m.org===r.org&&m.active&&m.status==="Diterima").length;if(count>=o.quota){alert("Kuota sudah penuh. Perbarui kuota atau selesaikan pengajuan lain terlebih dahulu.");return}r.status="Diterima";r.reason="Diterima oleh operator";if(!data.members.some(m=>m.username===r.username&&m.org===r.org&&m.active&&m.status==="Diterima")){data.members.push({id:uid("mem"),name:r.name,username:r.username,kelas:accounts.find(a=>a.username===r.username)?.kelas||"Belum diisi",org:r.org,status:"Diterima",active:true,date:today()})}save();renderDashboard("Verifikasi dan Penerimaan")}
function rejectRegistration(id){const r=data.registrations.find(r=>r.id===id);if(!r||!["Menunggu Verifikasi","Sedang Diproses"].includes(r.status))return;const reason=prompt("Alasan penolakan (opsional):","");if(reason===null)return;r.status="Ditolak";r.reason=reason.trim()||"Pengajuan tidak diterima";save();renderDashboard("Verifikasi dan Penerimaan")}
function deactivateOrg(id){const o=getOrgById(id);if(!o)return;const members=data.members.filter(m=>m.org===o.name&&m.active&&m.status==="Diterima").length;const pending=data.registrations.filter(r=>r.org===o.name&&["Menunggu Verifikasi","Sedang Diproses"].includes(r.status)).length;const message=members||pending?`Ekstrakurikuler ${o.name} memiliki ${members} anggota aktif dan ${pending} pengajuan yang masih diproses. Ekstrakurikuler akan dinonaktifkan, pendaftaran ditutup, dan seluruh riwayat tetap disimpan. Lanjutkan?`:`Nonaktifkan ${o.name}? Data dan riwayat tetap disimpan.`;if(!confirm(message))return;o.active=false;o.registrationOpen=false;data.members.filter(m=>m.org===o.name&&m.active).forEach(m=>{m.active=false});data.registrations.filter(r=>r.org===o.name&&["Menunggu Verifikasi","Sedang Diproses"].includes(r.status)).forEach(r=>{r.status="Ditolak";r.reason="Ekstrakurikuler dinonaktifkan"});save();updateSchoolNameDisplay();
renderPublicExkuls();renderDashboard("Data Ekstrakurikuler")}
function bindForms(){
 const orgForm=$("orgForm");if(orgForm)orgForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(orgForm),id=f.get("id"),name=f.get("name").trim();if(data.orgs.some(o=>o.name.toLowerCase()===name.toLowerCase()&&o.id!==id)){alert("Nama ekstrakurikuler tersebut sudah digunakan.");return}const values={name,category:f.get("category").trim(),description:f.get("description").trim(),coach:f.get("coach").trim(),schedule:f.get("schedule").trim(),location:f.get("location").trim(),quota:Number(f.get("quota")),registrationOpen:f.get("registrationOpen")==="true"&&(id?getOrgById(id)?.active!==false:true),active:id?(getOrgById(id)?.active!==false):true};if(id){const o=getOrgById(id);if(o)Object.assign(o,values)}else data.orgs.push({id:uid("org"),...values});save();editingOrgId=null;updateSchoolNameDisplay();
renderPublicExkuls();renderDashboard("Data Ekstrakurikuler")});
 const cancelEdit=$("cancelEdit");if(cancelEdit)cancelEdit.addEventListener("click",()=>{editingOrgId=null;renderDashboard("Data Ekstrakurikuler")});
 const scheduleForm=$("scheduleForm");if(scheduleForm)scheduleForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(scheduleForm),o=getOrg(f.get("org"));if(!o)return;o.schedule=f.get("schedule").trim();o.location=f.get("location").trim();save();renderDashboard("Kalender Kegiatan")});
 const annForm=$("announcementForm");if(annForm)annForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(annForm),id=f.get("id"),item={title:f.get("title").trim(),category:f.get("category"),org:f.get("org"),message:f.get("message").trim(),date:today(),active:true};if(id){const n=data.announcements.find(x=>x.id===id);if(n)Object.assign(n,item)}else data.announcements.unshift({id:uid("ann"),...item});save();renderDashboard("Informasi dan Pengumuman")});
 document.querySelectorAll("[data-edit-ann]").forEach(btn=>btn.addEventListener("click",()=>{const n=data.announcements.find(x=>x.id===btn.dataset.editAnn);if(!n)return;renderDashboard("Informasi dan Pengumuman");const form=$("announcementForm");if(!form)return;form.elements.id.value=n.id;form.elements.title.value=n.title;form.elements.category.value=n.category;form.elements.org.value=n.org;form.elements.message.value=n.message;form.querySelector("button[type=submit],button:not([type])").textContent="Simpan Perubahan";form.scrollIntoView({behavior:"smooth",block:"center"})}));
 document.querySelectorAll("[data-delete-ann]").forEach(btn=>btn.addEventListener("click",()=>{if(!confirm("Hapus pengumuman ini?"))return;data.announcements=data.announcements.filter(n=>n.id!==btn.dataset.deleteAnn);save();renderDashboard("Informasi dan Pengumuman")}));
 const docForm=$("docForm");if(docForm)docForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(docForm);data.documentation.unshift({id:uid("doc"),title:f.get("title").trim(),org:f.get("org"),date:f.get("date"),url:f.get("url").trim(),note:f.get("note").trim()});save();renderDashboard("Dokumentasi Kegiatan")});
 const profileForm=$("profileForm");if(profileForm)profileForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(profileForm),name=f.get("name").trim();if(!name){alert("Nama tidak boleh kosong.");return}currentUser.name=name;accountNames[currentUser.username]=name;localStorage.setItem("eksploraAccountNames",JSON.stringify(accountNames));const account=accounts.find(a=>a.username===currentUser.username);if(account)account.name=name;if(isStudent()){currentUser.kelas=f.get("kelas")?.trim()||currentUser.kelas;account.kelas=currentUser.kelas;data.members.filter(m=>m.username===currentUser.username).forEach(m=>{m.name=name;m.kelas=currentUser.kelas});data.registrations.filter(r=>r.username===currentUser.username).forEach(r=>r.name=name)}save();$("welcomeUser").textContent=`Halo, ${name}!`;renderDashboard(isStudent()?"Profil Saya":"Profil Akun")});
 const aspirationForm=$("aspirationForm");if(aspirationForm)aspirationForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(aspirationForm),message=String(f.get("message")||"").trim(),recipientUsername=String(f.get("recipientUsername")||"");if(!recipientUsername){alert("Silakan pilih penerima aspirasi.");return}if(message.length<5){alert("Isi aspirasi minimal 5 karakter.");return}const recipient=recipientUsername==="all"?null:accounts.find(a=>a.username===recipientUsername);if(recipientUsername!=="all"&&!recipient){alert("Penerima tidak ditemukan. Silakan pilih ulang.");return}const items=getAspirations();items.unshift({id:uid("asp"),sender:currentUser.name,username:currentUser.username,role:currentUser.role,recipientUsername,recipientName:recipient?recipient.name:"Semua pihak sekolah",recipientRole:recipient?recipient.role:"Semua pihak sekolah",category:f.get("category"),message,date:today(),read:false});localStorage.setItem("eksploraAspirations",JSON.stringify(items));alert("Aspirasi berhasil dikirim kepada "+(recipient?recipient.name:"semua pihak sekolah")+".");renderDashboard(currentTab)});
 document.querySelectorAll("[data-mark-asp]").forEach(btn=>btn.addEventListener("click",()=>{const items=getAspirations(),a=items.find(x=>x.id===btn.dataset.markAsp);if(a)a.read=true;localStorage.setItem("eksploraAspirations",JSON.stringify(items));renderDashboard(currentTab)}));
 document.querySelectorAll("[data-delete-asp]").forEach(btn=>btn.addEventListener("click",()=>{if(!confirm("Hapus aspirasi ini?"))return;const items=getAspirations().filter(x=>x.id!==btn.dataset.deleteAsp);localStorage.setItem("eksploraAspirations",JSON.stringify(items));renderDashboard(currentTab)}));
 const settingsForm=$("settingsForm");if(settingsForm)settingsForm.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(settingsForm);data.settings.schoolName=f.get("schoolName").trim();data.settings.schoolYear=f.get("schoolYear").trim();save();updateSchoolNameDisplay();alert("Pengaturan berhasil disimpan.");renderDashboard("Pengaturan Sistem")});
 const exportBtn=$("exportCsv");if(exportBtn)exportBtn.addEventListener("click",exportReport);const printBtn=$("printReport");if(printBtn)printBtn.addEventListener("click",()=>window.print());
}
function exportReport(){const rows=[["Jenis Data","Nama","Username","Ekstrakurikuler","Tanggal","Status/Detail"]];data.registrations.forEach(r=>rows.push(["Pendaftaran",r.name,r.username,r.org,r.date,r.status+(r.reason?` — ${r.reason}`:"")]));data.members.forEach(m=>rows.push(["Keanggotaan",m.name,m.username,m.org,m.date||"",m.active?m.status:"Riwayat"]));data.orgs.forEach(o=>rows.push(["Ekstrakurikuler",o.name,"",o.category,`${o.schedule} / ${o.location}`,`${o.active?"Aktif":"Nonaktif"}; pendaftaran ${o.registrationOpen?"dibuka":"ditutup"}`]));const csv="\uFEFF"+rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="laporan-eksplora.csv";a.click();URL.revokeObjectURL(url)}
updateSchoolNameDisplay();
renderPublicExkuls();


/* EKSPLORA v8.1 — navigasi geser, sidebar adaptif, dan micro-interaction. */
(() => {
  const dashboard = document.getElementById('appDashboard');
  const menu = document.getElementById('dashboardNav');
  const toggle = document.getElementById('workspaceMenuToggle');
  const content = document.getElementById('dashboardContent');
  if (!dashboard || !menu || !toggle || !content) return;
  const mobile = () => window.matchMedia('(max-width: 760px)').matches;
  const setMenu = (open) => {
    dashboard.classList.toggle('sidebar-open', open);
    dashboard.classList.toggle('sidebar-collapsed', !open && !mobile());
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  toggle.addEventListener('click', () => setMenu(!dashboard.classList.contains('sidebar-open') && (mobile() || dashboard.classList.contains('sidebar-collapsed'))));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('button.dash-tab') && mobile()) setMenu(false);
  });
  let startX = 0, startY = 0;
  dashboard.addEventListener('touchstart', (event) => {
    if (!event.touches.length) return;
    startX = event.touches[0].clientX; startY = event.touches[0].clientY;
  }, {passive:true});
  dashboard.addEventListener('touchend', (event) => {
    if (!event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    if (dx > 0 && startX < 55) setMenu(true);
    else if (dx < 0 && dashboard.classList.contains('sidebar-open')) setMenu(false);
  }, {passive:true});
  document.addEventListener('pointerdown', (event) => {
    const target = event.target.closest('button, .role-card, .service-card, .ekskul-card, .btn');
    if (!target || target.disabled || target.closest('.table-wrap')) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'tap-ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    target.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 520);
  }, {passive:true});
  const observer = new MutationObserver(() => {
    content.classList.remove('page-enter');
    void content.offsetWidth;
    content.classList.add('page-enter');
  });
  observer.observe(content, {childList:true});
  window.addEventListener('resize', () => {
    if (!mobile()) dashboard.classList.remove('sidebar-open');
    else dashboard.classList.remove('sidebar-collapsed');
  });
})();
