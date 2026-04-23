"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, userStore } from "@/lib/auth";

export async function completeOnboardingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere" };

  const step = formData.get("step") as string;

  switch (step) {
    case "profile": {
      const bio = formData.get("bio") as string;
      await userStore.update(user.id, { profileComplete: true });
      break;
    }
    case "preferences": {
      // Roommate preferences saved — in real app, this would update roommateStore
      break;
    }
    case "search": {
      // Saved search created — in real app, this would update savedSearchStore
      break;
    }
    case "complete": {
      await userStore.update(user.id, { onboardingComplete: true });
      revalidatePath("/dashboard");
      redirect("/dashboard");
    }
    default:
      return { error: "Step non valido" };
  }

  revalidatePath("/onboarding");
  return { success: true };
}

export async function skipOnboardingAction() {
  const user = await getCurrentUser();
  if (!user) return;

  await userStore.update(user.id, { onboardingComplete: true });
  redirect("/dashboard");
}
