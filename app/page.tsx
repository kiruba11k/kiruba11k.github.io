import type { GitHubRepo } from "@/lib/types";
import RepoDirectory from "@/components/RepoDirectory";
import { decorateRepositories, getAllRepositories } from "@/lib/github";

export const revalidate = 3600;

export default async function HomePage() {
  let repositories: GitHubRepo[] = [];
  try {
    repositories = await getAllRepositories();
  } catch (error) {
    console.error("Initial GitHub repository fetch failed:", error);
  }
  return <RepoDirectory initialRepos={decorateRepositories(repositories)} />;
}
