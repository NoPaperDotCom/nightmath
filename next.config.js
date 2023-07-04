/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
// const keys = require("./private.key.js");

const nextConfig = {
  // reactStrictMode: true,
  env: {
    GOOGLE_GTAG_ID: "G-C89W0555EJ",
    FB: "https://www.facebook.com/nightmaths",
    YOUTUBE: "https://www.youtube.com/channel/UCqmGrzx74ldcLu6nV4Bn2OA",
    INSTAGRAM: "https://www.instagram.com/nightmaths/",
    EMAIL: "mailto: southdee2019.paperless@gmail.com",
    TELEGRAM: "https://t.me/nightmaths",
    CONTACT: "85295414921",
    ADDRESS: "https://www.google.com/maps/place/%E9%A7%B1%E9%A7%9D%E6%BC%86%E5%A4%A7%E5%BB%88/@22.31056,114.22491,15z/data=!4m5!3m4!1s0x0:0xed282d5cf2908243!8m2!3d22.31056!4d114.22491",
    CORE_SERVER_URL: "https://parseapi.back4app.com",
    M1_SERVER_URL: "https://parseapi.back4app.com",
    M2_SERVER_URL: "https://parseapi.back4app.com"
    // ...keys
  },
  i18n
};

module.exports = nextConfig
