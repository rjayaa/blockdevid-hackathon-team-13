'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useActiveAccount } from 'panna-sdk'
import { LoginButton } from 'panna-sdk'
import { useActiveWallet, useDisconnect } from 'thirdweb/react'
import Link from 'next/link'

const Navbar = () => {
    const account = useActiveAccount()
    const wallet = useActiveWallet()
    const { disconnect } = useDisconnect()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="flex justify-between items-center absolute top-5 px-8 w-full z-50">
            <div className="text-lg tracking-wider px-3 py-1 bg-foreground text-carbon-medium rounded-sm">
                CarbonFi
            </div>

            <nav className="flex space-x-6 text-sm uppercase items-center">
                <a href="#" className="hover:text-background hover:border-background border-b border-foreground pb-0.5 transition-colors">Dashboard</a>
                <a href="#" className="hover:text-background transition-colors">Contact</a>

                {!account ? (
                    <div className="panna-login-button-wrapper">
                        <style>{`
                            .panna-login-button-wrapper button {
                                background-color: #4C763B !important;
                                color: #B0CE88 !important;
                                border: 2px solid #4C763B !important;
                                padding: 8px 16px !important;
                                border-radius: 4px !important;
                                text-transform: uppercase !important;
                                font-size: 14px !important;
                                font-weight: 500 !important;
                                letter-spacing: 0.05em !important;
                                transition: all 0.3s ease !important;
                            }
                            .panna-login-button-wrapper button:hover {
                                background-color: #B0CE88 !important;
                                color: #4C763B !important;
                                border-color: #B0CE88 !important;
                            }
                        `}</style>
                        <LoginButton />
                    </div>
                ) : (
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="text-sm px-4 py-2 bg-carbon-medium text-carbon-primary rounded-sm border-2 border-carbon-medium uppercase tracking-wider font-medium cursor-pointer transition-opacity hover:opacity-80"
                        >
                            {account.address.slice(0, 6)}...{account.address.slice(-4)}
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-foreground border-2 border-carbon-medium rounded-sm shadow-lg z-50">
                                <button
                                    onClick={() => {
                                        if (wallet) {
                                            disconnect(wallet)
                                            setIsDropdownOpen(false)
                                        }
                                    }}
                                    className="w-full text-left px-6 py-3 text-sm text-carbon-medium hover:bg-carbon-medium hover:text-carbon-primary uppercase tracking-wider font-medium transition-colors whitespace-nowrap"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar
