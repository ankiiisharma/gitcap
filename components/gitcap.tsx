"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Github,
  Star,
  GitFork,
  Eye,
  Calendar,
  GitCommit,
  GitPullRequest,
  CircleDot,
  Loader2,
  FileCode,
} from "lucide-react";
import {
  SiJavascript,
  SiPython,
  SiTypescript,
  SiCplusplus,
} from "react-icons/si";

interface GitHubData {
  totalRepos: number;
  stars: number;
  forks: number;
  totalWatchers: number;
  topLanguages: {
    language: string;
    reposCount: number;
    usagePercentage: string;
  }[];
  mostActiveDay: string;
  mostActiveRepo: string;
  totalCommits: number;
  pullRequestsCreated: number;
  pullRequestsMerged: number;
  issuesOpened: number;
  issuesClosed: number;
}

const LanguageIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  JavaScript: SiJavascript,
  Python: SiPython,
  TypeScript: SiTypescript,
  "C++": SiCplusplus,
};

export default function Component() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/github/${username}`);
      const data = await response.json();
      setData(data);
      setIsVisible(true);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <Card className="bg-zinc-800/50 h-[200px]">
      <CardContent className="p-6">
        <div className="h-4 w-1/3 bg-zinc-700 rounded animate-pulse mb-4" />
        <div className="h-8 w-1/2 bg-zinc-700 rounded animate-pulse" />
      </CardContent>
    </Card>
  );

  const cards = data ? (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <FileCode className="h-6 w-6 text-zinc-400" />
            <span className="text-sm text-zinc-400">Most Used Languages</span>
          </div>
          <div className="space-y-2">
            {data.topLanguages.slice(0, 3).map((lang, index) => {
              const Icon = LanguageIcons[lang.language] || FileCode;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-zinc-300" />
                    <span className="text-zinc-300">{lang.language}</span>
                  </div>
                  <span className="text-zinc-400">{lang.usagePercentage}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <Star className="h-6 w-6 text-zinc-400" />
            <span className="text-3xl font-bold text-zinc-100">
              {data.stars}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Total Stars</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <GitFork className="h-6 w-6 text-zinc-400" />
            <span className="text-3xl font-bold text-zinc-100">
              {data.forks}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Total Forks</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <Calendar className="h-6 w-6 text-zinc-400" />
            <span className="text-sm text-zinc-400">Most Active Day</span>
          </div>
          <p className="text-xl text-zinc-100">{data.mostActiveDay}</p>
          <p className="text-sm text-zinc-400">
            What did you cook that day? 🤔
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <Eye className="h-6 w-6 text-zinc-400" />
            <span className="text-3xl font-bold text-zinc-100">
              {data.totalWatchers}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Total Watchers</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <GitCommit className="h-6 w-6 text-zinc-400" />
            <span className="text-sm text-zinc-400">Contribution Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {data.totalCommits}
              </p>
              <p className="text-sm text-zinc-400">Total Commits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {data.totalRepos}
              </p>
              <p className="text-sm text-zinc-400">Repositories</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 h-[200px] transition-transform duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <GitPullRequest className="h-6 w-6 text-zinc-400" />
            <CircleDot className="h-6 w-6 text-zinc-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">PRs Created</span>
              <span className="text-zinc-100">{data.pullRequestsCreated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Issues Opened</span>
              <span className="text-zinc-100">{data.issuesOpened}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-12">
          <Github className="h-16 w-16 mb-4 text-zinc-100" />
          <h1 className="text-4xl font-bold mb-8 text-center">Gitcap</h1>

          <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-md">
            <Input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          cards
        )}
      </div>
    </div>
  );
}
