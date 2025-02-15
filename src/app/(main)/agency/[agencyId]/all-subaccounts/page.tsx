import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAuthUserDetails } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "./_components/delete-button";
import CreateSubaccountButton from "./_components/createSubaccountButton";

type Props = {
  params: Promise<{ agencyId: string }>;
};

const AllSubaccounts = async ({ params }: Props) => {
  const { agencyId } = await params;
  const user = await getAuthUserDetails();
  if (!user) return null;

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <CreateSubaccountButton
          user={user}
          id={agencyId}
          className="w-[200px] self-end m-6"
        />
        <Command className="rounded-lg bg-transparent ">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
            <CommandEmpty>No Results Found</CommandEmpty>
            <CommandGroup heading={"Sub Accounts"}>
              {!!user.Agency?.SubAccount.length ? (
                user.Agency.SubAccount.map((acc) => (
                  <CommandItem
                    key={acc.id}
                    className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccount/${acc.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          src={acc.subAccountLogo}
                          alt="subaccount logo"
                          fill
                          className="rounded-md object-contain"
                        />
                      </div>
                      <div className="flex flex-col justify-between ">
                        <div className="flex flex-col">
                          {acc.name}
                          <span className="text-muted-foreground text-xs">
                            {acc.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        className="text-red-600 w-20 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are your absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This action cannot be undon. This will delete the
                          subaccount and all data related to the subaccount.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton subaccountId={acc.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Sub Accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};
export default AllSubaccounts;
