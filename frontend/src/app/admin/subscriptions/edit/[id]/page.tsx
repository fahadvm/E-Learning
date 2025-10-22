"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";

interface SubscriptionPlan {
  name: string;
  price: string | number;
  description: string;
  features: string[];
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
    features: [""],
    popular: false,
    planFor: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Fetch Plan by ID
  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      try {
        const res = await adminApiMethods.getPlanById(id);
        console.log("Response from edit page:", res);

        // Adjust this line depending on your API shape
        const plan = res?.data?.data ?? res?.data ?? null;

        if (res.ok && plan) {
          setForm({
            name: plan.name || "",
            price: plan.price || "",
            description: plan.description || "",
            features: Array.isArray(plan.features) ? plan.features : [""],
            popular: Boolean(plan.popular),
            planFor: plan.planFor || ""
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

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle feature input changes
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...form.features];
    updatedFeatures[index] = value;
    setForm((prev) => ({ ...prev, features: updatedFeatures }));
  };

  // Add new feature field
  const addFeatureField = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price && form.price !== 0) newErrors.price = "Price is required";
    if (!form.planFor) newErrors.planFor = "Please select a plan type";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.features.length || form.features.some((f) => !f.trim())) {
      newErrors.features = "All feature fields must be filled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await adminApiMethods.updatePlan(id, form);
      if (res.ok) {
        showSuccessToast(res.message);
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
            placeholder="Enter plan name"
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
            placeholder="Enter price"
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
            placeholder="Enter description"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
          {errors.planFor && <p className="text-red-500 text-sm">{errors.planFor}</p>}
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

        {/* Features */}
        <div>
          <label className="block font-semibold">Features *</label>
          {form.features.map((feature, idx) => (
            <input
              key={idx}
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              className="w-full border p-2 rounded my-1"
              placeholder={`Feature ${idx + 1}`}
            />
          ))}
          {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
          <button
            type="button"
            onClick={addFeatureField}
            className="text-blue-600 mt-2 text-sm"
          >
            + Add Feature
          </button>
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
