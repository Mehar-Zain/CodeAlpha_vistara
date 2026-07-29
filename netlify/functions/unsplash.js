export default async (req) => {
  try {
    const url = new URL(req.url);

    const query = url.searchParams.get("query");
    const page = url.searchParams.get("page") || "1";
    const perPage = url.searchParams.get("per_page") || "20";

    const accessKey = Netlify.env.get("UNSPLASH_ACCESS_KEY");

    if (!accessKey) {
      return new Response(
        JSON.stringify({
          error: "Unsplash API key is not configured.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    let apiUrl;

    if (query) {
      apiUrl = new URL("https://api.unsplash.com/search/photos");

      apiUrl.searchParams.set("query", query);
      apiUrl.searchParams.set("page", page);
      apiUrl.searchParams.set("per_page", perPage);
    } else {
      apiUrl = new URL("https://api.unsplash.com/photos");

      apiUrl.searchParams.set("page", page);
      apiUrl.searchParams.set("per_page", perPage);
      apiUrl.searchParams.set("order_by", "popular");
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();

      return new Response(
        JSON.stringify({
          error: "Unsplash API request failed.",
          details: errorData,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        },
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

    return new Response(
      JSON.stringify({
        error: "Something went wrong while fetching images.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
