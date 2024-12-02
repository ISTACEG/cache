import publications from "./publications";
import instances from "./instances";
import Logo from "./assets/ista_transparent_logo.webp";
import { useEffect, useState } from "preact/hooks";
import { Analytics } from "@vercel/analytics/react";
import "./index.css"

export function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab") || "instances";
  const [activeTab, setActiveTab] = useState(initialTab);

  const years = [
    ...new Set(
      (activeTab === "publications" ? publications : instances).map(
        (publication) => new Date(publication.date).getFullYear()
      )
    ),
  ]
    .sort()
    .reverse();

  // Update URL whenever the active tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [activeTab]);

  // Preload images for both tabs once on initial render
  useEffect(() => {
    const images = [...publications, ...instances].map((publication) => publication.cover);
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <Intro />
      <Header />
      <Analytics />
      <div class="dark:text-white container mx-auto p-6">
        <div class="flex justify-center font-Azonix space-x-6 mb-8">
          <button
            onClick={() => setActiveTab("publications")}
            class={`px-6 py-3 font-bold text-lg ${activeTab === "publications"
                ? "text-white shadow-lg bg-gray-800"
                : "text-gray-500"
              } rounded-xl transition-colors duration-300`}
          >
            Cache
          </button>
          <button
            onClick={() => setActiveTab("instances")}
            class={`px-6 py-3 font-bold text-lg ${activeTab === "instances"
                ? "text-white shadow-lg bg-gray-800"
                : "text-gray-500"
              } rounded-xl transition-colors duration-300`}
          >
            InsTaNces
          </button>
        </div>

        <div class="mt-8">
          {years.map((year) => (
            <div key={year} class="p-8 mb-6">
              <p class="m-2 text-3xl font-semibold dark:text-black font-Azonix">{year}</p>
              <div class="flex flex-row flex-wrap">
                {(activeTab === "publications" ? publications : instances)
                  .filter(
                    (publication) =>
                      new Date(publication.date).getFullYear() === year
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.date).getMonth() - new Date(a.date).getMonth()
                  )
                  .map((publication) => (
                    <div
                      key={publication.name}
                      style={{padding: 8}}
                      class="max-w-sm rounded-1xl text-black relative shadow-2xl m-4 bg-white bg-opacity-80 hover:bg-opacity-90 transition-all duration-300"
                    >
                      {/* @ts-ignore */}
                      {publication?.highlight && (
                        <p className="animate-bounce inline-flex absolute items-center justify-center text-sm font-extrabold text-white bg-gradient-to-r from-pink-500 via-yellow-500 to-orange-500 rounded-full z-10 top-0 px-4 py-2 shadow-lg transform transition-all hover:scale-105 hover:rotate-3">
                          {/* @ts-ignore */}
                          {publication.highlight}
                        </p>
                      )}
                      {/* @ts-ignore */}
                      <div class="_df_thumb df-book-cover w-full h-56 rounded-t-1xl bg-cover bg-center" style={{ backgroundImage: `url(${publication.cover})` }} thumb={publication.cover} source={publication.file}></div>
                      <div class="p-4 desc-text">
                        <p class="desc-text font-bold text-2xl text-center tracking-tight">
                          {publication.name}
                        </p>
                        <p class="desc-text text-sm text-center text-gray-600 desc-text">
                          Published on {new Date(publication.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <nav class="p-2 bg-white border-gray-300 dark:bg-gray-900 border-b-2">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Responsive font sizes */}
          <span class="self-center text-xl md:text-2xl font-Azonix font-semibold whitespace-nowrap dark:text-white">
            Cache
          </span>
          <span class="m-1 md:m-2 dark:text-white">x</span>
          <span class="self-center font-bold font-noto text-2xl md:text-3xl whitespace-nowrap dark:text-white instance-brand">
            InsTaƞce
          </span>
        </a>
        <a
          class="flex md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse"
          href="http://istaceg.in/"
          target="_blank"
        >
          <div class="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 hover:cursor-pointer font-medium rounded-lg text-sm px-3 py-1 md:px-4 md:py-2 text-center bg-gray-500 dark:bg-gray-700">
            <img src={Logo} class="h-8 md:h-10" alt="Cache Logo" />
          </div>
        </a>
      </div>
    </nav>
  );
}


function Footer() {
  return (
    <footer class="bg-white shadow dark:bg-gray-800">
      <div class="w-full mx-auto max-w-screen-xl p-4 flex justify-center">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024
          <a href="https://istaceg.in/" class="hover:underline pl-2" target="_blank">
            Cache (ISTA, CEG)
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

const setCookie = (name: string, value: string, minutes: number): void => {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

function Intro() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (getCookie("notFirstTime") !== "1") {
      setTimeout(() => {
        setVisible(false);
        setCookie("notFirstTime", "1", 3); // Set cookie for 3 minutes on first view
      }, 4500);
    } else {
      setVisible(false);
    }
  }, []);
  return (
    <>
      {visible && (
        <div class="absolute bg-white opacity-100 font-Azonix z-20 max-w-full w-screen h-screen flex flex-row justify-center items-center p-0 m-0 top-0 left-0 bottom-0 right-0">
          <div class="inline-block">
            {"Cache".split("").map((char, index) => {
              const style = { animationDelay: `${0.5 + index * 0.4}s` };
              return (
                <span
                  aria-hidden="true"
                  class="moving text-2xl md:text-4xl lg:text-5xl inline-block font-Azonix"
                  key={index}
                  style={style}
                >
                  {char}
                </span>
              );
            })}
            <span class="m-5 text-3xl">x</span>
            {"InsTaƞce".split("").map((char, index) => {
              const style = { animationDelay: `${0.5 + index * 0.4}s`, fontWeight: "bolder" };
              return (
                <span
                  aria-hidden="true"
                  class="moving text-2xl md:text-4xl lg:text-5xl inline-block font-noto instance-brand"
                  key={index}
                  style={style}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
