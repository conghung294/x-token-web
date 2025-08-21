"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ImageIcon, Loader2 } from "lucide-react"

interface TokenData {
    name: string
    symbol: string
    supply: string
    description: string
    logo?: File
}

interface TokenCreationFormProps {
    onTokenCreated: (tokenData: TokenData) => void
}

export function TokenCreationForm({ onTokenCreated }: TokenCreationFormProps) {
    const [formData, setFormData] = useState<TokenData>({
        name: "",
        symbol: "",
        supply: "",
        description: "",
    })
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [errors, setErrors] = useState<Partial<TokenData>>({})

    const handleInputChange = (field: keyof TokenData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setFormData((prev) => ({ ...prev, logo: file }))
            const reader = new FileReader()
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<TokenData> = {}

        if (!formData.name.trim()) newErrors.name = "Token name is required"
        if (!formData.symbol.trim()) newErrors.symbol = "Symbol is required"
        if (formData.symbol.length > 10) newErrors.symbol = "Symbol must be 10 characters or less"
        if (!formData.supply.trim()) newErrors.supply = "Supply is required"
        if (isNaN(Number(formData.supply)) || Number(formData.supply) <= 0) {
            newErrors.supply = "Supply must be a positive number"
        }
        if (!formData.description.trim()) newErrors.description = "Description is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsCreating(true)

        // Simulate token creation process
        setTimeout(() => {
            onTokenCreated(formData)
            setIsCreating(false)
            // Reset form
            setFormData({ name: "", symbol: "", supply: "", description: "" })
            setLogoPreview(null)
        }, 3000)
    }

    return (
        <Card className="glass p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="font-serif text-3xl font-bold text-primary mb-2">Create New Token</h2>
                <p className="text-muted-foreground">Launch your custom token with bonding curve mechanics</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Token Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Token Name *
                    </Label>
                    <Input
                        id="name"
                        placeholder="e.g., My Awesome Token"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`glass ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Symbol */}
                <div className="space-y-2">
                    <Label htmlFor="symbol" className="text-sm font-medium">
                        Symbol *
                    </Label>
                    <Input
                        id="symbol"
                        placeholder="e.g., MAT"
                        value={formData.symbol}
                        onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
                        className={`glass ${errors.symbol ? "border-destructive" : ""}`}
                        maxLength={10}
                    />
                    {errors.symbol && <p className="text-sm text-destructive">{errors.symbol}</p>}
                </div>

                {/* Supply */}
                <div className="space-y-2">
                    <Label htmlFor="supply" className="text-sm font-medium">
                        Total Supply *
                    </Label>
                    <Input
                        id="supply"
                        type="number"
                        placeholder="e.g., 1000000"
                        value={formData.supply}
                        onChange={(e) => handleInputChange("supply", e.target.value)}
                        className={`glass ${errors.supply ? "border-destructive" : ""}`}
                    />
                    {errors.supply && <p className="text-sm text-destructive">{errors.supply}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                        Description *
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your token's purpose and utility..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className={`glass min-h-[100px] ${errors.description ? "border-destructive" : ""}`}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Logo (Optional)</Label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="logo"
                                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors glass"
                            >
                                {logoPreview ? (
                                    <img
                                        src={logoPreview || "/placeholder.svg"}
                                        alt="Token logo preview"
                                        className="h-24 w-24 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Click to upload logo</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                                    </div>
                                )}
                            </label>
                            <input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isCreating} className="w-full h-12 text-lg font-semibold" size="lg">
                    {isCreating ? (
                        <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Creating Token...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="h-5 w-5 mr-2" />
                            Create Token
                        </>
                    )}
                </Button>
            </form>

            {isCreating && (
                <div className="mt-6 p-4 glass rounded-lg">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <div>
                            <p className="font-medium">Creating your token...</p>
                            <p className="text-sm text-muted-foreground">This may take a few moments</p>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}
