"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorker, useUpdateWorker } from "@/hooks/useHelpers";
import { formatDate } from "@/lib/utils";

export default function EditWorkerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: worker, isLoading } = useWorker(params.id);
  const updateWorker = useUpdateWorker(params.id);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("details");

  const [formData, setFormData] = useState(() => ({
    name: worker?.name || "",
    phone: worker?.phone || "",
    category: worker?.category || "",
    department: worker?.department || "",
    joinDate: worker?.joinDate
      ? new Date(worker.joinDate).toISOString().split("T")[0]
      : "",
    isActive: worker?.isActive ?? true,
    salaryType: worker?.salaryType || "MONTHLY",
    salaryAmount: worker?.salaryAmount?.toString() || "",
    designatedLeaves: worker?.designatedLeaves?.toString() || "12",
    leaveCarryover: worker?.leaveCarryover ?? false,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading worker...</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.salaryAmount) {
      setError("Name and salary amount are required");
      return;
    }

    try {
      await updateWorker.mutateAsync({
        ...formData,
        salaryType: formData.salaryType as "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY",
        salaryAmount: parseFloat(formData.salaryAmount),
        designatedLeaves: parseInt(formData.designatedLeaves),
      });
      router.push("/helpers");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-6 py-8">
        <Link
          href="/helpers"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block"
        >
          ← Back to Workers
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Worker: {worker?.name}
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setTab("details")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === "details"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setTab("salary")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === "salary"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Salary
          </button>
          <button
            onClick={() => setTab("status")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === "status"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Status
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
          {/* Details Tab */}
          {tab === "details" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Salary Tab */}
          {tab === "salary" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Type
                </label>
                <select
                  value={formData.salaryType}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salaryAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryAmount: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designated Leaves per Year
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.designatedLeaves}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      designatedLeaves: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.leaveCarryover}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leaveCarryover: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Allow unused leaves to carry forward
                </span>
              </label>
            </>
          )}

          {/* Status Tab */}
          {tab === "status" && (
            <>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Current Status:{" "}
                  <span
                    className={`font-semibold ${
                      formData.isActive
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isActive: !formData.isActive,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                    formData.isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Mark as {formData.isActive ? "Inactive" : "Active"}
                </button>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateWorker.isPending}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {updateWorker.isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/helpers"
              className="flex-1 h-12 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
