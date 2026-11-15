import type { GitHubRepo, RepoCategory } from "@/lib/types";

const API = "https://api.github.com";
const USER = "kiruba11k";

export const FEATURED_REPOS = [
  { name: "Fitness-Chatbot-Agentic-Rag", note: "Agentic AI · LangGraph & Hugging Face" },
  { name: "TextScrapping-RAG", note: "RAG & LLMs · Hybrid FAISS + BM25 retrieval" },
  { name: "Invoice-Data-Extraction-AI-App", note: "Document AI · GenAI + Streamlit" },
  { name: "ImageSegmentation", note: "Computer Vision · U-Net with TensorFlow/Keras" },
  { name: "Multi-PDF-Chatbot", note: "RAG & LLMs · LangChain + FAISS" },
  { name: "Analyzing-Amazon-Sales-Data", note: "Data & Analytics · Python, Pandas & Power BI" }
] as const;

async function fetchPage(page: number): Promise<GitHubRepo[]> {
  const response = await fetch(
    API + "/users/" + USER + "/repos?per_page=100&page=" + page + "&sort=pushed&direction=desc&type=owner",
    { headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, next: { revalidate: 3600 } }
  );
  if (!response.ok) throw new Error("GitHub API returned " + response.status);
  return response.json() as Promise<GitHubRepo[]>;
}

export async function getAllRepositories(): Promise<GitHubRepo[]> {
  const pages: GitHubRepo[][] = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await fetchPage(page);
    pages.push(batch);
    if (batch.length < 100) break;
  }
  const unique = new Map<number, GitHubRepo>();
  pages.flat().forEach((repo) => unique.set(repo.id, repo));
  return Array.from(unique.values()).sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at));
}

export function categoryFor(repo: GitHubRepo): RepoCategory[] {
  const text = [repo.name, repo.description ?? "", ...(repo.topics ?? []), repo.language ?? ""].join(" ").toLowerCase();
  const categories: RepoCategory[] = [];
  if (/agent|langgraph|langchain|rag|retriev|llm|chatbot|embedding|vector|gemini|gpt/.test(text)) categories.push("agentic-rag");
  if (/computer vision|opencv|yolo|vision|image|segment|detection|tracking|pytorch|tensorflow|keras/.test(text)) categories.push("computer-vision");
  if (repo.language === "Python" || /python|machine learning|deep learning|artificial intelligence|ai model/.test(text)) categories.push("python-ai");
  if (["Java", "JavaScript", "TypeScript", "HTML", "CSS"].includes(repo.language ?? "") || /spring|react|nextjs|frontend|full.?stack|django|fastapi|web app/.test(text)) categories.push("java-fullstack");
  if (["Jupyter Notebook", "R"].includes(repo.language ?? "") || /data science|analytics|pandas|numpy|visuali[sz]|sales|eda|dataset/.test(text)) categories.push("data-science");
  return Array.from(new Set(categories));
}

export function languageGroup(language: string | null): "Python" | "Java" | "Notebooks" | "Web / JS" | "Other" {
  if (language === "Python") return "Python";
  if (language === "Java") return "Java";
  if (language === "Jupyter Notebook") return "Notebooks";
  if (["JavaScript", "TypeScript", "HTML", "CSS"].includes(language ?? "")) return "Web / JS";
  return "Other";
}

export function fallbackDescription(repo: GitHubRepo): string {
  if (repo.description?.trim()) return repo.description;
  const details = [repo.language, ...(repo.topics ?? []).slice(0, 3)].filter(Boolean);
  return details.length ? "A " + details.join(" · ") + " project from Kiruba's GitHub workspace." : "An open-source project and experiment by Kirubakaran Periyasamy.";
}

export function decorateRepositories(repos: GitHubRepo[]) {
  const featured = new Map<string, { name: string; note: string; index: number }>(FEATURED_REPOS.map((repo, index) => [repo.name.toLowerCase(), { ...repo, index }] as const));
  return repos.map((repo) => ({
    ...repo,
    categories: categoryFor(repo),
    languageGroup: languageGroup(repo.language),
    isFeatured: featured.has(repo.name.toLowerCase()),
    featuredNote: featured.get(repo.name.toLowerCase())?.note ?? null,
    fallbackDescription: fallbackDescription(repo)
  })).sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    if (a.isFeatured && b.isFeatured) return (featured.get(a.name.toLowerCase())?.index ?? 99) - (featured.get(b.name.toLowerCase())?.index ?? 99);
    return Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
  });
}

export async function getRepositoryLanguages(repo: string): Promise<Record<string, number>> {
  const response = await fetch(API + "/repos/" + USER + "/" + encodeURIComponent(repo) + "/languages", {
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    next: { revalidate: 3600 }
  });
  if (!response.ok) throw new Error("Unable to load language breakdown");
  return response.json() as Promise<Record<string, number>>;
}