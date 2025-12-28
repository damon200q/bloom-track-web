import { z } from 'zod';
import { insertCycleSchema, cycles, insertPregnancySchema, pregnancies, insertWeightSchema, weightEntries, insertPostpartumSchema, postpartumChecks } from './schema';

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
  pregnancy: {
    list: {
      method: 'GET' as const,
      path: '/api/pregnancy',
      responses: {
        200: z.array(z.custom<typeof pregnancies.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/pregnancy',
      input: insertPregnancySchema,
      responses: {
        201: z.custom<typeof pregnancies.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  weight: {
    list: {
      method: 'GET' as const,
      path: '/api/weight',
      responses: {
        200: z.array(z.custom<typeof weightEntries.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/weight',
      input: insertWeightSchema,
      responses: {
        201: z.custom<typeof weightEntries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  postpartum: {
    list: {
      method: 'GET' as const,
      path: '/api/postpartum',
      responses: {
        200: z.array(z.custom<typeof postpartumChecks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/postpartum',
      input: insertPostpartumSchema,
      responses: {
        201: z.custom<typeof postpartumChecks.$inferSelect>(),
        400: errorSchemas.validation,
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
