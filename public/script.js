document.addEventListener("DOMContentLoaded", () => {

    // --- Overview Modal DOM references ---
  const overviewModal = document.getElementById("overviewModal");
  const overviewModalLabel = document.getElementById("overviewModalLabel");
  const overviewCarouselInner = document.getElementById("overview-carousel-inner");
  const overviewGenre = document.getElementById("overview-genre");
  const overviewDescription = document.getElementById("overview-description");
  const overviewPrice = document.getElementById("overview-price");
  const overviewAddToCart = document.getElementById("overview-add-to-cart");
  const overviewCarouselPreviews = document.getElementById("overview-carousel-previews");
  let currentOverviewProductId = null;

  // Checkout Modal logic
  const checkoutModalElem = document.getElementById('checkoutModal');
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutSummary = document.getElementById("checkout-summary");
  const confirmPurchaseBtn = document.getElementById("confirm-purchase-btn");
  const checkoutThankyou = document.getElementById("checkout-thankyou");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutModalFooter = document.getElementById("checkout-modal-footer");
  const thankyouConfirmBtn = document.getElementById("thankyou-confirm-btn");

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

  const savedCart = localStorage.getItem("cart");
  const cart = savedCart ? JSON.parse(savedCart) : [];

  let currentGenre = "all";
  let currentSort = "az"; // default
  const sortSelect = document.getElementById("product-sort");
  const contactForm = document.getElementById("contact-form");
  

  /*
  // Render featured games on load and when navigating to Home
  document.querySelector('a[href="/"]').addEventListener("click", () => {
    renderFeaturedGames();
  });
  
  hide cuz not needed rn
  */

  // fade in on load lulll
  const fades = document.querySelectorAll(".page-fade");
  requestAnimationFrame(() => {
    fades.forEach(elem => elem.classList.add("fadein"));
  });

  // fade out weeeeee
  //const navLinks = document.querySelectorAll("a[href]"); for all stuff even not nav
  const navLinks = document.querySelectorAll("nav a[href]");
  
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const targetUrl = link.getAttribute("href");

      // Ignore links like "#" or same-page anchors
      if (!targetUrl || targetUrl.startsWith("#")) return;

      event.preventDefault(); // stop immediate navigation

      const page = document.querySelector(".page-fade");
      if (page) {
        page.classList.remove("fadein");
        page.classList.add("fadeout");

        // After animation, navigate
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600); // match fadeout duration
      } else {
        // Fallback: just go immediately
        window.location.href = targetUrl;
      }
    });
  });

  // --- Product Data ---
  const productData = {
    "until-youre-mine": {
      name: "Until You're Mine",
      price: 225,
      genre: "Visual Novel",
      description: "A gripping visual novel about choices and consequences.",
      images: [
        "/assets/uym.png",
        "/assets/uym1.png",
        "/assets/uym2.png",
        "/assets/uym3.png",
        "/assets/uym4.png",
        "/assets/uym5.png"
      ]
    },
    "gta": {
      name: "Grand Theft Auto",
      price: 350,
      genre: "Open-World",
      description: "Grand Theft Auto V Enhanced, best game.",
      images: [
        "/assets/gta.webp",
        "/assets/gta1.jpg",
        "/assets/gta2.jpg",
        "/assets/gta3.jpg",
        "/assets/gta4.jpg",
        "/assets/gta5.jpg",
      ]
    },
    "peak": {
      name: "Peak",
      price: 185,
      genre: "Exploration",
      description: "Reach the peak!!!",
      images: [
        "/assets/peak.webp",
        "/assets/peak1.png",
        "/assets/peak2.png",
        "/assets/peak3.png",
        "/assets/peak4.png",
        "/assets/peak5.png"
      ]
    },
    "call-of-jd": {
      name: "Call of JD",
      price: 325,
      genre: "Action",
      description: "Fast-paced action and thrilling missions await in Call of JD.",
      images: [
        "/assets/jd.jpg",
        "/assets/jd1.jpg",
        "/assets/jd2.jpg",
        "/assets/jd3.jpg",
        "/assets/jd4.jpg"
      ]
    },
    "summertime-saga": {
      name: "Summertime Saga",
      price: 550,
      genre: "Visual Novel",
      description: "A coming-of-age dating sim with a twist.",
      images: [
        "/assets/sts.png",
        "/assets/sts1.jpg",
        "/assets/sts2.jpg",
        "/assets/sts3.webp"
      ]
    },
    "god-of-war": {
      name: "God of War",
      price: 565,
      genre: "Action",
      description: "Epic battles and mythological adventures in God of War.",
      images: [
        "/assets/gow.jpg",
        "/assets/gow1.jpg",
        "/assets/gow2.jpg",
        "/assets/gow3.jpg",
        "/assets/gow4.jpg",
        "/assets/gow5.jpg",
      ]
    },
    "Songsilk": {
      name: "Songsilk",
      price: 340,
      genre: "Metroidvania",
      description: "The long awaited Knight Hollow Songsilk.",
      images: [
        "/assets/silksong.jpg",
        "/assets/silksong1.webp",
        "/assets/silksong2.jpg",
        "/assets/silksong3.jpg",
        "/assets/silksong4.jpg"
      ]
    },
    "conter-strik": {
      name: "Conter Strik",
      price: 150,
      genre: "FPS",
      description: "Hello am 48 year man from somalia. Sorry for my bed england. I selled my wife for internet connection for play \"conter strik\" and i want to become the goodest player like you I play with 400 ping on brazil and i am global elite 2. pls no copy pasterio my story",
      images: [
        "/assets/cs.jpg",
        "/assets/cs1.jpg",
        "/assets/cs2.jpg",
        "/assets/cs3.jpg"
      ]
    },
    "ddlc": {
      name: "Doki Doki Literature Club",
      price: 200,
      genre: "Visual Novel",
      description: "You kind of left her hanging this morning, you know?",
      images: [
        "/assets/ddlc.png",
        "/assets/ddlc1.jpg",
        "/assets/ddlc2.jpg",
        "/assets/ddlc3.jpg",
        "/assets/ddlc4.jpg",
        "/assets/ddlc5.jpg"
      ]
    }
  };

  // Add Sort dropdown listener
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentSort = sortSelect.value;
      renderProductsSection(currentGenre, currentSort);
    });
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

  // Contact form handler
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Optionally, validate fields here
      contactForm.reset();
      const success = document.getElementById("contact-success");
      if (success) {
        success.classList.remove("d-none");
        setTimeout(() => {
          success.classList.add("d-none");
        }, 3000);
      }
    });
  }

  renderCart();
  renderProductCategories();
  renderProductsSection();
  renderFeaturedGames();


  function goToPage(pageName) {
    const routes = {
      home: "/",
      products: "/products",
      about: "/about",
      contact: "/contact",
      cart: "/cart"
    };

    const target = routes[pageName.toLowerCase()];
    if (!target) return;

    const page = document.querySelector(".page-fade");
    if (page) {
      page.classList.remove("fadein");
      page.classList.add("fadeout");

      setTimeout(() => {
        window.location.href = target;
      }, 600);
    } else {
      window.location.href = target;
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
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

  // pick n random items from array ---
  function pickRandom(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

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
    saveCart();
    const cartItemsDiv = document.getElementById("cart-items");
    const cartTotalDiv = document.getElementById("cart-total");
    const btnRow = document.getElementById("checkout-btn-row");
    if (!cartItemsDiv) return;

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `<p class="text-center">Your cart is empty 😢</p>`;
      cartTotalDiv.innerHTML = "";
      if (btnRow) btnRow.classList.add("d-none");
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

    // Show checkout button row if cart has items
    if (btnRow) btnRow.classList.remove("d-none");
    updateCheckoutButton();
  }

  // --- set active preview image ---
  function setActivePreview(idx) {
    if (!overviewCarouselPreviews) return;
    overviewCarouselPreviews.querySelectorAll("img").forEach((img, i) => {
      img.classList.toggle("active", i === idx);
    });
  }

  // --- Render Categories (Genres) ---
  function renderProductCategories() {
    const categoriesDiv = document.getElementById('product-categories');
    if (!categoriesDiv) return;
    const genres = Array.from(new Set(Object.values(productData).map(p => p.genre))).sort();
    categoriesDiv.innerHTML = `
      <div class="d-inline-flex flex-wrap gap-2 justify-content-center">
        <button class="btn btn-outline-primary btn-sm category-btn active" data-genre="all">All</button>
        ${genres.map(genre =>
          `<button class="btn btn-outline-primary btn-sm category-btn" data-genre="${genre}">${genre}</button>`
        ).join('')}
      </div>
    `;
    categoriesDiv.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        categoriesDiv.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGenre = btn.getAttribute('data-genre');
        renderProductsSection(currentGenre, currentSort);
      });
    });
  }

  // --- Render Products Section ---
  function renderProductsSection(filterGenre = "all", sortBy = "az") {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    let entries = Object.entries(productData);

    // filter by genre
    if (filterGenre && filterGenre !== "all") {
      entries = entries.filter(([id, data]) => data.genre === filterGenre);
    }

    // sort logic
    entries.sort(([, a], [, b]) => {
      switch (sortBy) {
        case "az": return a.name.localeCompare(b.name);
        case "za": return b.name.localeCompare(a.name);
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        default: return 0;
      }
    });

    // render cards
    productsList.innerHTML = entries.map(([id, data]) => `
      <div class="col-md-4">
        <div class="card h-100">
          <div class="ratio ratio-1x1">
            <img src="${data.images[0]}" class="card-img-top object-fit-cover rounded" alt="${data.name}">
          </div>
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">₱${data.price}</p>
            <a href="/" class="btn btn-primary w-100 overview-btn" data-product-id="${id}">Overview</a>
            <a href="/" class="btn btn-secondary w-100 add-to-cart" data-product-id="${id}">Add to Cart</a>
          </div>
        </div>
      </div>
    `).join('');

    attachProductEventListeners();
    attachOverviewModalListeners();
  }

  // --- Attach Product Event Listeners ---
  function attachProductEventListeners() {
    // Add to Cart handler (Products section)
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.onclick = null;
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
        goToPage("cart");
      });
    });
  }

  // --- Attach Overview Modal Event Listeners ---
  function attachOverviewModalListeners() {
    // Remove previous listeners to avoid duplicates
    document.querySelectorAll(".overview-btn").forEach(btn => {
      btn.onclick = null;
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

        // Previews below carousel
        if (overviewCarouselPreviews) {
          overviewCarouselPreviews.innerHTML = data.images.map((img, idx) =>
            `<img src="${img}" data-idx="${idx}" alt="Preview ${idx + 1}" class="${idx === 0 ? "active" : ""}">`
          ).join("");
        }

        // Preview click: jump to carousel slide
        if (overviewCarouselPreviews) {
          overviewCarouselPreviews.querySelectorAll("img").forEach((img, idx) => {
            img.onclick = () => {
              const carousel = window.bootstrap && window.bootstrap.Carousel
                ? bootstrap.Carousel.getOrCreateInstance(document.getElementById("overviewCarousel"))
                : null;
              if (carousel) carousel.to(idx);
              setActivePreview(idx);
            };
          });
        }

        // --- Sync preview highlight on carousel slide ---
        const carouselElem = document.getElementById("overviewCarousel");
        if (carouselElem) {
          // Remove previous event listeners to avoid stacking
          carouselElem._previewSyncHandler && carouselElem.removeEventListener("slid.bs.carousel", carouselElem._previewSyncHandler);
          carouselElem._previewSyncHandler = function () {
            const items = Array.from(overviewCarouselInner.querySelectorAll(".carousel-item"));
            const idx = items.findIndex(item => item.classList.contains("active"));
            setActivePreview(idx);
          };
          carouselElem.addEventListener("slid.bs.carousel", carouselElem._previewSyncHandler);
        }

        // Reset carousel to first slide
        if (window.bootstrap && window.bootstrap.Carousel) {
          try {
            const carousel = bootstrap.Carousel.getOrCreateInstance(document.getElementById("overviewCarousel"));
            carousel.to(0);
          } catch {}
        }

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
      overviewAddToCart.onclick = () => {
        if (!currentOverviewProductId) return;
        const data = productData[currentOverviewProductId];
        if (!data) return;
        const existing = cart.find(item => item.name === data.name);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name: data.name, price: data.price, img: data.images[0], qty: 1 });
        }
        renderCart();
        goToPage("cart");

        if (window.bootstrap && window.bootstrap.Modal) {
          const modal = bootstrap.Modal.getInstance(overviewModal);
          if (modal) modal.hide();
        }
      };
    }
  }

  // --- Override getAllProducts to use productData ---
  function getAllProducts() {
    return Object.entries(productData).map(([id, data]) => ({
      name: data.name,
      price: data.price,
      img: data.images[0]
    }));
  }

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

});
