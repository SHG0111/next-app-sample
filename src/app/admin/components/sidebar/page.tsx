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
    <aside className="w-56 bg-black fixed top-20 -mt-1 left-0 bottom-0 z-50 ">
      <nav className="space-y-4">
        {navLinks.map((link) => (
          <a
            href={`${link.href}`}
            key={`${link.name}-${link.href}`}
            className=" px-4 py-4 text-md flex items-center  text-white  hover:bg-blue-800 "
          >
            <span className="mr-2">{link.icon}</span> <span>{link.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
