import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReadingClient } from "@/components/reading/reading-client";

export default async function ReadingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <ReadingClient
      user={{
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        isAdmin: session.user.isAdmin,
        hasUsedFreeReading: session.user.hasUsedFreeReading,
      }}
    />
  );
}
