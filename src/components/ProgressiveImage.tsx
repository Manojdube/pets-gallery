import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface Props {
  src: string;
  alt: string;
  height?: number | string;
  objectFit?: "cover" | "contain";
}

// Wrapper controls layout and clipping
const Wrapper = styled.div<{ height?: number | string }>`
  position: relative;
  width: 100%;
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height || "100%"};
  overflow: hidden;
  border-radius: 8px;
`;

// Shared image styles (both blur + main image)
const Img = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.4s ease, filter 0.4s ease;
`;

const ProgressiveImage: React.FC<Props> = ({
  src,
  alt,
  height,
  objectFit = "cover",
}) => {
  // Tracks when high-quality image is loaded
  const [loaded, setLoaded] = useState(false);

  // Tracks if component is inside viewport
  const [inView, setInView] = useState(false);

  // Reference to DOM element for observing visibility
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Helper to append query params to image URL (for CDN optimization)
  const addParams = (url: string, params: string) =>
    url + (url.includes("?") ? "&" : "?") + params;

  // Responsive image sources (different sizes)
  const small = addParams(src, "auto=compress&cs=tinysrgb&w=400&q=60");
  const medium = addParams(src, "auto=compress&cs=tinysrgb&w=800&q=70");
  const large = addParams(src, "auto=compress&cs=tinysrgb&w=1200&q=75");

  // Low-quality blurred placeholder
  const blur = addParams(src, "auto=compress&cs=tinysrgb&w=50&q=25");

  /**
   * Intersection Observer:
   * Detects when image enters viewport
   * Only then we start loading images (performance optimization)
   */
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true); // trigger image load
          observer.disconnect(); // stop observing after first trigger
        }
      },
      {
        rootMargin: "100px", // preload slightly before entering viewport
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  /**
   * Reset state when image source changes
   */
  useEffect(() => {
    setLoaded(false);
    setInView(false);
  }, [src]);

  return (
    <Wrapper ref={wrapperRef} height={height}>
      {/* 
        Blur placeholder:
        - Shown initially
        - Fades out when main image loads
      */}
      {inView && (
        <Img
          src={blur}
          alt={alt}
          style={{
            objectFit,
            filter: "blur(14px)",
            transform: "scale(1.1)", // avoid edge clipping
            opacity: loaded ? 0 : 1,
          }}
        />
      )}

      {/*
        Main image:
        - Loads only when in viewport
        - Fades in after loading
        - Uses srcSet for responsive loading
      */}
      {inView && (
        <Img
          src={medium}
          srcSet={`
            ${small} 400w,
            ${medium} 800w,
            ${large} 1200w
          `}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          decoding="async"
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)} // fallback: avoid stuck blur
          style={{
            objectFit,
            opacity: loaded ? 1 : 0,
          }}
        />
      )}
    </Wrapper>
  );
};

// Memoization prevents unnecessary re-renders in lists
export default React.memo(ProgressiveImage);