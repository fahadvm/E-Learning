"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";
import { SubscriptionFeatureWithDescription, ValidationErrors } from "@/types/admin/adminTypes";

const builtInFeatures: Record<string, string> = {
  Compiler: "Write and run code directly on the platform.",
  "Video Call": "Connect with instructors or peers in real time.",
};

interface SubscriptionPlan {
  name: string;
  price: string | number;
  description: string;
  features: string[]; // only feature names
  popular: boolean;
  planFor: "Student" | "Company" | "";
}

const EditSubscriptionPlan = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<SubscriptionPlan>({
    name: "",
    price: "",
    description: "",
    features: [],
    popular: false,
    planFor: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Fetch Plan by ID
  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      try {
        const res = await adminApiMethods.getPlanById(id);
        const plan = res?.data?.data ?? res?.data;

        if (res.ok && plan) {
          setForm({
            name: plan.name,
            price: plan.price,
            description: plan.description,
            features: plan.features?.map((f: SubscriptionFeatureWithDescription) => f.name) || [],
            popular: plan.popular,
            planFor: plan.planFor,
          });
        }
      } catch (error) {
        console.error("Failed to fetch plan", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Toggle feature checkbox
  const toggleFeature = (feature: string) => {
    setForm((prev) => {
      const exists = prev.features.includes(feature);
      const updated = exists
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];

      return { ...prev, features: updated };
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.planFor) newErrors.planFor = "Please select a plan type";
    if (form.features.length === 0)
      newErrors.features = "Select at least one feature";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...form,
        features: form.features.map((name) => ({
          name,
          description: builtInFeatures[name],
        })),
      };

      const res = await adminApiMethods.updatePlan(id, payload);

      if (res.ok) {
        showSuccessToast("Plan updated successfully");
        router.push("/admin/subscriptions");
      } else {
        showInfoToast(res.message);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-700 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Subscription Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Plan Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold mb-1">Price *</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Plan For */}
        <div>
          <label className="block font-semibold mb-1">Plan For *</label>
          <select
            name="planFor"
            value={form.planFor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Student">Student</option>
            <option value="Company">Company</option>
          </select>
          {errors.planFor && (
            <p className="text-red-500 text-sm">{errors.planFor}</p>
          )}
        </div>

        {/* Popular */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">Popular</label>
          <input
            type="checkbox"
            name="popular"
            checked={form.popular}
            onChange={handleChange}
          />
        </div>

        {/* Features (CHECKBOXES like Add Page) */}
        <div>
          <label className="block font-semibold mb-1">Features *</label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(builtInFeatures).map((feature) => (
              <label
                key={feature}
                className="flex items-center gap-2 border px-3 py-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
          {errors.features && (
            <p className="text-red-500 text-sm">{errors.features}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Plan
        </button>
      </form>
    </div>
  );
};

export default EditSubscriptionPlan;
