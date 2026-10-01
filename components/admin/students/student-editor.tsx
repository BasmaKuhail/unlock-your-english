import { useState, type FormEvent } from "react";

import {
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/admin/icons";
import { Field } from "@/components/admin/ui/field";
import { Toggle } from "@/components/admin/ui/toggle";
import type { Level } from "@/lib/admin/types";
import type { Student } from "@/types/student";
import { cn } from "@/lib/cn";

type StudentEditorProps =
  | {
      mode: "create";
      levels: Level[];
      onClose: () => void;
      onCreate: (data: CreateStudentFormData) => void;
    }
  | {
      mode: "edit";
      student: Student;
      levels: Level[];
      onClose: () => void;
      onSave: (student: Student, newPassword?: string) => void;
    };

export type CreateStudentFormData = {
  name: string;
  password: string;
  level: string | null;
  levelOpen: boolean;
};

export function StudentEditor(props: StudentEditorProps) {
  const isCreateMode = props.mode === "create";

  const [name, setName] = useState(
    isCreateMode ? "" : props.student.name,
  );

  const [level, setLevel] = useState<string | null>(
    isCreateMode ? null : props.student.level,
  );

  const [levelOpen, setLevelOpen] = useState(
    isCreateMode ? false : props.student.levelOpen,
  );

  const [status, setStatus] = useState<"Active" | "Frozen">(
    isCreateMode ? "Active" : props.student.status,
  );

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isCreateMode) {
      props.onCreate({
        name: name.trim(),
        password,
        level,
        levelOpen,
      });

      return;
    }

    props.onSave(
      {
        ...props.student,
        name: name.trim(),
        level,
        levelOpen,
        status,
      },
      password.length > 0 ? password : undefined,
    );
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-end bg-ink/25 backdrop-blur-[1px] sm:items-stretch sm:justify-end"
      role="dialog"
    >
      <div className="flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:h-full sm:max-h-none sm:max-w-xl sm:rounded-none">
        <div className="flex items-start justify-between border-b border-[#e8eaf1] px-4 py-4 sm:px-6 sm:py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
              Student profile
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-[-0.05em] sm:text-2xl">
              {isCreateMode ? "Add student" : "Edit student"}
            </h2>
          </div>

          <button
            aria-label="Close editor"
            className="rounded-full p-2 text-ink/45 hover:bg-[#f2f4f8]"
            onClick={props.onClose}
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
            <div className="rounded-xl bg-[#f6f8fc] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink/42">
                Student ID
              </p>

              {isCreateMode ? (
                <>
                  <p className="mt-1 text-sm font-semibold text-ink/65">
                    Generated automatically
                  </p>

                  <p className="mt-2 text-xs leading-5 text-ink/42">
                    A unique learner ID will be created when you save this
                    student.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 break-all font-mono text-sm font-semibold text-ink/65">
                    {props.student.studentId}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-ink/42">
                    The learner ID is permanent and can&apos;t be changed.
                  </p>
                </>
              )}
            </div>

            <Field label="Full name">
              <input
                autoComplete="off"
                className="input"
                maxLength={100}
                minLength={2}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </Field>

            {isCreateMode || isResettingPassword ? (
              <Field label={isCreateMode ? "Password" : "New password"}>
                <div className="relative">
                  <input
                    autoComplete="new-password"
                    className="input pr-12"
                    id="student-password"
                    minLength={8}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                    required={isCreateMode || isResettingPassword}
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                  />

                  <button
                    aria-label={
                      isPasswordVisible
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={isPasswordVisible}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink/45 transition hover:bg-[#edf2ff] hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    onClick={() =>
                      setIsPasswordVisible((visible) => !visible)
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
              </Field>
            ) : (
              <button
                className="w-full rounded-xl border border-[#dce4ff] bg-[#f5f7ff] px-4 py-3 text-sm font-bold text-brand transition hover:bg-[#edf2ff] focus:outline-none focus:ring-2 focus:ring-brand/20"
                onClick={() => setIsResettingPassword(true)}
                type="button"
              >
                Reset password
              </button>
            )}

            <Field label="Current level">
              <select
                className="input"
                onChange={(event) =>
                  setLevel(event.target.value || null)
                }
                value={level ?? ""}
              >
                <option value="">Not assigned</option>

                {props.levels.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-xl border border-[#e7e9f0] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">Level access</p>
                  <p className="mt-1 text-xs text-ink/47">
                    Let this student open their current level.
                  </p>
                </div>

                <Toggle
                  checked={levelOpen}
                  label="Toggle level access"
                  onChange={() =>
                    setLevelOpen((current) => !current)
                  }
                />
              </div>

              {!isCreateMode && (
                <div className="mt-4 border-t border-[#edf0f5] pt-4">
                  <p className="text-sm font-bold">Account status</p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-bold transition",
                        status === "Active"
                          ? "border-[#bcebd5] bg-[#edfbf4] text-[#19734e]"
                          : "border-[#e5e8ef] text-ink/50 hover:bg-[#f8f9fc]",
                      )}
                      onClick={() => setStatus("Active")}
                      type="button"
                    >
                      Active
                    </button>

                    <button
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-bold transition",
                        status === "Frozen"
                          ? "border-[#dfe2e9] bg-[#f2f3f6] text-ink/70"
                          : "border-[#e5e8ef] text-ink/50 hover:bg-[#f8f9fc]",
                      )}
                      onClick={() => setStatus("Frozen")}
                      type="button"
                    >
                      Frozen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#e8eaf1] px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-5">
            <button
              className="w-full rounded-full px-4 py-3 text-sm font-bold text-ink/55 hover:bg-[#f2f4f8] sm:w-auto"
              onClick={props.onClose}
              type="button"
            >
              Cancel
            </button>

            <button
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(58,112,255,0.22)] hover:bg-brand-dark sm:w-auto"
              type="submit"
            >
              {isCreateMode ? "Create student" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
