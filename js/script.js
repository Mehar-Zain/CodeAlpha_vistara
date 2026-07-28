let lastFocusedElement = null;

("use strict");

/* =========================================================
   VISTARA — PROFESSIONAL IMAGE GALLERY
   Main JavaScript Application
========================================================= */

/* =========================================================
   01. IMAGE DATA
========================================================= */

const images = [
  {
    id: 1,

    title: "Into the Wild",

    category: "nature",

    photographer: "Vistara Collection",

    description:
      "A quiet mountain landscape surrounded by mist, creating a sense of depth, calm, and endless discovery.",

    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 2,

    title: "Golden Horizon",

    category: "nature",

    photographer: "Vistara Collection",

    description:
      "Warm sunlight stretches across an untouched landscape as the day begins to fade.",

    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 3,

    title: "The Journey",

    category: "travel",

    photographer: "Vistara Collection",

    description:
      "A winding road through a breathtaking landscape, reminding us that every journey begins with a single step.",

    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 4,

    title: "Urban Geometry",

    category: "architecture",

    photographer: "Vistara Collection",

    description:
      "Modern architecture transformed into an abstract composition of lines, shadows, and structure.",

    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 5,

    title: "Wild Silence",

    category: "wildlife",

    photographer: "Vistara Collection",

    description:
      "A powerful wildlife moment captured in the quiet stillness of its natural environment.",

    thumbnail:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 6,

    title: "Wanderlust",

    category: "travel",

    photographer: "Vistara Collection",

    description:
      "A remote destination waiting to be explored by those who seek something beyond the familiar.",

    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 7,

    title: "Silent Peaks",

    category: "nature",

    photographer: "Vistara Collection",

    description:
      "Majestic peaks rise above a peaceful valley, creating a dramatic natural panorama.",

    thumbnail:
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 8,

    title: "City Lines",

    category: "architecture",

    photographer: "Vistara Collection",

    description:
      "A contemporary cityscape where architecture, symmetry, and light meet in perfect balance.",

    thumbnail:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 9,

    title: "Into the Unknown",

    category: "travel",

    photographer: "Vistara Collection",

    description:
      "A remote landscape that invites curiosity and the courage to explore what lies beyond.",

    thumbnail:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 10,

    title: "Eyes of the Wild",

    category: "wildlife",

    photographer: "Vistara Collection",

    description:
      "A close encounter with nature, revealing the quiet intensity of the wild.",

    thumbnail:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 11,

    title: "Coastal Escape",

    category: "travel",

    photographer: "Vistara Collection",

    description:
      "Clear waters and dramatic coastlines create the perfect setting for an unforgettable escape.",

    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=90",
  },

  {
    id: 12,

    title: "Modern Perspective",

    category: "architecture",

    photographer: "Vistara Collection",

    description:
      "A bold architectural perspective showcasing the relationship between space, form, and light.",

    thumbnail:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=75",

    full: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=90",
  },
];
/* =========================================================
   02. APPLICATION STATE
========================================================= */

const state = {
  activeFilter: "all",

  searchQuery: "",

  favorites: JSON.parse(localStorage.getItem("vistaraFavorites")) || [],

  currentLightboxIndex: 0,

  filteredImages: [...images],
};

/* =========================================================
   03. DOM ELEMENTS
========================================================= */

