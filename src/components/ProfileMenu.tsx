
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
import { 
  User, 
  Home, 
  UserCog, 
  Shield, 
  Share2, 
  CreditCard,
  LogOut,
  Lock
} from "lucide-react"

export function ProfileMenu() {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="relative flex items-center gap-2 px-4 hover:bg-accent"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">Profile</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-72 p-3" 
          align="end"
          sideOffset={8}
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-center gap-3 pb-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="space-y-1 p-1">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2">
              <UserCog className="h-4 w-4 text-muted-foreground" />
              <span>Personal Info</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Privacy Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span>Sharing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Billing</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-red-600 hover:text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
