"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useLogin } from "@/api/useAuth";

import AuthShell from "./AuthShell";
import {
  ErrorText,
  Field,
  Form,
  FormError,
  Input,
  Label,
  SubmitButton,
} from "./AuthForm";

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: LoginValues) {
    try {
      await login.mutateAsync(values);
      router.replace("/dashboard");
    } catch {
      // error displayed inline below
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your plan"
      description="Access your saved plan from anywhere and continue tracking your money."
      footer={
        <>
          Don&apos;t have an account yet?{" "}
          <Link href="/signup">Create one</Link>
        </>
      }
    >
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field>
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            $hasError={Boolean(errors.email)}
            {...register("email", {
              required: "Enter your email.",
            })}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            $hasError={Boolean(errors.password)}
            {...register("password", {
              required: "Enter your password.",
            })}
          />
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        </Field>

        {login.error && (
          <FormError role="alert">
            {login.error instanceof Error
              ? login.error.message
              : "Could not sign you in."}
          </FormError>
        )}

        <SubmitButton type="submit" disabled={login.isPending}>
          {login.isPending ? "Signing in..." : "Sign in"}
        </SubmitButton>
      </Form>
    </AuthShell>
  );
}
