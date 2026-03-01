interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ size = 24, className }: LogoProps) {
  return (
    <svg
      aria-label="OpenScroll logo"
      className={className}
      fill="none"
      height={size}
      role="img"
      viewBox="0 0 128 128"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 11.1304H11.1304V116.87H0V11.1304Z" fill="currentColor" />
      <path
        d="M47.3043 33.3913H58.4348V55.6522H47.3043V33.3913Z"
        fill="currentColor"
      />
      <path
        d="M36.1739 44.5217H47.3043V66.7826H36.1739V44.5217Z"
        fill="currentColor"
      />
      <path
        d="M69.5652 33.3913H80.6957V55.6522H69.5652V33.3913Z"
        fill="currentColor"
      />
      <path
        d="M80.6957 44.5217H91.8261V66.7826H80.6957V44.5217Z"
        fill="currentColor"
      />
      <path d="M11.1304 0H22.2609V22.2609H11.1304V0Z" fill="currentColor" />
      <path
        d="M11.1304 105.739H22.2609V128H11.1304V105.739Z"
        fill="currentColor"
      />
      <path
        d="M116.87 11.1304H128V116.87H116.87V11.1304Z"
        fill="currentColor"
      />
      <path d="M105.739 0H116.87V22.2609H105.739V0Z" fill="currentColor" />
      <path
        d="M105.739 105.739H116.87V128H105.739V105.739Z"
        fill="currentColor"
      />
      <path
        d="M58.4348 22.2609H69.5652V105.739H58.4348V22.2609Z"
        fill="currentColor"
      />
      <path d="M22.2609 0H105.739V11.1304H22.2609V0Z" fill="currentColor" />
      <path
        d="M22.2609 116.87H105.739V128H22.2609V116.87Z"
        fill="currentColor"
      />
    </svg>
  );
}
