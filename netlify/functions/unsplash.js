const UNSPLASH_API_ORIGIN = "https://api.unsplash.com";
const MAX_PER_PAGE = 30;
const DEFAULT_PER_PAGE = 20;

export default async (req) => {
  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const url = new URL(req.url);

    const query = url.searchParams.get("query");
    const downloadLocation = url.searchParams.get("download_location");

    const accessKey = Netlify.env.get("UNSPLASH_ACCESS_KEY");
    if (!accessKey) {
      return jsonResponse(
        { error: "Unsplash API key is not configured." },
        500,
      );
    }

    // ---------------------------------------------------------
    // Branch 1: download tracking ping
    // Unsplash API Guidelines require calling links.download_location
    // whenever a user downloads a photo. The frontend passes that exact
    // URL through here so the Access Key never has to live client-side.
    // ---------------------------------------------------------
    if (downloadLocation) {
      let target;
      try {
        target = new URL(downloadLocation);
      } catch {
        return jsonResponse({ error: "Invalid download_location." }, 400);
      }

      // SSRF guard: only ever forward requests that actually point at
      // Unsplash's own API. Never let this become an open proxy.
      if (target.origin !== UNSPLASH_API_ORIGIN) {
        return jsonResponse(
          { error: "download_location must be an Unsplash API URL." },
          400,
        );
      }

      const trackResponse = await fetch(target, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      });

      if (!trackResponse.ok) {
        const details = await trackResponse.text();
        return jsonResponse(
          { error: "Unsplash download tracking failed.", details },
          trackResponse.status,
        );
      }

      const trackData = await trackResponse.json();
      return jsonResponse(trackData, 200);
    }

    // ---------------------------------------------------------
    // Branch 2: photo listing / search
    // ---------------------------------------------------------
    const page = clampInt(
      url.searchParams.get("page"),
      1,
      1,
      Number.MAX_SAFE_INTEGER,
    );
    const perPage = clampInt(
      url.searchParams.get("per_page"),
      DEFAULT_PER_PAGE,
      1,
      MAX_PER_PAGE,
    );

    let apiUrl;
    if (query) {
      apiUrl = new URL("/search/photos", UNSPLASH_API_ORIGIN);
      apiUrl.searchParams.set("query", query);
      apiUrl.searchParams.set("page", String(page));
      apiUrl.searchParams.set("per_page", String(perPage));
    } else {
      apiUrl = new URL("/photos", UNSPLASH_API_ORIGIN);
      apiUrl.searchParams.set("page", String(page));
      apiUrl.searchParams.set("per_page", String(perPage));
      apiUrl.searchParams.set("order_by", "popular");
    }

    const response = await fetch(apiUrl, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return jsonResponse(
        { error: "Unsplash API request failed.", details: errorData },
        response.status,
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Unsplash function error:", error);
    return jsonResponse(
      { error: "Something went wrong while fetching images." },
      500,
    );
  }
};

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Parses an integer query param, falling back to `fallback` and clamping
// to [min, max] so malformed or out-of-range input can never reach Unsplash.
function clampInt(rawValue, fallback, min, max) {
  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}
