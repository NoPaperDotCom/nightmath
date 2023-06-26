import React from "react";
import Head from "next/head";

const AppHead = ({ name, title, author = false, description = false, keywords = false }) => {
  return (
    <Head>
      <title>{`${name} - ${title}`}</title>
      <meta charSet="UTF-8" />
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {author ? <meta name="author" content={author} /> : null}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default AppHead;
