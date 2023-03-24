import { useRouter } from "next/router";
import Link from "next/link";

import "@/styles/globals.css";

import Navbar from "@/components/Navbar";

import menuData from "@/menudata";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <div className="flex mt-5 w-100vw">
        <div className="min-w-[20rem] w-[15%]">
          <div className="bg-slate-100 mx-5 rounded-lg px-3 py-3">
            <h1 className="font-light text-lg mb-5">
              {menuData[router.pathname.split("/")[1]].title}
            </h1>
            {menuData[router.pathname.split("/")[1]].items.map((item) => (
              <Link href={item.href}>
                <div
                  className={`rounded-lg px-3 py-5 mt-2 cursor-pointer ${
                    router.pathname != item.href && "hover:bg-slate-50"
                  } ${
                    router.pathname == item.href ? "bg-slate-200" : "bg-white"
                  }`}
                >
                  <h1>{item.title}</h1>
                  <p className="text-xs mt-1">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Component {...pageProps} />
      </div>
    </>
  );
}
