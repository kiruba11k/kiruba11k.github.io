import { NextResponse } from "next/server";
import { decorateRepositories, getAllRepositories } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const repositories = await getAllRepositories();
    return NextResponse.json(decorateRepositories(repositories), {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" }
    });
  } catch (error) {
    console.error("GitHub repository API failed:", error);
    return NextResponse.json({ error: "GitHub repositories are temporarily unavailable." }, { status: 503 });
  }
}
