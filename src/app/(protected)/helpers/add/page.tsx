"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateWorker } from "@/hooks/useHelpers";

export default function AddWorkerPage() {
  const router = useRouter();
  const createWorker = useCreateWorker();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    department: "",
    joinDate: new Date().toISOString().split("T")[0],
    salaryType: "MONTHLY",
    salaryAmount: "",
    designatedLeaves: "12",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.salaryAmount) {
      setError("Name and salary amount are required");
      return;
    }

    try {
      await createWorker.mutateAsync({
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

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Worker</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          {/* Phone */}
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
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Category */}
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
              placeholder="e.g., Manager, Operator"
            />
          </div>

          {/* Department */}
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
              placeholder="e.g., Operations"
            />
          </div>

          {/* Join Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Join Date
            </label>
            <input
              type="date"
              required
              value={formData.joinDate}
              onChange={(e) =>
                setFormData({ ...formData, joinDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Salary Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Type *
            </label>
            <select
              required
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

          {/* Salary Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.salaryAmount}
              onChange={(e) =>
                setFormData({ ...formData, salaryAmount: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="25000"
            />
          </div>

          {/* Designated Leaves */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designated Leaves per Year
            </label>
            <input
              type="number"
              min="0"
              value={formData.designatedLeaves}
              onChange={(e) =>
                setFormData({ ...formData, designatedLeaves: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12"
            />
          </div>

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
              disabled={createWorker.isPending}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              {createWorker.isPending ? "Creating..." : "Add Worker"}
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
