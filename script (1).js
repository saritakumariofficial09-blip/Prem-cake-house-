const products={
cakes:[
{id:"chocolate",name:"Chocolate Cake",hi:"चॉकलेट केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true},
{id:"vanilla",name:"Vanilla Cake",hi:"वेनिला केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true},
{id:"pineapple",name:"Pineapple Cake",hi:"पाइनएप्पल केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true},
{id:"butterscotch",name:"Butterscotch Cake",hi:"बटरस्कॉच केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true},
{id:"white-forest",name:"White Forest Cake",hi:"व्हाइट फॉरेस्ट केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true},
{id:"strawberry",name:"Strawberry Cake",hi:"स्ट्रॉबेरी केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true},
{id:"blueberry",name:"Blueberry Cake",hi:"ब्लूबेरी केक",icon:"🎂",prices:{"0.5":150,"1":250,"2":500,"3":750,"5":1250,"7":1750},sizes:true}
],
pastries:[{id:"pastry",name:"Pastry",hi:"सभी प्रकार की पेस्ट्री",icon:"🍰",price:20}],
cupcakes:[{id:"cupcake",name:"Cup Cake",hi:"सभी प्रकार के कप केक",icon:"🧁",price:15}],
items:[
{id:"balloon",name:"Birthday Balloon",hi:"बर्थडे बैलून",icon:"🎈",minPrice:50,maxPrice:100,range:true},
{id:"cap",name:"Birthday Cap",hi:"बर्थडे कैप",icon:"🥳",minPrice:10,maxPrice:100,range:true},
{id:"candle",name:"Cake Candle",hi:"केक कैंडल",icon:"🕯️",minPrice:10,maxPrice:100,range:true},
{id:"banner",name:"Cake Decoration Banner",hi:"केक डेकोरेशन बैनर",icon:"🎀",minPrice:50,maxPrice:300,range:true},
{id:"fog",name:"Fog / Spray",hi:"फॉग / स्प्रे",icon:"💨",minPrice:50,maxPrice:150,range:true}
]};

let cart=[];
const money=n=>"₹"+n.toLocaleString("en-IN");

function renderProducts(category="cakes"){
document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
document.getElementById("product-list").innerHTML=products[category].map(p=>`
<article class="product"><div class="product-top">${p.icon}</div><div class="product-body">
<h3>${p.name}</h3><p>${p.hi}</p>
${p.sizes?`<label>Size<select id="size-${p.id}">
<option value="0.5">½ Pound — ${money(p.prices["0.5"])}</option>
<option value="1">1 Pound — ${money(p.prices["1"])}</option>
<option value="2">2 Pound — ${money(p.prices["2"])}</option>
<option value="3">3 Pound — ${money(p.prices["3"])}</option>
<option value="5">5 Pound — ${money(p.prices["5"])}</option>
<option value="7">7 Pound — ${money(p.prices["7"])}</option>
</select></label>`:p.range?`<strong>${money(p.minPrice)} – ${money(p.maxPrice)}</strong><p class="small">type/design के अनुसार final price बदल सकती है।</p>`:`<strong>${money(p.price)}</strong>`}
<button class="button" onclick="addToCart('${p.id}','${category}')">Add to Order</button>
</div></article>`).join("");
}

function addToCart(id,category){
const p=products[category].find(x=>x.id===id);let size="",price=p.price;
if(p.sizes){size=document.getElementById("size-"+p.id).value;price=p.prices[size]}
else if(p.range){price=p.minPrice}
const key=id+"-"+size;const existing=cart.find(x=>x.key===key);
if(existing)existing.qty++;else cart.push({key,id,name:p.name,hi:p.hi,size,price,qty:1,range:!!p.range,min:p.minPrice,max:p.maxPrice});
renderCart();document.getElementById("order").scrollIntoView({behavior:"smooth"});
}

function renderCart(){
const wrap=document.getElementById("cart-items");
if(!cart.length){wrap.innerHTML='<p class="empty">अभी कोई item नहीं चुना गया है।</p>';document.getElementById("cart-total").textContent="₹0";return}
wrap.innerHTML=cart.map((x,i)=>`<div class="cart-row"><div><strong>${x.name}</strong><small>${x.hi}${x.size?" • "+x.size+" Pound":""}${x.range?" • starting price":""} • ${money(x.price)} × ${x.qty}</small></div><div class="cart-actions"><button class="qty-btn" onclick="changeQty(${i},-1)">−</button><strong>${x.qty}</strong><button class="qty-btn" onclick="changeQty(${i},1)">+</button></div></div>`).join("");
document.getElementById("cart-total").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);renderCart()}

document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>renderProducts(b.dataset.category)));

document.getElementById("delivery-type").addEventListener("change",e=>{
const delivery=e.target.value==="delivery";
document.getElementById("address-wrap").classList.toggle("hidden",!delivery);
document.getElementById("distance-wrap").classList.toggle("hidden",!delivery);
document.getElementById("address").required=delivery;
document.getElementById("distance").required=delivery;
});

document.getElementById("order-form").addEventListener("submit",e=>{
e.preventDefault();
if(!cart.length){alert("कृपया पहले कोई product चुनें।");return}
const name=document.getElementById("customer-name").value.trim();
const phone=document.getElementById("customer-phone").value.trim();
const mode=document.getElementById("delivery-type").value;
const payment=document.getElementById("payment").value;
const address=document.getElementById("address").value.trim();
const distance=Number(document.getElementById("distance").value||0);
const message=document.getElementById("cake-message").value.trim();
const itemsTotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
const deliveryCharge=mode==="delivery"?distance*20:0;
const total=itemsTotal+deliveryCharge;
document.getElementById("confirmation").classList.remove("hidden");
document.getElementById("confirmation").innerHTML=`
<h3>Order Booked! 🎉</h3><p><strong>${name}</strong>, आपका order request तैयार है।</p>
<p>📞 Phone: ${phone}</p><p>📦 ${mode==="pickup"?"Shop Pickup — FREE":"Home Delivery"}</p>
${mode==="delivery"?`<p>📍 Address: ${address}</p><p>🛵 Delivery: ${distance} km × ₹20 = <strong>${money(deliveryCharge)}</strong></p>`:""}
<p>💳 Payment: ${payment==="upi"?"UPI (details later)":"Cash on Pickup"}</p>
${message?`<p>🎂 Cake Message: ${message}</p>`:""}
<p>🧾 Items Total: ${money(itemsTotal)}</p><p><strong>Total: ${money(total)}</strong></p>
<p class="small">नोट: Balloon, Cap, Candle, Banner और Fog/Spray की final कीमत type/design के अनुसार बदल सकती है। अभी cart में minimum listed price लिया गया है।</p>`;
document.getElementById("confirmation").scrollIntoView({behavior:"smooth"});
});
renderProducts();renderCart();