import React from "react";
import Container from "../../components/containers/Container";

export const amazonAdListContainer = () => {
  const echoDot = (
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B07FZ8S74R&asins=B07FZ8S74R&linkId=8e9c1d8168cc24060fbb8652d03c3652&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    />
  );

  const toque = (
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B002G9UDYG&asins=B002G9UDYG&linkId=f0f22ba022967812f7eba4b7fa66147f&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    />
  );

  const masks = (
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B09B6V9Q8J&asins=B09B6V9Q8J&linkId=44984dc6b395160f260a1ba92a6c9b6c&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066C0&bg_color=FFFFFF"
    />
  );

  const iphoneCase = (
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B09L57S7D3&asins=B09L57S7D3&linkId=d8ccaa61a7d075c18c61c63a04efe0a6&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    />
  );

  const glassScreen = (
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B07H2V5YLH&asins=B07H2V5YLH&linkId=86b87acdb2d811d95ce90bca6d426d5a&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    />
  );

  const virtualReality = (
    <iframe
      style={{ width: "120px", height: "240px" }}
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      frameBorder="0"
      src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=ventwithstran-20&marketplace=amazon&amp;region=US&placement=B099VMT8VZ&asins=B099VMT8VZ&linkId=acee9ba10f27a6095d3d307d24f600e6&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
    />
  );
  return (
    <Container className="x-fill justify-between mb32 gap16">
      {masks}
      {iphoneCase}
      {glassScreen}
      {virtualReality}
    </Container>
  );
};
