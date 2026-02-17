import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = "", size = 40 }: LogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-md ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/syntask_logo.jpg"
        alt="SynTask Logo"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}