"use client"

import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const HalftoneGlobeDynamic = dynamic(
    () => import('@/components/ui/Globe'),
    { ssr: false }
);

const HeroSection = () => {
    return (
        <div className="bg-carbon-darkest h-screen flex flex-col justify-end px-8 pb-8 relative overflow-hidden">
            {/* Dark background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-carbon-darker to-carbon-darkest opacity-50 pointer-events-none" />

            <div className="flex flex-col items-center justify-end relative z-10">

                <div className='flex items-center justify-center w-full h-auto'>
                    <div className='w-[23vw] h-[23vw]'>
                        <Image
                            src={'/globe-outline.svg'}
                            width={1000}
                            height={1000}
                            alt="Planet Earth"
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                    <div className="w-[26vw] h-[26vw] relative">
                        <HalftoneGlobeDynamic />
                    </div>
                    <div className='w-[23vw] h-[23vw]'>
                        <Image
                            src={'/globe-earth.png'}
                            width={1000}
                            height={1000}
                            alt="Planet Earth"
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                </div>
                <div className="self-start text-left w-full">
                    <h1 className="text-[8vh] leading-snug text-justify text-carbon-medium">
                        Every breath hinges on a stable climate. <br />
                        <span className='font-semibold border-b-4 border-carbon-light text-carbon-light'>PoRCE</span> are tokenizing climate action to safeguard our shared future.
                        <Link href={"/dashboard"} className='text-[4vh] px-4 py-2 bg-carbon-light hover:bg-white hover:text-carbon-darkest text-carbon-darkest border-4 border-carbon-light cursor-pointer ml-8 align-middle rounded-sm font-semibold transition-all'>Get Started ⟶</Link>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;