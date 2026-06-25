"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import { Session } from "next-auth";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export function RootProvider({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
} 