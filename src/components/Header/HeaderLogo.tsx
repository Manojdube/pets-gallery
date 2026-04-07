import { LogoSection, LogoIcon, LogoText } from "./Header.styles";

interface LogoProps {
  onLogoClick?: () => void;
}

export const Logo = ({ onLogoClick }: LogoProps) => (
  <LogoSection
    role="button"
    tabIndex={0}
    onClick={onLogoClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onLogoClick?.();
      }
    }}
    aria-label="myZoo Home"
  >
    <LogoIcon aria-hidden="true">🐾</LogoIcon>
    <LogoText>myZoo</LogoText>
  </LogoSection>
);
