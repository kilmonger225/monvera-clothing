// components/CategoryNav.tsx
import Link from "next/link";

const categories = [
  { name: "All Drops", href: "/" },
  { name: "Tees", href: "/?category=tees" },
  { name: "Hoodies", href: "/?category=hoodies" },
  { name: "Sweatpants / Joggers", href: "/?category=sweatpants" },
  { name: "Mesh Shorts", href: "/?category=shorts" },
  { name: "Cargos / Pants", href: "/?category=cargos" },
  { name: "Outerwear / Jackets", href: "/?category=outerwear" },
  { name: "Headwear / Hats", href: "/?category=headwear" },
  { name: "Accessories", href: "/?category=accessories" },
  { name: "Gym Wears", href: "/?category=gym-wears" }, // <-- Your new category!
  { name: "The Archive", href: "/?category=archive" },
];

export default function CategoryNav() {
  return (
    <aside className="w-48 flex-shrink-0 hidden md:block pt-2">
      <h3 className="text-xs font-bold tracking-widest text-[#1A1A1A] mb-6 uppercase">
        Categories
      </h3>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href={category.href}
              className="text-sm text-gray-500 hover:text-black font-medium transition-colors duration-200 uppercase tracking-wider"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}