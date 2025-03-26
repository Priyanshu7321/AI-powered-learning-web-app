import { Link, useLocation } from "wouter";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OwlMascot from "./OwlMascot";

type Language = 'en' | 'hi';

interface HeaderProps {
  userName?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ userName = "Lily", language, onLanguageChange }: HeaderProps) {
  const [location] = useLocation();
  
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <OwlMascot size="small" />
            <h1 className="text-white font-bold text-2xl font-comic">LearnSpeakGrow</h1>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-accent hover:bg-transparent transition" aria-label="Settings">
            <i className="ri-settings-3-line text-2xl"></i>
          </Button>
          
          <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
            <Avatar className="w-8 h-8 border-2 border-accent">
              <AvatarImage src="" />
              <AvatarFallback className="bg-accent text-dark">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white font-medium hidden md:inline">{userName}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="flex items-center justify-center bg-white bg-opacity-20 rounded-full w-10 h-10 text-white hover:bg-opacity-30 transition" 
                variant="ghost"
                aria-label="Change language"
              >
                <span className="font-medium">{language.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onLanguageChange('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLanguageChange('hi')}>
                हिंदी (Hindi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