const elements = {
  pageLoader: document.getElementById("pageLoader"),

  siteHeader: document.getElementById("siteHeader"),

  navLinks: document.getElementById("navLinks"),

  menuToggle: document.getElementById("menuToggle"),

  mobileMenu: document.getElementById("mobileMenu"),

  mobileMenuClose: document.getElementById("mobileMenuClose"),

  searchTrigger: document.getElementById("searchTrigger"),

  searchInput: document.getElementById("searchInput"),

  clearSearch: document.getElementById("clearSearch"),

  filterButtons: document.getElementById("filterButtons"),

  galleryGrid: document.getElementById("galleryGrid"),

  featuredGrid: document.getElementById("featuredGrid"),

  emptyState: document.getElementById("emptyState"),

  resetGallery: document.getElementById("resetGallery"),

  resultsCount: document.getElementById("resultsCount"),

  favoritesCount: document.getElementById("favoritesCount"),

  totalImages: document.getElementById("totalImages"),

  totalCategories: document.getElementById("totalCategories"),

  lightbox: document.getElementById("lightbox"),

  lightboxBackdrop: document.getElementById("lightboxBackdrop"),

  lightboxClose: document.getElementById("lightboxClose"),

  lightboxPrev: document.getElementById("lightboxPrev"),

  lightboxNext: document.getElementById("lightboxNext"),

  lightboxImage: document.getElementById("lightboxImage"),

  lightboxTitle: document.getElementById("lightboxTitle"),

  lightboxCategory: document.getElementById("lightboxCategory"),

  lightboxPhotographer: document.getElementById("lightboxPhotographer"),

  lightboxDescription: document.getElementById("lightboxDescription"),

  lightboxFavorite: document.getElementById("lightboxFavorite"),

  lightboxShare: document.getElementById("lightboxShare"),

  lightboxDownload: document.getElementById("lightboxDownload"),

  currentImageNumber: document.getElementById("currentImageNumber"),

  totalImageNumber: document.getElementById("totalImageNumber"),

  toast: document.getElementById("toast"),

  toastIcon: document.getElementById("toastIcon"),

  toastMessage: document.getElementById("toastMessage"),
};

/* =========================================================
   04. INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  renderFeaturedCollection();

  initializeImageLoading();

  renderGallery();

  updateStatistics();

  updateFavoritesCount();

  setupEventListeners();

  setupScrollEffects();
}

/* =========================================================
   05. FEATURED COLLECTION
========================================================= */

function renderFeaturedCollection() {
  if (!elements.featuredGrid) {
    return;
  }

  const featuredImages = images.slice(0, 5);

  elements.featuredGrid.innerHTML = featuredImages
    .map((image) => {
      return `

            <article
              class="featured-card"
              data-image-id="${image.id}"
              tabindex="0"
              role="button"
              aria-label="Open ${image.title}"
            >

              <img
                src="${image.thumbnail}"
                alt="${image.title}"
                loading="lazy"
              />

              <div
                class="featured-card-content"
              >

                <span>
                  ${formatCategory(image.category)}
                </span>

                <h3>
                  ${image.title}
                </h3>

              </div>

            </article>

          `;
    })
    .join("");

  const cards = elements.featuredGrid.querySelectorAll(".featured-card");

  cards.forEach((card) => {
    const imageId = Number(card.dataset.imageId);

    card.addEventListener("click", () => {
      openLightboxById(imageId);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        openLightboxById(imageId);
      }
    });
  });
}

/* =========================================================
   06. GALLERY RENDERING
========================================================= */

function renderGallery() {
  const filteredImages = getFilteredImages();

  state.filteredImages = filteredImages;

  elements.resultsCount.textContent = filteredImages.length;

  if (filteredImages.length === 0) {
    elements.galleryGrid.innerHTML = "";

    elements.emptyState.hidden = false;

    return;
  }

  elements.emptyState.hidden = true;

  elements.galleryGrid.innerHTML = filteredImages
    .map((image, index) => {
      return createGalleryCard(image, index);
    })
    .join("");

  attachGalleryCardEvents();

  initializeImageLoading();
}

elements.galleryGrid.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", handleImageError, {
    once: true,
  });
});

/* =========================================================
   07. GALLERY CARD TEMPLATE
========================================================= */

function createGalleryCard(image, index) {
  const isFavorite = state.favorites.includes(image.id);

  return `

    <article
      class="gallery-card"
      data-image-id="${image.id}"
      style="animation-delay: ${index * 0.06}s"
      tabindex="0"
      role="button"
      aria-label="Open ${image.title}"
    >

      <img
        src="${image.thumbnail}"
        alt="${image.title}"
        loading="lazy"
        decoding="async"
      />


      <div
        class="gallery-overlay"
      >

        <div>

          <p>
            ${formatCategory(image.category)}
          </p>

          <h3>
            ${image.title}
          </h3>

        </div>


        <button
          class="card-favorite ${isFavorite ? "active" : ""}"
          type="button"
          data-favorite-id="${image.id}"
          aria-label="${
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }"
        >

          ${isFavorite ? "♥" : "♡"}

        </button>

      </div>

    </article>

  `;
}

