"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Github,
  Star,
  GitFork,
  Calendar,
  CheckCircle,
  Loader2,
  Laptop,
  Tag,
} from "lucide-react";

import {
  SiJavascript,
  SiPython,
  SiTypescript,
  SiCplusplus,
  SiGo,
  SiHtml5,
  SiCss3,
  SiDocker,
  SiRubygems,
  SiPhp,
  SiKotlin,
  SiSwift,
  SiRust,
  SiScala,
  SiDart,
  SiElixir,
  SiLua,
  SiR,
  SiShell,
  SiHaskell,
  SiJulia,
} from "react-icons/si";

import { FaJava } from "react-icons/fa";

import { motion } from "motion/react";
import React from "react";

interface GitHubData {
  username: string;
  avatar: string;
  stars: number;
  forks: number;
  activeDays: number;
  commits: number;
  repositories: number;
  pullRequests: number;
  issuesOpened: number;
  issuesClosed: number;
  mostActiveDay: string;
  mostUsedLang: string;
  topLanguages: Array<{
    language: string;
    reposCount: number;
    usagePercentage: string;
  }>;
}

const getCommitTag = (commits: number): string => {
  if (commits > 100) return "Code Conqueror 🏆";
  if (commits > 80) return "Commit Wizard ✨";
  if (commits > 50) return "Prolific Contributor 🚀";
  if (commits > 20) return "Active Coder 💻";
  if (commits > 10) return "Rising Developer 🌱";
  return "Newbie 🔰";
};

const languageIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  JavaScript: SiJavascript,
  Python: SiPython,
  TypeScript: SiTypescript,
  "C++": SiCplusplus,
  Go: SiGo,
  HTML: SiHtml5,
  CSS: SiCss3,
  Docker: SiDocker,
  Java: FaJava,
  Ruby: SiRubygems,
  PHP: SiPhp,
  Kotlin: SiKotlin,
  Swift: SiSwift,
  Rust: SiRust,
  Scala: SiScala,
  Dart: SiDart,
  Elixir: SiElixir,
  Lua: SiLua,
  R: SiR,
  Shell: SiShell,
  Haskell: SiHaskell,
  Julia: SiJulia,
  TypeScriptIcon: SiTypescript,
};

export default function GitHubStats() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/github/${username}`);
      const data = await response.json();

      // Map API response to GitHubData structure
      const mappedData: GitHubData = {
        username: data.username,
        avatar: data.avatarUrl,
        stars: data.stars,
        forks: data.forks,
        activeDays: data.mostActiveDay ? parseInt(data.mostActiveDay) : 0,
        commits: data.totalCommits,
        repositories: data.totalRepos,
        pullRequests: data.pullRequestsCreated || 0,
        issuesOpened: data.issuesOpened || 0,
        issuesClosed: data.issuesClosed || 0,
        mostActiveDay: data.mostActiveDay || "N/A",
        mostUsedLang: data.topLanguages[0]?.language || "N/A",
        topLanguages: data.topLanguages || [],
      };

      setData(mappedData);
      console.log(mappedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-gray-800/50 h-[200px] p-6 rounded-md animate-pulse">
      <div className="h-4 w-1/3 bg-gray-700 rounded mb-4" />
      <div className="h-8 w-1/2 bg-gray-700 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-12">
          <Github className="h-16 w-16 mb-4 text-white" />
          <h1 className="text-5xl font-bold mb-8 text-center text-blue-400">
            Gitcap
          </h1>

          <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-md">
            <Input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 transition-colors duration-300"
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
          data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <img
                  src={data.avatar}
                  alt={`${data.username}'s avatar`}
                  className="w-24 h-24 rounded-full mb-4 border border-blue-500"
                />
                <h2 className="text-3xl font-bold text-blue-300">
                  Hey {data.username},
                </h2>
                <p className="text-lg text-gray-200">
                  Thanks for visiting! Hope you have a great year ahead! 🎉
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Top 3 Languages Card */}
                <Card className="bg-gray-800 border border-gray-600 hover:border-blue-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Laptop className="h-6 w-6 text-slate-400" />
                      <span className="text-lg font-bold text-white">
                        Most Used Languages
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                      {data.topLanguages.slice(0, 3).map((lang, index) => {
                        const Icon = languageIcons[lang.language]; // Get the correct icon based on the language name
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between text-white"
                          >
                            {/* Display the language icon */}
                            {Icon && (
                              <Icon className="h-6 w-6 text-blue-400 mr-2" />
                            )}
                            <span>{lang.language}</span>
                            <span>{lang.usagePercentage} %</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Total Stars Card */}
                <Card className="bg-gray-800 border border-gray-600 hover:border-blue-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Star className="h-6 w-6 text-yellow-400" />
                      <span className="text-lg font-bold text-white">
                        Total Stars Earned
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mt-4 text-white">
                      {data.stars}
                    </h3>
                    <p className="text-sm text-white">Total Stars</p>
                  </CardContent>
                </Card>

                {/* Total Forks Card */}
                <Card className="bg-gray-800 border border-gray-600 hover:border-blue-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <GitFork className="h-6 w-6 text-slate-400" />
                      <span className="text-lg font-bold text-white">
                        Total Forks Earned
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mt-4 text-white">
                      {data.forks}
                    </h3>
                    <p className="text-sm text-white">Total Forks</p>
                  </CardContent>
                </Card>

                {/* Most Active Days Card */}
                <Card className="bg-gray-800 border border-gray-600 hover:border-blue-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Calendar className="h-6 w-6 text-slate-400" />
                      <span className="text-lg font-bold text-white">
                        Total Active days
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mt-4 text-white">
                      {data.mostActiveDay}
                    </h3>
                    <p className="text-sm text-white">
                      What did you cook that day? 🤔
                    </p>
                  </CardContent>
                </Card>

                {/* Total Commits Card */}
                <Card className="bg-gray-800 border border-gray-600 hover:border-blue-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <CheckCircle className="h-6 w-6 text-slate-400" />
                      <span className="text-lg font-bold text-white">
                        Total Commits
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mt-4 text-white">
                      {data.commits}
                    </h3>
                    <p className="text-sm text-white">Total Commits</p>
                  </CardContent>
                </Card>

                {/* Tag*/}
                <Card className="bg-gray-800 border border-gray-600 hover:border-blue-300 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Tag className="h-6 w-6 text-slate-400" />
                      <span className="text-lg font-bold text-white">
                        Your Tag
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mt-4 text-white">
                      {getCommitTag(data.commits)}
                    </h3>
                    <p className="text-sm text-white">
                      this defines your aura.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
