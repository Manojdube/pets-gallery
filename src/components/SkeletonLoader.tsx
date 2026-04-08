import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const shimmerGradient = 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)';

// Styles
const SkeletonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;

  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Desktop: 4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`;

const SkeletonCard = styled.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${shimmer} 2s infinite;
  background: ${shimmerGradient};
  background-size: 1000px 100%;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 6px;
  animation: ${shimmer} 2s infinite;
  background: ${shimmerGradient};
  background-size: 1000px 100%;
`;

const SkeletonText = styled.div<{ width?: string; height?: string }>`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '14px'};
  border-radius: 4px;
  animation: ${shimmer} 2s infinite;
  background: ${shimmerGradient};
  background-size: 1000px 100%;
`;

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 12 }) => (
  <SkeletonWrapper>
    {Array.from({ length: count }).map((_, idx) => (
      <SkeletonCard key={idx}>
        <SkeletonImage />
        <SkeletonText width="80%" height="16px" />
        <SkeletonText width="100%" height="12px" />
        <SkeletonText width="100%" height="12px" />
        <SkeletonText width="60%" height="12px" />
      </SkeletonCard>
    ))}
  </SkeletonWrapper>
);
