import { useId, type SVGProps } from "react";

/** A single roasted coffee bean (SVG). `size` is the width in px; height follows the bean's shape. */
export default function Bean({ size, style, ...rest }: { size: number } & SVGProps<SVGSVGElement>) {
  const grad = useId();
  return (
    <svg viewBox="0 0 20 28" aria-hidden style={{ width: size, height: size * 1.4, ...style }} {...rest}>
      <defs><radialGradient id={grad} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#8A5A3B" /><stop offset="0.6" stopColor="#4A2C1C" /><stop offset="1" stopColor="#2A170E" /></radialGradient></defs>
      <ellipse cx="10" cy="14" rx="9.5" ry="13.5" fill={`url(#${grad})`} />
      <path d="M10 2.5C6.5 9 13.5 18 10 25.5" fill="none" stroke="#1C0F08" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="6.5" cy="9" rx="2" ry="3.5" fill="#fff" opacity="0.12" />
    </svg>
  );
}
