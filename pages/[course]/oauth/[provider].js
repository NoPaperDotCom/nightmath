const googleAPI = (typeof window !== "undefined") ? false : require('googleapis');

import React from "react";
import { useRouter } from "next/router";
import { callMethod, getAvailableCourse } from "@/utils/parse";
import AppError from "@/utils/error";

import { Layout } from "@/components/brand";
import { Flex, Spin } from "de/components";

const _oauthSignInLinkRequest = (provider = "google", info = {}) => {
  if (provider === "google" && googleAPI) {
    const { google } = googleAPI;
    const _googleOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      info.redirectURL
    );

    return _googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "openid", "profile"]
    });
  }

  return "/";
};

const _oauthRedirect = async (provider = "google", info = {}) => {
  try {
    let _authData = {};
    if (provider === "google" && googleAPI && info.code) {
      const { google } = googleAPI;
      const _googleOAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        info.redirectURL
      );

      const { tokens } = await _googleOAuth2Client.getToken(info.code);
      _googleOAuth2Client.setCredentials(tokens);

      const _oauth2 = google.oauth2({
        auth: _googleOAuth2Client,
        version: "v2"
      });

      const _userInfo = await _oauth2.userinfo.get();
      _authData = {
        id: _userInfo.data.id,
        email: _userInfo.data.email,
        name: _userInfo.data.name,
        id_token: tokens.id_token,
        access_token: tokens.access_token
      };
    }

    return await callMethod(info.course, "linkUser", { provider, authData: _authData });
  } catch (error) {
    if (error instanceof AppError) { return error; }
    return new AppError({ text: `${provider}-signin`, status: 401, message: error.message });
  }
};

export default function OAuthPage({ course, sessionToken }) {
  const _router = useRouter();
  React.useEffect(() => {
    window.localStorage.setItem(`nightmaths:${course}-session-token`, sessionToken);
    _router.replace(`/${course}`);
    return () => true;
  }, []);

  return (
    <Layout>
      <Flex baseStyle={{ minSize: [1, 1] }}>
        <Spin size={0.4} color={{ s: 0.25, l: 0.5 }} />
      </Flex>
    </Layout>
  )
}

export async function getServerSideProps({ params, query, req, res }) {
  const { course, provider } = params;
  const { requestLink = false } = query;
  const _course = course.toLowerCase();
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const _redirectURL = `${_proto}://${req.headers.host}/${_course}/oauth/${provider}`;

  if (getAvailableCourse().indexOf(_course) === -1) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };    
  }

  if (requestLink) {
    const _link = _oauthSignInLinkRequest(provider, { redirectURL: _redirectURL });
    return {
      redirect: {
        destination: _link,
        permanent: false
      }
    };
  }

  const _ret = await _oauthRedirect(provider, { code: query.code, redirectURL: _redirectURL, course: _course });
  if (_ret instanceof Error) {
    return {
      redirect: {
        destination: `/${course}/error?message=${_ret.message}`,
        permanent: false
      }
    };
  }

  if (!_ret.sessionToken) {
    return {
      redirect: {
        destination: `/${course}`,
        permanent: false
      }
    };
  }

  return {
    props: {
      course: _course,
      sessionToken: _ret.sessionToken
    }
  };
}
