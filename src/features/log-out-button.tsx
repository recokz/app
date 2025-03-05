"use client";

import { Button } from "@mantine/core";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Button variant="subtle" onClick={handleLogout}>
      Выйти
    </Button>
  );
}
