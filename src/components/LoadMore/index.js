import React, { useEffect } from "react";

import Container from "../../components/containers/Container";
import LoadingHeart from "../loaders/Heart";

let hasScrolled = false;

function LoadMore({ children, loadMore = () => {} }) {
  const scrollListener = () => {
    if (
      window.innerHeight + window.scrollY + 5 >= document.body.scrollHeight &&
      !hasScrolled
    ) {
      hasScrolled = true;
      loadMore();
    }

    setTimeout(() => {
      hasScrolled = false;
    }, 1000);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <Container className="column x-fill full-center" onClick={loadMore}>
      {children}

      <LoadingHeart />
    </Container>
  );
}

export default LoadMore;
