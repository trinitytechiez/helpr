"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { SignOutButton } from "@/components/SignOutButton";
import { useDashboardStats, useWorkersOnLeaveToday } from "@/hooks/useDashboard";
import { useWorkers } from "@/hooks/useWorkers";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: stats } = useDashboardStats();
  const { data: workers } = useWorkers();
  const { data: onLeaveTodayIds } = useWorkersOnLeaveToday();

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

  const workersOnLeave = workers?.filter((w: any) =>
    onLeaveTodayIds?.has(w.id)
  );

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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Helpr</h1>
            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-md">
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-green-100">{formatDate(new Date())}</p>
        </div>

        {/* Today's Attendance Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Today's Attendance
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Present */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
              <p className="text-gray-600 text-xs mb-2">Present</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.present || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">workers</p>
            </div>

            {/* Absent */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
              <p className="text-gray-600 text-xs mb-2">Absent</p>
              <p className="text-3xl font-bold text-red-600">
                {stats?.absent || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">workers</p>
            </div>

            {/* On Leave */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <p className="text-gray-600 text-xs mb-2">On Leave</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.onLeave || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">workers</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                Marked: {(stats?.present || 0) + (stats?.absent || 0) + (stats?.onLeave || 0)} / {stats?.total || 0}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {stats?.total
                  ? Math.round(
                      (((stats?.present || 0) +
                        (stats?.absent || 0) +
                        (stats?.onLeave || 0)) /
                        stats.total) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{
                  width: `${
                    stats?.total
                      ? (((stats?.present || 0) +
                          (stats?.absent || 0) +
                          (stats?.onLeave || 0)) /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Workers on Leave Today */}
        {workersOnLeave && workersOnLeave.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              On Leave Today
            </h3>
            <div className="space-y-2">
              {workersOnLeave.map((worker: any) => (
                <div
                  key={worker.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <p className="font-semibold text-blue-900">{worker.name}</p>
                  <p className="text-xs text-blue-700">{worker.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/attendance"
              className="w-full block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors text-center text-base"
            >
              📋 Mark Today's Attendance
            </Link>
            <Link
              href="/workers"
              className="w-full block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-center text-base"
            >
              👥 Manage Workers
            </Link>
            <Link
              href="/reports"
              className="w-full block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors text-center text-base"
            >
              📊 View Reports
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Workers</span>
              <span className="font-semibold text-gray-900">{stats?.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mark Rate</span>
              <span className="font-semibold text-gray-900">
                {stats?.total
                  ? Math.round(
                      (((stats?.present || 0) +
                        (stats?.absent || 0) +
                        (stats?.onLeave || 0)) /
                        stats.total) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Attendance Status</span>
              <span className="font-semibold text-green-600">Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
