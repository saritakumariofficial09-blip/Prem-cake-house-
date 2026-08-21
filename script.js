const products = {
  cakes: [
    {id:"chocolate-cake", name:"Chocolate Cake", hi:"चॉकलेट केक", icon:"🎂", prices:{"0.5":250,"1":450,"2":850,"3":1200,"5":1900,"7":2600}, sizes:true},
    {id:"vanilla-cake", name:"Vanilla Cake", hi:"वेनिला केक", icon:"🎂", prices:{"0.5":220,"1":400,"2":750,"3":1050,"5":1700,"7":2350}, sizes:true},
    {id:"birthday-cake", name:"Birthday Cake", hi:"बर्थडे केक", icon:"🎂", prices:{"0.5":300,"1":550,"2":1000,"3":1450,"5":2200,"7":3000}, sizes:true}
  ],
  pastries: [
    {id:"chocolate-pastry", name:"Chocolate Pastry", hi:"चॉकलेट पेस्ट्री", icon:"🍰", price:60},
    {id:"vanilla-pastry", name:"Vanilla Pastry", hi:"वेनिला पेस्ट्री", icon:"🍰", price:55},
    {id:"pineapple-pastry", name:"Pineapple Pastry", hi:"पाइनएप्पल पेस्ट्री", icon:"🍰", price:55}
  ],
  cupcakes: [
    {id:"chocolate-cupcake", name:"Chocolate Cup Cake", hi:"चॉकलेट कप केक", icon:"🧁", price:50},
    {id:"vanilla-cupcake", name:"Vanilla Cup Cake", hi:"वेनिला कप केक", icon:"🧁", price:45},
    {id:"red-velvet-cupcake", name:"Red Velvet Cup Cake", hi:"रेड वेलवेट कप केक", icon:"🧁", price:70}
  ],
  items: [
    {id:"balloon", name:"Birthday Balloon", hi:"बर्थडे बैलून", icon:"🎈", price:20},
    {id:"cap", name:"Birthday Cap", hi:"बर्थडे कैप", icon:"🥳", price:25},
    {id:"candle", name:"Cake Candles", hi:"केक कैंडल", icon:"🕯️", price:30}
  ]
};

let cart = [];

function money(n) { return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(category="cakes") {
  document.querySelectorAll(".category").forEach(b => b.classList.toggle("active", b.dataset.category === category));
  const list = document.getElementById("product-list");
  list.innerHTML = products[category].map(p => `
    <article class="product">
      <div class="product-top">${p.icon}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.hi}</p>
        ${p.sizes ? `
          <label>Size
            <select id="size-${p.id}">
              <option value="0.5">½ Pound — ${money(p.prices["0.5"])}</option>
              <option value="1">1 Pound — ${money(p.prices["1"])}</option>
              <option value="2">2 Pound — ${money(p.prices["2"])}</option>
              <option value="3">3 Pound — ${money(p.prices["3"])}</option>
              <option value="5">5 Pound — ${money(p.prices["5"])}</option>
              <option value="7">7 Pound — ${money(p.prices["7"])}</option>
            </select>
          </label>` : `<strong>${money(p.price)}</strong>`}
        <button class="button" onclick="addToCart('${p.id}', '${category}')">Add to Order</button>
      </div>
    </article>`).join("");
}

function addToCart(id, category) {
  const p = products[category].find(x => x.id === id);
  let size = "";
  let price = p.price;
  if (p.sizes) {
    size = document.getElementById("size-"+p.id).value;
    price = p.prices[size];
  }
  const key = id + "-" + size;
  const existing = cart.find(x => x.key === key);
  if (existing) existing.qty++;
  else cart.push({key, id, name:p.name, hi:p.hi, size, price, qty:1});
  renderCart();
  document.getElementById("order").scrollIntoView({behavior:"smooth"});
}

function renderCart() {
  const wrap = document.getElementById("cart-items");
  if (!cart.length) {
    wrap.innerHTML = '<p class="empty">अभी कोई item नहीं चुना गया है।</p>';
    document.getElementById("cart-total").textContent = "₹0";
    return;
  }
  wrap.innerHTML = cart.map((x,i) => `
    <div class="cart-row">
      <div>
        <strong>${x.name}</strong>
        <small>${x.hi}${x.size ? " • "+x.size+" Pound" : ""} • ${money(x.price)} × ${x.qty}</small>
      </div>
      <div class="cart-actions">
        <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
        <strong>${x.qty}</strong>
        <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
      </div>
    </div>`).join("");
  const total = cart.reduce((s,x) => s + x.price*x.qty, 0);
  document.getElementById("cart-total").textContent = money(total);
}

function changeQty(i, delta) {
  cart[i].qty += delta;
  if (cart[i].qty <= 0) cart.splice(i,1);
  renderCart();
}

document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", () => renderProducts(btn.dataset.category));
});

document.getElementById("delivery-type").addEventListener("change", e => {
  document.getElementById("address-wrap").classList.toggle("hidden", e.target.value !== "delivery");
  document.getElementById("address").required = e.target.value === "delivery";
});

document.getElementById("order-form").addEventListener("submit", e => {
  e.preventDefault();
  if (!cart.length) {
    alert("कृपया पहले कोई product चुनें।");
    return;
  }
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const mode = document.getElementById("delivery-type").value;
  const payment = document.getElementById("payment").value;
  const address = document.getElementById("address").value.trim();
  const message = document.getElementById("cake-message").value.trim();
  const total = cart.reduce((s,x) => s + x.price*x.qty, 0);

  document.getElementById("confirmation").classList.remove("hidden");
  document.getElementById("confirmation").innerHTML = `
    <h3>Order Booked! 🎉</h3>
    <p><strong>${name}</strong>, आपका order request तैयार है।</p>
    <p>📞 Phone: ${phone}</p>
    <p>📦 ${mode === "pickup" ? "Shop Pickup — FREE" : "Home Delivery"}</p>
    ${mode === "delivery" ? `<p>📍 Address: ${address}</p>` : ""}
    <p>💳 Payment: ${payment === "upi" ? "UPI" : "Cash on Pickup"}</p>
    ${message ? `<p>🎂 Cake Message: ${message}</p>` : ""}
    <p><strong>Total: ${money(total)}</strong></p>
    <p class="small">अगले चरण में हम इस confirmation को bakery के WhatsApp/real order system से जोड़ेंगे।</p>`;
  document.getElementById("confirmation").scrollIntoView({behavior:"smooth"});
});

renderProducts();
renderCart();
