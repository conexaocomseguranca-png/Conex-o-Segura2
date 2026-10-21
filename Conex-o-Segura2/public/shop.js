// Loja do Conexão Segura — JavaScript puro, sem dependências.
const SHOP_ITEMS = [
  {id:"avatar-fox",name:"Raposa Gamer",category:"Avatares",price:100,appearance:"teal",image:"assets/avatar-raposa.jpg",description:"Esperta, curiosa e pronta para a missão.",badge:"NOVO"},
  {id:"avatar-panda",name:"Panda Conectado",category:"Avatares",price:100,appearance:"gold",image:"assets/avatar-panda.jpg",description:"Fofura de sobra e muita conexão.",badge:"NOVO"},
  {id:"avatar-cat",name:"Gato Aventureiro",category:"Avatares",price:100,appearance:"coral",image:"assets/avatar-gato.jpg",description:"Um parceiro curioso para cada aventura.",badge:"NOVO"},
  {id:"avatar-capybara",name:"Capivara de Boa",category:"Avatares",price:100,appearance:"teal",image:"assets/avatar-capivara.jpg",description:"Tranquila no estilo, ligada na segurança.",badge:"NOVO"},
  {id:"frame-teal",name:"Conexão Neon",category:"Molduras",price:50,appearance:"teal",description:"Um brilho extra para o seu avatar.",badge:"POPULAR"},
  {id:"frame-coral",name:"Chama Digital",category:"Molduras",price:100,appearance:"coral",description:"Uma moldura cheia de energia."},
  {id:"frame-gold",name:"Agente Dourado",category:"Molduras",price:150,appearance:"gold",description:"Seu avatar com um toque de ouro.",badge:"ESPECIAL"},
  {id:"badge-shield",name:"Guardião da Rede",category:"Emblemas",price:80,appearance:"shield",description:"O emblema de quem protege a rede."},
  {id:"badge-star",name:"Estrela Digital",category:"Emblemas",price:120,appearance:"star",description:"Uma estrela para acompanhar seu nome."},
  {id:"badge-crown",name:"Mestre da Segurança",category:"Emblemas",price:200,appearance:"crown",description:"Uma conquista digna de um mestre.",badge:"ESPECIAL"}
];

function purchaseShopItem(balance,owned,item){
  if(owned.includes(item.id))return {balance,owned,error:"Você já tem este item."};
  if(balance<item.price)return {balance,owned,error:"Moedas insuficientes."};
  return {balance:balance-item.price,owned:[...owned,item.id],error:null};
}

