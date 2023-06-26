import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout, Footer, Banner } from "@/components/brand";
import { 
  Flex,
  Block,
  Locator,
  Text,
  FillBtn
} from "de/components";

import { M } from "de/utils";

const _textSize = (normalSize) => M(normalSize/2, 3 * normalSize / 5, 4 * normalSize / 5, normalSize, "#")
const _padding = (scale = 1) => M(1 * scale, 2 * scale, 3 * scale, 5 * scale, "#")
const _gap = (scale = 1) => M(1 * scale, "#", "#", 2 * scale, "#")

export default function Error({ locale, error, course }) {
  const { t } = useTranslation(["common", "app", "error"]);
  const _errorText = t(`error:${error.text}`, { message: error.message });
  const _router = useRouter();
  return (
    <Layout t={t} title={t("error:app-title")}>
      <Flex size={1} baseStyle={{ minSize: [1, 1] }}>        
        <Flex size={[1, true]} gap={_gap()} padding={_padding(2)}>
          <Banner title={t("app:app-name")} />
          <Block size={[1, true]}>
            <Text size={_textSize(1.5)} weight={2} color={{ h: -240, s: 0.6, l: 0.4 }}>{_errorText}</Text>
          </Block>
          <FillBtn
            rounded="()"
            size={[1, true]}
            color={{ h: -120, s: 0.5, l: 0.5 }}
            focusScaleEffect={0.8}
            onClick={() => _router.replace(`/${course}`)}
          >
            <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{t("back")}</Text>
          </FillBtn>
        </Flex>
      </Flex>
      <Locator fixed reverse loc={[0, 0, 0]} size={[1, true]}>
        <Footer shareLabel={t("share")} />
      </Locator>
    </Layout>
  )
}

export async function getServerSideProps({ locale, params, query, req, res }) {
  const { course } = params;
  const { message = "internal_500_unknown" } = query;
  const [errorText, errorCode = 500, errorMessage = ""] = message.split("_");
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "app",
        "error"
      ])),
      locale,
      course,
      error: { text: errorText, code: errorCode, message: errorMessage }
    }
  };
};
