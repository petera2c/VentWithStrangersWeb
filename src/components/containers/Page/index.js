import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

import Container from "../Container";

import { getMetaData } from "./util";

function Page({
  children,
  className,
  description,
  id,
  keywords,
  style,
  title,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
      ReactGA.pageview(pathname);
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  const { description2, keywords2, title2 } = getMetaData(pathname); // Variables

  return (
    <Container
      className={"column flex-fill ov-auto bg-grey-2 " + className}
      id={id}
      style={style}
    >
      <Helmet defer={false}>
        <meta charSet="utf-8" />
        <title>{title ? title : title2}</title>
        <meta content={title ? title : title2} name="title" />
        <meta content={title ? title : title2} name="og:title" />
        <meta
          content={description ? description : description2}
          name="description"
        />
        <meta
          content={description ? description : description2}
          name="og:description"
        />
        <meta content={keywords ? keywords : keywords2} name="keywords" />
      </Helmet>

      {children}
    </Container>
  );
}

export default Page;
