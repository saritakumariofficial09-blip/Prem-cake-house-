
const WHATSAPP = "916200171750";

const cakeProducts = [
  {name:"Pineapple Cake", hi:"पाइनएप्पल केक", photo:"pineapple.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}},
  {name:"Chocolate Cake", hi:"चॉकलेट केक", photo:"chocolate.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}},
  {name:"Vanilla Cake", hi:"वनीला केक", photo:"vanilla.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}},
  {name:"Butterscotch Cake", hi:"बटरस्कॉच केक", photo:"butterscotch.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}},
  {name:"White Forest Cake", hi:"व्हाइट फॉरेस्ट केक", photo:"white-forest.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}},
  {name:"Strawberry Cake", hi:"स्ट्रॉबेरी केक", photo:"strawberry.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}},
  {name:"Blueberry Cake", hi:"ब्लूबेरी केक", photo:"blueberry.jpg", prices:{"½ Pound":150,"1 Pound":250,"2 Pound":500,"3 Pound":750,"5 Pound":1250,"7 Pound":1750}}
];

const products = {
  cakes: cakeProducts,
  pastries: [{name:"Pastry",hi:"सभी प्रकार",price:20}],
  cupcakes: [{name:"Cup Cake",hi:"सभी प्रकार",price:15,photo:"cupcake.jpg"}],
  items: [
    {name:"Balloon",hi:"गुब्बारा",price:50},
    {name:"Birthday Cap",hi:"बर्थडे कैप",price:10},
    {name:"Candle",hi:"मोमबत्ती",price:10,photo:"number-candle.jpg"},
    {name:"Cake Decoration Banner",hi:"केक डेकोरेशन बैनर",price:50},
    {name:"Fog / Spray",hi:"फॉग / स्प्रे",price:50}
  ]
};

let activeCategory = "cakes";
let cart = [];

function money(n){ return "₹" + Number(n || 0).toLocaleString("en-IN"); }

function renderProducts(){
  const box = document.getElementById("product-list");
  box.innerHTML = "";
  products[activeCategory].forEach((p,i)=>{
    const card = document.createElement("div");
    card.className = "product-card";

    if(activeCategory === "cakes"){
      card.innerHTML = `
        ${p.photo ? `<img class="product-photo" src="${p.photo}" alt="${p.name}">` : ""}
        <h3>${p.name}</h3><p>${p.hi}</p>
        <select id="size-${i}">
          ${Object.entries(p.prices).map(([s,v])=>`<option value="${s}">${s} — ${money(v)}</option>`).join("")}
        </select>
        <button class="btn add-btn" onclick="addCake(${i})">➕ ऑर्डर में जोड़ें</button>`;
    }else{
      card.innerHTML = `
        ${p.photo ? `<img class="product-photo" src="${p.photo}" alt="${p.name}">` : `<div class="product-photo product-emoji">${activeCategory==="pastries"?"🍰":activeCategory==="cupcakes"?"🧁":"🎈"}</div>`}
        <h3>${p.name}</h3><p>${p.hi} — ${money(p.price)}</p>
        <button class="btn add-btn" onclick="addSimple(${i})">➕ ऑर्डर में जोड़ें</button>`;
    }
    box.appendChild(card);
  });
}

function addCake(i){
  const p = cakeProducts[i];
  const size = document.getElementById("size-"+i).value;
  const price = p.prices[size];
  const key = p.name + "|" + size;
  const found = cart.find(x=>x.key===key);
  if(found) found.qty++;
  else cart.push({key,name:p.name,size,price,qty:1});
  renderCart();
  document.getElementById("order").scrollIntoView({behavior:"smooth"});
}

function addSimple(i){
  const p = products[activeCategory][i];
  const key = p.name;
  const found = cart.find(x=>x.key===key);
  if(found) found.qty++;
  else cart.push({key,name:p.name,price:p.price,qty:1});
  renderCart();
  document.getElementById("order").scrollIntoView({behavior:"smooth"});
}

function changeQty(index,delta){
  cart[index].qty += delta;
  if(cart[index].qty <= 0) cart.splice(index,1);
  renderCart();
}

function renderCart(){
  const box=document.getElementById("cart");
  if(!cart.length){box.innerHTML="<p>अभी कोई item नहीं चुना गया है।</p>";}
  else{
    box.innerHTML=cart.map((x,i)=>`
      <div class="cart-item">
        <div><b>${x.name}</b>${x.size?"<br><small>"+x.size+"</small>":""}<br>${money(x.price)} × ${x.qty}</div>
        <div class="qty"><button type="button" onclick="changeQty(${i},-1)">−</button>${x.qty}<button type="button" onclick="changeQty(${i},1)">+</button></div>
      </div>`).join("");
  }
  updateTotals();
}

function updateTotals(){
  const items = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const type = document.getElementById("delivery-type").value;
  const distance = Number(document.getElementById("distance").value||0);
  const delivery = type==="delivery" ? distance*20 : 0;
  document.getElementById("items-total").textContent=money(items);
  document.getElementById("delivery-total").textContent=money(delivery);
  document.getElementById("grand-total").textContent=money(items+delivery);
}

document.querySelectorAll(".category").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".category").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory=btn.dataset.category;
    renderProducts();
  });
});

document.getElementById("delivery-type").addEventListener("change",()=>{
  document.getElementById("delivery-fields").classList.toggle("hidden",document.getElementById("delivery-type").value!=="delivery");
  updateTotals();
});
document.getElementById("distance").addEventListener("input",updateTotals);

document.getElementById("order-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length){alert("कृपया पहले कोई product चुनें।");return;}

  const name=document.getElementById("customer-name").value.trim();
  const phone=document.getElementById("customer-phone").value.trim();
  const mode=document.getElementById("delivery-type").value;
  const distance=Number(document.getElementById("distance").value||0);
  const address=document.getElementById("address").value.trim();
  const cakeMessage=document.getElementById("cake-message").value.trim();
  const payment=document.getElementById("payment").value;

  if(mode==="delivery" && (!distance || !address)){
    alert("Delivery के लिए distance और address भरें।");
    return;
  }

  const itemsTotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const delivery=mode==="delivery"?distance*20:0;
  const grandTotal=itemsTotal+delivery;

  const lines=[
    "🍰 *Prem Cake House — New Order*",
    "",
    "👤 Name: "+name,
    "📞 Phone: "+phone,
    "",
    "🧾 *Order Details:*"
  ];
  cart.forEach(x=>lines.push("• "+x.name+(x.size?" — "+x.size:"")+" × "+x.qty+" — "+money(x.price*x.qty)));
  lines.push("", "🛍️ Items Total: "+money(itemsTotal));
  if(mode==="delivery"){
    lines.push("🛵 Delivery: "+distance+" km × ₹20 = "+money(delivery),"📍 Address: "+address);
  }else lines.push("🏪 Shop Pickup: FREE");
  if(cakeMessage) lines.push("🎂 Cake Message: "+cakeMessage);
  lines.push("💰 *Grand Total: "+money(grandTotal)+"*","💳 Payment: "+payment);

  const bakeryUrl="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(lines.join("\n"));

  const customerLines=[
    "🎉 *आपका ऑर्डर सफलतापूर्वक बुक हो गया है!*",
    "",
    "🍰 *Prem Cake House*",
    "👤 नाम: "+name,
    "",
    "🧾 *ऑर्डर की जानकारी:*"
  ];
  cart.forEach(x=>customerLines.push("• "+x.name+(x.size?" — "+x.size:"")+" × "+x.qty+" — "+money(x.price*x.qty)));
  customerLines.push("","🛍️ सामान की कीमत: "+money(itemsTotal));
  if(mode==="delivery") customerLines.push("🛵 Delivery: "+distance+" km × ₹20 = "+money(delivery),"📍 पता: "+address);
  else customerLines.push("🏪 Shop Pickup: FREE");
  customerLines.push("💰 *कुल कीमत: "+money(grandTotal)+"*","💳 Payment: "+payment);
  if(cakeMessage) customerLines.push("🎂 Cake Message: "+cakeMessage);
  customerLines.push("","🙏 धन्यवाद! Prem Cake House में आपका स्वागत है। ❤️");

  const customerUrl="https://wa.me/?text="+encodeURIComponent(customerLines.join("\n"));

  document.getElementById("bakery-whatsapp").href=bakeryUrl;
  document.getElementById("customer-whatsapp").href=customerUrl;
  document.getElementById("confirmation").classList.remove("hidden");
  document.getElementById("confirmation").scrollIntoView({behavior:"smooth",block:"center"});

  // Keep the convenient first step: open the bakery WhatsApp immediately.
  window.open(bakeryUrl,"_blank");
});

renderProducts();
renderCart();
