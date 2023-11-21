"use client";
import { Fragment, useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
// import { setThemeCookie } from "./themeAction";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function ThemeToggle({ theme }: { theme: string }) {
  const router = useRouter();
  const [themeSetting, setThemeSetting] = useState(
    Cookies.get("theme") ? "system" : theme || "system",
  );

  useEffect(() => {
    const isSystem = Cookies.get("isSystem");
    const currentTheme = Cookies.get("theme");
    if (isSystem || !currentTheme) {
      let themeToSet: string;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.remove("light");
        // if (!document.documentElement.classList.contains("dark"))
        document.documentElement.classList.add("dark");
        themeToSet = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        // if (!document.documentElement.classList.contains("light"))
        document.documentElement.classList.add("light");
        themeToSet = "light";
      }
      if (!isSystem) Cookies.set("isSystem", "true");
      Cookies.set("theme", themeToSet);
      if (currentTheme !== themeToSet) router.refresh();
    }
  }, []);

  function changeThemeSetting(selectedTheme: string) {
    if (themeSetting === selectedTheme) return;
    // console.log("changeThemeSetting happened");
    let themeToSet = "";
    const currentTheme = Cookies.get("theme");

    switch (selectedTheme) {
      case "light":
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        // setThemeCookie("light");
        setThemeSetting("light");
        themeToSet = "light";
        Cookies.set("isSystem", "", { expires: new Date(0) });
        break;

      case "dark":
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        // setThemeCookie("dark");
        setThemeSetting("dark");
        themeToSet = "dark";
        Cookies.set("isSystem", "", { expires: new Date(0) });
        break;

      case "system":
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.remove("light");
          if (!document.documentElement.classList.contains("dark"))
            document.documentElement.classList.add("dark");
          themeToSet = "dark";
        } else {
          document.documentElement.classList.remove("dark");
          if (!document.documentElement.classList.contains("light"))
            document.documentElement.classList.add("light");
          themeToSet = "light";
        }
        setThemeSetting("system");
        Cookies.set("isSystem", "true");
        // deleteThemeCookie();
        // setThemeCookie("system");
        break;
    }
    if (themeToSet === "")
      console.error("this shouldn't be happening themeToSet was Empty!");
    Cookies.set("theme", themeToSet);
    // console.log("set theme to ", themeToSet);
    if (currentTheme !== themeToSet) router.refresh();
  }

  {
  }
  return (
    <div className="relative">
      <Listbox value={themeSetting} onChange={changeThemeSetting}>
        <Listbox.Label className="sr-only">Theme</Listbox.Label>
        <Listbox.Button type="button" className="flex items-center">
          <span className="dark:hidden">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 fill-black"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            </div>
          </span>
          <span className="hidden dark:inline">
            <div className="relative ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 fill-white"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute right-0 top-0 h-4 fill-white sm:h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </span>
        </Listbox.Button>
        <Listbox.Options className="dark:highlight-white/5 absolute -right-[175%] top-[120%] z-50 w-36 overflow-hidden rounded-lg bg-white py-1 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-0">
          <Listbox.Option key="light" value="light" as={Fragment}>
            {({ active, selected }) => (
              <li
                className={`flex cursor-pointer items-center px-2 py-1 ${
                  selected && "text-yellow-500"
                } ${active && "bg-slate-50 dark:bg-slate-600/30"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="me-3 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
                Light
              </li>
            )}
          </Listbox.Option>
          <Listbox.Option key="dark" value="dark" as={Fragment}>
            {({ active, selected }) => (
              <li
                className={`flex cursor-pointer items-center px-2 py-1 ${
                  selected && "text-sky-500"
                } ${active && "bg-slate-50 dark:bg-slate-600/30"}`}
              >
                <div className="relative drop-shadow-[0px_0px_25px_#3b82f6]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="me-3 h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute right-0 top-0 me-3 h-3 w-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                Dark
              </li>
            )}
          </Listbox.Option>
          <Listbox.Option key="system" value="system" as={Fragment}>
            {({ active, selected }) => (
              <li
                className={`flex cursor-pointer items-center px-2 py-1 ${
                  selected && "text-sky-500"
                } ${active && "bg-slate-50 dark:bg-slate-600/30"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="me-3 h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                System
              </li>
            )}
          </Listbox.Option>
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

export default ThemeToggle;
