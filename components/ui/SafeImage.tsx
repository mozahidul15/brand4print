'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
    onLoad?: () => void;
    onError?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    fill = false,
    width,
    height,
    className = '',
    priority = false,
    placeholder,
    blurDataURL,
    unoptimized = true, // Default to true for external images
    onLoad,
    onError,
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        console.error(`Failed to load image: ${src}`);
        setHasError(true);
        setIsLoading(false);
        onError?.();
    };

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
                <div className="flex flex-col items-center justify-center text-gray-400 p-2">
                    <ImageIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center">Image Error</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
                    <div className="animate-pulse flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <span className="text-xs">Loading...</span>
                    </div>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                className={className}
                priority={priority}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                unoptimized={unoptimized}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    display: isLoading ? 'none' : 'block',
                }}
            />
        </>
    );
};

export default SafeImage;
