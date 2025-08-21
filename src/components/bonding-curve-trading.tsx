"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, TrendingUp, TrendingDown, Loader2 } from "lucide-react"

interface TokenData {
    name: string
    symbol: string
    supply: string
    description: string
    logo?: File
}

interface BondingCurveTradingProps {
    token: TokenData
    onClose: () => void
}

export function BondingCurveTrading({ token, onClose }: BondingCurveTradingProps) {
    const [buyAmount, setBuyAmount] = useState("")
    const [sellAmount, setSellAmount] = useState("")
    const [isTrading, setIsTrading] = useState(false)
    const [activeTab, setActiveTab] = useState("buy")

    // Mock bonding curve calculations
    const calculateTokensFromSOL = (solAmount: number): number => {
        // Simple bonding curve: price increases with supply
        const basePrice = 0.001 // Starting price in SOL
        const priceMultiplier = 1.0001 // Price increase factor
        const currentSupply = 100000 // Mock current circulating supply

        let tokens = 0
        let remainingSol = solAmount
        let currentPrice = basePrice * Math.pow(priceMultiplier, currentSupply)

        while (remainingSol > 0 && tokens < 10000) {
            const tokenPrice = currentPrice
            if (remainingSol >= tokenPrice) {
                remainingSol -= tokenPrice
                tokens += 1
                currentPrice *= priceMultiplier
            } else {
                break
            }
        }

        return Math.floor(tokens * 100) / 100
    }

    const calculateSOLFromTokens = (tokenAmount: number): number => {
        // Reverse calculation for selling
        const basePrice = 0.001
        const priceMultiplier = 1.0001
        const currentSupply = 100000

        let solReceived = 0
        let remainingTokens = tokenAmount
        let currentPrice = basePrice * Math.pow(priceMultiplier, currentSupply - tokenAmount)

        while (remainingTokens > 0) {
            solReceived += currentPrice
            remainingTokens -= 1
            currentPrice *= priceMultiplier
        }

        return Math.floor(solReceived * 1000000) / 1000000 // 6 decimal places
    }

    const estimatedTokens = buyAmount ? calculateTokensFromSOL(Number.parseFloat(buyAmount) || 0) : 0
    const estimatedSOL = sellAmount ? calculateSOLFromTokens(Number.parseFloat(sellAmount) || 0) : 0

    const handleTrade = async (type: "buy" | "sell") => {
        setIsTrading(true)

        // Simulate transaction
        setTimeout(() => {
            setIsTrading(false)
            if (type === "buy") {
                setBuyAmount("")
            } else {
                setSellAmount("")
            }
            // Show success message (in real app, would update balances)
        }, 3000)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-primary">Trade {token.name}</h2>
                            <p className="text-sm text-muted-foreground">{token.symbol} • Bonding Curve</p>
                        </div>
                        <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            ✕
                        </Button>
                    </div>

                    {/* Price Chart Placeholder */}
                    <Card className="glass p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Price Chart</h3>
                            <div className="flex items-center gap-2 text-sm text-primary">
                                <TrendingUp className="h-4 w-4" />
                                <span>+12.5%</span>
                            </div>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">Bonding Curve Visualization</p>
                        </div>
                    </Card>

                    {/* Trading Interface */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 glass">
                            <TabsTrigger
                                value="buy"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Buy {token.symbol}
                            </TabsTrigger>
                            <TabsTrigger
                                value="sell"
                                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                            >
                                Sell {token.symbol}
                            </TabsTrigger>
                        </TabsList>

                        {/* Buy Tab */}
                        <TabsContent value="buy" className="space-y-4">
                            <Card className="glass p-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="buy-amount" className="text-sm font-medium">
                                            SOL Amount
                                        </Label>
                                        <Input
                                            id="buy-amount"
                                            type="number"
                                            placeholder="0.0"
                                            value={buyAmount}
                                            onChange={(e) => setBuyAmount(e.target.value)}
                                            className="glass text-lg h-12"
                                            step="0.001"
                                            min="0"
                                        />
                                    </div>

                                    <div className="flex items-center justify-center py-2">
                                        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Estimated {token.symbol}</Label>
                                        <div className="glass p-3 rounded-lg">
                                            <p className="text-lg font-semibold">
                                                {estimatedTokens.toLocaleString()} {token.symbol}
                                            </p>
                                            {buyAmount && (
                                                <p className="text-sm text-muted-foreground">
                                                    ≈ {(estimatedTokens / (Number.parseFloat(buyAmount) || 1)).toFixed(6)} {token.symbol}/SOL
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleTrade("buy")}
                                        disabled={!buyAmount || Number.parseFloat(buyAmount) <= 0 || isTrading}
                                        className="w-full h-12 text-lg font-semibold"
                                        size="lg"
                                    >
                                        {isTrading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp className="h-5 w-5 mr-2" />
                                                Confirm Buy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Sell Tab */}
                        <TabsContent value="sell" className="space-y-4">
                            <Card className="glass p-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sell-amount" className="text-sm font-medium">
                                            {token.symbol} Amount
                                        </Label>
                                        <Input
                                            id="sell-amount"
                                            type="number"
                                            placeholder="0.0"
                                            value={sellAmount}
                                            onChange={(e) => setSellAmount(e.target.value)}
                                            className="glass text-lg h-12"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>

                                    <div className="flex items-center justify-center py-2">
                                        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Estimated SOL</Label>
                                        <div className="glass p-3 rounded-lg">
                                            <p className="text-lg font-semibold">{estimatedSOL.toFixed(6)} SOL</p>
                                            {sellAmount && (
                                                <p className="text-sm text-muted-foreground">
                                                    ≈ {(estimatedSOL / (Number.parseFloat(sellAmount) || 1)).toFixed(8)} SOL/{token.symbol}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleTrade("sell")}
                                        disabled={!sellAmount || Number.parseFloat(sellAmount) <= 0 || isTrading}
                                        className="w-full h-12 text-lg font-semibold bg-secondary hover:bg-secondary/90"
                                        size="lg"
                                    >
                                        {isTrading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="h-5 w-5 mr-2" />
                                                Confirm Sell
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Trading Info */}
                    <Card className="glass p-4 mt-6">
                        <h4 className="font-medium mb-3">Trading Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Current Price</p>
                                <p className="font-medium">0.001234 SOL</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">24h Volume</p>
                                <p className="font-medium">1,234 SOL</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Market Cap</p>
                                <p className="font-medium">12,345 SOL</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Holders</p>
                                <p className="font-medium">456</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    )
}
