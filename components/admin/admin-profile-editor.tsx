"use client";

import {
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import {
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/admin/icons";
import { Field } from "@/components/admin/ui/field";
import {
  type AdminProfile,
  useAdmin,
} from "@/context/admin-context";
import { signOutAdmin } from "@/lib/auth/admin-auth";

type AdminProfileEditorProps = {
  admin: AdminProfile;
  onClose: () => void;
};

export function AdminProfileEditor({
  admin,
  onClose,
}: AdminProfileEditorProps) {
  const router = useRouter();
  const { updateAdmin } = useAdmin();

  const [displayName, setDisplayName] = useState(
    admin.displayName ?? "",
  );

  const [email, setEmail] = useState(admin.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const normalizedName = displayName.trim();
    const normalizedEmail = email.trim();

    if (normalizedName.length < 2) {
      setError("Enter a valid display name.");
      return;
    }

    if (!normalizedEmail) {
      setError("Enter a valid email address.");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const passwordChanged = newPassword.length > 0;

      await updateAdmin({
        displayName: normalizedName,
        email: normalizedEmail,
        ...(passwordChanged
          ? { newPassword }
          : {}),
      });

      if (passwordChanged) {
        await signOutAdmin();

        router.replace(
          "/admin/login?reason=password-changed",
        );

        return;
      }

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end bg-ink/25 backdrop-blur-[1px] sm:items-stretch sm:justify-end"
      role="dialog"
    >
      <div className="flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:h-full sm:max-h-none sm:max-w-xl sm:rounded-none">
        <div className="flex items-start justify-between border-b border-[#e8eaf1] px-4 py-4 sm:px-6 sm:py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
              Account
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-[-0.05em] sm:text-2xl">
              Edit profile
            </h2>
          </div>

          <button
            aria-label="Close profile editor"
            className="rounded-full p-2 text-ink/45 hover:bg-[#f2f4f8]"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={submit}
        >
          <div className="space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <Field label="Display name">
              <input
                autoComplete="name"
                className="input"
                maxLength={100}
                minLength={2}
                onChange={(event) =>
                  setDisplayName(event.target.value)
                }
                required
                value={displayName}
              />
            </Field>

            <Field label="Email address">
              <input
                autoComplete="email"
                className="input"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                type="email"
                value={email}
              />
            </Field>

            <Field label="New password">
              <div className="relative">
                <input
                  autoComplete="new-password"
                  className="input pr-12"
                  minLength={8}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Leave blank to keep current password"
                  type={
                    isPasswordVisible
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                />

                <button
                  aria-label={
                    isPasswordVisible
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={isPasswordVisible}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink/45 transition hover:bg-[#edf2ff] hover:text-brand"
                  onClick={() =>
                    setIsPasswordVisible(
                      (visible) => !visible,
                    )
                  }
                  type="button"
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs leading-5 text-ink/42">
                Leave blank if you don&apos;t want to change your
                password. Changing it will sign you out.
              </p>
            </Field>

            {error && (
              <p
                className="rounded-xl bg-[#fff3f1] px-4 py-3 text-sm font-medium text-[#bd3c34]"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#e8eaf1] px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-5">
            <button
              className="w-full rounded-full px-4 py-3 text-sm font-bold text-ink/55 hover:bg-[#f2f4f8] disabled:opacity-50 sm:w-auto"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>

            <button
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}