import { Button } from "@mantine/core";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function TryButton() {
  return (
    <>
      <SignedIn>
        <Button size="lg" component={Link} href="/cabinet" id="try">
          Попробовать
        </Button>
      </SignedIn>
      <SignedOut>
        <Button size="lg" component={Link} href="/sign-in" id="try">
          Попробовать
        </Button>
      </SignedOut>
    </>
  );
}
