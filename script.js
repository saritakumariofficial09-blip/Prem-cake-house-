document.addEventListener("DOMContentLoaded", function () {
  const WHATSAPP = "916200171750";
  const cakeSizes = [
    ["0.5", "½ Pound", 150],
    ["1", "1 Pound", 250],
    ["2", "2 Pound", 500],
    ["3", "3 Pound", 750],
    ["5", "5 Pound", 1250],
    ["7", "7 Pound", 1750]
  ];

  const products = {
    cakes: [
      ["Chocolate Cake","चॉकलेट केक","🎂"],
      ["Vanilla Cake","वेनिला केक","🎂"],
      ["Pineapple Cake","पाइनएप्पल केक","🎂"],
      ["Butterscotch Cake","बटरस्कॉच केक","🎂"],
      ["White Forest Cake","व्हाइट फॉरेस्ट केक","🎂"],
      ["Strawberry Cake","स्ट्रॉबेरी केक","🎂"],
      ["Blueberry Cake","ब्लूबेरी केक","🎂"]
    ],
    pastries: [["Pastry","सभी प्रकार की पेस्ट्री","🍰"]],
    cupcakes: [["Cup Cake","सभी प्रकार के कप केक","🧁"]],
    items: [
      ["Birthday Balloon","बर्थडे बैलून","🎈",50,100],
      ["Birthday Cap","बर्थडे कैप","🥳",10,100],
      ["Cake Candle","केक कैंडल","🕯️",10,100],
      ["Cake Decoration Banner","केक डेकोरेशन बैनर","🎀",50,300],
      ["Fog / Spray","फॉग / स्प्रे","💨",50,150]
    ]
  };

  let cart = [];

  function money(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
  }

  function renderCategory(category) {
    document.querySelectorAll(".category").forEach(function (button) {
      button.classList.toggle("active", button.dataset.category === category);
    });

    const list = document.getElementById("product-list");
    list.innerHTML = "";

    products[category].forEach(function (p, index) {
      const card = document.createElement("article");
      card.className = "product";

      let controls = "";
      if (category === "cakes") {
        const select = document.createElement("select");
        select.id = "cake-size-" + index;
        cakeSizes.forEach(function (s) {
          const option = document.createElement("option");
          option.value = s[0];
          option.textContent = s[1] + " — " + money(s[2]);
          select.appendChild(option);
        });
        controls = "<label>Size</label>";
        card.innerHTML = '<div class="product-top">' + p[2] + '</div><div class="product-body"><h3>' + p[0] + '</h3><p>' + p[1] + '</p></div>';
        card.querySelector(".product-body").appendChild(select);
      } else {
        let priceText = "";
        if (category === "pastries") priceText = money(20);
        if (category === "cupcakes") priceText = money(15);
        if (category === "items") priceText = money(p[3]) + " – " + money(p[4]);

        card.innerHTML = '<div class="product-top">' + p[2] + '</div><div class="product-body"><h3>' + p[0] + '</h3><p>' + p[1] + '</p><b>' + priceText + '</b>' + (category === "items" ? '<p><small>Final price shop confirm करेगा।</small></p>' : '') + '</div>';
      }

      const body = card.querySelector(".product-body");
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "btn";
      addButton.style.marginTop = "12px";
      addButton.style.width = "100%";
      addButton.textContent = "Add to Order";
      addButton.addEventListener("click", function () {
        addProduct(category, index);
      });
      body.appendChild(addButton);
      list.appendChild(card);
    });

    document.getElementById("products").scrollIntoView({behavior:"smooth", block:"start"});
  }

  function addProduct(category, index) {
    const p = products[category][index];
    let size = "";
    let price = 0;

    if (category === "cakes") {
      const select = document.getElementById("cake-size-" + index);
      const selected = cakeSizes.find(function (s) { return s[0] === select.value; });
      size = selected[0];
      price = selected[2];
    } else if (category === "pastries") {
      price = 20;
    } else if (category === "cupcakes") {
      price = 15;
    } else {
      price = p[3];
    }

    const key = category + "|" + index + "|" + size;
    const existing = cart.find(function (item) { return item.key === key; });

    if (existing) existing.qty += 1;
    else cart.push({
      key:key, name:p[0], size:size, price:Number(price), qty:1,
      variable:category === "items"
    });

    renderCart();
    document.getElementById("order").scrollIntoView({behavior:"smooth", block:"start"});
  }

  function renderCart() {
    const cartEl = document.getElementById("cart");

    if (cart.length === 0) {
      cartEl.innerHTML = "<p>अभी कोई item नहीं चुना गया है।</p>";
    } else {
      cartEl.innerHTML = "";
      cart.forEach(function (item, index) {
        const row = document.createElement("div");
        row.className = "cart-row";
        const details = document.createElement("div");
        details.innerHTML = "<b>" + item.name + "</b><small>" +
          (item.size ? item.size + " • " : "") + money(item.price) + " × " + item.qty +
          (item.variable ? " • starting price" : "") + "</small>";

        const qty = document.createElement("div");
        qty.className = "qty";
        qty.innerHTML = '<button type="button">−</button> ' + item.qty + ' <button type="button">+</button>';
        qty.children[0].addEventListener("click", function(){ changeQty(index,-1); });
        qty.children[1].addEventListener("click", function(){ changeQty(index,1); });

        row.appendChild(details);
        row.appendChild(qty);
        cartEl.appendChild(row);
      });
    }

    updateTotals();
  }

  function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index,1);
    renderCart();
  }

  function getDeliveryCharge() {
    if (document.getElementById("delivery-type").value !== "delivery") return 0;
    const km = Number(document.getElementById("distance").value);
    return Number.isFinite(km) && km > 0 ? km * 20 : 0;
  }

  function updateTotals() {
    const itemsTotal = cart.reduce(function(sum,item) {
      return sum + (Number(item.price) * Number(item.qty));
    }, 0);
    const delivery = getDeliveryCharge();

    document.getElementById("items-total").textContent = money(itemsTotal);
    document.getElementById("delivery-total").textContent = money(delivery);
    document.getElementById("grand-total").textContent = money(itemsTotal + delivery);
  }

  document.querySelectorAll(".category").forEach(function(button) {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      renderCategory(button.dataset.category);
    });
  });

  document.getElementById("delivery-type").addEventListener("change", function() {
    const delivery = this.value === "delivery";
    const fields = document.getElementById("delivery-fields");
    fields.classList.toggle("hidden", !delivery);
    document.getElementById("distance").required = delivery;
    document.getElementById("address").required = delivery;
    updateTotals();
  });

  document.getElementById("distance").addEventListener("input", updateTotals);

  document.getElementById("order-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("कृपया पहले कोई product चुनें।");
      return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const mode = document.getElementById("delivery-type").value;
    const distance = Number(document.getElementById("distance").value || 0);
    const address = document.getElementById("address").value.trim();
    const cakeMessage = document.getElementById("cake-message").value.trim();
    const payment = document.getElementById("payment").value;

    const itemsTotal = cart.reduce(function(sum,item) {
      return sum + (Number(item.price) * Number(item.qty));
    }, 0);
    const delivery = getDeliveryCharge();
    const grandTotal = itemsTotal + delivery;

    const lines = [
      "🍰 *PREM CAKE HOUSE ORDER*",
      "",
      "👤 नाम: " + name,
      "📞 फोन: " + phone,
      "",
      "*🧾 ORDER DETAILS*"
    ];

    cart.forEach(function(item) {
      lines.push(
        item.name + (item.size ? " — " + item.size : "") +
        " × " + item.qty + " — " + money(Number(item.price) * Number(item.qty)) +
        (item.variable ? " (starting price)" : "")
      );
    });

    lines.push("", "🛍️ सामान की कीमत: " + money(itemsTotal));

    if (mode === "delivery") {
      lines.push("🛵 Delivery: " + distance + " km × ₹20 = " + money(delivery));
      lines.push("📍 पता: " + address);
    } else {
      lines.push("🏪 Shop Pickup: FREE");
    }

    lines.push("💰 *कुल कीमत: " + money(grandTotal) + "*");
    lines.push("💳 Payment: " + payment);

    if (cakeMessage) lines.push("", "🎂 Cake Message: " + cakeMessage);

    lines.push(
      "",
      "🎉 *आपका ऑर्डर सफलतापूर्वक बुक हो गया है!*",
      "🙏 धन्यवाद! Prem Cake House में आपका स्वागत है ❤️",
      "",
      "कृपया details check करके WhatsApp पर Send करें।"
    );

    const url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
    const confirmation = document.getElementById("confirmation");
    confirmation.classList.remove("hidden");
    confirmation.innerHTML =
      "<h3>Order Message Ready! 🎉</h3>" +
      "<p>पूरा order WhatsApp के लिए तैयार है।</p>" +
      '<a class="btn whatsapp" target="_blank" rel="noopener" href="' + url + '">📱 Open WhatsApp & Send</a>';

    window.open(url, "_blank");
  });

  renderCategory("cakes");
  renderCart();
});