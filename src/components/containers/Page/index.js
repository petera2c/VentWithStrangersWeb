import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import loadable from "@loadable/component";

const Container = loadable(() => import("../Container"));

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

  const [description2, setDescription2] = useState("");
  const [keywords2, setkeywords2] = useState("");
  const [title2, settitle2] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
      ReactGA.pageview(pathname);
    }

    import("./util").then((functions) => {
      const { description, keywords, title } = functions.getMetaData(pathname);
      setDescription2(description);
      setkeywords2(keywords);
      settitle2(title);
    });

    window.scrollTo(0, 0);
  }, [pathname]);

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
