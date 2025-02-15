import { ModeToggle } from "@/components/global/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import Image from "next/image";
import Link from "next/link";

type Props = {
  user?: null | User;
};

const Navigation = async ({ user }: Props) => {
  return (
    <div className="p-4 flex items-center justify-between z-10 fixed top-0 right-0 left-0">
      <aside className="flex items-center gap-2">
        <Image
          src={"/assets/plura-logo.svg"}
          width={40}
          height={40}
          alt="plura logo"
        />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex justify-center items-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documations</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Button
          asChild
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          {(await currentUser()) ? (
            <Link href={"/agency"}>Dashboard</Link>
          ) : (
            <SignInButton mode="modal">Login</SignInButton>
          )}
        </Button>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
