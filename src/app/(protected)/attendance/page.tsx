"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import {
  useAttendanceByDate,
  useMarkAttendance,
  useBulkMarkAttendance,
} from "@/hooks/useAttendance";
import { useHelpers } from "@/hooks/useHelpers";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS = {
  PRESENT: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  ABSENT: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  LATE: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  HALF_DAY: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  ON_LEAVE: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { data: workers } = useHelpers();
  const { data: attendance } = useAttendanceByDate(selectedDate);
  const markAttendance = useMarkAttendance();
  const bulkMarkAttendance = useBulkMarkAttendance();

  const activeWorkers = useMemo(
    () => workers?.filter((w: any) => w.isActive) || [],
    [workers]
  );

  const attendanceMap = useMemo(() => {
    const map = new Map();
    attendance?.forEach((record: any) => {
      map.set(record.workerId, record);
    });
    return map;
  }, [attendance]);

  const stats = useMemo(() => {
    const workersWithAttendance = activeWorkers.filter((w: any) =>
      attendanceMap.has(w.id)
    );

    const counts = {
      present: 0,
      absent: 0,
      onLeave: 0,
      late: 0,
      halfDay: 0,
      total: activeWorkers.length,
      marked: workersWithAttendance.length,
    };

    workersWithAttendance.forEach((w: any) => {
      const record = attendanceMap.get(w.id);
      switch (record.status) {
        case "PRESENT":
          counts.present++;
          break;
        case "ABSENT":
          counts.absent++;
          break;
        case "ON_LEAVE":
          counts.onLeave++;
          break;
        case "LATE":
          counts.late++;
          break;
        case "HALF_DAY":
          counts.halfDay++;
          break;
      }
    });

    return counts;
  }, [activeWorkers, attendanceMap]);

  async function handleStatusChange(
    workerId: string,
    status: string
  ) {
    try {
      await markAttendance.mutateAsync({
        workerId,
        date: selectedDate,
        status: status as any,
      });
    } catch (error) {
      console.error("Failed to mark attendance:", error);
    }
  }

  async function handleMarkAllPresent() {
    const records = activeWorkers.map((worker: any) => ({
      workerId: worker.id,
      date: selectedDate,
      status: "PRESENT",
    }));

    try {
      await bulkMarkAttendance.mutateAsync(records);
    } catch (error) {
      console.error("Failed to bulk mark attendance:", error);
    }
  }

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const isFutureDate = new Date(selectedDate) > new Date();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Mark Attendance
          </h1>

          {/* Date Picker */}
          <div className="flex gap-4 items-center mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {formatDate(new Date(selectedDate))}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{stats.present}</p>
              <p className="text-xs text-blue-800">Present</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-red-800">Absent</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{stats.onLeave}</p>
              <p className="text-xs text-blue-800">On Leave</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                Marked: {stats.marked} / {stats.total}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((stats.marked / stats.total) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${(stats.marked / stats.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warning for Future Dates */}
      {isFutureDate && (
        <div className="max-w-2xl mx-auto px-6 py-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            ⚠️ You cannot mark attendance for future dates
          </p>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* Bulk Actions */}
        <div className="mb-6">
          <button
            onClick={handleMarkAllPresent}
            disabled={isFutureDate}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            ✓ Mark All as Present
          </button>
        </div>

        {/* Workers List */}
        <div className="space-y-3">
          {activeWorkers.map((worker: any) => {
            const record = attendanceMap.get(worker.id);
            const status = record?.status || null;

            return (
              <div
                key={worker.id}
                className={`bg-white rounded-lg p-4 border-2 transition-colors ${
                  status
                    ? `${STATUS_COLORS[status as keyof typeof STATUS_COLORS].bg} ${STATUS_COLORS[status as keyof typeof STATUS_COLORS].border}`
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {worker.name}
                    </h3>
                    <p className="text-sm text-gray-600">{worker.category}</p>
                  </div>
                  {status && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[status as keyof typeof STATUS_COLORS].bg
                      } ${STATUS_COLORS[status as keyof typeof STATUS_COLORS].text}`}
                    >
                      {status}
                    </span>
                  )}
                </div>

                {/* Status Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {["PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(worker.id, s)}
                        disabled={isFutureDate}
                        className={`py-2 px-2 rounded text-xs font-semibold transition-all ${
                          status === s
                            ? `${STATUS_COLORS[s as keyof typeof STATUS_COLORS].bg} ${STATUS_COLORS[s as keyof typeof STATUS_COLORS].text} border-2 ${STATUS_COLORS[s as keyof typeof STATUS_COLORS].border}`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200"
                        } disabled:opacity-50`}
                      >
                        {s === "PRESENT"
                          ? "✓"
                          : s === "ABSENT"
                          ? "✕"
                          : s === "LATE"
                          ? "⏰"
                          : s === "HALF_DAY"
                          ? "½"
                          : "🏖"}
                        <br />
                        {s === "PRESENT"
                          ? "P"
                          : s === "ABSENT"
                          ? "A"
                          : s === "LATE"
                          ? "L"
                          : s === "HALF_DAY"
                          ? "H"
                          : "L"}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {activeWorkers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No active workers found</p>
            <p className="text-sm text-gray-500">
              Add workers from the Workers section to mark attendance
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
