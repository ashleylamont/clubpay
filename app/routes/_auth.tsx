import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center flex-auto py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center max-w-3xl">
        <Outlet />
      </main>
    </div>
  );
}
