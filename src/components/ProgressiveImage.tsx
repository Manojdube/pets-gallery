import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  src: string;
  alt: string;
  height?: number;
}

const Wrapper = styled.div<{ height: number }>`
  position: relative;
  width: 100%;
  height: ${({ height }) => height}px;
  overflow: hidden;
  border-radius: 6px;
`;

const Img = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease, filter 0.3s ease;
`;

const ProgressiveImage: React.FC<Props> = ({ src, alt, height = 200 }) => {
  const [loaded, setLoaded] = useState(false);

  const addParams = (url: string, params: string) =>
    url + (url.includes("?") ? "&" : "?") + params;

  const low = addParams(src, "auto=compress&cs=tinysrgb&w=50&q=30");
  const high = addParams(src, "auto=compress&cs=tinysrgb&w=500&q=75");

  return (
    <Wrapper height={height}>
      {/* Blurred preview */}
      <Img
        src={low}
        alt={alt}
        style={{
          filter: "blur(12px)",
          transform: "scale(1.1)",
          opacity: loaded ? 0 : 1,
        }}
      />

      {/* Clear image */}
      <Img
        src={high}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
        }}
      />
    </Wrapper>
  );
};

export default React.memo(ProgressiveImage);