export interface GitHubRepo {
  id: number; name: string; full_name: string; html_url: string; description: string | null;
  language: string | null; stargazers_count: number; forks_count: number; open_issues_count: number;
  updated_at: string; pushed_at: string; created_at: string; topics?: string[];
  default_branch: string; clone_url: string; homepage: string | null; private: boolean;
}
export type RepoCategory = "agentic-rag" | "computer-vision" | "python-ai" | "java-fullstack" | "data-science";
export type SidebarFilter = "all" | "featured" | RepoCategory;
export type LanguageFilter = "All" | "Python" | "Java" | "Notebooks" | "Web / JS" | "Other";
export type DecoratedRepo = GitHubRepo & {
  categories: RepoCategory[]; languageGroup: Exclude<LanguageFilter, "All">;
  isFeatured: boolean; featuredNote: string | null; fallbackDescription: string;
};