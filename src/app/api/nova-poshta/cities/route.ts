import { NextRequest, NextResponse } from "next/server";

const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = process.env.NOVA_POSHTA_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 1) {
    return NextResponse.json({ data: [] });
  }

  const res = await fetch(NP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        FindByString: q,
        Limit: "20",
      },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ data: [] }, { status: 502 });
  }

  const json = await res.json();
  const items: { ref: string; label: string }[] = (json.data ?? []).map(
    (c: { Ref: string; Description: string; AreaDescription: string }) => ({
      ref: c.Ref,
      label: `${c.Description} (${c.AreaDescription} обл.)`,
    }),
  );

  return NextResponse.json({ data: items });
}
