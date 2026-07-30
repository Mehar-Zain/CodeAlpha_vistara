"use strict";

/* =========================================================
   VISTARA — PROFESSIONAL IMAGE GALLERY
   Main JavaScript Application (Reviewed & Fixed)
========================================================= */

let lastFocusedElement = null;

/* =========================================================
   01. IMAGE DATA & UNSPLASH API
========================================================= */

const API_ENDPOINT = "/.netlify/functions/unsplash";

// Holds the currently loaded set of images (current query/page window).
const images = [];

/*
  Unsplash categories used by Vistara.
  These queries are used when the user selects a category filter.
*/
const categoryQueries = {
  all: "",
  nature: "nature landscape",
  travel: "travel destinations",
  architecture: "modern architecture",
  wildlife: "wildlife animals",
};

/*
  API state.
  - abortController lets us cancel a stale in-flight request instead of
    silently dropping a newer one (fixes the "dropped request" race).
*/
const apiState = {
  page: 1,
  perPage: 20,
  isLoading: false,
  hasMore: true,
  totalPages: 1,
  currentRequest: 0,
  abortController: null,
};

/* =========================================================
   01A. UNSPLASH API
========================================================= */

/*
  Fetch images from the Netlify Function.
  If a search query is provided, the function uses the Unsplash Search API.
  Otherwise, it loads popular images.
*/
async function fetchUnsplashImages({
  query = "",
  page = 1,
  perPage = 20,
  append = false,
} = {}) {
  // Cancel any request that's still in flight rather than dropping this one.
  if (apiState.abortController) {
    apiState.abortController.abort();
  }
  const controller = new AbortController();
  apiState.abortController = controller;

  apiState.isLoading = true;
  const requestId = ++apiState.currentRequest;

  // Track which query is actually driving the grid right now, so
  // infinite-scroll pagination (and anything else) can reuse it.
  state.currentQuery = query;

  if (!append) {
    showGalleryLoading();
  }

  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    if (query.trim()) {
      params.set("query", query.trim());
    }

    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      const statusMessages = {
        400: "Invalid search request.",
        401: "Image service authentication failed.",
        403: "Access to the image service was denied.",
        404: "Image service endpoint not found.",
        429: "Rate limit reached. Please wait a moment and try again.",
        500: "The image service is temporarily unavailable.",
      };
      const message =
        statusMessages[response.status] ||
        `Image service request failed (${response.status}).`;
      throw new Error(message);
    }

    const data = await response.json();

    // Ignore outdated responses (defense in depth alongside AbortController).
    if (requestId !== apiState.currentRequest) {
      return;
    }

    const apiImages = query.trim()
      ? data.results || []
      : Array.isArray(data)
        ? data
        : data.results || [];

    const mappedImages = apiImages.map(mapUnsplashImage);

    // Update pagination information.
    if (query.trim()) {
      apiState.totalPages = data.total_pages || 1;
    } else {
      // Popular/no-query endpoint: Unsplash doesn't return total_pages,
      // so derive "more available" purely from whether this page had results.
      apiState.totalPages = Number.MAX_SAFE_INTEGER;
    }

    // Replace images for a new search/filter; append for "load more".
    if (append) {
      images.push(...mappedImages);
    } else {
      images.length = 0;
      images.push(...mappedImages);
    }

    apiState.page = page;

    // Stop paginating once a page comes back empty, regardless of totalPages.
    apiState.hasMore =
      mappedImages.length > 0 && apiState.page < apiState.totalPages;

    // Remove duplicate image IDs (IDs are strings from the Unsplash API).
    const uniqueImages = [
      ...new Map(images.map((image) => [image.id, image])).values(),
    ];
    images.length = 0;
    images.push(...uniqueImages);

    // Update application state.
    state.filteredImages = [...images];

    renderFeaturedCollection();
    renderGallery();
    updateStatistics();
    updateFavoritesCount();
  } catch (error) {
    if (error.name === "AbortError") {
      // Expected when a newer request superseded this one — not a real error.
      return;
    }
    console.error("Vistara Unsplash API Error:", error);
    if (requestId === apiState.currentRequest) {
      showGalleryError(error.message);
    }
  } finally {
    if (requestId === apiState.currentRequest) {
      apiState.isLoading = false;
    }
  }
}

