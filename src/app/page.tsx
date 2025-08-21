"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { AuthButton } from "@/components/auth-button"
import { WalletDisplay } from "@/components/wallet-display"
import { TokenCreationForm } from "@/components/token-creation-form"
import { BondingCurveTrading } from "@/components/bonding-curve-trading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

interface TokenData {
  name: string
  symbol: string
  supply: string
  description: string
  logo?: File
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [currentPage, setCurrentPage] = useState("home")
  const [createdTokens, setCreatedTokens] = useState<TokenData[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)

  const handleLogin = (address: string) => {
    setWalletAddress(address)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setWalletAddress("")
    setCurrentPage("home")
  }

  const handleTokenCreated = (tokenData: TokenData) => {
    setCreatedTokens((prev) => [...prev, tokenData])
    // Show success message and redirect to tokens page
    setTimeout(() => {
      setCurrentPage("tokens")
    }, 1000)
  }

  const handleTradeToken = (token: TokenData) => {
    setSelectedToken(token)
  }

  if (!isAuthenticated) {
    return <AuthButton onLogin={handleLogin} />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="flex-1 md:ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <WalletDisplay walletAddress={walletAddress} onLogout={handleLogout} />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentPage === "home" && (
            <Card className="glass p-8">
              <div className="text-center">
                <h2 className="font-serif text-4xl font-bold text-primary mb-4">Welcome to TokenForge</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Create custom tokens and trade them with bonding curves
                </p>
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Card
                    className="glass p-6 hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setCurrentPage("create")}
                  >
                    <h3 className="font-serif text-xl font-semibold mb-2">Create Token</h3>
                    <p className="text-sm text-muted-foreground">Launch your own token with custom parameters</p>
                  </Card>
                  <Card
                    className="glass p-6 hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setCurrentPage("tokens")}
                  >
                    <h3 className="font-serif text-xl font-semibold mb-2">My Tokens</h3>
                    <p className="text-sm text-muted-foreground">View and manage your created tokens</p>
                  </Card>
                </div>
              </div>
            </Card>
          )}

          {currentPage === "create" && <TokenCreationForm onTokenCreated={handleTokenCreated} />}

          {currentPage === "tokens" && (
            <Card className="glass p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">My Tokens</h2>
              {createdTokens.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any tokens yet</p>
                  <Card
                    className="glass p-4 hover:scale-105 transition-transform cursor-pointer inline-block"
                    onClick={() => setCurrentPage("create")}
                  >
                    <p className="text-primary font-medium">Create your first token</p>
                  </Card>
                </div>
              ) : (
                <div className="grid gap-4">
                  {createdTokens.map((token, index) => (
                    <Card key={index} className="glass p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-semibold">{token.name}</h3>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            Supply: {Number(token.supply).toLocaleString()}
                          </p>
                          <p className="mt-2 text-sm">{token.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-right mb-2">
                            <p className="text-sm text-primary font-medium">Active</p>
                            <p className="text-xs text-muted-foreground">0.001234 SOL</p>
                          </div>
                          <Button onClick={() => handleTradeToken(token)} className="gap-2" size="sm">
                            <TrendingUp className="h-4 w-4" />
                            Trade
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </main>

      {selectedToken && <BondingCurveTrading token={selectedToken} onClose={() => setSelectedToken(null)} />}
    </div>
  )
}
