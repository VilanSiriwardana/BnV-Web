import { z } from 'zod';

import { emailSchema } from '@/lib/forms/fields';
import type { FormState } from '@/lib/forms/types';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Please enter your password.').max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginField = keyof LoginInput;
export type LoginState = FormState<LoginField>;
