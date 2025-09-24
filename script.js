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

  function updateCheckoutButton() {
    const btn = document.getElementById("checkout-btn");
    const btnRow = document.getElementById("checkout-btn-row");
    if (!btn || !btnRow) return;
    if (cart.length === 0) {
      btn.disabled = true;
      btnRow.classList.add("d-none");
    } else {
      btn.disabled = false;
      btnRow.classList.remove("d-none");
    }
  }

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
    updateCheckoutButton();
  }

  // Add to Cart handler (Products section)
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const productId = btn.getAttribute("data-product-id");
      const data = productData[productId];
      if (!data) return;
      const existing = cart.find(item => item.name === data.name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: data.name, price: data.price, img: data.images[0], qty: 1 });
      }
      renderCart();
      showPage("#cart");
    });
  });

  // Show cart when navigating
  document.querySelector('a[href="#cart"]').addEventListener("click", () => {
    renderCart();
  });

  // Utility: Get all products from the Products section
  function getAllProducts() {
    const productCards = document.querySelectorAll('#products .card');
    return Array.from(productCards).map(card => {
      const name = card.querySelector('.card-title')?.textContent?.trim() || '';
      const priceText = card.querySelector('.card-text')?.textContent?.replace(/[^\d]/g, '') || '0';
      const price = parseInt(priceText, 10);
      const img = card.querySelector('img')?.getAttribute('src') || '';
      return { name, price, img };
    });
  }

  // Utility: Pick n random items from array
  function pickRandom(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  // Render Featured Games in Home section
  function renderFeaturedGames() {
    const featuredDiv = document.getElementById('featured-games');
    if (!featuredDiv) return;
    const products = getAllProducts();
    if (products.length === 0) {
      featuredDiv.innerHTML = '<p>No games available.</p>';
      return;
    }
    const featured = pickRandom(products, Math.min(3, products.length));
    featuredDiv.innerHTML = featured.map(game => `
      <div class="col-md-4">
        <div class="card h-100">
          <div class="ratio ratio-1x1">
            <img src="${game.img}" class="card-img-top object-fit-cover rounded" alt="${game.name}">
          </div>
          <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text">₱${game.price}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render featured games on load and when navigating to Home
  renderFeaturedGames();
  document.querySelector('a[href="#home"]').addEventListener("click", () => {
    renderFeaturedGames();
  });

  // Checkout Modal logic
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutSummary = document.getElementById("checkout-summary");
  const confirmPurchaseBtn = document.getElementById("confirm-purchase-btn");
  const checkoutThankyou = document.getElementById("checkout-thankyou");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutModalFooter = document.getElementById("checkout-modal-footer");
  const thankyouConfirmBtn = document.getElementById("thankyou-confirm-btn");
  let checkoutModal = null;

  // --- Checkout Form Validation ---
  const emailInput = document.getElementById("checkout-email");
  const cardDetails = document.getElementById("card-details");
  const cardNumber = document.getElementById("card-number");
  const cardExpiry = document.getElementById("card-expiry");
  const cardCvc = document.getElementById("card-cvc");
  const cardName = document.getElementById("card-name");
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  const paymentFeedback = document.getElementById("payment-method-feedback");

  // Track touched state for each field
  const touched = {
    email: false,
    payment: false,
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
    cardName: false
  };

  function validateEmail(email) {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validateCardNumber(num) {
    // Remove spaces, check for 16-19 digits
    const digits = num.replace(/\s+/g, "");
    return /^\d{16,19}$/.test(digits);
  }
  function validateExpiry(exp) {
    // MM/YY, valid month, not expired
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
    const [mm, yy] = exp.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const year = 2000 + yy;
    const expiry = new Date(year, mm);
    return expiry > now;
  }
  function validateCVC(cvc) {
    return /^\d{3,4}$/.test(cvc);
  }
  function validateCardName(name) {
    return name.trim().length > 0;
  }
  function getSelectedPayment() {
    const checked = Array.from(paymentRadios).find(r => r.checked);
    return checked ? checked.value : null;
  }
  function validateForm() {
    let valid = true;

    // Email
    if (!emailInput.value || !validateEmail(emailInput.value)) {
      if (touched.email) emailInput.classList.add("is-invalid");
      valid = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    // Payment method
    const payment = getSelectedPayment();
    if (!payment) {
      if (touched.payment) paymentFeedback.style.display = "";
      valid = false;
    } else {
      paymentFeedback.style.display = "none";
    }

    // Card details if Card is selected
    if (payment === "card") {
      if (!validateCardNumber(cardNumber.value)) {
        if (touched.cardNumber) cardNumber.classList.add("is-invalid");
        valid = false;
      } else {
        cardNumber.classList.remove("is-invalid");
      }
      if (!validateExpiry(cardExpiry.value)) {
        if (touched.cardExpiry) cardExpiry.classList.add("is-invalid");
        valid = false;
      } else {
        cardExpiry.classList.remove("is-invalid");
      }
      if (!validateCVC(cardCvc.value)) {
        if (touched.cardCvc) cardCvc.classList.add("is-invalid");
        valid = false;
      } else {
        cardCvc.classList.remove("is-invalid");
      }
      if (!validateCardName(cardName.value)) {
        if (touched.cardName) cardName.classList.add("is-invalid");
        valid = false;
      } else {
        cardName.classList.remove("is-invalid");
      }
    } else {
      // Remove card field errors if not card
      [cardNumber, cardExpiry, cardCvc, cardName].forEach(f => f && f.classList.remove("is-invalid"));
    }

    // Enable/disable confirm button
    if (confirmPurchaseBtn) confirmPurchaseBtn.disabled = !valid;
    return valid;
  }

  // Mark fields as touched on first input/change/blur
  if (emailInput) {
    emailInput.addEventListener("blur", () => { touched.email = true; validateForm(); });
    emailInput.addEventListener("input", () => { touched.email = true; validateForm(); });
  }
  if (paymentRadios.length) {
    paymentRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        touched.payment = true;
        if (getSelectedPayment() === "card") {
          cardDetails.style.display = "";
        } else {
          cardDetails.style.display = "none";
        }
        validateForm();
      });
    });
  }
  if (cardNumber) {
    cardNumber.addEventListener("blur", () => { touched.cardNumber = true; validateForm(); });
    cardNumber.addEventListener("input", () => { touched.cardNumber = true; validateForm(); });
  }
  if (cardExpiry) {
    cardExpiry.addEventListener("blur", () => { touched.cardExpiry = true; validateForm(); });
    cardExpiry.addEventListener("input", () => { touched.cardExpiry = true; validateForm(); });
  }
  if (cardCvc) {
    cardCvc.addEventListener("blur", () => { touched.cardCvc = true; validateForm(); });
    cardCvc.addEventListener("input", () => { touched.cardCvc = true; validateForm(); });
  }
  if (cardName) {
    cardName.addEventListener("blur", () => { touched.cardName = true; validateForm(); });
    cardName.addEventListener("input", () => { touched.cardName = true; validateForm(); });
  }

  // Validate on input/change for real-time button enable/disable
  if (checkoutForm) {
    checkoutForm.addEventListener("input", validateForm);
    checkoutForm.addEventListener("change", validateForm);
  }

  // Bootstrap Modal instance (requires Bootstrap JS bundle)
  document.addEventListener("DOMContentLoaded", () => {
    // Bootstrap Modal instance (requires Bootstrap JS bundle)
    if (window.bootstrap && window.bootstrap.Modal) {
      checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    }
  });

  // Populate checkout summary when modal is shown
  if (checkoutBtn && checkoutSummary) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
      }
      let html = `<table class="table">
        <thead>
          <tr>
            <th>Game</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>`;
      let total = 0;
      cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `<tr>
          <td>${item.name}</td>
          <td>₱${item.price}</td>
          <td>${item.qty}</td>
          <td>₱${subtotal}</td>
        </tr>`;
      });
      html += `</tbody></table>
        <div class="text-end"><strong>Total: ₱${total}</strong></div>`;
      checkoutSummary.innerHTML = html;

      // Reset thank you state
      if (checkoutThankyou) checkoutThankyou.style.display = "none";
      if (checkoutForm) checkoutForm.style.display = "";
      if (checkoutModalFooter) checkoutModalFooter.style.display = "";
    });
  }

  // Confirm purchase handler
  if (confirmPurchaseBtn) {
    confirmPurchaseBtn.addEventListener("click", () => {
      // Validate before purchase
      if (!validateForm()) return;
      // Show thank you, hide form and footer
      if (checkoutThankyou) checkoutThankyou.style.display = "";
      if (checkoutForm) checkoutForm.style.display = "none";
      if (checkoutModalFooter) checkoutModalFooter.style.display = "none";
      cart.length = 0;
      renderCart();
      updateCheckoutButton();
    });
  }

  // Thank you confirm button closes modal
  if (thankyouConfirmBtn) {
    thankyouConfirmBtn.addEventListener("click", () => {
      // Modal will close via data-bs-dismiss="modal"
      // Optionally, reset modal state for next open
      setTimeout(() => {
        if (checkoutThankyou) checkoutThankyou.style.display = "none";
        if (checkoutForm) checkoutForm.style.display = "";
        if (checkoutModalFooter) checkoutModalFooter.style.display = "";
      }, 300);
    });
  }

  // --- Product Data for Overview Modal ---
  const productData = {
    "until-youre-mine": {
      name: "Until You're Mine",
      price: 200,
      genre: "Visual Novel",
      description: "A gripping visual novel about choices and consequences.",
      images: [
        "./assets/product1.png",
        "./assets/header.png"
      ]
    },
    "eternum": {
      name: "Eternum",
      price: 250,
      genre: "Adventure",
      description: "Dive into a world of adventure and mystery in Eternum.",
      images: [
        "./assets/product2.png",
        "./assets/header.png"
      ]
    },
    "student-transfer": {
      name: "Student Transfer",
      price: 150,
      genre: "Simulation",
      description: "Experience life as a student in this unique simulation game.",
      images: [
        "./assets/product3.png",
        "./assets/product2.png"
      ]
    },
    "call-of-jd": {
      name: "Call of JD",
      price: 550,
      genre: "Action",
      description: "Fast-paced action and thrilling missions await in Call of JD.",
      images: [
        "./assets/product4.png",
        "./assets/header.png"
      ]
    },
    "summertime-saga": {
      name: "Summertime Saga",
      price: 550,
      genre: "Dating Sim",
      description: "A coming-of-age dating sim with a twist.",
      images: [
        "./assets/product1.png",
        "./assets/product4.png"
      ]
    },
    "god-of-war": {
      name: "God of War",
      price: 550,
      genre: "Action",
      description: "Epic battles and mythological adventures in God of War.",
      images: [
        "./assets/product4.png",
        "./assets/header.png"
      ]
    }
  };

  // --- Overview Modal Logic ---
  const overviewModal = document.getElementById("overviewModal");
  const overviewModalLabel = document.getElementById("overviewModalLabel");
  const overviewCarouselInner = document.getElementById("overview-carousel-inner");
  const overviewGenre = document.getElementById("overview-genre");
  const overviewDescription = document.getElementById("overview-description");
  const overviewPrice = document.getElementById("overview-price");
  const overviewAddToCart = document.getElementById("overview-add-to-cart");
  let currentOverviewProductId = null;

  // Handle Overview button click
  document.querySelectorAll(".overview-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const productId = btn.getAttribute("data-product-id");
      const data = productData[productId];
      if (!data) return;

      // Title
      overviewModalLabel.textContent = data.name;

      // Carousel (16:9 ratio for each image)
      overviewCarouselInner.innerHTML = data.images.map((img, idx) =>
        `<div class="carousel-item${idx === 0 ? " active" : ""}">
          <div class="ratio ratio-16x9">
            <img src="${img}" class="d-block w-100 rounded" alt="${data.name} image ${idx + 1}" style="object-fit:cover;">
          </div>
        </div>`
      ).join("");

      // Genre, Description, Price
      overviewGenre.textContent = data.genre;
      overviewDescription.textContent = data.description;
      overviewPrice.textContent = `₱${data.price}`;

      // Store current product id for add to cart
      currentOverviewProductId = productId;

      // Show modal
      if (window.bootstrap && window.bootstrap.Modal) {
        const modal = bootstrap.Modal.getOrCreateInstance(overviewModal);
        modal.show();
      }
    });
  });

  // Add to Cart from Overview Modal
  if (overviewAddToCart) {
    overviewAddToCart.addEventListener("click", () => {
      if (!currentOverviewProductId) return;
      const data = productData[currentOverviewProductId];
      if (!data) return;
      // Use first image as cart image
      const existing = cart.find(item => item.name === data.name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: data.name, price: data.price, img: data.images[0], qty: 1 });
      }
      renderCart();
      showPage("#cart");
      // Optionally close the modal
      if (window.bootstrap && window.bootstrap.Modal) {
        const modal = bootstrap.Modal.getInstance(overviewModal);
        if (modal) modal.hide();
      }
    });
  }
});
