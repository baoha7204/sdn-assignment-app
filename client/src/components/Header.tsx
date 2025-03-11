import { Link, useNavigate } from "react-router-dom";
import { FlaskConical, User, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Function to get user's initials for avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return "U";
    return currentUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg cursor-pointer"
            >
              <FlaskConical className="h-6 w-6" />
              <span>Perfume Shop</span>
            </Link>

            <nav className="flex items-center gap-4">
              {/* Admin-only navigation links */}
              {currentUser?.isAdmin && (
                <>
                  <Button variant="ghost" asChild>
                    <Link
                      to="/admin/brands"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      <span>Brands</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link
                      to="/admin/perfumes"
                      className="flex items-center gap-2"
                    >
                      <FlaskConical className="h-4 w-4" />
                      <span>Perfumes</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link
                      to="/admin/collectors"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Collectors</span>
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
