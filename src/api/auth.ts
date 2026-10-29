import axios from "axios";
import { localStore } from "./localStore";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000/api";

export const authClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export type AuthUser = {
  id: number;
  email: string;
  created_at: string;
};

export type AuthResponse = {
  user: AuthUser;
};

function unwrapError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { error?: string } | undefined)?.error ??
      error.message;
    return typeof message === "string" ? message : fallback;
  }
  return fallback;
}

export async function signupRequest(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    const { data } = await authClient.post<AuthResponse>("/auth/signup", {
      email,
      password,
    });
    return data.user;
  } catch (error) {
    throw new Error(unwrapError(error, "Could not create your account."));
  }
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    const { data } = await authClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data.user;
  } catch (error) {
    throw new Error(unwrapError(error, "Invalid email or password."));
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    await authClient.post("/auth/logout");
  } catch {
    // ignore — client-side we treat logout as always-success
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await authClient.get<AuthResponse>("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function uploadPlanToBackend(): Promise<void> {
  try {
    const settings = localStore.getSettings();
    await authClient.post("/sync/upload", {
      settings,
      transactions: localStore.getTransactions(),
      incomeSources: localStore.getIncomeSources(),
      fixedExpenses: localStore.getFixedExpenses(),
      financialGoals: localStore.getFinancialGoals(),
    });
  } catch (error) {
    throw new Error(unwrapError(error, "Could not save your plan."));
  }
}

export async function clearBackendPlan(): Promise<void> {
  try {
    await authClient.post("/sync/upload", {
      settings: null,
      transactions: [],
      incomeSources: [],
      fixedExpenses: [],
      financialGoals: [],
    });
  } catch (error) {
    throw new Error(unwrapError(error, "Could not reset your plan."));
  }
}
