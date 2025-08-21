"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, ExternalLink, LogOut } from "lucide-react"
import { useState } from "react"

interface WalletDisplayProps {
    walletAddress: string
    onLogout: () => void
}

export function WalletDisplay({ walletAddress, onLogout }: WalletDisplayProps) {
    const [copied, setCopied] = useState(false)

    const copyAddress = async () => {
        await navigator.clipboard.writeText(walletAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
        <Card className="glass p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Connected Wallet</p>
                        <p className="text-xs text-muted-foreground">{truncateAddress(walletAddress)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={copyAddress} className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {copied && <p className="text-xs text-primary mt-2">Address copied to clipboard!</p>}
        </Card>
    )
}
