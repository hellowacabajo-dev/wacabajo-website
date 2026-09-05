"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signIn, type LoginState } from "@/lib/backoffice/actions";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = { error: null };

export function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {(notice || state.error) && (
        <p
          role="alert"
          className="rounded-md border border-border-strong bg-surface px-4 py-3 font-sans text-sm text-foreground-muted"
        >
          {state.error ?? notice}
        </p>
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="username"
        placeholder="nama@wacabajo.org"
      />
      <Field
        id="password"
        label="Kata sandi"
        type="password"
        autoComplete="current-password"
      />

      <SubmitButton />
    </form>
  );
}

function Field({
  id,
  label,
  ...rest
}: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-sm font-medium">
        {label}
      </label>
      <input
        {...rest}
        id={id}
        name={id}
        required
        className="mt-2 h-12 w-full rounded-md border border-border-strong bg-surface-raised px-4 font-sans text-base text-foreground placeholder:text-foreground-subtle"
      />
    </div>
  );
}

/**
 * `useFormStatus` harus dipanggil dari komponen di dalam <form>, bukan dari
 * komponen yang merender form-nya — makanya tombolnya dipisah.
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Memeriksa…" : "Masuk"}
    </Button>
  );
}
