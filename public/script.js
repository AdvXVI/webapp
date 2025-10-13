document.addEventListener("DOMContentLoaded", () => {

    // --- Overview Modal ---
  const overviewModal = document.getElementById("overviewModal");
  const overviewModalLabel = document.getElementById("overviewModalLabel");
  const overviewCarouselInner = document.getElementById("overview-carousel-inner");
  const overviewGenre = document.getElementById("overview-genre");
  const overviewDescription = document.getElementById("overview-description");
  const overviewPrice = document.getElementById("overview-price");
  const overviewAddToCart = document.getElementById("overview-add-to-cart");
  const overviewCarouselPreviews = document.getElementById("overview-carousel-previews");
  let currentOverviewProductId = null;

  // Checkout Modal
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutSummary = document.getElementById("checkout-summary");
  const confirmPurchaseBtn = document.getElementById("confirm-purchase-btn");
  const checkoutThankyou = document.getElementById("checkout-thankyou");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutModalFooter = document.getElementById("checkout-modal-footer");
  const thankyouConfirmBtn = document.getElementById("thankyou-confirm-btn");

  // const fieldValidators = {
  //   'checkout-email': validateEmail,
  //   'card-number': validateCardNumber,
  //   'card-expiry': validateExpiry,
  //   'card-cvc': validateCVC,
  //   'card-name': validateTextInput
  // };

  const savedCart = localStorage.getItem("cart");
  const cart = savedCart ? JSON.parse(savedCart) : [];

  let currentGenre = "all";
  let currentSort = "az"; // default
  const sortSelect = document.getElementById("product-sort");
  
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
    // "summertime-saga": {
    //   name: "Summertime Saga",
    //   price: 550,
    //   genre: "Visual Novel",
    //   description: "A coming-of-age dating sim with a twist.",
    //   images: [
    //     "/assets/sts.png",
    //     "/assets/sts1.jpg",
    //     "/assets/sts2.jpg",
    //     "/assets/sts3.webp"
    //   ]
    // },
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
      description: "Engage in an incredibly realistic brand of terrorist warfare in this wildly popular team-based game.",
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
      description: "Welcome to the club! Write poems for your crush and experience the terror of school romance in this critically-acclaimed psychological horror story.",
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

  $.validator.addMethod("textInput", function(value, element, maxLength) {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (!/[a-zA-Z0-9]/.test(trimmed)) return false;
    if (trimmed.length > maxLength) return false;
    return true;
  }, "Invalid input.");

  $.validator.addMethod("customEmail", function(value, element) {
    value = value.trim();
    if (!value) return false;

    const parts = value.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;
    if (!local || !domain) return false;

    if (!/^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/.test(local)) return false;
    if (!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/.test(domain)) return false;

    const labels = domain.split('.');
    for (const label of labels) {
      if (label.length === 0) return false;
      if (!/[A-Za-z0-9]/.test(label)) return false;
      if (/^-|-$/.test(label)) return false;
    }

    return true;
  }, "Invalid email address");


  $.validator.addMethod("notEmpty", function (value, element) {
    return value.trim().length > 0;
  }, "This field cannot be empty.");

  // Contact number
  $.validator.addMethod("contactNumber", function(value, element) {
    value = value.trim();
    return this.optional(element) || /^\d{6,19}$/.test(value);
  }, "Please enter a valid contact number (6-19 digits).");

  $.validator.addMethod("strongPassword", function(value, element) {
      // At least 8 characters
      if (value.length < 8) return false;

      // At least 1 lowercase letter
      if (!/[a-z]/.test(value)) return false;

      // At least 1 uppercase letter
      if (!/[A-Z]/.test(value)) return false;

      // At least 1 number
      if (!/[0-9]/.test(value)) return false;

      // At least 1 special character
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;

      return true;
  }, "Password must be at least 8 characters, with uppercase, lowercase, number, and special character.");

  $.validator.addMethod("passwordMatch", function(value, element, param) {
    const passwordVal = $(param).val().trim(); 
    return value.trim() === passwordVal && value.trim().length > 0;
  }, "Passwords do not match.");

  $.validator.addMethod("cardNumber", function(value, element) {
    const digits = value.replace(/\s+/g, "");
    return this.optional(element) || /^\d{16,19}$/.test(digits);
  }, "Invalid card number (16-19 digits).");

  $.validator.addMethod("cardExpiry", function(value, element) {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [mm, yy] = value.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const year = 2000 + yy;
    const expiry = new Date(year, mm);
    return expiry > now;
  }, "Invalid expiry date.");

  $.validator.addMethod("cardCVC", function(value, element) {
    return this.optional(element) || /^\d{3,4}$/.test(value);
  }, "Invalid CVC.");

  $.validator.addMethod("paymentSelected", function(value, element) {
    return $('input[name="payment-method"]:checked').length > 0;
  }, "Please select a payment method.");


  renderCart();
  renderProductCategories();
  renderProductsSection();
  renderFeaturedGames();
  setupLoginForm();
  setupSignupForm();
  setupContactForm();
  setupCheckoutForm();
  setupCheckoutSummary();
  setupPasswordToggles();

  /*
  setupCheckoutActions();

  */


  // resetModalForm('#loginModal');
  // resetModalForm('#signupModal');
  // resetModalForm('#checkoutModal');

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
        if (val > 99) {
          val = 99;
          showAlert("Max quantity reached (99).");
        }

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

  function setActivePreview(idx) {
    if (!overviewCarouselPreviews) return;
    overviewCarouselPreviews.querySelectorAll("img").forEach((img, i) => {
      img.classList.toggle("active", i === idx);
    });
  }

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

  function getAllProducts() {
    return Object.entries(productData).map(([id, data]) => ({
      name: data.name,
      price: data.price,
      img: data.images[0]
    }));
  }

  function setupLoginForm() {
    const $form = $('#login-form');
    const $email = $('#login-email');
    const $invalid = $('#login-invalid-feedback');

    restrictToEmail($email);

    $form.validate({
      onkeyup: function(element) { $(element).valid(); },  
      onfocusout: function(element) { $(element).valid(); },
      rules: {
        'login-email': {
          required: true,
          customEmail: true
        },
        'login-password': {
          required: true
        }
      },
      messages: {
        'login-email': {
          required: "Please enter your email",
        },
        'login-password': {
          required: "Please enter your password",
        }
      },
      errorClass: "is-invalid",
      validClass: "is-valid",
      errorPlacement: function(error, element) {
        const $feedback = $('#' + element.attr('id') + '-feedback');
        if ($feedback.length) $feedback.text(error.text());
      },
      highlight: function(element) {
        $(element).addClass('is-invalid').removeClass('is-valid');
        //$invalid.show();
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid').addClass('is-valid');
        const $feedback = $('#' + element.id + '-feedback');
        if ($feedback.length) $feedback.text('');
        //if ($form.valid()) $invalid.hide();
      },
      submitHandler: function(form) {
        console.log('Login success:', {
          email: $('#login-email').val(),
          password: $('#login-password').val()
        });
        bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
      }
    });
  }

  function setupSignupForm() {
    const $form = $('#signup-form');
    const $name = $('#signup-name');
    const $email = $('#signup-email');
    const $address = $('#signup-address');
    const $contact = $('#signup-contact');
    const $password = $('#signup-password');
    const $confirm = $('#signup-confirm');

    restrictToEmail($email);
    restrictToDigits($contact);

    $form.validate({
      onkeyup: function(element) { $(element).valid(); },  
      onfocusout: function(element) { $(element).valid(); },
      rules: {
        'signup-name': {
          required: true,
          textInput: 30
        },
        'signup-email': {
          required: true,
          customEmail: true
        },
        'signup-address': {
          required: true,
          textInput: 50
        },
        'signup-contact': {
          required: true,
          contactNumber: true
        },
        'signup-password': {
          required: true,
          strongPassword: true
        },
        'signup-confirm': {
          required: true,
          passwordMatch: '#signup-password'
        }
      },
      messages: {
        'signup-name': {
          required: "Please enter your name",
        },
        'signup-email': {
          required: "Please enter your email",
        },
        'signup-address': {
          required: "Please enter your address",
        },
        'signup-contact': {
          required: "Please enter your contact number",
        },
        'signup-password': {
          required: "Please enter your password",
        },
        'signup-confirm': {
          required: "Please reenter your password",
        }
      },
      errorClass: "is-invalid",
      validClass: "is-valid",
      errorPlacement: function(error, element) {
        const $feedback = $('#' + element.attr('id') + '-feedback');
        if ($feedback.length) $feedback.text(error.text());
      },
      highlight: function(element) {
        $(element).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid').addClass('is-valid');
        const $feedback = $('#' + element.id + '-feedback');
        if ($feedback.length) $feedback.text('');
      },
      submitHandler: function(form) {
        console.log('Signup success:', {
          name: $name.val(),
          email: $email.val(),
          address: $address.val(),
          contact: $contact.val(),
          password: $password.val()
        });
        bootstrap.Modal.getInstance(document.getElementById('signupModal'))?.hide();
      }
    });
  }

  function setupCheckoutForm() {
    const $form = $('#checkout-form');
    const $confirm = $('#confirm-purchase-btn');
    const $thankyou = $('#checkout-thankyou');
    const $modalFooter = $('#checkout-modal-footer');

    $form.validate({
      onkeyup: function(element) { $(element).valid(); },
      onfocusout: function(element) { $(element).valid(); },
      rules: {
        'checkout-email': {
          required: true,
          customEmail: true
        },
        'payment-method': {
          paymentSelected: true
        },
        'card-number': {
          required: function() { return $('input[name="payment-method"]:checked').val() === 'card'; },
          cardNumber: true
        },
        'card-expiry': {
          required: function() { return $('input[name="payment-method"]:checked').val() === 'card'; },
          cardExpiry: true
        },
        'card-cvc': {
          required: function() { return $('input[name="payment-method"]:checked').val() === 'card'; },
          cardCVC: true
        },
        'card-name': {
          required: function() { return $('input[name="payment-method"]:checked').val() === 'card'; },
          textInput: 50
        }
      },
      messages: {
        'checkout-email': {
          required: "Please enter your email",
        },
        'payment-method': {
          required: "Please select a payment method.",
        },
        'card-number': {
          required: "Please enter the Card's Number",
        },
        'card-expiry': {
          required: "Please enter the Card's Expiry",
        },
        'card-cvc': {
          required: "Please enter the Card's CVC",
        },
        'card-name': {
          required: "Please enter the Cardholder's Name",
        }
      },
      errorClass: "is-invalid",
      validClass: "is-valid",  
      errorPlacement: function(error, element) {
        const $feedback = $('#' + element.attr('id') + '-feedback');
        if ($feedback.length) $feedback.text(error.text());
      
        if (element.attr('name') === 'payment-method') {
          $('#payment-method-feedback').show().text(error.text());
        }
      },
      highlight: function(element) {
      $(element).removeClass('is-valid');
        if ($(element).attr('name') !== 'payment-method') {
            $(element).addClass('is-invalid');
        }
        if ($(element).attr('name') === 'payment-method') $('#payment-method-feedback').show();
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid');
        if ($(element).attr('name') !== 'payment-method') {
            $(element).addClass('is-valid');
        }
        const $feedback = $('#' + element.id + '-feedback');
        if ($feedback.length) $feedback.text('');
        if ($(element).attr('name') === 'payment-method') $('#payment-method-feedback').hide();
      },
      submitHandler: function(form) {
        console.log('✅ Checkout successful');
        $form.hide();
        if ($modalFooter.length) $modalFooter.hide();
        if ($thankyou.length) $thankyou.show();
        cart.length = 0;
        renderCart();
        updateCheckoutButton();
        $confirm.prop('disabled', true);
        //bootstrap.Modal.getInstance(document.getElementById('checkoutModal'))?.hide();
        }
    });

    // Toggle card fields visibility
    $('input[name="payment-method"]').on('change', () => {
      const checked = $('input[name="payment-method"]:checked').val();
      const $cardDetails = $('#card-details');
      if (checked === 'card') {
        $cardDetails.slideDown();
      } else {
        $cardDetails.slideUp();
        $('#card-number, #card-expiry, #card-cvc, #card-name').removeClass('is-invalid is-valid');
        $form.validate().resetForm(); // reset card validation
      }
    });

    // Enable/disable confirm button dynamically
    $form.find('input, select').add('input[name="payment-method"]').on('input change', () => {
      $confirm.prop('disabled', !$form.valid());
    });

    $('#thankyou-confirm-btn').on('click', () => {
      setTimeout(() => {
        if ($thankyou.length) $thankyou.hide();
        if ($modalFooter.length) $modalFooter.show();
        $form.show();
      }, 300);
    });
  }

  function setupContactForm() {
    const $form = $('#contact-form');
    const $name = $('#contact-name');
    const $email = $('#contact-email');
    const $message = $('#contact-message');
    const $success = $('#contact-success');

    if (!$form.length) return;

    restrictToEmail($email);

    $form.validate({
      onkeyup: function(element) { $(element).valid(); },
      onfocusout: function(element) { $(element).valid(); },
      rules: {
        'contact-name': {
          required: true,
          textInput: 30
        },
        'contact-email': {
          required: true,
          customEmail: true
        },
        'contact-message': {
          required: true,
          textInput: 1000
        }
      },
      messages: {
        'contact-name': {
          required: "Please enter your name",
        },
        'contact-email': {
          required: "Please enter your email",
        },
        'contact-message': {
          required: "Please enter a message",
        }
      },
      errorClass: "is-invalid",
      validClass: "is-valid",
      errorPlacement: function(error, element) {
        const $feedback = $('#' + element.attr('id') + '-feedback');
        if ($feedback.length) $feedback.text(error.text());
      },
      highlight: function(element) {
        $(element).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid').addClass('is-valid');
        const $feedback = $('#' + element.id + '-feedback');
        if ($feedback.length) $feedback.text('');
      },
      submitHandler: function(form) {
        showAlert("Your message has been sent!", "success");
        $success.removeClass('d-none');

        form.reset();
        $name.removeClass('is-invalid');
        $email.removeClass('is-invalid');
        $message.removeClass('is-invalid');

        setTimeout(() => {
          $success.addClass('d-none');
        }, 3000);
      }
    });
  }

  function setupPasswordToggles() {
    $('.toggle-password').on('click', function () {
      const target = $($(this).data('target'));
      const icon = $(this).find('i');
      const isPassword = target.attr('type') === 'password';

      target.attr('type', isPassword ? 'text' : 'password');
      icon.toggleClass('bi-eye bi-eye-slash');
    });
  }

  function setupCheckoutSummary() {
    if (checkoutBtn && checkoutSummary) {
      checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
          return;
        }

        let html = `<table class="table table-dark table-striped align-middle">
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
          html += `
            <tr>
              <td>${item.name}</td>
              <td>₱${item.price}</td>
              <td>${item.qty}</td>
              <td>₱${subtotal}</td>
            </tr>`;
        });

        html += `</tbody></table>
          <div class="text-end"><strong>Total: ₱${total}</strong></div>`;
        checkoutSummary.innerHTML = html;

        // reset UI state if already purchased earlier
        if (checkoutThankyou) checkoutThankyou.style.display = "none";
        if (checkoutForm) checkoutForm.style.display = "";
        if (checkoutModalFooter) checkoutModalFooter.style.display = "";
      });
    }
  }

  //clears modal inputs
  function resetModalForm(modalSelector) {
    const $modal = $(modalSelector);

    // When modal is fully hidden
    $modal.on('hidden.bs.modal', function () {
      const $form = $modal.find('form');
      $form.trigger('reset'); // clear all values

      // remove invalid classes
      $form.find('.is-invalid').removeClass('is-invalid');

      // hide any shared error feedbacks like login
      $form.find('.invalid-feedback').hide();
    });
  }

  function restrictToDigits($el) {
    $el.on('keypress', e => {
      if (!/[0-9]/.test(String.fromCharCode(e.which))) e.preventDefault();
    });
  }

  function restrictToEmail($el) {
    $el.on('keypress', e => {
      const char = String.fromCharCode(e.which);
      const val = $el.val();
      if (!/[a-zA-Z0-9._@-]/.test(char) || (char === '@' && val.includes('@'))) {
        e.preventDefault();
      }
    });
  }

  function showAlert(message, type = "danger", duration = 3000) {
    const container = document.getElementById("global-alert-container");
    if (!container) return;

    // Cap to max 3 alerts, remove oldest if needed
    const alerts = container.querySelectorAll(".alert");
    if (alerts.length >= 3) {
      const oldest = alerts[0];
      const bsOldest = bootstrap.Alert.getOrCreateInstance(oldest);
      oldest.classList.add("alert-exit-active");
      setTimeout(() => bsOldest.close(), 300);
    }

    // Create alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible text-center shadow fade show alert-enter`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(alertDiv);

    // Animate in
    requestAnimationFrame(() => {
      alertDiv.classList.remove("alert-enter");
      alertDiv.classList.add("alert-enter-active");
    });

    // Auto-dismiss after duration (if > 0)
    if (duration > 0) {
      setTimeout(() => {
        alertDiv.classList.remove("alert-enter-active");
        alertDiv.classList.add("alert-exit-active");
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alertDiv);
        setTimeout(() => bsAlert.close(), 300);
      }, duration);
    }

    // Animate out when closed manually
    alertDiv.addEventListener('close.bs.alert', () => {
      alertDiv.classList.remove("alert-enter-active");
      alertDiv.classList.add("alert-exit-active");
    });
  }

  /* hide legacy validations, will reuse if may mali sa jquery validations

  function setupLoginForm() {
    const $form = $('#login-form');
    const $email = $('#login-email');
    const $password = $('#login-password');
    const $invalid = $('#login-invalid-feedback');

    restrictToEmail($email);

    $email.on('input blur', () => validateField($email, validateEmail));
    $password.on('input blur', () => validateField($password, validateNotEmpty));

    $form.on('submit', function (e) {
      e.preventDefault();
      const emailOk = validateField($email, validateEmail);
      const passOk = validateField($password, validateNotEmpty);

      if (!emailOk || !passOk) {
        $invalid.show();
        $email.addClass('is-invalid');
        $password.addClass('is-invalid');
        return;
      }

      $invalid.hide();
      console.log('Login success:', { email: $email.val(), password: $password.val() });
      bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
    });
  }

  function setupSignupForm() {
    const $form = $('#signup-form');
    const $name = $('#signup-name');
    const $email = $('#signup-email');
    const $address = $('#signup-address');
    const $contact = $('#signup-contact');
    const $password = $('#signup-password');
    const $confirm = $('#signup-confirm');

    restrictToEmail($email);

    restrictToDigits($contact);

    $name.on('input blur', () => validateField($name, validateTextInput, 30));
    $email.on('input blur', () => validateField($email, validateEmail));
    $address.on('input blur', () => validateField($address, validateTextInput, 50));
    $contact.on('input blur', () => validateField($contact, validateContact));
    $password.on('input blur', () => {validateField($password, validateNotEmpty), validateField($confirm, val => val === $.trim($password.val()) && val.length > 0)});
    $confirm.on('input blur', () =>
      validateField($confirm, val => val === $.trim($password.val()) && val.length > 0)
    );

    $form.on('submit', function (e) {
      e.preventDefault();

      const valid =
        validateField($name, validateTextInput, 30) &&
        validateField($email, validateEmail) &&
        validateField($address, validateTextInput, 50) &&
        validateField($contact, validateContact) &&
        validateField($password, validateNotEmpty) &&
        validateField($confirm, val => val === $.trim($password.val()) && val.length > 0);

      if (!valid) return;

      console.log('Signup success:', {
        name: $name.val(),
        email: $email.val(),
        address: $address.val(),
        contact: $contact.val(),
        password: $password.val()
      });
      bootstrap.Modal.getInstance(document.getElementById('signupModal'))?.hide();
    });
  }

  function setupContactForm() {
    const $form = $('#contact-form');
    const $name = $('#contact-name');
    const $email = $('#contact-email');
    const $message = $('#contact-message');
    const $success = $('#contact-success');

    if (!$form.length) return;

    restrictToEmail($email);

    $name.on('input blur', () => {
      const val = $name.val();
      const $feedback = $('#name-feedback');
      if (val.trim().length === 0) {
        $feedback.text('Please enter your name.');
        $name.addClass('is-invalid');
      } else if (val.trim().length > 31) {
        $feedback.text('Name must be less than or equal to 30 characters.');
        $name.addClass('is-invalid');
      } else if (!validateTextInput($name.val())) {
        $feedback.text('Please enter your name.');
        $name.addClass('is-invalid');
        valid = false;
      } else {
        $name.removeClass('is-invalid');
      }
    });

    $email.on('input blur', () => {
      if (validateEmail($email.val())) {
        $email.removeClass('is-invalid');
      } else {
        $email.addClass('is-invalid');
      }
    });

    $message.on('input blur', () => {
      const val = $message.val();
      const $feedback = $('#message-feedback');
      if (val.trim().length === 0) {
        $feedback.text('Please enter your message.');
        $message.addClass('is-invalid');
      } else if (val.trim().length >= 1000) {
        $feedback.text('Message must be less than 1,000 characters.');
        $message.addClass('is-invalid');
      } else if (!validateTextInput($message.val())) {
        $feedback.text('Please enter your message.');
        $message.addClass('is-invalid');
        valid = false;
      } else {
        $message.removeClass('is-invalid');
      }
    });

    $form.on('submit', function (e) {
      e.preventDefault();
      let valid = true;

      if (!validateTextInput($name.val())) {
        $name.addClass('is-invalid');
        valid = false;
      } else {
        $name.removeClass('is-invalid');
      }

      if (!validateEmail($email.val())) {
        $email.addClass('is-invalid');
        valid = false;
      } else {
        $email.removeClass('is-invalid');
      }

      if (!validateTextInput($message.val())) {
        $message.addClass('is-invalid');
        valid = false;
      } else {
        $message.removeClass('is-invalid');
      }

      if (!valid) return;

      // Success
      showAlert("Your message has been sent!", "success");
      $success.removeClass('d-none');

      $form[0].reset();
      $name.removeClass('is-invalid');
      $email.removeClass('is-invalid');
      $message.removeClass('is-invalid');

      setTimeout(() => {
        $success.addClass('d-none');
      }, 3000);
    });
  }

  function setupCheckoutForm() {
    const $fields = $('#checkout-form input, #checkout-form select');
    const $confirm = $('#confirm-purchase-btn');
    const $email = $('#checkout-email');

    restrictToEmail($email);

    $fields.each(function () {
      const id = this.id;
      const validator = fieldValidators[id];
      if (validator) {
        $(this).on('input change', () => validateField($(this), validator));
      }
    });

    // Real-time validation for payment method radios
    $('input[name="payment-method"]').on('change', () => {
      validatePaymentMethod();
      toggleCardFields();
    });

    // Form submit
    $('#checkout-form').on('submit', function (e) {
      e.preventDefault();
      if (!validateCheckoutForm()) return;
      console.log('✅ Checkout successful');
      bootstrap.Modal.getInstance(document.getElementById('checkoutModal'))?.hide();
      // TODO: clear cart, show thank you message, etc.
    });

    // Update confirm button enable state as user types
    $fields.add('input[name="payment-method"]').on('input change', () => {
      $confirm.prop('disabled', !validateCheckoutForm(false));
    });
  }

  */

  //if functions keep growing baka setup nlng ng new function setupCheckoutModal that keeps
  //all checkout related funcs (easier call to ready func)

  /*

  function setupCheckoutActions() {
    if (confirmPurchaseBtn) {
      confirmPurchaseBtn.addEventListener("click", () => {
        // Validate before processing
        if (!validateCheckoutForm()) return;

        // Show thank you message
        if (checkoutThankyou) checkoutThankyou.style.display = "";
        if (checkoutForm) checkoutForm.style.display = "none";
        if (checkoutModalFooter) checkoutModalFooter.style.display = "none";

        // Clear the cart
        cart.length = 0;
        renderCart();
        updateCheckoutButton();
      });
    }

    // Thank you confirmation (closes modal)
    if (thankyouConfirmBtn) {
      thankyouConfirmBtn.addEventListener("click", () => {
        // Optional delay to give Bootstrap time to hide modal
        setTimeout(() => {
          if (checkoutThankyou) checkoutThankyou.style.display = "none";
          if (checkoutForm) checkoutForm.style.display = "";
          if (checkoutModalFooter) checkoutModalFooter.style.display = "";
        }, 300);
      });
    }
  }

  dont change validation funcs :D nakalimutan ko jquery validation but works mostly the same
  will refactor nalang later

  function validateField($field, validator, ...args) {
    const value = $.trim($field.val());
    const isValid = validator(value, ...args);
    $field.toggleClass('is-invalid', !isValid);
    return isValid;
  }

  function validateTextInput(value, maxLength = 1000) {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (!/[a-zA-Z0-9]/.test(trimmed)) return false;
    if (trimmed.length > maxLength) return false;
    return true;
  }

  function validateEmail(email) {
    if (typeof email !== 'string') return false;
    const s = email.trim();

    const parts = s.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;
    if (!local || !domain) return false;

    // must start and end with alphanumeric, allowed chars in middle are . _ -
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/.test(local)) return false;

    if (!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/.test(domain)) return false;

    const labels = domain.split('.');
    for (const label of labels) {
      if (label.length === 0) return false;             // no "example..com"
      if (!/[A-Za-z0-9]/.test(label)) return false;     // label must include alnum
      if (/^-|-$/.test(label)) return false;            // don't start/end with hyphen
    }

    return true;
  }

  function validateNotEmpty(value) {
    return value.trim().length > 0;
  }

  function validateContact(contact) {
    return /^\d{6,19}$/.test(contact);
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

  function validatePaymentMethod() {
    const checked = $('input[name="payment-method"]:checked').val();
    const $feedback = $('#payment-method-feedback');
    if (!checked) {
      $feedback.show();
      return false;
    }
    $feedback.hide();
    return true;
  }

  function toggleCardFields() {
    const checked = $('input[name="payment-method"]:checked').val();
    const $cardDetails = $('#card-details');
    if (checked === 'card') {
      $cardDetails.slideDown();
    } else {
      $cardDetails.slideUp();
      // reset validation states when switching away from card
      $('#card-number, #card-expiry, #card-cvc, #card-name').removeClass('is-invalid');
    }
  }

  function validateCheckoutForm() {
    let valid = true;

    // Email
    const $email = $('#checkout-email');
    if (!validateField($email, validateEmail)) valid = false;

    // Payment
    const methodValid = validatePaymentMethod();
    if (!methodValid) valid = false;

    // Card fields if card is selected
    const checked = $('input[name="payment-method"]:checked').val();
    if (checked === 'card') {
      const cardIds = ['card-number', 'card-expiry', 'card-cvc', 'card-name'];
      cardIds.forEach(id => {
        const $el = $('#' + id);
        if (!validateField($el, fieldValidators[id])) valid = false;
      });
    }

    $('#confirm-purchase-btn').prop('disabled', !valid);
    return valid;
  }

  */

});
