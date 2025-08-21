"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Plus, Wallet, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
    currentPage: string
    onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const navigation = [
        { name: "Home", icon: Home, id: "home" },
        { name: "Create Token", icon: Plus, id: "create" },
        { name: "My Tokens", icon: Wallet, id: "tokens" },
    ]

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden glass"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-full flex-col glass-strong rounded-r-2xl">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
                        <h1 className="font-serif text-2xl font-bold text-sidebar-primary">TokenForge</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Button
                                    key={item.id}
                                    variant={currentPage === item.id ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 h-12 text-left",
                                        currentPage === item.id
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    )}
                                    onClick={() => {
                                        onPageChange(item.id)
                                        setIsOpen(false)
                                    }}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Button>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
            )}
        </>
    )
}
