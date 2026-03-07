import Link from "next/link";

import { UserForm } from "@/components/admin/user-form";

export default function NewUserPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Register User</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new admin or customer account.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to Dashboard
        </Link>
      </div>

      <UserForm />
    </div>
  );
}