function readWallet(){
  return {balance:0,owned:[],avatar:null,frame:null,emblem:null};
}
let shopWallet=readWallet();
function saveWallet(){
  // Os dados definitivos ficam no banco PostgreSQL (via /api).
  updateWallet();
  applyShopEquipment();
}
function updateWallet(){
  const balance=document.getElementById("walletBalance");
  if(balance)balance.textContent=shopWallet.balance.toLocaleString("pt-BR");
}
function addWalletCoins(amount){
  // Atualiza o contador imediatamente e grava cada moeda coletada na corrida.
  if(!player?.id || !runner?.partidaId)return;
  shopWallet.balance+=amount;saveWallet();
  for(let i=0;i<amount;i++){
    const partidaId=runner.partidaId, jogadorId=player.id;
    Banco.enfileirar(()=>Banco.pedir('/api/moedas',{
      jogador_id:jogadorId,partida_id:partidaId,quantidade:1
    })).catch(e=>Banco.aviso('Nao foi possivel salvar uma moeda: '+e.message));
  }
}
function applyShopEquipment(){
  const frame=SHOP_ITEMS.find(item=>item.id===shopWallet.frame);
  document.body.dataset.avatarFrame=frame?.appearance||"default";
  const emblem=SHOP_ITEMS.find(item=>item.id===shopWallet.emblem);
  document.querySelectorAll(".player-tag").forEach(tag=>{
    const old=tag.querySelector(".equipped-emblem");if(old)old.remove();
    if(emblem)tag.insertAdjacentHTML("beforeend",`<span class="equipped-emblem" title="${emblem.name}">${shopSymbol(emblem.appearance)}</span>`);
  });
}
function shopSymbol(appearance){
  const shapes={shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z"/><path d="m8 12 3 3 5-6"/>',star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',crown:'<path d="m3 6 4 4 5-7 5 7 4-4-2 12H5z"/><path d="M5 21h14"/>'};
  return shapes[appearance]?`<svg viewBox="0 0 24 24" class="shop-symbol" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[appearance]}</svg>`:"";
}
function openShop(){
  cancelAnimationFrame(runnerFrame);clearTimeout(timer);stopCardTimer();stopSpeak();
  game.status="shop";shopCategory="Todos";shopInventory=false;shopMessage="";render();
}
function shopEquipmentSlot(item){return item.category==="Avatares"?"avatar":item.category==="Molduras"?"frame":"emblem";}
function ownedAnimalAvatar(id){return SHOP_ITEMS.find(item=>item.id===id&&item.category==="Avatares"&&shopWallet.owned.includes(id));}
function itemIsEquipped(item){return shopWallet[shopEquipmentSlot(item)]===item.id;}
function shopCard(item){
  const owned=shopWallet.owned.includes(item.id),equipped=itemIsEquipped(item),affordable=shopWallet.balance>=item.price;
  return `<article class="shop-card appearance-${item.appearance}">
    <div class="shop-item-art">
      <span class="item-category">${item.category==="Avatares"?"AVATAR":item.category==="Molduras"?"MOLDURA":"EMBLEMA"}</span>
      ${item.badge?`<span class="item-badge">${item.badge}</span>`:""}
      ${item.category==="Avatares"?`<img class="shop-animal-avatar" src="${item.image}" alt="${item.name}" width="130" height="130" loading="lazy">`:item.category==="Molduras"?`<div class="shop-avatar-frame"><img src="${playerAvatar()}" alt="${item.name}"></div>`:`<div class="shop-emblem" aria-hidden="true">${shopSymbol(item.appearance)}</div>`}
      <span class="art-spark spark-one">✦</span><span class="art-spark spark-two">✧</span>
    </div>
    <div class="shop-item-info"><h2>${item.name}</h2><p>${item.description}</p>
      <div class="shop-purchase-row"><span class="shop-price"><img src="${COIN_IMG}" alt="Moedas">${item.price}</span><span class="item-ownership">${owned?"✓ ADQUIRIDO":""}</span></div>
      <button class="shop-buy ${owned?"owned":""}" data-shop-item="${item.id}" ${equipped||(!owned&&!affordable)?"disabled":""}>${equipped?"✓ Equipado":owned?"Equipar":affordable?"Comprar →":"Moedas insuficientes"}</button>
    </div>
  </article>`;
}
function renderShop(){
  const items=SHOP_ITEMS.filter(item=>(shopCategory==="Todos"||item.category===shopCategory)&&(!shopInventory||shopWallet.owned.includes(item.id)));
  app.innerHTML=`<section class="shop-screen">
    <div class="shop-breadcrumb"><button class="shop-back" id="shopBack">← Menu inicial</button><span>/</span><span>Loja</span></div>
    <div class="shop-heading"><div><span class="eyebrow">SEU ESFORÇO VALE RECOMPENSAS</span><h1>Loja <em>Conexão Segura</em><span class="heading-spark">✦</span></h1><p>Novas conquistas. Um estilo só seu.</p></div>
      <div class="shop-balance"><img src="${COIN_IMG}" alt=""><div><span>SUAS MOEDAS</span><strong>${shopWallet.balance.toLocaleString("pt-BR")}</strong></div></div>
    </div>
    <div class="shop-feature"><div class="feature-icon">✦</div><div><strong>Uma nova missão: deixar sua marca.</strong><p>Uma coleção especial para os guardiões da internet.</p></div><div class="feature-art"><img src="${AVATARS[1]}" alt=""><span>⭐</span><img src="${AVATARS[0]}" alt=""></div></div>
    <div class="shop-toolbar"><div class="shop-tabs" role="tablist" aria-label="Categorias da loja">${["Todos","Avatares","Molduras","Emblemas"].map(category=>`<button role="tab" aria-selected="${shopCategory===category}" class="shop-tab ${shopCategory===category?"active":""}" data-category="${category}">${category==="Todos"?"▦ ":category==="Avatares"?"☺ ":category==="Molduras"?"◉ ":"✧ "}${category}</button>`).join("")}</div><button class="inventory-button ${shopInventory?"active":""}" aria-pressed="${shopInventory}" id="inventoryBtn">✓ Meus itens <span>${shopWallet.owned.length}</span></button></div>
    <div class="shop-collection-heading"><h2>${shopInventory?"Sua coleção":"Escolha seu próximo item"}</h2><span>${items.length} ${items.length===1?"item":"itens"}</span></div>
    <div class="shop-grid">${items.map(shopCard).join("")}</div>
    ${items.length?"":'<div class="shop-empty"><span>◇</span><h2>Sua coleção começa aqui</h2><p>Nenhum item adquirido nesta categoria.</p><button class="shop-back" id="allItemsBtn">Ver itens da loja →</button></div>'}
    <p class="shop-message" role="status">${escapeHtml(shopMessage)}</p>
    <div class="shop-bottom"><span>🛡️ CONQUISTAS DE VERDADE. SÓ MOEDAS DO JOGO.</span><button class="shop-back" id="shopPlay">Ganhar mais moedas →</button></div>
  </section>`;
  document.getElementById("shopBack").onclick=goHome;
  document.getElementById("shopPlay").onclick=()=>{if(player)startGame();else{goHome();openModal();}};
  document.getElementById("inventoryBtn").onclick=()=>{shopInventory=!shopInventory;shopMessage="";renderShop();};
  document.getElementById("allItemsBtn")?.addEventListener("click",()=>{shopInventory=false;shopCategory="Todos";renderShop();});
  app.querySelectorAll("[data-category]").forEach(button=>button.onclick=()=>{shopCategory=button.dataset.category;shopMessage="";renderShop();});
  app.querySelectorAll("[data-shop-item]").forEach(button=>button.onclick=async()=>{
    const item=SHOP_ITEMS.find(item=>item.id===button.dataset.shopItem);if(!item||!player)return;
    button.disabled=true;
    try{
      const novo=!shopWallet.owned.includes(item.id);
      const rota=novo?'/api/compras':'/api/equipar';
      const retorno=await Banco.enfileirar(()=>Banco.pedir(rota,{
        jogador_id:player.id,item_id:item.id
      }));
      shopWallet=retorno.carteira;
      if(item.category==='Avatares'){
        player.avatar=item.id;
        selectedAvatar=item.id;
      }
      shopMessage=novo?`${item.name} adquirido e equipado!`:`${item.name} equipado!`;
      Banco.limparAviso();chirp(true);saveWallet();renderShop();
    }catch(erro){
      shopMessage=erro.message;
      Banco.aviso('Nao foi possivel salvar a compra: '+erro.message);
      renderShop();
    }
  });
  updateWallet();
}