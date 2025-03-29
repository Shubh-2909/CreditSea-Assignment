// import {
//   Bell,
//   CircleUser,
//   Menu,
//   MessageCircleMore,
//   Package2,
//   Search,
// } from "lucide-react";
// import Link from "next/link";
// import { Button } from "../components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
// import { getServerSession } from "next-auth";
// import prisma from "../lib/prisma";

// export const Navbar = async () => {
//   const session = await getServerSession();
//   const userRole = await prisma.user.findUnique({
//     where: {
//       email: session?.user?.email ?? "",
//     },
//     select: {
//       role: true,
//     },
//   });

//   return (
//     <header className="sticky top-0 flex h-[7vh] items-center gap-4 border-b bg-background px-4 md:px-6 shadow-lg ">
//       <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ">
//         <Link
//           href="#"
//           className="flex items-center gap-2 text-lg font-semibold md:text-base"
//         >
//           <h2 className="text-green-700 text-nowrap font-bold">CREDIT APP</h2>
//         </Link>
//       </nav>
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="outline" size="icon" className="shrink-0 md:hidden">
//             <Menu className="h-5 w-5" />
//             <span className="sr-only">Toggle navigation menu</span>
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left">
//           <nav className="grid gap-6 text-lg font-medium">
//             <Link
//               href="#"
//               className="flex items-center gap-2 text-lg font-semibold"
//             >
//               <h2 className="text-green-700 text-nowrap font-bold">
//                 CREDIT APP
//               </h2>
//             </Link>
//             <Link
//               href="#"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Dashboard
//             </Link>
//             <Link
//               href="#"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Orders
//             </Link>
//             <Link
//               href="#"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Products
//             </Link>
//             <Link
//               href="#"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Customers
//             </Link>
//             <Link href="#" className="hover:text-foreground">
//               Settings
//             </Link>
//           </nav>
//         </SheetContent>
//       </Sheet>
//       <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
//         <div className="ml-auto flex-1 sm:flex-initial flex gap-2">
//           <div className="p-2">
//             <Bell className="h-5 w-5 fill-[#0A512F]" />
//           </div>
//           <div className="p-1">
//             <MessageCircleMore className="h-6 w-6 fill-[#0A512F] text-white mt-" />
//           </div>
//         </div>
//         <div className="flex items-center justify-center mb-1">
//           <CircleUser className="h-5 w-5" />
//           <span className="text-lg ml-2 font-bold text-green-700">{userRole?.role}</span>
//         </div>
//       </div>
//     </header>
//   );
// };

import { Bell, CircleUser, Menu, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
// import { getServerSession } from "next-auth";
// import prisma from "../lib/prisma";

export const Navbar = async () => {
  //   const session = await getServerSession();
  //   const userRole = await prisma.user.findUnique({
  //     where: {
  //       email: session?.user?.email ?? "",
  //     },
  //     select: {
  //       role: true,
  //     },
  //   });

  const navLinks = [
    { href: "#", label: "Dashboard", index: "1" },
    { href: "#", label: "Orders", index: "2" },
    { href: "#", label: "Products", index: "3" },
    { href: "#", label: "Customers", index: "4" },
    { href: "#", label: "Settings", index: "5" },
  ];

  return (
    <header className="sticky top-0 flex h-[7vh] items-center gap-4 border-b bg-background px-4 md:px-6 shadow-lg">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <h2 className="text-black-700 text-nowrap font-bold">CREDIT APP</h2>
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <h2 className="text-black-700 text-nowrap font-bold">
                CREDIT APP
              </h2>
            </Link>
            {navLinks.map(({ href, label }, index) => (
              <Link
                key={`nav-link-${index}`} // Ensure unique keys for every item
                href={href}
                className="text-muted-foreground hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial flex gap-2">
          <div className="p-2" key="bell-icon">
            <Bell className="h-5 w-5 fill-[#384B70]" />
          </div>
          <div className="p-1" key="message-icon">
            <MessageCircleMore className="h-6 w-6 fill-[#384B70] text-white" />
          </div>
        </div>
        <div className="flex items-center justify-center mb-1" key="user-role">
          <CircleUser className="h-5 w-5" />
          <span className="text-lg ml-2 font-bold text-gray-700">
            {/* {userRole?.role} */}
          </span>
        </div>
      </div>
    </header>
  );
};