/* =========================================================
   08. GALLERY CARD EVENTS
========================================================= */

function attachGalleryCardEvents() {
  const cards = elements.galleryGrid.querySelectorAll(".gallery-card");

  cards.forEach((card) => {
    const imageId = Number(card.dataset.imageId);

    card.addEventListener("click", (event) => {
      if (event.target.closest(".card-favorite")) {
        return;
      }

      openLightboxById(imageId);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        openLightboxById(imageId);
      }
    });

    const favoriteButton = card.querySelector(".card-favorite");

    if (favoriteButton) {
      favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        toggleFavorite(imageId);
      });
    }
  });
}

/* =========================================================
   09. FILTERING LOGIC
========================================================= */

function getFilteredImages() {
  let filtered = [...images];

  /* Category Filter */

  if (state.activeFilter === "favorites") {
    filtered = filtered.filter((image) => state.favorites.includes(image.id));
  } else if (state.activeFilter !== "all") {
    filtered = filtered.filter(
      (image) => image.category === state.activeFilter,
    );
  }

  /* Search Filter */

  if (state.searchQuery.trim()) {
    const query = state.searchQuery.toLowerCase().trim();

    filtered = filtered.filter((image) => {
      return (
        image.title.toLowerCase().includes(query) ||
        image.category.toLowerCase().includes(query) ||
        image.description.toLowerCase().includes(query)
      );
    });
  }

  return filtered;
}

/* =========================================================
   10. CATEGORY FILTERS
========================================================= */

function handleFilterChange(filter) {
  state.activeFilter = filter;

  const buttons = elements.filterButtons.querySelectorAll(".filter-btn");

  buttons.forEach((button) => {
    const isActive = button.dataset.filter === filter;

    button.classList.toggle("active", isActive);

    button.setAttribute("aria-selected", isActive);
  });

  renderGallery();

  updateSearchState();
}
/* =========================================================
   11. SEARCH
========================================================= */

function handleSearch(value) {
  state.searchQuery = value;

  elements.clearSearch.classList.toggle("visible", Boolean(value.trim()));

  renderGallery();

  updateSearchState();
}

function updateSearchState() {
  const hasSearch = state.searchQuery.trim().length > 0;

  const hasFilter = state.activeFilter !== "all";

  const isFiltered = hasSearch || hasFilter;

  elements.galleryGrid.classList.toggle("is-filtered", isFiltered);
}

/* =========================================================
   12. RESET GALLERY
========================================================= */

function resetGallery() {
  state.activeFilter = "all";

  state.searchQuery = "";

  elements.searchInput.value = "";

  elements.clearSearch.classList.remove("visible");

  handleFilterChange("all");
}

/* =========================================================
   13. FAVORITES SYSTEM
========================================================= */

function toggleFavorite(imageId) {
  const index = state.favorites.indexOf(imageId);

  if (index === -1) {
    state.favorites.push(imageId);

    showToast("Added to favorites", "♥");
  } else {
    state.favorites.splice(index, 1);

    showToast("Removed from favorites", "♡");
  }

  saveFavorites();

  updateFavoritesCount();

  renderGallery();

  /* Refresh Lightbox */

  if (elements.lightbox.classList.contains("active")) {
    updateLightboxFavoriteButton();
  }
}

/* =========================================================
   14. SAVE FAVORITES
========================================================= */

function saveFavorites() {
  localStorage.setItem("vistaraFavorites", JSON.stringify(state.favorites));
}

/* =========================================================
   15. FAVORITES COUNTER
========================================================= */

function updateFavoritesCount() {
  elements.favoritesCount.textContent = state.favorites.length;
}

/* =========================================================
   16. LIGHTBOX — OPEN
========================================================= */

function openLightboxById(imageId) {
  lastFocusedElement = document.activeElement;

  const index = state.filteredImages.findIndex((image) => image.id === imageId);

  if (index === -1) {
    return;
  }

  state.currentLightboxIndex = index;

  updateLightbox();

  elements.lightbox.classList.add("active");

  elements.lightbox.setAttribute("aria-hidden", "false");

  document.body.classList.add("no-scroll");

  elements.lightboxClose.focus();
}
/* =========================================================
   17. LIGHTBOX — UPDATE
========================================================= */

