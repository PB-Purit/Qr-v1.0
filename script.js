/* ===== PDA ===== */
const pdaItems = [
  { tag:"PDA 1", id:"11142pda1"     },
  { tag:"PDA 2", id:"2448961"       },
  { tag:"PDA 3", id:"13Apr1988780"  },
  { tag:"C ice", id:"8857121917050" },
];

function renderQR(container, text, size){
  container.innerHTML="";
  new QRCode(container,{text,width:size,height:size,colorDark:"#161616",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
}

const pdaMenu=document.getElementById("pdaMenu");
const pdaMenuToggle=document.getElementById("pdaMenuToggle");

function togglePdaMenu(force){
  const open=typeof force==="boolean"?force:!pdaMenu.classList.contains("show");
  pdaMenu.classList.toggle("show",open);
  pdaMenuToggle.classList.toggle("active",open);
  pdaMenuToggle.setAttribute("aria-expanded", String(open));
}

pdaMenuToggle.addEventListener("click",(e)=>{e.stopPropagation();togglePdaMenu();});
document.addEventListener("click",(e)=>{
  if(!pdaMenu.contains(e.target) && !pdaMenuToggle.contains(e.target)) togglePdaMenu(false);
});
document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") togglePdaMenu(false); });

const visitCountEl=document.getElementById("visitCount");
function updateVisitCount(){
  const storageKey="qr-generator-visit-count";
  try{
    const nextCount=Number(localStorage.getItem(storageKey) || 0) + 1;
    localStorage.setItem(storageKey, nextCount);
    if(visitCountEl) visitCountEl.textContent=`ยอดเข้าชม: ${nextCount.toLocaleString("th-TH")}`;
  }catch{
    if(visitCountEl) visitCountEl.textContent="ยอดเข้าชม: 1";
  }
}

window.addEventListener("DOMContentLoaded",()=>{
  pdaItems.forEach((item,i)=>{ renderQR(document.getElementById("pda-mini-"+i), item.id, 42); });
  updateVisitCount();
});

let activePdaIdx=null;
function openPdaModal(idx){
  activePdaIdx=idx;
  const item=pdaItems[idx];
  document.getElementById("pdaModalTag").textContent=item.tag;
  document.getElementById("pdaModalId").textContent=item.id;
  renderQR(document.getElementById("pdaModalQr"), item.id, 180);
  document.getElementById("pdaOverlay").classList.add("show");
}
function closePdaModal(){
  document.getElementById("pdaOverlay").classList.remove("show");
  activePdaIdx=null;
}
document.getElementById("pdaOverlay").addEventListener("click",(e)=>{
  if(e.target===document.getElementById("pdaOverlay")) closePdaModal();
});
function downloadPdaQr(){
  const box=document.getElementById("pdaModalQr");
  setTimeout(()=>{
    const canvas=box.querySelector("canvas");
    const img=box.querySelector("img");
    const dataUrl=canvas?canvas.toDataURL("image/png"):(img?img.src:null);
    if(!dataUrl)return;
    const a=document.createElement("a");
    a.href=dataUrl;
    a.download="pda-"+(activePdaIdx!==null?pdaItems[activePdaIdx].id:"qr")+".png";
    document.body.appendChild(a);a.click();a.remove();
  },50);
}

/* ===== DIRECTORY ===== */
const directorySections=[
  {
    title:"Opening ST.",
    items:[
      {num:"G.01",label:"ร้านทองเยาวราช",               url:"https://surl.li/gviqqp"},
      {num:"01",  label:"อุปกรณ์ไฟฟ้า",          url:"https://surl.li/snjgbf"},
      {num:"02",  label:"ห้องลองชุด",             url:"https://surl.li/taymce"},
      {num:"03",  label:"ขนม",                    url:"https://surl.lt/ttrqnm"},
      {num:"04",  label:"ร้านทอง AURORA",                url:"https://surl.li/lfkwln"},
      {num:"05",  label:"ห้องน้ำ",                url:"https://surl.li/wrfvbk"},
      
      {num:"S.01",label:"Random Saving Petty cash",url:"https://surl.li/zhmlzq"},
    ]
  },
  {
    title:"Night ST.",
    items:[
      {num:"06",  label:"พนง",                    url:"https://surl.li/xsrvdj"},
      {num:"07",  label:"Stock",                  url:"https://surl.li/dnzrgz"},
      {num:"08",  label:"FF",                     url:"https://surl.li/lrdbbw"},
      {num:"09",  label:"Door Amazon",            url:"https://surl.li/awrvpv"},
      {num:"10",  label:"Food court",             url:"https://surl.li/spwrzh"},
      {num:"Log (Night)", label:"Log Status",           url:"https://surl.li/ifpvwh"},
    ]
  }
];

function getCanvasDataUrl(container){
  const canvas=container.querySelector("canvas");
  if(canvas)return canvas.toDataURL("image/png");
  const img=container.querySelector("img");
  return img?img.src:null;
}
function downloadFromBox(container,filename){
  setTimeout(()=>{
    const dataUrl=getCanvasDataUrl(container);
    if(!dataUrl)return;
    const a=document.createElement("a");
    a.href=dataUrl;
    a.download=filename.endsWith(".png")?filename:filename+".png";
    document.body.appendChild(a);a.click();a.remove();
  },50);
}

/* Custom generator */
const customInput=document.getElementById("customInput");
const genBtn=document.getElementById("genBtn");
const genErr=document.getElementById("genErr");
const genResult=document.getElementById("genResult");
const genQrBox=document.getElementById("genQrBox");
const genValText=document.getElementById("genValText");
const genDownload=document.getElementById("genDownload");

function generateCustom(){
  const val=customInput.value.trim();
  if(!val){genErr.classList.add("show");genResult.classList.remove("show");return;}
  genErr.classList.remove("show");
  renderQR(genQrBox,val,200);
  genValText.textContent=val;
  genResult.classList.add("show");
}
genBtn.addEventListener("click",generateCustom);
customInput.addEventListener("keydown",(e)=>{if(e.key==="Enter")generateCustom();});
genDownload.addEventListener("click",()=>downloadFromBox(genQrBox,"qrcode-custom"));

/* Directory grid */
const grid=document.getElementById("directoryGrid");
directorySections.forEach((section)=>{
  const sectionWrap=document.createElement("div");
  sectionWrap.className="directory-section";

  const sectionTitle=document.createElement("h3");
  sectionTitle.className="directory-section-title";
  sectionTitle.textContent=section.title;
  sectionWrap.appendChild(sectionTitle);

  const group=document.createElement("div");
  group.className="directory-group";
  section.items.forEach((item)=>{
    const tile=document.createElement("button");
    tile.className="tile";
    tile.innerHTML=`<span class="tile-num">${item.num}</span><span class="tile-label">${item.label}</span>`;
    tile.addEventListener("click",()=>openModal(item));
    group.appendChild(tile);
  });

  sectionWrap.appendChild(group);
  grid.appendChild(sectionWrap);
});

/* Directory modal */
const overlay=document.getElementById("overlay");
const modalNum=document.getElementById("modalNum");
const modalLabel=document.getElementById("modalLabel");
const modalQrBox=document.getElementById("modalQrBox");
const modalUrl=document.getElementById("modalUrl");
const modalDownload=document.getElementById("modalDownload");
const modalOpen=document.getElementById("modalOpen");
const modalClose=document.getElementById("modalClose");
let currentItem=null;

function openModal(item){
  currentItem=item;
  modalNum.textContent=item.num;
  modalLabel.textContent=item.label;
  modalUrl.textContent=item.url;
  renderQR(modalQrBox,item.url,200);
  overlay.classList.add("show");
}
function closeModal(){overlay.classList.remove("show");currentItem=null;}
modalClose.addEventListener("click",closeModal);
overlay.addEventListener("click",(e)=>{if(e.target===overlay)closeModal();});
modalDownload.addEventListener("click",()=>{if(currentItem)downloadFromBox(modalQrBox,"qrcode-"+currentItem.num);});
modalOpen.addEventListener("click",()=>{if(currentItem)window.open(currentItem.url,"_blank");});
