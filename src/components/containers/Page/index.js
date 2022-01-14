import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

import Container from "../Container";
import Sidebar from "../../Sidebar";

import { isMobileOrTablet } from "../../../util";

import "./style.css";

function Page(props) {
  const { children, className } = props;
  const { pathname } = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
      ReactGA.pageview(pathname);
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  const checkPropsVariables = (activePage) => {
    let { title, description, image, style } = props; // Variables
    title += " | Vent With Strangers";
    return { style, title, description, image };
  };

  const { description, image, style, title } = checkPropsVariables(pathname);

  return (
    <Container
      className={"column flex-fill ov-auto bg-grey-2 " + className}
      style={style}
    >
      <Helmet defer={false}>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta property="image" content={image} />
        <meta property="og:image" content={image} />
      </Helmet>

      {children}
    </Container>
  );
}

export default Page;
