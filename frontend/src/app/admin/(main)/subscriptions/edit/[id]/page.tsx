"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";
import { SubscriptionFeatureWithDescription } from "@/types/admin/adminTypes";

/* ================= CONSTANTS ================= */

const builtInFeatures: Record<string, string> = {
  Compiler: "Write and run code directly on the platform.",
  "Video Call": "Connect with instructors or peers in real time.",
};

/* ================= ZOD ================= */

const priceRegex = /^(Free|Custom|\d+(\.\d{1,2})?)$/;

const editSubscriptionSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),

  price: z
    .string()
    .trim()
    .regex(priceRegex, 'Enter a valid price, "Free" or "Custom"')
    .refine(
      (val) => ["Free", "Custom"].includes(val) || Number(val) > 0,
      { message: "Price must be greater than 0" }
    ),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  features: z.array(z.string()).min(1, "Select at least one feature"),

  popular: z.boolean(),

  planFor: z.enum(["Student", "Company"]),
});

type EditSubscriptionForm = z.infer<typeof editSubscriptionSchema>;

/* ================= PAGE ================= */

const EditSubscriptionPlan = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<EditSubscriptionForm>({
    name: "",
    price: "",
    description: "",
    features: [],
    popular: false,
    planFor: "Student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  /* ============== FETCH PLAN ============== */

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;

      try {
        const res = await adminApiMethods.getPlanById(id);
        const plan = res?.data?.data ?? res?.data;

        if (res.ok && plan) {
          setForm({
            name: plan.name,
            price: String(plan.price),
            description: plan.description,
            features:
              plan.features?.map(
                (f: SubscriptionFeatureWithDescription) => f.name
              ) || [],
            popular: Boolean(plan.popular),
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

  /* ============== HANDLERS ============== */

  const handleChange = <
    K extends keyof EditSubscriptionForm
  >(
    field: K,
    value: EditSubscriptionForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => {
      const updated = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];

      return { ...prev, features: updated };
    });

    setErrors((prev) => ({ ...prev, features: "" }));
  };

  /* ============== SUBMIT ============== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = editSubscriptionSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const payload = {
        ...parsed.data,
        features: parsed.data.features.map((name) => ({
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

  /* ============== UI ============== */

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Edit Subscription Plan</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="font-semibold">Plan Name *</label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="font-semibold">Price *</label>
          <input
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Plan For */}
        <div>
          <label className="font-semibold">Plan For *</label>
          <select
            value={form.planFor}
            onChange={(e) =>
              handleChange("planFor", e.target.value as "Student" | "Company")
            }
            className="w-full border p-2 rounded"
          >
            <option value="Student">Student</option>
            <option value="Company">Company</option>
          </select>
          {errors.planFor && (
            <p className="text-red-500 text-sm">{errors.planFor}</p>
          )}
        </div>

        {/* Popular */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.popular}
            onChange={(e) => handleChange("popular", e.target.checked)}
          />
          Popular
        </label>

        {/* Features */}
        <div>
          <label className="font-semibold">Features *</label>
          <div className="flex flex-wrap gap-3 mt-2">
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
