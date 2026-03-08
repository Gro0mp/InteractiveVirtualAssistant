import React from "react";

export function GridBackground() {
    return (
        <div className="absolute inset-0 z-0 bg-[#f2f2f2]">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="dotted-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path
                            d="M 30 0 L 0 0 0 30"
                            fill="none"
                            stroke="#999999"
                            strokeWidth="0.7"
                            strokeDasharray="2 2"
                        />
                    </pattern>
                    <radialGradient id="grid-fade" cx="50%" cy="45%" rx="65%" ry="60%">
                        <stop offset="0%" stopColor="white" stopOpacity="0"/>
                        <stop offset="70%" stopColor="white" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="white" stopOpacity="1"/>
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotted-grid)"/>
                <rect width="100%" height="100%" fill="url(#grid-fade)"/>
            </svg>
        </div>
    );
}