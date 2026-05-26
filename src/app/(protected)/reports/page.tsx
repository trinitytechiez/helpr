"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useWorkers } from "@/hooks/useWorkers";

export default function ReportsPage() {
  const { data: workers, isLoading } = useWorkers();
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("MONTHLY");

  const activeWorkers = workers?.filter((w: any) => w.isActive) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600">Salary & Attendance</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Worker Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Worker
          </label>
          <select
            value={selectedWorker || ""}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choose a worker...</option>
            {activeWorkers.map((worker: any) => (
              <option key={worker.id} value={worker.id}>
                {worker.name} ({worker.salaryType})
              </option>
            ))}
          </select>
        </div>

        {/* Period Selection */}
        {selectedWorker && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
            </select>
          </div>
        )}

        {/* Report Summary */}
        {selectedWorker && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Gross Salary</p>
              <p className="text-4xl font-bold text-green-600">₹0</p>
              <p className="text-xs text-gray-500 mt-2">Calculated salary for period</p>
            </div>

            <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Days Present</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Days Absent</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Leave Balance</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Deductions</p>
                <p className="text-2xl font-bold text-orange-600">₹0</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Info */}
        {!selectedWorker && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              📊 <strong>Reports Feature:</strong> Select a worker above to view their detailed salary calculations, attendance breakdown, and leave balance for the selected period.
            </p>
          </div>
        )}

        {/* Export Button */}
        {selectedWorker && (
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
            📥 Export to Excel
          </button>
        )}

        {/* Coming Soon Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            ⚡ <strong>Full salary calculations</strong> will be available in the next update with detailed breakdowns and monthly comparisons.
          </p>
        </div>
      </div>
    </div>
  );
}
