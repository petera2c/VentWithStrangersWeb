import React from "react";
import Container from "../components/containers/Container";

export const amazonAdListContainer = () => {
  const items = [
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B07DKTDBWC&asins=B07DKTDBWC&linkId=9eecb46bc191d5cbc2821558e191c83a&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    ></iframe>,
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B08XT9TP8X&asins=B08XT9TP8X&linkId=c2e9132ea19129bd1fa1ae0f663dd9bc&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    ></iframe>,
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B08GD3WZN8&asins=B08GD3WZN8&linkId=79f5832b09cacf7dfa1c589250a9e1c7&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    ></iframe>
  ];

  return (
    <Container className="column gap16 pa16">
      {shuffle(items).map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </Container>
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}
