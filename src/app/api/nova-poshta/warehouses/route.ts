import { NextRequest, NextResponse } from "next/server";

const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY = process.env.NOVA_POSHTA_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const cityRef = req.nextUrl.searchParams.get("cityRef")?.trim() ?? "";
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!cityRef) {
    return NextResponse.json({ data: [] });
  }

  const methodProperties: Record<string, string> = {
    CityRef: cityRef,
    Limit: "50",
  };

  if (q) {
    methodProperties.FindByString = q;
  }

  const res = await fetch(NP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ data: [] }, { status: 502 });
  }

  const json = await res.json();
  const items: { ref: string; label: string }[] = (json.data ?? []).map(
    (w: { Ref: string; Description: string }) => ({
      ref: w.Ref,
      label: w.Description,
    }),
  );

  return NextResponse.json({ data: items });
}
