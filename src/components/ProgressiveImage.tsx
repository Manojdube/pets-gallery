import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  src: string;
  alt: string;
  height?: number | string;
  objectFit?: "cover" | "contain";
}

const Wrapper = styled.div<{ height?: number | string }>`
  position: relative;
  width: 100%;
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height || "100%"};
  overflow: hidden;
  border-radius: 8px;
`;

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
  const [loaded, setLoaded] = useState(false);

  const addParams = (url: string, params: string) =>
    url + (url.includes("?") ? "&" : "?") + params;

  // responsive sources
  const small = addParams(src, "auto=compress&cs=tinysrgb&w=400&q=60");
  const medium = addParams(src, "auto=compress&cs=tinysrgb&w=800&q=70");
  const large = addParams(src, "auto=compress&cs=tinysrgb&w=1200&q=75");

  const blur = addParams(src, "auto=compress&cs=tinysrgb&w=50&q=25");

  return (
    <Wrapper height={height}>
      {/* Blur */}
      <Img
        src={blur}
        alt={alt}
        style={{
          objectFit,
          filter: "blur(14px)",
          transform: "scale(1.1)",
          opacity: loaded ? 0 : 1,
        }}
      />

      {/* Responsive main */}
      <Img
        src={medium}
        srcSet={`
          ${small} 400w,
          ${medium} 800w,
          ${large} 1200w
        `}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        loading="lazy"
        decoding="async"
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          objectFit,
          opacity: loaded ? 1 : 0,
        }}
      />
    </Wrapper>
  );
};

export default React.memo(ProgressiveImage);