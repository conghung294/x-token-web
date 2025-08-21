"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Twitter, Wallet } from "lucide-react"

interface AuthButtonProps {
    onLogin: (walletAddress: string) => void
}

export function AuthButton({ onLogin }: AuthButtonProps) {
    const [isConnecting, setIsConnecting] = useState(false)

    const handleLogin = async () => {
        setIsConnecting(true)
        // Simulate Privy login process
        setTimeout(() => {
            // Mock wallet address for demo
            const mockWalletAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
            onLogin(mockWalletAddress)
            setIsConnecting(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 glass text-center">
                <div className="mb-6">
                    <h1 className="font-serif text-3xl font-bold text-primary mb-2">Welcome to TokenForge</h1>
                    <p className="text-muted-foreground">Create and trade tokens with bonding curves</p>
                </div>

                <Button onClick={handleLogin} disabled={isConnecting} className="w-full h-12 gap-3 text-lg" size="lg">
                    <Twitter className="h-5 w-5" />
                    {isConnecting ? "Connecting..." : "Sign in with X"}
                </Button>

                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>Powered by Privy</span>
                </div>
            </Card>
        </div>
    )
}
