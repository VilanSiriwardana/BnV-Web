'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

import { FormShell, TextField } from '@/components/forms/form-kit';
import { routes } from '@/config/routes';

import { loginAdmin } from './actions';
import { loginSchema, type LoginState } from './schema';

const initialState: LoginState = { status: 'idle' };
const f = loginSchema.shape;

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      router.replace(routes.admin.dashboard);
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <FormShell
      action={formAction}
      state={state.status === 'success' ? { status: 'idle' } : state}
      pending={pending || state.status === 'success'}
      submitLabel="Sign in"
      pendingLabel="Signing in…"
    >
      <TextField
        name="email"
        label="Email"
        schema={f.email}
        type="email"
        autoComplete="username"
        required
      />
      <TextField
        name="password"
        label="Password"
        schema={f.password}
        type="password"
        autoComplete="current-password"
        required
      />
    </FormShell>
  );
}
