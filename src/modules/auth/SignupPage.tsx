"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useSignup } from "@/api/useAuth";

import AuthShell from "./AuthShell";
import {
  ErrorText,
  Field,
  Form,
  FormError,
  Hint,
  Input,
  Label,
  SubmitButton,
} from "./AuthForm";

type SignupValues = {
  email: string;
  password: string;
  confirm: string;
};

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupValues>({
    defaultValues: { email: "", password: "", confirm: "" },
    mode: "onTouched",
  });

  const password = watch("password");

  async function onSubmit(values: SignupValues) {
    try {
      await signup.mutateAsync({
        email: values.email,
        password: values.password,
      });
      router.replace("/dashboard");
    } catch {
      // error displayed inline below
    }
  }

  return (
    <AuthShell
      eyebrow="Save your plan"
      title="Create your account"
      description="Keep your plan safe, access it from any device, and continue right where you left off."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </>
      }
    >
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            $hasError={Boolean(errors.email)}
            {...register("email", {
              required: "Enter your email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email.",
              },
            })}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            $hasError={Boolean(errors.password)}
            {...register("password", {
              required: "Choose a password.",
              minLength: {
                value: 8,
                message: "At least 8 characters.",
              },
            })}
          />
          {errors.password ? (
            <ErrorText>{errors.password.message}</ErrorText>
          ) : (
            <Hint>At least 8 characters.</Hint>
          )}
        </Field>

        <Field>
          <Label htmlFor="signup-confirm">Confirm password</Label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            $hasError={Boolean(errors.confirm)}
            {...register("confirm", {
              required: "Confirm your password.",
              validate: (value) =>
                value === password || "Passwords do not match.",
            })}
          />
          {errors.confirm && <ErrorText>{errors.confirm.message}</ErrorText>}
        </Field>

        {signup.error && (
          <FormError role="alert">
            {signup.error instanceof Error
              ? signup.error.message
              : "Could not create your account."}
          </FormError>
        )}

        <SubmitButton type="submit" disabled={signup.isPending}>
          {signup.isPending ? "Saving your plan..." : "Create account & save plan"}
        </SubmitButton>
      </Form>
    </AuthShell>
  );
}
