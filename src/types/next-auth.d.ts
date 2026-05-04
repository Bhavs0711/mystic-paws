import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin: boolean;
      hasUsedFreeReading: boolean;
    };
  }

  interface User {
    isAdmin: boolean;
    hasUsedFreeReading: boolean;
  }
}
