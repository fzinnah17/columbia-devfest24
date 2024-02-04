
  
  import { Button } from "@/components/ui/button"
  import { HamburgerMenuIcon } from "@radix-ui/react-icons"
  import SearchButton from '@/components/SearchButton';
  import ProfileDropdown from './profile-dropdown';
  import ModeToggle from './mode-toggle';

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  export default function Menu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline"><HamburgerMenuIcon/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="flex items-center gap-4">
                <ProfileDropdown />
                <span className="text-lg">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-4">
                <ModeToggle />
                <span className="text-lg">Toggle</span>
            </DropdownMenuItem>
            
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  