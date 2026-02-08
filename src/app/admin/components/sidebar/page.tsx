import { MdOutlineDashboard } from "react-icons/md";
import { TbBrandProducthunt } from "react-icons/tb";

const Sidebar = () => {
  interface navLinks {
    name: string;
    href: string;
    icon: string;
    active: boolean;
  }
  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <MdOutlineDashboard />,
      active: true,
    },
    {
      name: "Products",
      href: "/admin/products-table",
      icon: <TbBrandProducthunt />,
      active: false,
    },
  ];
  return (
    <aside className="w-64 bg-gray-100 border-r p-6">
      <nav className="space-y-2">
        {navLinks.map((link) => (
          <a
            href={`${link.href}`}
            key={`${link.name}-${link.href}`}
            className=" px-4 py-2 text-sm flex items-center font-medium text-gray-700 hover:bg-gray-200 rounded"
          >
            <span className="mr-2">{link.icon}</span> <span>{link.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
