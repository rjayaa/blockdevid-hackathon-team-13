"use client"

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const HalftoneGlobeDynamic = dynamic(
    () => import('@/components/ui/Globe'),
    { ssr: false }
);

const GlobeWrapper = () => {
    const pathname = usePathname();
    const isLandingPage = pathname === '/'; 

    const globeContainerClasses = isLandingPage
        ? "top-[3vh] w-[26vw] h-[26vw] left-1/2 -translate-x-1/2 opacity-100"
        : "bottom-0 w-[200vw] h-[100vh] left-1/2 -translate-x-1/2 opacity-100";

    const globeInnerClasses = isLandingPage
        ? "absolute inset-0 w-full h-full"
        : "absolute bottom-[-70vh] left-1/2 -translate-x-1/2 w-[150vh] h-[150vh]";

    return (
        <div 
            className={`fixed overflow-hidden transition-all duration-1000 ease-in-out ${globeContainerClasses}`}
            style={{ zIndex: -1}} 
        >
            <div 
                className={`transition-all duration-1000 ease-in-out ${globeInnerClasses}`} 
            >
                <HalftoneGlobeDynamic /> 
            </div>
        </div>
    )
}

export default GlobeWrapper