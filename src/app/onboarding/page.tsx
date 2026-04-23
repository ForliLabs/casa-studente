import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login");
  if (user.onboardingComplete) redirect("/dashboard");

  return (
    <main className="flex min-h-[calc(100vh-130px)] items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="w-full max-w-2xl">
        <OnboardingWizard
          userRole={user.role}
          userName={user.name}
          userEmail={user.email}
        />
      </div>
    </main>
  );
}
