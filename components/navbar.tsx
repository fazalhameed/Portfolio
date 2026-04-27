"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import { getPersonalInfo, getSocialLinks } from "@/lib/config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const personalInfo = getPersonalInfo();
  const socialLinks = getSocialLinks();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <motion.header
      className={cn(
        "fixed top-0 w-full z-40 backdrop-blur-sm transition-all duration-300",
        scrollY.get() > 50 ? "bg-background/80" : "bg-transparent",
      )}
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold" onClick={closeMenu}>
          <motion.span
            className="flex gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              className="h-8 w-8 hidden dark:block"
              src="/dark-logo.png"
              alt="shamim-logo-dark"
            />
            <img
              className="h-8 w-8 block dark:hidden"
              src="/light-logo.png"
              alt="shamim-logo-light"
            />
            {personalInfo.name.split(" ")[1]}{" "}
            <span className="text-primary">
              {personalInfo.name.split(" ")[2] || ""}
            </span>
          </motion.span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="text-base font-medium rounded-full px-4"
                >
                  <Link href={item.href} onClick={closeMenu}>
                    {item.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="block md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] flex flex-col p-0 backdrop-blur-xl bg-background/90"
            >
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-left flex items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <img
                      className="h-8 w-8 hidden dark:block"
                      src="/dark-logo.png"
                      alt="shamim-logo-dark"
                    />
                    <img
                      className="h-8 w-8 block dark:hidden"
                      src="/light-logo.png"
                      alt="shamim-logo-light"
                    />
                    <span className="text-xl font-bold">
                      {personalInfo.name.split(" ")[1]}{" "}
                      <span className="text-primary">
                        {personalInfo.name.split(" ")[2] || ""}
                      </span>
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col p-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start text-lg py-6 font-medium"
                      onClick={closeMenu}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </Button>
                  </motion.div>
                ))}
              </nav>

              <SheetFooter className="mt-auto p-6 border-t flex-row justify-center gap-4 sm:justify-start">
                {socialLinks.map((social) => {
                  const Icon =
                    social.platform === "GitHub"
                      ? FaGithub
                      : social.platform === "LinkedIn"
                        ? FaLinkedinIn
                        : FaGlobe;
                  return (
                    <Button
                      key={social.platform}
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  );
                })}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