function updateLightbox() {
  const image = state.filteredImages[state.currentLightboxIndex];

  if (!image) {
    return;
  }

  elements.lightboxImage.src = image.full;

  elements.lightboxImage.alt = image.title;

  elements.lightboxTitle.textContent = image.title;

  elements.lightboxCategory.textContent = formatCategory(image.category);

  elements.lightboxPhotographer.textContent = image.photographer;

  elements.lightboxDescription.textContent = image.description;

  elements.currentImageNumber.textContent = String(
    state.currentLightboxIndex + 1,
  ).padStart(2, "0");

  elements.totalImageNumber.textContent = String(
    state.filteredImages.length,
  ).padStart(2, "0");

  updateLightboxFavoriteButton();
}

/* =========================================================
   18. LIGHTBOX — CLOSE
========================================================= */

function closeLightbox() {
  elements.lightbox.classList.remove("active");

  elements.lightbox.setAttribute("aria-hidden", "true");

  document.body.classList.remove("no-scroll");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}
/* =========================================================
   19. LIGHTBOX — NEXT
========================================================= */

function showNextImage() {
  if (state.filteredImages.length === 0) {
    return;
  }

  state.currentLightboxIndex =
    (state.currentLightboxIndex + 1) % state.filteredImages.length;

  updateLightbox();
}

/* =========================================================
   20. LIGHTBOX — PREVIOUS
========================================================= */

function showPreviousImage() {
  if (state.filteredImages.length === 0) {
    return;
  }

  state.currentLightboxIndex =
    (state.currentLightboxIndex - 1 + state.filteredImages.length) %
    state.filteredImages.length;

  updateLightbox();
}

/* =========================================================
   21. LIGHTBOX — FAVORITE
========================================================= */

function updateLightboxFavoriteButton() {
  const image = state.filteredImages[state.currentLightboxIndex];

  if (!image) {
    return;
  }

  const isFavorite = state.favorites.includes(image.id);

  const icon = elements.lightboxFavorite.querySelector(".action-icon");

  icon.textContent = isFavorite ? "♥" : "♡";

  elements.lightboxFavorite.querySelector("span:last-child").textContent =
    isFavorite ? "Remove Favorite" : "Favorite";
}

/* =========================================================
   22. LIGHTBOX — SHARE
========================================================= */

async function shareImage() {
  const image = state.filteredImages[state.currentLightboxIndex];

  if (!image) {
    return;
  }

  const shareData = {
    title: `${image.title} — Vistara`,

    text: image.description,

    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);

      showToast("Image shared successfully", "↗");
    } else {
      await navigator.clipboard.writeText(window.location.href);

      showToast("Link copied to clipboard", "✓");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showToast("Unable to share image", "!");
    }
  }
}

/* =========================================================
   23. LIGHTBOX — DOWNLOAD
========================================================= */

