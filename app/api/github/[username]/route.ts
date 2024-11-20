import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type RouteParams = {
    params: Promise<{
        username: string;
    }>;
};

type EventPayload = {
    id: string;
    type: string | null;
    actor: {
        id: number;
        login: string;
        display_login?: string;
        gravatar_id: string | null;
        url: string;
        avatar_url: string;
    };
    repo: {
        id: number;
        name: string;
        url: string;
    };
    org?: {
        id: number;
        login: string;
        gravatar_id: string | null;
        url: string;
        avatar_url: string;
    };
    payload: {
        action?: string;
        pull_request?: {
            merged: boolean;
        };
        repo?: {
            name: string;
        };
    };
    public: boolean;
    created_at: string | null;
};

export async function GET(
    request: NextRequest,
    context: RouteParams
): Promise<NextResponse> {
    try {
        // Await the params nextjs 15!!!!!
        const { username } = await context.params;

        const { data: repos } = await octokit.repos.listForUser({
            username,
            sort: "updated",
            per_page: 100,
        });

        const { data: events } = await octokit.activity.listPublicEventsForUser({
            username,
            per_page: 100,
        });

        const stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        const forks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
        const totalRepos = repos.length;
        const totalWatchers = repos.reduce((acc, repo) => acc + (repo.watchers_count || 0), 0);

        const languageUsage = repos.reduce((acc, repo) => {
            if (repo.language) {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const topLanguages = Object.entries(languageUsage)
            .map(([language, count]) => ({
                language,
                reposCount: count,
                usagePercentage: ((count / totalRepos) * 100).toFixed(2),
            }))
            .sort((a, b) => b.reposCount - a.reposCount)
            .slice(0, 3);

        const commitsByDay: Record<string, number> = {};
        const commitsByRepo: Record<string, number> = {};
        let totalCommits = 0;
        let pullRequestsCreated = 0;
        let pullRequestsMerged = 0;
        let issuesOpened = 0;
        let issuesClosed = 0;

        events.forEach((event: EventPayload) => {
            if (event.type === "PushEvent") {
                totalCommits++;
                const date = new Date(event.created_at || "invalid date").toLocaleDateString();
                commitsByDay[date] = (commitsByDay[date] || 0) + 1;

                const repoName = event.payload?.repo?.name.split("/")[1];
                if (repoName) {
                    commitsByRepo[repoName] = (commitsByRepo[repoName] || 0) + 1;
                }
            } else if (event.type === "PullRequestEvent" && event.payload.pull_request) {
                pullRequestsCreated++;
                if (event.payload.action === "closed" && event.payload.pull_request.merged) {
                    pullRequestsMerged++;
                }
            } else if (event.type === "IssuesEvent" && event.payload.action) {
                if (event.payload.action === "opened") {
                    issuesOpened++;
                } else if (event.payload.action === "closed") {
                    issuesClosed++;
                }
            }
        });

        const mostActiveDay = Object.entries(commitsByDay).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
        const mostActiveRepo = Object.entries(commitsByRepo).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        return NextResponse.json({
            totalRepos,
            stars,
            forks,
            totalWatchers,
            topLanguages,
            mostActiveDay,
            mostActiveRepo,
            totalCommits,
            pullRequestsCreated,
            pullRequestsMerged,
            issuesOpened,
            issuesClosed,
        });
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        return NextResponse.json(
            { error: "Failed to fetch GitHub data" },
            { status: 500 }
        );
    }
}
