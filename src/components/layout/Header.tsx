import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserMenu from "./UserMenu";

const Header = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-orbitron font-bold text-primary">
          ClubLink
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  </nav>
);

export default Header;