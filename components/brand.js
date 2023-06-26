import React from "react";
import Head from "@/components/head";
import {
  Container,
  ImageBackground,
  ColorBackground,
  Locator,
  Block,
  Flex,
  Text,
  Icon,
  Logo,
  OutlineBtn
} from "de/components";

import { M, share } from "de/utils";

const _textSize = (normalSize) => M(normalSize/2, 3 * normalSize / 5, 4 * normalSize / 5, normalSize, "#");
export const Layout = ({ t = false, title = false, children }) => {
  return (
    <>
      {
        (!t) ? null : <Head
          author={t("app:app-author")}
          name={t("app:app-name")}
          description={t("app:app-description")}
          keywords={t("app:app-keywords")}
          title={(!title) ? "" : title}
        />
      }
      <Container
        theme={{
          fontColor: "#000000",
          fontFamily: ["Noto Sans TC", "Roboto"],
          fontSize: 16,   // px
          fontWeight: 400, // unitless
          thickness: 1, // px
          radius: 16, // px
          spacing: 16, // px
          color: { h: 240, s: 0, l: 0 } // blue as theme color
        }}
        colorPalette={{
          focus: { s: 0.4, l: 0.6 }
        }}
      >
        <ImageBackground fixed size="cover" src="/imgs/landing_maths_bg.jpg" />
        <ColorBackground fixed color={{ s: 0, l: 0, a: 0.75 }} />
        {children}
      </Container>
    </>
  );
};

export const Navbar = ({ title, subtitle = false, logoutText = false, logoutHandler = false }) => {
  return (
    <Locator fixed loc={[0, 0, 10]} size={[1, true]}>
      <Flex itemPosition={["start", "center"]} size={[1, true]} padding={0.25}>
        <ColorBackground color={{ s: 0, l: 0 }} />
        <Flex size={M([0.1, "s"], [0.075, "s"], "#", [0.05, "s"], [0.025, "s"])} rounded>
          <ImageBackground size="cover" src="/imgs/landing_maths_icon.jpg" />          
        </Flex>
        <Flex itemPosition={["start", "center"]} size={M([0.775, true], [0.825, true], "#", [0.85, true], [0.925, true])} padding={0.5}>
          <Text size={_textSize(2.5)} weight={2} color={{ s: 0.9, l: 0.65 }} baseStyle={{ textShadow: { s: 1, l: 0.5 } }}>{title}</Text>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {(!subtitle) ? null : <Text size={_textSize(2.5)} weight={2} color={{ s: 0.1, l: 0.8 }}>-&nbsp;{subtitle}</Text>}
        </Flex>
        <Flex itemPosition={["end", "center"]} size={[true, true]}>
          {
            (!logoutText) ? null :
              <OutlineBtn
                size={true}
                focusScaleEffect={0.8}
                onClick={logoutHandler}
              >
                <Text size={_textSize(1)} weight={2} color={{ s: 0.1, l: 0.8 }}>{logoutText}</Text>
              </OutlineBtn>
          }
        </Flex>
      </Flex>
    </Locator>
  );
};

export const Banner = ({ title, subtitle = false }) => {
  return (
    <Flex itemPosition={["center", "center"]} size={[1, true]} gap={M(1, "#", "#", 2, "#")}>
      <Flex size={M([0.3, "s"], "#", [0.2, "s"], [0.1, "s"], "#")} rounded>
        <ImageBackground size="cover" src="/imgs/landing_maths_icon.jpg" />          
      </Flex>
      <Flex size={[true, true]}>
        <Flex itemPosition={M(["center", "center"], ["start", "center"], "#", "#", "#")} size={[1, true]}>
          <Text size={_textSize(5)} weight={2} color={{ s: 0.9, l: 0.65 }} baseStyle={{ textShadow: { s: 1, l: 0.5 } }}>{title}</Text>
        </Flex>
        {
          (!subtitle) ? null :
          <Flex itemPosition={M(["center", "center"], ["start", "center"], "#", "#", "#")} size={[1, true]}>
            <Text size={_textSize(1.5)} weight={2} color={{ s: 0.1, l: 0.8 }}>&nbsp;-&nbsp;{subtitle}&nbsp;-</Text>
          </Flex>
        }
      </Flex>
    </Flex>
  );
};

export const Footer = ({
  shareLabel,
  color={ s: 0.2, l: 1 }
}) => {
  const _label = shareLabel;
  return (
    <Flex itemPosition={["center", "center"]} size={1} padding={0.5}>
      <ColorBackground color={{ s: 0, l: 0 }} />
      <Block size={[1, true]} padding={0.2}>
        <Text family="Pacifico" weight={1} background={color}>{'Copyright @ NoPaper.life'}</Text>
      </Block>
      <Flex size={[1, true]} padding={0.2}>
        <Text weight={1.2} background={color}>{_label}&nbsp;&nbsp;</Text>
        {["whatsapp", "facebook", "twitter"].map((socialMedia) =>
          <OutlineBtn key={socialMedia} size={["s", 1]} color={color} focusScaleEffect padding={0.5} onClick={() => share({ socialMedia, url: window.location.href })}>
            <Logo size={1.2} name={socialMedia} />
          </OutlineBtn>
        )}
      </Flex>
    </Flex>
  );
};
