document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");

  function showPage(id) {
    pages.forEach(p => p.style.display = "none"); // hide all
    const active = document.querySelector(id);
    if (active) active.style.display = "block";   // show one
  }

  // handle clicks
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("href"); // e.g. #products
      showPage(target);
    });
  });

  // default on load (if URL has #, respect it)
  if (window.location.hash) {
    showPage(window.location.hash);
  } else {
    showPage("#home");
  }

  const cart = [];

  function renderCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    const cartTotalDiv = document.getElementById("cart-total");
    if (!cartItemsDiv) return;

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `<p class="text-center">Cart is empty 😢</p>`;
      cartTotalDiv.innerHTML = "";
      return;
    }

    let html = `<table class="table table-dark table-striped align-middle">
      <thead>
        <tr>
          <th>Game</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>`;
    let total = 0;
    cart.forEach((item, idx) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      html += `<tr>
        <td>
          <img src="${item.img}" alt="${item.name}" style="width:40px;height:40px;object-fit:cover;margin-right:8px;">
          ${item.name}
        </td>
        <td>₱${item.price}</td>
        <td>
          <input type="number" min="1" value="${item.qty}" data-idx="${idx}" class="cart-qty form-control form-control-sm" style="width:70px;">
        </td>
        <td>₱${subtotal}</td>
        <td>
          <button class="btn btn-danger btn-sm cart-remove" data-idx="${idx}">Remove</button>
        </td>
      </tr>`;
    });
    html += `</tbody></table>`;
    cartItemsDiv.innerHTML = html;
    cartTotalDiv.innerHTML = `<h4>Total: ₱${total}</h4>`;

    // Quantity change
    cartItemsDiv.querySelectorAll(".cart-qty").forEach(input => {
      input.addEventListener("change", e => {
        const idx = parseInt(input.dataset.idx);
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;
        cart[idx].qty = val;
        renderCart();
      });
    });

    // Remove item
    cartItemsDiv.querySelectorAll(".cart-remove").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = parseInt(btn.dataset.idx);
        cart.splice(idx, 1);
        renderCart();
      });
    });
  }

  // Add to Cart handler
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const name = btn.dataset.product;
      const price = parseInt(btn.dataset.price);
      const img = btn.dataset.img;
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }
      renderCart();
      // Optionally, switch to cart view
      showPage("#cart");
    });
  });

  // Show cart when navigating
  document.querySelector('a[href="#cart"]').addEventListener("click", () => {
    renderCart();
  });
});
