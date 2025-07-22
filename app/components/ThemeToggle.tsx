'use client';
import { useTheme } from "next-themes";
import { Button} from "@/components/ui/button";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <FaSun className = "absolute h-8 w-8 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"></FaSun>
            <FaMoon className = "absolute h-8 w-8 rotate-90 scale-0 dark:-rotate-0 dark:scale-100"></FaMoon>
        </Button>
    )
}