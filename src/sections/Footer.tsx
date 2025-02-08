import { Logo} from "@/assets";
import Link from "next/link";

const navItems = [
  { href: "/services", title: "Services" },
  { href: "/innovations", title: "Innovation" },
  { href: "https://calendly.com/mainakchaudhuri671/tech-talk", title: "Talk" },
  { href: "/contract", title: "Contract" },
  
];

export const Footer = () => {
  return (
    <footer className="py-5 border-t border-white/15">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex gap-2 items-center lg:flex-1">
            <Logo className="size-6" />
            <Link href="https://mainakchaudhuri.netlify.app/" target="_blank"><span className="font-medium">Make @ Supernova</span></Link>
          </div>
          <nav className="flex flex-col lg:flex-row gap-5 lg:gap-7 lg:flex-1 lg:justify-center">
            {navItems.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-white/70 hover:text-white text-xs md:text-sm transition"
              >
                {link.title}
              </Link>
            ))}
          </nav>          
          
        </div>
      </div>
    </footer>
  );
};