/*
  Convert an Unsplash API image into Vistara's internal image structure.
  NOTE: Unsplash photo IDs are strings — never coerce them with Number().
*/
function mapUnsplashImage(image) {
  return {
    id: image.id, // string, e.g. "eOvv-2FIQZ8"
    title: image.alt_description || image.description || "Untitled Visual",
    category: detectImageCategory(image),
    photographer: image.user?.name || "Unknown Photographer",
    photographerUrl: image.user?.links?.html || "https://unsplash.com",
    description:
      image.description ||
      image.alt_description ||
      "A visual story discovered through Vistara.",
    thumbnail: image.urls?.small || image.urls?.regular || image.urls?.full,
    full: image.urls?.full || image.urls?.regular,
    regular: image.urls?.regular || image.urls?.full,
    downloadLocation: image.links?.download_location || null,
    unsplashUrl: image.links?.html || "https://unsplash.com",
    createdAt: image.created_at || null,
  };
}

/*
  Detect a Vistara category from Unsplash data so category filters
  continue to work meaningfully with live API images.
*/
function detectImageCategory(image) {
  const tags = (image.tags || [])
    .map((tag) => tag.title?.toLowerCase())
    .filter(Boolean);

  const text = [image.alt_description, image.description, ...tags]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    text.includes("wildlife") ||
    text.includes("animal") ||
    text.includes("lion") ||
    text.includes("tiger") ||
    text.includes("elephant") ||
    text.includes("bird")
  ) {
    return "wildlife";
  }

  if (
    text.includes("architecture") ||
    text.includes("building") ||
    text.includes("skyscraper") ||
    text.includes("urban") ||
    text.includes("city")
  ) {
    return "architecture";
  }

  if (
    text.includes("travel") ||
    text.includes("tourism") ||
    text.includes("adventure") ||
    text.includes("journey") ||
    text.includes("vacation")
  ) {
    return "travel";
  }

  return "nature";
}

/* =========================================================
   01B. API LOADING & ERROR STATES
========================================================= */

function showGalleryLoading() {
  if (!elements.galleryGrid) return;

  elements.emptyState.hidden = true;

  elements.galleryGrid.innerHTML = `
    <div class="gallery-api-state" role="status" aria-live="polite">
      <div class="api-state-spinner"></div>
      <p>Discovering visual stories...</p>
    </div>
  `;
}

function showGalleryError(message) {
  if (!elements.galleryGrid) return;

  elements.galleryGrid.innerHTML = `
    <div class="gallery-api-state gallery-api-error">
      <div class="api-state-icon">!</div>
      <h3>Unable to load images</h3>
      <p>${escapeHtml(
        message ||
          "We couldn't connect to the Vistara image service. Please try again.",
      )}</p>
      <button type="button" class="btn" id="retryGallery">Try Again</button>
    </div>
  `;

  const retryButton = document.getElementById("retryGallery");
  retryButton?.addEventListener("click", () => {
    fetchUnsplashImages({
      query: state.currentQuery,
      page: 1,
      perPage: apiState.perPage,
    });
  });
}

/* =========================================================
   02. APPLICATION STATE
========================================================= */

const state = {
  activeFilter: "all",
  searchQuery: "",
  currentQuery: "", // the query string actually powering the current grid
  favorites: safeReadFavorites(),
  currentLightboxIndex: 0,
  filteredImages: [...images],
};

function safeReadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem("vistaraFavorites"));
    if (!Array.isArray(stored)) return [];

    // Favorites are stored as full image records (id, title, thumbnail,
    // etc.) rather than bare IDs, so the favorites view never depends on
    // whatever happens to be loaded from the API at the moment — it works
    // the same right after a refresh, or after searching/filtering away
    // from the images that were originally favorited.
    //
    // Older versions of this app stored bare ID strings instead. Those
    // can't be reconstructed into full records without another API call,
    // so they're safely dropped here rather than crashing the renderer.
    return stored.filter(
      (item) => item && typeof item === "object" && typeof item.id === "string",
    );
  } catch {
    return [];
  }
}

