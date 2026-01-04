import { z } from 'zod'

const priceRegex = /^(Free|Custom|\d+(\.\d{1,2})?)$/

const subscriptionPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Plan name must be at least 3 characters'),

  price: z
    .string()
    .trim()
    .regex(priceRegex, 'Enter a valid price, "Free" or "Custom"')
    .refine(
      (val) =>
        ['Free', 'Custom'].includes(val) || Number(val) > 0,
      { message: 'Price must be greater than 0' }
    ),

  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters'),

  features: z
    .array(z.string())
    .min(1, 'Select at least one feature'),

  planFor: z.enum(['Student', 'Company']),

  popular: z.boolean(),
})

type SubscriptionForm = z.infer<typeof subscriptionPlanSchema>
