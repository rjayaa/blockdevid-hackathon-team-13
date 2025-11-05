import React from 'react'

const Navbar = () => {
    return (
        <header className="flex justify-between items-center absolute top-5 px-8 w-full">
            <div className="text-lg tracking-wider px-3 py-1 bg-foreground text-[#B0CE88] rounded-sm">
                CarbonFi
            </div>

            <nav className="flex space-x-6 text-sm uppercase">
                <a href="#" className="hover:text-background hover:border-background border-b border-foreground pb-0.5">Dashboard</a>
                <a href="#" className="hover:text-background">Contact</a>
            </nav>
        </header>
    )
}

export default Navbar
