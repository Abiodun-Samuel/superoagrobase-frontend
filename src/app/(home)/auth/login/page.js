import LoginFormWrapper from "@/components/auth/Login";
import PageLoader from "@/components/ui/PageLoader";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginFormWrapper />
    </Suspense>
  );
}
