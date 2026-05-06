import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
    { href: "/map", label: "Map" },
    { href: "/insights", label: "Insights" },
    { href: "/about", label: "About" },
];

export function Footer() {
    return (
        <footer className="bg-forest text-text-on-dark">
            <div className="mx-auto max-w-[1200px] px-6 py-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <Image
                            src="/images/hyle-logo-dark.png"
                            alt="Hyle logo"
                            width={500}
                            height={500}
                            className="h-7 w-auto"
                        />            <p className="mt-2 text-sm leading-relaxed text-white/60">
                            Environmental Intelligence Platform — monitoring and scoring
                            Indonesia&apos;s environmental health through data.
                        </p>
                    </div>

                    <div>
                        <ul className="flex flex-wrap items-center gap-6 md:gap-10">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-base md:text-lg font-medium text-white/80 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>
                <Separator className="my-8 bg-white/10" />

                <p className="text-xs text-white/40">
                    © {new Date().getFullYear()} Hyle. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
