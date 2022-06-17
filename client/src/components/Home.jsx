import React from "react";

import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

import Account from "./Account";

const Home = () => {
  const { auth } = useAuth();

  return (
    <div className="h-screen bg-slate-100">
      <nav className="inset-0 bg-white flex justify-between p-8 items-center border-b-2">
        <div className="text-3xl">
          <span className="font-bold">CertME</span>&trade;
        </div>
        <div className=" flex gap-4">
          {auth ? (
            <div className="flex gap-4">
              <div>
                <Link to="/dashboard">
                  <span className="font-semibold px-4 py-2 border-2 rounded-md border-slate-300">
                    DashBoard
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <Account />
            </div>
          )}
        </div>
      </nav>
      <TextAnimation />
      <footer className="absolute w-full bottom-0 bg-slate-300 py-2 border-t-2">
        <div className="text-slate-800 font-normal flex items-center gap-1 justify-center">
          <span>Made with</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-rose-700"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            by{" "}
            <a
              className="font-semibold underline decoration-slate-400"
              href="https://github.com/anasvemmully"
            >
              C383R_CH3F
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

const TextAnimation = () => {
  React.useEffect(() => {
    const elts = {
      text1: document.getElementById("text1"),
      text2: document.getElementById("text2"),
    };

    const texts = ["If", "You", "Like", "It", "Please", "Give", "a Love :)"];

    const morphTime = 1;
    const cooldownTime = 0.25;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function setMorph(fraction) {
      elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      elts.text1.textContent = texts[textIndex % texts.length];
      elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doCooldown() {
      morph = 0;

      elts.text2.style.filter = "";
      elts.text2.style.opacity = "100%";

      elts.text1.style.filter = "";
      elts.text1.style.opacity = "0%";
    }
    let id;
    function animate() {
      id = requestAnimationFrame(animate);

      let newTime = new Date();
      let shouldIncrementIndex = cooldown > 0;
      let dt = (newTime - time) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }

        doMorph();
      } else {
        doCooldown();
      }
    }
    (() => {
      id = animate();
    })();

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <>
      <div id="container">
        <span id="text1"></span>
        <span id="text2"></span>
      </div>

      <svg id="filters">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default Home;
