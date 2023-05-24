import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { isClickTitleState } from "../grobalStates/isClickTitleStateAtom";
import { selectedTagState } from "../grobalStates/selectedTagAtom";
import { selectedPageState } from "../grobalStates/selectedPageAtom";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";

import Footer from "./footer";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";

const name = "Neut Code Tech Blog";
export const siteTitle = "Neut Blog";

const Layout = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  const setIsClickTitle = useSetRecoilState(isClickTitleState);
  const setSelectedTag = useSetRecoilState(selectedTagState);
  const setSelectedPage = useSetRecoilState(selectedPageState);
  const router = useRouter();

  const goHome = () => {
    setIsClickTitle(true);
    setSelectedTag("");
    setSelectedPage(0);
    router.push("/");
  };

  useEffect(() => {
    if (!vantaEffect) {
      window.THREE = THREE;
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: window.THREE,
          highlightColor: 0xf53fce,
          midtoneColor: 0xffff,
          baseColor: 0x6363eb,
          blurFactor: 0.68,
          speed: 2.0,
          zoom: 0.5,
          minHeight: 300.0,
        })
      );
    }
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header} ref={vantaRef}>
        <div className={styles.name} onClick={goHome}>
          <h1 className={utilStyles.heading2Xl}>{name}</h1>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
