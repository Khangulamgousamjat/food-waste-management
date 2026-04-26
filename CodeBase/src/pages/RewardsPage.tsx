import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Award,
  Users,
  Gift,
  Calendar,
  Ticket,
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  badges: number;
  donations: number;
  streak: number;
}

interface MonthlyReward {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredPoints: number;
  available: boolean;
}

const RewardsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "badges" | "leaderboard" | "rewards"
  >("badges");
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "first-donation",
      name: "First Time Donor",
      description: "Complete your first food donation",
      icon: <Star className="h-6 w-6" />,
      unlocked: false,
    },
    {
      id: "donation-streak",
      name: "Donation Streak",
      description: "Donate food for 7 consecutive days",
      icon: <Medal className="h-6 w-6" />,
      unlocked: false,
      progress: 3,
    },
    {
      id: "top-contributor",
      name: "Top Contributor",
      description: "Be among the top 10 donors of the month",
      icon: <Trophy className="h-6 w-6" />,
      unlocked: false,
    },
    {
      id: "community-hero",
      name: "Community Hero",
      description: "Complete 50 successful donations",
      icon: <Award className="h-6 w-6" />,
      unlocked: false,
      progress: 25,
    },
  ]);

  const [monthlyRewards, setMonthlyRewards] = useState<MonthlyReward[]>([
    {
      id: "ipl-tickets",
      title: "IPL Match Tickets",
      description: "VIP tickets to an IPL match of your choice",
      icon: <Ticket className="h-6 w-6" />,
      requiredPoints: 2000,
      available: true,
    },
    {
      id: "concert-passes",
      title: "Concert Passes",
      description: "Premium passes to upcoming concerts",
      icon: <Ticket className="h-6 w-6" />,
      requiredPoints: 1500,
      available: true,
    },
    {
      id: "eco-gift",
      title: "Eco-Friendly Gift Box",
      description: "Curated box of sustainable products",
      icon: <Gift className="h-6 w-6" />,
      requiredPoints: 1000,
      available: true,
    },
    {
      id: "plant",
      title: "Indoor Plant",
      description: "Beautiful indoor plant for your space",
      icon: <Gift className="h-6 w-6" />,
      requiredPoints: 500,
      available: true,
    },
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: "1",
      name: "Gagan",
      points: 1500,
      rank: 1,
      badges: 5,
      donations: 2,
      streak: 7,
    },
    {
      id: "2",
      name: "Bharath",
      points: 1200,
      rank: 2,
      badges: 4,
      donations: 3,
      streak: 5,
    },
    {
      id: "3",
      name: "Abhilash",
      points: 1000,
      rank: 3,
      badges: 3,
      donations: 1,
      streak: 3,
    },
  ]);

  useEffect(() => {
    // Here you would fetch the user's actual points, badges, and leaderboard data
    setUserPoints(850);
    setUserRank(4);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to view rewards
          </h1>
          <p className="text-gray-600">
            You need to be logged in to see your rewards and badges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* User Stats */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Your Rewards
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track your progress and achievements
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {userPoints} Points
                  </div>
                  <div className="text-sm text-gray-600">Rank #{userRank}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("badges")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "badges"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Badges
                </button>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "leaderboard"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab("rewards")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "rewards"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Monthly Rewards
                </button>
              </nav>
            </div>

            <div className="p-8">
              {/* Badges Tab */}
              {activeTab === "badges" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-6 rounded-lg border-2 ${
                        badge.unlocked
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-3 rounded-full ${
                            badge.unlocked
                              ? "bg-primary-100 text-primary-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {badge.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">
                            {badge.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {badge.description}
                          </p>
                          {badge.progress !== undefined && (
                            <div className="mt-3">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-primary-500 rounded-full"
                                  style={{
                                    width: `${(badge.progress / 100) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Progress: {badge.progress}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === "leaderboard" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Top Contributors
                    </h2>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {currentMonth}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full font-medium">
                            {entry.rank}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-900">
                              {entry.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {entry.badges} Badges
                              </div>
                              <div className="flex items-center">
                                <Trophy className="h-4 w-4 mr-1" />
                                {entry.donations} Donations
                              </div>
                              <div className="flex items-center">
                                <Medal className="h-4 w-4 mr-1" />
                                {entry.streak} Day Streak
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">
                            {entry.points} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Rewards Tab */}
              {activeTab === "rewards" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Available Rewards
                    </h2>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {currentMonth}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {monthlyRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className={`p-6 rounded-lg border-2 ${
                          userPoints >= reward.requiredPoints
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-3 rounded-full ${
                              userPoints >= reward.requiredPoints
                                ? "bg-primary-100 text-primary-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {reward.icon}
                          </div>
                          <div className="ml-4 flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {reward.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {reward.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-primary-600">
                                  {reward.requiredPoints} pts
                                </div>
                                {userPoints >= reward.requiredPoints ? (
                                  <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                                    Claim Reward
                                  </button>
                                ) : (
                                  <div className="mt-2 text-sm text-gray-500">
                                    {reward.requiredPoints - userPoints} pts
                                    needed
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-primary-500 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      (userPoints / reward.requiredPoints) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsPage;
