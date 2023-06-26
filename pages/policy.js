import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout, Footer, Navbar } from "@/components/brand";
import {
  ImageBackground,  
  Flex,
  Block,
  Locator,
  Text,
  FillBtn
} from "de/components";

import { M } from "de/utils";

const _textSize = (normalSize) => M(normalSize/2, 3 * normalSize / 5, 4 * normalSize / 5, normalSize, "#");
const _gap = (scale = 1) => M(1 * scale, "#", "#", 2 * scale, "#");

export default function Policy({ locale }) {
  const { t } = useTranslation(["common", "app", "policy"]);
  const _router = useRouter();
  const _policy = t("policy:terms", { returnObjects: true });
  return (
    <Layout t={t} title={t("policy:app-title")}>
      <Navbar title={t("app:app-name")} />
      <Flex size={1} baseStyle={{ minSize: [1, 1] }}>
        <Flex size={[1, true]} gap={_gap(1)} padding={M(4, "#", "#", 8, "#")}>
          {
            _policy.map(({ title, content }, idx) => 
              <Block key={idx} align="start" size={[1, true]}>
                <Text size={_textSize(2.5)} weight={2} color={{ s:1, l:1 }}>{title}</Text>
                <br />
                <Text size={_textSize(1.5)} weight={1} color={{ s:1, l:1 }}>{content}</Text>
              </Block>
            )
          }
          <FillBtn
            rounded="()"
            size={[1, true]}
            color={{ h: -120, s: 0.5, l: 0.5 }}
            focusScaleEffect={0.8}
            onClick={() => _router.replace("/")}
          >
            <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{t("home")}</Text>
          </FillBtn>
        </Flex>
        <Flex size={[1, true]}>
          <Footer shareLabel={t("share")} />
        </Flex>
      </Flex>
    </Layout>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "app",
        "policy"
      ]))
    }
  };
};