/* =========================================================
   03. DOM ELEMENTS (populated once the DOM is ready)
========================================================= */

const elements = {};

function cacheElements() {
  Object.assign(elements, {
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
    gallerySentinel: document.getElementById("gallerySentinel"),
  });
}

/* =========================================================
   04. INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
  cacheElements();
  setupEventListeners();
  setupScrollEffects();
  setupInfiniteScroll();
  updateFavoritesCount();
  updateStatistics();

  await fetchUnsplashImages({
    page: 1,
    perPage: apiState.perPage,
  });
}

/* =========================================================
   05. FEATURED COLLECTION
========================================================= */

function renderFeaturedCollection() {
  if (!elements.featuredGrid) return;

  const featuredImages = images.slice(0, 5);

  elements.featuredGrid.innerHTML = featuredImages
    .map(
      (image) => `
      <article
        class="featured-card"
        data-image-id="${escapeHtml(image.id)}"
        tabindex="0"
        role="button"
        aria-label="Open ${escapeHtml(image.title)}"
      >
        <img src="${image.thumbnail}" alt="${escapeHtml(image.title)}" loading="lazy" />
        <div class="featured-card-content">
          <span>${escapeHtml(formatCategory(image.category))}</span>
          <h3>${escapeHtml(image.title)}</h3>
        </div>
      </article>
    `,
    )
    .join("");

  const cards = elements.featuredGrid.querySelectorAll(".featured-card");
  cards.forEach((card) => {
    const imageId = card.dataset.imageId;

    card.addEventListener("click", () => openLightboxById(imageId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightboxById(imageId);
      }
    });

    card.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", handleImageError, { once: true });
      img.addEventListener("load", () => img.classList.add("is-loaded"), {
        once: true,
      });
      if (img.complete) img.classList.add("is-loaded");
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
    repositionSentinel();
    return;
  }

  elements.emptyState.hidden = true;

  elements.galleryGrid.innerHTML = filteredImages
    .map((image, index) => createGalleryCard(image, index))
    .join("");

  attachGalleryCardEvents();
  repositionSentinel();
}

/*
  The sentinel that drives infinite scroll must always sit directly
  after the gallery grid. The grid's height changes constantly as
  images load, get filtered, or get appended, so the sentinel can't
  just live in a fixed spot in the HTML — it has to be re-anchored
  to the bottom of the grid every time the grid re-renders. Moving a
  node in the DOM does not detach its existing IntersectionObserver,
  so this is safe to do on every render.
*/
function repositionSentinel() {
  if (!elements.gallerySentinel || !elements.galleryGrid) return;
  elements.galleryGrid.after(elements.gallerySentinel);
}

/* =========================================================
   07. GALLERY CARD TEMPLATE
========================================================= */

