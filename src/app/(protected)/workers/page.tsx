"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useWorkers, useDeleteWorker } from "@/hooks/useWorkers";
import { formatDate } from "@/lib/utils";

export default function WorkersPage() {
  const { data: workers, isLoading, error } = useWorkers();
  const deleteWorker = useDeleteWorker();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredWorkers = workers?.filter((worker: any) => {
    const matchesSearch = worker.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === null ? true : worker.isActive === filterActive;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
            <Link
              href="/workers/add"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              + Add Worker
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive(null)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === null
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterActive(true)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === true
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterActive(false)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === false
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6 pb-24">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading workers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              Failed to load workers. Please try again.
            </p>
          </div>
        ) : filteredWorkers?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No workers found</p>
            <Link
              href="/workers/add"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Create your first worker
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkers?.map((worker: any) => (
              <div
                key={worker.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {worker.name}
                    </h3>
                    <p className="text-sm text-gray-600">{worker.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      worker.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {worker.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p>{worker.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salary Type</p>
                    <p>{worker.salaryType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p>{formatDate(new Date(worker.joinDate))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salary</p>
                    <p>₹{worker.salaryAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <Link
                    href={`/workers/${worker.id}`}
                    className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(worker.id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === worker.id && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-900 mb-2">
                      Are you sure? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          deleteWorker.mutate(worker.id);
                          setDeleteConfirm(null);
                        }}
                        className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-900 text-sm font-medium rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
