import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const navigationItems = [
    {
      href: "/",
      value: t("home"),
    },
    {
      href: "/nosotros",
      value: t("about"),
    },
    {
      href: "/servicios",
      value: t("services"),
    },
  ];

  return (
    <div className="absolute w-full flex items-center justify-center py-5 bg-transparent">
      <nav className="w-10/12 flex flex-row justify-between bg-white/30 backdrop-blur-lg p-2 rounded-md">
        <div>
          <p>Embotec</p>
        </div>
        <div className="flex flex-row gap-2">
          {navigationItems.map((item, index) => (
            <Link key={index} href={item.href}>
              {item.value}
            </Link>
          ))}
        </div>
        <div>
          <button>{t("contact")}</button>
        </div>
      </nav>
    </div>
  );
}
