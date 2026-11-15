import { NextResponse } from "next/server";
import { getRepositoryLanguages } from "@/lib/github";

export const revalidate = 3600;

export async function GET(_request: Request, context: { params: { name: string } }) {
  try {
    const languages = await getRepositoryLanguages(context.params.name);
    return NextResponse.json(languages, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" }
    });
  } catch (error) {
    console.error("GitHub language breakdown failed:", error);
    return NextResponse.json({ error: "Language breakdown unavailable." }, { status: 502 });
  }
}
