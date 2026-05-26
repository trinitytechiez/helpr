"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { SignOutButton } from "@/components/SignOutButton";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Helpr</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-6 shadow-md">
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-green-100">Monday, May 26, 2026</p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Present Count */}
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-2">Present Today</p>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-xs text-gray-500 mt-1">workers</p>
          </div>

          {/* Absent Count */}
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <p className="text-gray-600 text-sm mb-2">Absent Today</p>
            <p className="text-3xl font-bold text-red-600">0</p>
            <p className="text-xs text-gray-500 mt-1">workers</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-base">
            📋 Mark Today's Attendance
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-base">
            👥 Manage Workers
          </button>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors text-base">
            📊 View Reports
          </button>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            🚀 <strong>More features coming soon:</strong> Attendance history, salary reports, and more!
          </p>
        </div>
      </div>
    </div>
  );
}
