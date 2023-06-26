import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  Flex,
  Block,
  Locator,
  Text,
  FillBtn
} from "de/components";
import { M } from "de/utils";

import { Layout, Footer, Banner } from "@/components/brand";
import { validUserSessionToken, callMethod, getAvailableCourse } from "@/utils/parse";
import AppError from "@/utils/error";


import { loadStripe } from "@stripe/stripe-js";
let _stripe = null;
let _stripePromise = null;

const _getStripeObj = () => {
  if (!_stripe) { _stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); }
  return _stripe;
};

const _getStripePromise = () => {
  if (!_stripePromise) { _stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY); }
  return _stripePromise;
};

const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
const _textSize = (normalSize) => M(normalSize/2, 3 * normalSize / 5, 4 * normalSize / 5, normalSize, "#");
const _padding = (scale = 1) => M(1 * scale, 2 * scale, 3 * scale, 5 * scale, "#");
const _gap = (scale = 1) => M(1 * scale, "#", "#", 2 * scale, "#");

export default function CheckoutIndexPage({ locale, course, recipt }) {
  const _router = useRouter();
  const { t } = useTranslation(["common", "app", "course", course]);
  const _courseRecipt = t(`${course}:recipts`, { returnObjects: true });
  const _recipt = t("course:recipt-content", { returnObjects: true, ...recipt, item: _courseRecipt[recipt.item], startDate: _formatDate(new Date(recipt.startDate)), expiredDate: _formatDate(new Date(recipt.expiredDate)) });
  return (
    <Layout t={t} title={t("course:recipt-title")} >
      <Flex size={1} baseStyle={{ minSize: [1, 1] }}>        
        <Flex size={[1, true]} gap={_gap(0.1)} padding={_padding(0.5)}>
          <Banner title={t("app:app-name")} subtitle={t("course:recipt-title", { course: course.toUpperCase() })}/>
          <Block size={[1, true]}>
            <Text size={_textSize(1.2)} weight={2} color={{  h: -240, s: 0.4, l: 0.5 }}>{t("course:recipt-message")}</Text> 
          </Block>
          <Block align="start" size={[1, true]} padding={_padding(0.5)}>
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.transactionId}</Text>
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.useName}</Text>
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.item}</Text>
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.cost}</Text>
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.startDate}</Text>   
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.expiredDate}</Text>  
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{_recipt.remarks}</Text>        
          </Block>
          <FillBtn
            rounded="()"
            size={[1, true]}
            color={{ h: -120, s: 0.5, l: 0.5 }}
            focusScaleEffect={0.8}
            onClick={() => _router.replace(`/${course}`)}
          >
            <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{t("begin")}</Text>
          </FillBtn>
        </Flex>
      </Flex>
      <Locator fixed reverse loc={[0, 0, 0]} size={[1, true]}>
        <Footer shareLabel={t("share")} />
      </Locator>
    </Layout>
  )
};

export async function getServerSideProps({ params, query, locale, req, res }) {
  const { course } = params;
  const { status = false, sessionToken = false, sessionId = false } = query;
  const _locale = (!locale) ? "zh_hk" : locale;
  const _course = course.toLowerCase();

  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const _redirectURL = `${_proto}://${req.headers.host}/${_course}/checkout/stripe`;

  try {
    // is avaible course
    if (getAvailableCourse().indexOf(_course) === -1) {
      return {
        redirect: {
          destination: "/",
          permanent: false
        }
      };
    }

    // not a user
    if (!sessionToken) {
      return {
        redirect: {
          destination: "/",
          permanent: false
        }
      };
    }

    const _user = await validUserSessionToken(_course, sessionToken);
    if (_user instanceof Error) {
      return {
        redirect: {
          destination: "/",
          permanent: false
        }
      };    
    }

    // checkout cancelled
    if (status === "cancelled") {
      return {
        redirect: {
          destination: `/${_course}`,
          permanent: false
        }
      };
    }

    const _stripeObj = _getStripeObj();

    // checkout success
    if (status === "success") {
      // no stripe session Id
      if (!sessionId) { throw new AppError({ text: "stripe-error", status: 500, message: "no stripe session id" }); }

      const _session = await _stripeObj.checkout.sessions.retrieve(sessionId);
      if (!_session || _session["payment_status"] !== "paid") { throw new AppError({ text: "stripe-error", status: 500, message: _session["payment_status"] }); }

      // set expired date / add transaction ......
      const _recipt = await callMethod(_course, "purchased", {
        userId: _user.objectId,
        method: "stripe",
        refNumber: _session.payment_intent,
        item: "online-one-month",
        price: _session.amount_total / 100,
        currency: _session.currency
      });
      
      return {
        props: {
          recipt: _recipt,
          course: _course,
          locale,
          ...(await serverSideTranslations(locale, ["common", "app", "course", _course]))
        }
      };
    }

    // create stripe checkout ...
    const _localeJson = require(`@/public/locales/${_locale}/${_course}.json`);
    const _now = new Date();
    const _endDate = new Date()
    _endDate.setDate(_now.getDate() + 30);
 
    const _products = await Promise.all([
      _stripeObj.products.create({
        name: `${_localeJson.recipts["online-one-month"]} (${_formatDate(_now)} - ${_formatDate(_endDate)})`,
        description: _localeJson.terms.replace("{{link}}", `${_proto}://${req.headers.host}/policy`)
      })
    ]);

    const _prices = await Promise.all(
      _products.map(({ id }, i) =>
        _stripeObj.prices.create({
          product: id,
          unit_amount: 450 * 100,
          currency: "hkd"
        })
      )
    );

    // Create Checkout Sessions.
    const _session = await _stripeObj.checkout.sessions.create({
      line_items: _prices.map(({ id }) => ({
        price: id,
        quantity: 1
      })),
      customer_email: _user.email,
      payment_method_types: ["card", "alipay", "wechat_pay"],
      payment_method_options: {
        wechat_pay: {
          client: "web"
        }
      },
      mode: "payment",
      success_url: `${_redirectURL}?status=success&sessionToken=${sessionToken}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${_redirectURL}?status=cancelled&sessionToken=${sessionToken}&sessionId={CHECKOUT_SESSION_ID}`
    });

    return {
      redirect: {
        destination: _session.url,
        permanent: false
      }
    };
  } catch (error) {
    return {
      redirect: {
        destination: `/${_course}/error?message=${error.message}}`,
        permanent: false
      }
    };
  }
};
