"use client"

import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';

const HalftoneGlobeDynamic = dynamic(
    () => import('@/components/ui/Globe'),
    { ssr: false }
);

const HeroSection = () => {
    return (
        <div className="bg-carbon-medium h-screen flex flex-col justify-end px-8 pb-8">
            <div className="flex flex-col items-center justify-end">

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
                            src={'/globe-outline.png'}
                            width={1000}
                            height={1000}
                            alt="Planet Earth"
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                </div>
                <div className="self-start text-left w-full">
                    <h1 className="text-[8vh] leading-snug text-justify ">
                        Every breath hinges on a stable climate. <br />
                        <span className='font-semibold border-b-4 border-foreground'>Carbon Fi</span> are tokenizing climate action to safeguard our shared future.
                        <span className='text-[4vh] px-4 py-1 bg-transparent hover:bg-foreground hover:text-[#B0CE88] text-foreground border-2 border-foreground cursor-pointer ml-8 align-middle rounded-sm'>Get Started ⟶</span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;