async function downloadImage() {
  const image = state.filteredImages[state.currentLightboxIndex];

  if (!image) {
    return;
  }

  try {
    const response = await fetch(image.src);

    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;

    link.download = `${slugify(image.title)}.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(blobUrl);

    showToast("Download started", "↓");
  } catch (error) {
    showToast("Unable to download image", "!");
  }
}

/* =========================================================
   24. MOBILE MENU
========================================================= */

function openMobileMenu() {
  elements.mobileMenu.classList.add("active");

  elements.mobileMenu.setAttribute("aria-hidden", "false");

  elements.menuToggle.setAttribute("aria-expanded", "true");

  document.body.classList.add("no-scroll");
}

function closeMobileMenu() {
  elements.mobileMenu.classList.remove("active");

  elements.mobileMenu.setAttribute("aria-hidden", "true");

  elements.menuToggle.setAttribute("aria-expanded", "false");

  document.body.classList.remove("no-scroll");
}

/* =========================================================
   25. SCROLL EFFECTS
========================================================= */

function setupScrollEffects() {
  window.addEventListener(
    "scroll",
    () => {
      const scrollPosition = window.scrollY;

      elements.siteHeader.classList.toggle("scrolled", scrollPosition > 40);

      updateActiveNavigation();
    },
    {
      passive: true,
    },
  );
}

/* =========================================================
   26. ACTIVE NAVIGATION
========================================================= */

function updateActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");

  const scrollPosition = window.scrollY + 150;

  sections.forEach((section) => {
    const top = section.offsetTop;

    const height = section.offsetHeight;

    const id = section.getAttribute("id");

    if (scrollPosition >= top && scrollPosition < top + height) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}

/* =========================================================
   27. TOAST NOTIFICATION
========================================================= */

let toastTimeout;

function showToast(message, icon = "✓") {
  clearTimeout(toastTimeout);

  elements.toastIcon.textContent = icon;

  elements.toastMessage.textContent = message;

  elements.toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3000);
}

/* =========================================================
   28. STATISTICS
========================================================= */

function updateStatistics() {
  const categories = new Set(images.map((image) => image.category));

  elements.totalImages.textContent = images.length;

  elements.totalCategories.textContent = categories.size;
}

/* =========================================================
   29. UTILITY — CATEGORY FORMAT
========================================================= */

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/* =========================================================
   30. UTILITY — SLUGIFY
========================================================= */

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* =========================================================
   31. EVENT LISTENERS
========================================================= */

function setupEventListeners() {
  /* Mobile Menu */

  elements.menuToggle.addEventListener("click", openMobileMenu);

  elements.mobileMenuClose.addEventListener("click", closeMobileMenu);

  /* Mobile Navigation */

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* Search Trigger */

  elements.searchTrigger.addEventListener("click", () => {
    document.querySelector("#explore").scrollIntoView({
      behavior: "smooth",
    });

    setTimeout(() => {
      elements.searchInput.focus();
    }, 600);
  });

  /* Search Input */

  elements.searchInput.addEventListener("input", (event) => {
    handleSearch(event.target.value);
  });

  /* Clear Search */

  elements.clearSearch.addEventListener("click", () => {
    elements.searchInput.value = "";

    handleSearch("");

    elements.searchInput.focus();
  });

  /* Category Filters */

  elements.filterButtons.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");

    if (!button) {
      return;
    }

    handleFilterChange(button.dataset.filter);
  });

  /* Reset */

  elements.resetGallery.addEventListener("click", resetGallery);

  /* Favorites */

  document.getElementById("favoritesTrigger").addEventListener("click", () => {
    document.querySelector("#explore").scrollIntoView({
      behavior: "smooth",
    });

    handleFilterChange("favorites");
  });

  /* Lightbox Close */

  elements.lightboxClose.addEventListener("click", closeLightbox);

  elements.lightboxBackdrop.addEventListener("click", closeLightbox);

  /* Lightbox Navigation */

  elements.lightboxNext.addEventListener("click", showNextImage);

  elements.lightboxPrev.addEventListener("click", showPreviousImage);

  /* Lightbox Favorite */

  elements.lightboxFavorite.addEventListener("click", () => {
    const image = state.filteredImages[state.currentLightboxIndex];

    if (image) {
      toggleFavorite(image.id);
    }
  });

  /* Share */

  elements.lightboxShare.addEventListener("click", shareImage);

  /* Download */

  elements.lightboxDownload.addEventListener("click", downloadImage);

  /* Keyboard Navigation */

  document.addEventListener("keydown", (event) => {
    if (!elements.lightbox.classList.contains("active")) {
      return;
    }

    switch (event.key) {
      case "Escape":
        closeLightbox();

        break;

      case "ArrowRight":
        showNextImage();

        break;

      case "ArrowLeft":
        showPreviousImage();

        break;
    }
  });
}

/* =========================================================
   32. PAGE LOADER
========================================================= */

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    elements.pageLoader.classList.add("hidden");

    document.body.classList.add("page-ready");
  });
});

function handleImageError(event) {
  const image = event.target;

  image.src =
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80";

  image.alt = "Vistara image unavailable";
}

function initializeImageLoading() {
  const images = document.querySelectorAll(
    ".gallery-card img, .featured-card img",
  );

  images.forEach((image) => {
    if (image.complete) {
      image.classList.add("is-loaded");

      return;
    }

    image.addEventListener(
      "load",
      () => {
        image.classList.add("is-loaded");
      },
      {
        once: true,
      },
    );
  });
}
