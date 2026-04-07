import styled from "styled-components";

// ─── Layout ────────────────────────────────────────────────────────────────────

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 12px;
  }

  @media (max-width: 640px) {
    padding: 12px;
    gap: 8px;
  }
`;

// ─── Logo ──────────────────────────────────────────────────────────────────────

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid #4a90e2;
    outline-offset: 4px;
    border-radius: 4px;
  }

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
  animation: logoFloat 3s ease-in-out infinite;

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

export const LogoText = styled.span`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

// ─── Search ────────────────────────────────────────────────────────────────────

export const SearchSection = styled.div<{ $isExpanded: boolean }>`
  flex: ${(p) => (p.$isExpanded ? 1 : "none")};
  max-width: ${(p) => (p.$isExpanded ? "500px" : "44px")};
  min-width: ${(p) => (p.$isExpanded ? "200px" : "auto")};
  position: relative;
  margin: 0 20px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    max-width: ${(p) => (p.$isExpanded ? "300px" : "44px")};
    margin: 0 12px;
  }

  @media (max-width: 640px) {
    flex: ${(p) => (p.$isExpanded ? 1 : "none")};
    max-width: ${(p) => (p.$isExpanded ? "none" : "44px")};
    min-width: auto;
    margin: 0 8px;
  }
`;

export const SearchIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  &:hover { color: #667eea; }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const SearchInput = styled.input<{ $isExpanded: boolean }>`
  width: ${(p) => (p.$isExpanded ? "100%" : "0")};
  padding: ${(p) => (p.$isExpanded ? "10px 40px 10px 44px" : "0")};
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  background-color: #f8f9fa;
  opacity: ${(p) => (p.$isExpanded ? 1 : 0)};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background-color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &::placeholder { color: #999; }

  @media (max-width: 640px) {
    padding: ${(p) => (p.$isExpanded ? "8px 36px 8px 44px" : "0")};
    font-size: 13px;
  }
`;

export const SearchClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    color: #667eea;
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

// ─── Actions ───────────────────────────────────────────────────────────────────

export const ActionsSection = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) { gap: 8px; }
  @media (max-width: 640px) { gap: 6px; }
`;

export const IconOnlyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

export const DownloadWrapper = styled.div`
  position: relative;
`;

export const CountBadge = styled.div<{ $show: boolean }>`
  position: absolute;
  top: -7px;
  right: -7px;
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid white;
  pointer-events: none;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transform: ${(p) => (p.$show ? "scale(1)" : "scale(0.5)")};
  transition: opacity 0.2s ease, transform 0.2s ease;
`;

// ─── Sort ──────────────────────────────────────────────────────────────────────

export const SortWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const SortTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px 0 12px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  .sort-chevron {
    font-size: 11px;
    transition: transform 0.2s ease;
  }

  &[aria-expanded="true"] .sort-chevron {
    transform: rotate(180deg);
  }

  /* Mobile: icon only */
  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
    justify-content: center;

    .sort-label,
    .sort-chevron {
      display: none;
    }
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    padding: 0;
    justify-content: center;

    .sort-label,
    .sort-chevron {
      display: none;
    }
  }
`;

export const SortDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #efefef;
  min-width: 168px;
  overflow: hidden;
  z-index: 200;
  animation: dropIn 0.15s ease;

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export const SortGroupLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #aaa;
  padding: 10px 14px 4px;
`;

export const SortDropdownDivider = styled.hr`
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 4px 0;
`;

export const SortDropdownItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => (p.$active ? "#667eea" : "#333")};
  background: ${(p) => (p.$active ? "rgba(102,126,234,0.1)" : "transparent")};
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.07);
  }

  .sort-check {
    margin-left: auto;
    font-size: 11px;
    color: #667eea;
    opacity: ${(p) => (p.$active ? 1 : 0)};
  }
`;