function createGalleryCard(image, index) {
  const isFavorite = state.favorites.some((fav) => fav.id === image.id);

  return `
    <article
      class="gallery-card"
      data-image-id="${escapeHtml(image.id)}"
      style="animation-delay: ${index * 0.06}s"
      tabindex="0"
      role="button"
      aria-label="Open ${escapeHtml(image.title)}"
    >
      <img
        src="${image.thumbnail}"
        alt="${escapeHtml(image.title)}"
        loading="lazy"
        decoding="async"
      />

      <div class="gallery-overlay">
        <div>
          <p>${escapeHtml(formatCategory(image.category))}</p>
          <h3>${escapeHtml(image.title)}</h3>
        </div>

        <button
          class="card-favorite ${isFavorite ? "active" : ""}"
          type="button"
          data-favorite-id="${escapeHtml(image.id)}"
          aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
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
    const imageId = card.dataset.imageId;

    card.addEventListener("click", (event) => {
      if (event.target.closest(".card-favorite")) return;
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
        const image = state.filteredImages.find((img) => img.id === imageId);
        if (image) toggleFavorite(image);
      });
    }

    card.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", handleImageError, { once: true });
      img.addEventListener("load", () => img.classList.add("is-loaded"), {
        once: true,
      });
      if (img.complete) img.classList.add("is-loaded");
    });
  });
}

/* =========================================================
   09. FILTERING LOGIC
========================================================= */

function getFilteredImages() {
  let filtered;

  if (state.activeFilter === "favorites") {
    // Favorites are self-contained records (see safeReadFavorites), so
    // this view is independent of whatever the API currently has loaded.
    filtered = [...state.favorites];
  } else if (state.activeFilter !== "all") {
    filtered = images.filter((image) => image.category === state.activeFilter);
  } else {
    filtered = [...images];
  }

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

async function handleFilterChange(filter) {
  state.activeFilter = filter;

  const buttons = elements.filterButtons.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive);
  });

  // Favorites are handled locally against already-loaded images.
  if (filter === "favorites") {
    renderGallery();
    updateSearchState();
    return;
  }

  state.searchQuery = "";
  elements.searchInput.value = "";
  elements.clearSearch.classList.remove("visible");

  // "All" loads popular Unsplash images; other filters use a mapped query.
  const query = filter === "all" ? "" : categoryQueries[filter] || filter;

  await fetchUnsplashImages({
    query,
    page: 1,
    perPage: apiState.perPage,
  });

  updateSearchState();
}

/* =========================================================
   11. SEARCH
========================================================= */

let searchTimeout;

function handleSearch(value) {
  state.searchQuery = value;
  elements.clearSearch.classList.toggle("visible", value.trim().length > 0);

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUnsplashImages({
      query: value.trim(),
      page: 1,
      perPage: apiState.perPage,
    });
  }, 500);
}

function updateSearchState() {
  const hasSearch = state.searchQuery.trim().length > 0;
  const hasFilter = state.activeFilter !== "all";
  elements.galleryGrid.classList.toggle("is-filtered", hasSearch || hasFilter);
}

/* =========================================================
   12. RESET GALLERY
========================================================= */

async function resetGallery() {
  state.activeFilter = "all";
  state.searchQuery = "";
  elements.searchInput.value = "";
  elements.clearSearch.classList.remove("visible");
  await handleFilterChange("all");
}

/* =========================================================
   13. FAVORITES SYSTEM
========================================================= */

function toggleFavorite(image) {
  const index = state.favorites.findIndex((fav) => fav.id === image.id);

  if (index === -1) {
    state.favorites.push(image);
    showToast("Added to favorites", "♥");
  } else {
    state.favorites.splice(index, 1);
    showToast("Removed from favorites", "♡");
  }

  saveFavorites();
  updateFavoritesCount();
  renderGallery();

  if (elements.lightbox.classList.contains("active")) {
    updateLightboxFavoriteButton();
  }
}

/* =========================================================
   14. SAVE FAVORITES
========================================================= */

function saveFavorites() {
  try {
    localStorage.setItem("vistaraFavorites", JSON.stringify(state.favorites));
  } catch (error) {
    console.error("Unable to save favorites:", error);
  }
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
  if (index === -1) return;

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
  if (!image) return;

  // Use "regular" resolution for on-screen display; "full" is reserved
  // for the explicit download action to avoid loading multi-MB images
  // just to preview them.
  elements.lightboxImage.src = image.regular || image.full;
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
  if (state.filteredImages.length === 0) return;
  state.currentLightboxIndex =
    (state.currentLightboxIndex + 1) % state.filteredImages.length;
  updateLightbox();
}

/* =========================================================
   20. LIGHTBOX — PREVIOUS
========================================================= */

function showPreviousImage() {
  if (state.filteredImages.length === 0) return;
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
  if (!image) return;

  const isFavorite = state.favorites.some((fav) => fav.id === image.id);
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
  if (!image) return;

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
  if (!image) return;

  try {
    // Unsplash API guidelines require triggering the download_location
    // endpoint whenever a photo download occurs. This is fire-and-forget
    // so it never blocks the actual download below.
    if (image.downloadLocation) {
      fetch(
        `${API_ENDPOINT}?download_location=${encodeURIComponent(image.downloadLocation)}`,
      ).catch(() => {});
    }

    const response = await fetch(image.full);
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

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
    console.error("Download error:", error);
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
    { passive: true },
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
  // Note: these reflect the currently loaded set of images for the
  // active query/filter, not a site-wide Unsplash total.
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
   30A. UTILITY — HTML ESCAPE (XSS protection)
========================================================= */

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================
   31. EVENT LISTENERS
========================================================= */

function setupEventListeners() {
  elements.menuToggle.addEventListener("click", openMobileMenu);
  elements.mobileMenuClose.addEventListener("click", closeMobileMenu);

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Any in-page anchor link (header nav, footer links, hero buttons,
  // scroll indicator, mobile nav) scrolls past the gallery on its way to
  // the target section — pause infinite-scroll loading while that happens.
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href^="#"]')) {
      suppressInfiniteScroll();
    }
  });

  elements.searchTrigger.addEventListener("click", () => {
    suppressInfiniteScroll();
    document.querySelector("#explore").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => elements.searchInput.focus(), 600);
  });

  elements.searchInput.addEventListener("input", (event) => {
    handleSearch(event.target.value);
  });

  elements.clearSearch.addEventListener("click", () => {
    elements.searchInput.value = "";
    handleSearch("");
    elements.searchInput.focus();
  });

  elements.filterButtons.addEventListener("click", async (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    await handleFilterChange(button.dataset.filter);
  });

  elements.resetGallery.addEventListener("click", resetGallery);

  document.getElementById("favoritesTrigger").addEventListener("click", () => {
    suppressInfiniteScroll();
    document.querySelector("#explore").scrollIntoView({ behavior: "smooth" });
    handleFilterChange("favorites");
  });

  elements.lightboxClose.addEventListener("click", closeLightbox);
  elements.lightboxBackdrop.addEventListener("click", closeLightbox);
  elements.lightboxNext.addEventListener("click", showNextImage);
  elements.lightboxPrev.addEventListener("click", showPreviousImage);

  elements.lightboxFavorite.addEventListener("click", () => {
    const image = state.filteredImages[state.currentLightboxIndex];
    if (image) toggleFavorite(image);
  });

  elements.lightboxShare.addEventListener("click", shareImage);
  elements.lightboxDownload.addEventListener("click", downloadImage);

  document.addEventListener("keydown", (event) => {
    if (!elements.lightbox.classList.contains("active")) return;

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
    elements.pageLoader?.classList.add("hidden");
    document.body.classList.add("page-ready");
  });
});

/* =========================================================
   33. IMAGE ERROR FALLBACK
========================================================= */

function handleImageError(event) {
  const image = event.target;
  image.src =
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80";
  image.alt = "Vistara image unavailable";
}

/* =========================================================
   34. INFINITE SCROLL (pagination)
========================================================= */

/*
  Clicking a nav link, footer link, or "scroll to X" button smoothly
  scrolls past the gallery grid on the way to its target. That motion
  briefly carries the sentinel through the viewport, which would
  otherwise trigger a real "load more" fetch — growing the grid mid-scroll
  and making the destination section appear to keep moving away.
  This suppression window ignores intersections for a short period
  after any such intentional navigation.
*/
let infiniteScrollSuppressedUntil = 0;

function suppressInfiniteScroll(durationMs = 1500) {
  infiniteScrollSuppressedUntil = Date.now() + durationMs;
}

function setupInfiniteScroll() {
  const sentinel = elements.gallerySentinel;
  if (!sentinel) return;

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    if (Date.now() < infiniteScrollSuppressedUntil) return;
    if (apiState.isLoading) return;
    if (!apiState.hasMore) return;
    // Favorites are a purely local view — nothing more to fetch.
    if (state.activeFilter === "favorites") return;

    fetchUnsplashImages({
      query: state.currentQuery, // uses whatever query is actually active
      page: apiState.page + 1,
      perPage: apiState.perPage,
      append: true,
    });
  });

  observer.observe(sentinel);
}
