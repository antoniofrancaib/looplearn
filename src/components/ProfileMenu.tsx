import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function ProfileMenu() {
  return (
    <div className="relative z-[100]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <User className="h-5 w-5" />
            <span className="sr-only">Open profile menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 p-2" 
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-foreground">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuGroup className="space-y-0.5">
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
              Home
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
              Personal info
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
              Data and privacy
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
              Security
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
              People and sharing
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer">
              Payments and subscriptions
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}