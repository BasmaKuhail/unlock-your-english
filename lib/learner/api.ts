import { auth } from "@/lib/firebase/client";

export async function learnerRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to continue.");
  const token = await user.getIdToken();
  const response = await fetch(path, {
    ...options, cache: "no-store",
    headers: { ...options.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data as T;
}
