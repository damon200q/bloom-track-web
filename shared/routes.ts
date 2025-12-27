import { z } from 'zod';
import { insertCycleSchema, cycles } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  cycles: {
    list: {
      method: 'GET' as const,
      path: '/api/cycles',
      responses: {
        200: z.array(z.custom<typeof cycles.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cycles',
      input: insertCycleSchema,
      responses: {
        201: z.custom<typeof cycles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/cycles/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
