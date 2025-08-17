// /app/admin/subscription/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const EditSubscriptionPlan = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    features: [""],
    popular: false,
    planFor: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/subscriptionplans/${id}`
        );

        const plan = res.data?.data;
        if (plan) {
          setForm({
            name: plan.name || "",
            price: plan.price || "",
            description: plan.description || "",
            features: Array.isArray(plan.features) ? plan.features : [""],
            popular: plan.popular || false,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...form.features];
    updatedFeatures[index] = value;
    setForm((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeatureField = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/subscriptionplans/${id}`,
        form
      );
      router.push("/admin/subscriptions");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-600 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Subscription Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="input w-full border p-2"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="input w-full border p-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="input w-full border p-2"
        />

        <div>
          <label className="block mb-1 font-semibold">Plan For</label>
          <select
            name="planFor"
            value={form.planFor}
            onChange={handleChange}
            className="input w-full border p-2"
          >
            <option value="">Select</option>
            <option value="Student">Student</option>
            <option value="Company">Company</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold">Popular</label>
          <input
            type="checkbox"
            name="popular"
            checked={form.popular}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold">Features</label>
          {form.features.map((feature, idx) => (
            <input
              key={idx}
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              className="input w-full border p-2 my-1"
              placeholder={`Feature ${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addFeatureField}
            className="text-blue-500 mt-2"
          >
            + Add Feature
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditSubscriptionPlan;
