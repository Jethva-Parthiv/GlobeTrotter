import { z } from 'zod'

export const tripSchema = z
  .object({
    name: z.string().min(1, 'Trip name is required'),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    cover_photo_url: z.string().nullable().optional(),
    is_public: z.coerce.boolean().optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'End date must be on or after the start date',
    path: ['end_date'],
  })


export const stopSchema = z
  .object({
    city_id: z.string().min(1, 'Choose a city'),
    arrival_date: z.string().min(1, 'Arrival date is required'),
    departure_date: z.string().min(1, 'Departure date is required'),
    transport_cost: z.coerce.number().min(0, 'Must be 0 or more'),
    stay_cost: z.coerce.number().min(0, 'Must be 0 or more'),
  })
  .refine((data) => data.departure_date >= data.arrival_date, {
    message: 'Departure must be on or after arrival',
    path: ['departure_date'],
  })
