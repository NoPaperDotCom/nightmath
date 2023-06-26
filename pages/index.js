import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout, Footer, Banner } from "@/components/brand";
import { PDFModal } from "@/components/modal";

import {
  setOverlayDisplay,
  ImageBackground,
  ColorBackground,
  Flex,
  Block,
  Locator,
  Text,
  Icon,
  Logo,
  FillBtn,
  OutlineBtn
} from "de/components";

import { callMethod } from "de/hooks";
import { M, whatsapp } from "de/utils";

const scrollTo = (el) => {
  const _el = (el instanceof Element) ? el : document.getElementById(el);
  if (_el instanceof Element) { return _el.scrollIntoView({ behavior: 'smooth' }, true); }
  return false;
};

const _textSize = (normalSize) => M(normalSize/2, 3 * normalSize / 5, 4 * normalSize / 5, normalSize, "#")
const _padding = (scale = 1) => M(1 * scale, 2 * scale, 3 * scale, 5 * scale, "#")
const _gap = (scale = 1) => M(1 * scale, "#", "#", 2 * scale, "#")
const HomeSectorCard = ({ title, content, detailRef, actionHandler, detailText, position="left" }) => {
  return (
    <Flex size={M([1, true], "#", "#", "#", [0.4, true])} padding={_padding()} rounded={M("{}", "#", "#", "#", (position === "left") ? "(]" : "[)")}>
      <ColorBackground color={{ s: 0.2, l: 0.2 }} />
      <Block size={[1, true]}>
        <Text size={_textSize(3)} weight={2} color={{ s: 0.8, l: 0.7 }}>{title}</Text>
      </Block>
      {content}
      <Flex size={[1, true]} gap={_gap()} padding={1}>
        {["Core", "M1", "M2"].map(course => 
          <FillBtn key={course} rounded="{}" size={0.25, "s"} color={{ h: -120, s: 0.5, l: 0.5 }} focusScaleEffect={0.8} onClick={() => actionHandler(course)}>
            <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{course}</Text>
          </FillBtn>
        )}
      </Flex>
      <OutlineBtn focusScaleEffect={0.8} onClick={() => scrollTo(detailRef)}>
        <Text size={_textSize(1.2)} weight={1} color={{ s: 0.2, l: 0.8 }}>{detailText}</Text>
      </OutlineBtn>
    </Flex>
  );
};

const HomeSector = ({ t, router }) => {
  return (
    <Flex id="home-sector" itemPosition={["center", "start"]} size={[1, true]} baseStyle={{ minSize: [1, 1] }} padding={_padding()}>
      <Banner title={t("app:app-name")} subtitle={t("app:app-title")} />
      <Flex itemPosition={["center", "center"]} size={[1, true]}>
        {[{ name: "channel", url: process.env.YOUTUBE }, { name: "facebook", url: process.env.FB }, { name: "telegram", url: process.env.TELEGRAM }]
          .map(({ name, url }) => 
            <OutlineBtn key={name} size={true} focusScaleEffect={0.8} onClick={() => window.open(url, "_blank")}>
              <Text size={_textSize(1.5)} weight={1} color={{ s: 0.6, l: 0.7 }}>#{t(name)}</Text>
            </OutlineBtn>
          )
        }
      </Flex>
      <Flex itemPosition={["center", "center"]} size={[1, true]} gap={2}>
        <HomeSectorCard
          position="left"
          title={t("index:home-online-title")}
          content={t("index:home-online-content", { returnObjects: true })}
          detailRef="online-sector"
          detailText={`#${t("detail")}`}
          actionHandler={(course) => router.replace(`/${course}`)}
        />
        <HomeSectorCard
          position="right"
          title={t("index:home-tutorial-title")}
          content={t("index:home-tutorial-content", { returnObjects: true })}
          detailRef="tutorial-sector"
          detailText={`#${t("detail")}`}
          actionHandler={(course) => whatsapp({ phone: process.env.CONTACT, text: `${t("enroll")}${course}${t("course")}` })}
        />
      </Flex>
    </Flex>
  );
};

const TutorialSector = ({ t }) => {
  return (
    <Flex id="tutorial-sector" itemPosition={["center", "start"]} size={[1, true]} padding={_padding()}>
      <ColorBackground color={{ s: 0.2, l: 0.2 }} />

      <Flex itemPosition={["center", "start"]} size={[1, true]} padding={2}>
        <Text size={_textSize(5)} weight={2} color={{ s: 0.9, l: 0.65 }}>{t("index:home-tutorial-title")}</Text>
      </Flex>

      <Flex itemPosition={["start", "start"]} size={[1, true]} gap={2} padding={2}>
        <Text underline size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.7 }}>{t("index:tutorial-course-title")}</Text>
        {["core", "m1", "m2", "group", "assessment"].map((course) => {
          const _courseText = t("index:tutorial-course-content", { returnObjects: true })[course];
          return (
            <Flex key={course} itemPosition={["center", "start"]} size={[1, true]} gap={1.5} padding={2} rounded="{}">
              <ColorBackground color={{ s: 0.5, l: 0.9 }} />
              {(course === "core" || course === "m1" || course === "m2") ? 
                <Locator loc={[0, 0, 1]} size={true} baseStyle={{ rotate: 315, translate: M(["-20px", 0], "#", ["-65px", 0], "#", "#") }}>
                  <Block size={true} padding={M([1, 0], "#", [5, 0], "#", "#")}>
                    <ColorBackground color={{  h: -240, s: 0.5, l: 0.5 }} />
                    <Text size={_textSize(2.5)} weight={2} color={{ s: 1, l: 1 }}>{t("hot")}</Text>
                  </Block>
                </Locator> : null}
                <Locator reverse loc={[0, 0, 1]} size={true}>
                  <Block size={true} padding={M(0.4, 0.5, 1, "#", "#")}>
                    <ColorBackground color={{  h: -240, s: 0.5, l: 0.5 }} />
                    <Text size={_textSize(1)} weight={2} color={{ s: 1, l: 1 }}>{_courseText.price}</Text>
                  </Block>
                </Locator>
              <Block size={[1, true]}>
                <Text size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.3 }}>~&nbsp;{_courseText.name}&nbsp;~</Text>
              </Block>
              {_courseText.details.map((detail, idx) => 
                <Block key={idx} size={M([1, true], "#", "#", [0.15, true], "#")} padding={.5}>
                  <Text size={_textSize(1.8)} weight={2} color={{ s: 0.8, l: 0.65 }}>{detail}</Text>
                </Block>
              )}
              <Flex size={[1, true]} gap={0.5}>
                {_courseText.type.map((type, idx) => 
                  <FillBtn rounded="{}" size={0.1, "s"} color={{ h: -120, s: 0.5, l: 0.5 }} focusScaleEffect={0.8} onClick={() => whatsapp({ phone: process.env.CONTACT, text: `${t("enroll")}${_courseText.name}(${type})` })}>
                    <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{`${t("enroll")}${type}`}</Text>
                  </FillBtn>
                )}
              </Flex>
            </Flex>
          );
        })}
      </Flex>

      <Flex itemPosition={["start", "start"]} size={[1, true]} gap={2} padding={2}>
        <Text underline size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.7 }}>{t("index:tutorial-timetable-title")}</Text>
        <Flex itemPosition={["start", "center"]} size={[1, true]}>
          <Flex itemPosition={["start", "center"]} size={[1, true]} border={[false, false, { t: "-", c: { s: 1, l: 1 }, w: 2 }, false]} padding={0.5}>
            <Flex size={[1/8, true]} />
            {["mon", "tue", "wed", "thur", "fri", "sat", "sun"]
              .map(weekday =>
                <Flex key={weekday} size={[1/8, true]}>
                  <Text size={_textSize(1.2)} weight={2} color={{ s: 1, l: 1 }}>{t(weekday)}</Text>
                </Flex>
              )
            }
          </Flex>
          {
            [
              ["14:00-15:30", t("index:tutorial-timetable-rest"), t("index:tutorial-timetable-free-assessment")],
              ["15:30-17:00", t("index:tutorial-timetable-rest"), `${t("index:tutorial-timetable-intensive")}(B)`],
              ["17:00-18:30", t("index:tutorial-timetable-rest"), `${t("index:tutorial-timetable-intensive")}(B)`],
              ["18:30-20:00", `${t("index:tutorial-timetable-intensive")}(A)`, t("index:tutorial-timetable-1to1")],
              ["20:00-21:30", `${t("index:tutorial-timetable-intensive")}(A)`, t("index:tutorial-timetable-1to1")],
              ["21:30-23:00", t("index:tutorial-timetable-1to1"), t("index:tutorial-timetable-1to1")]
            ].map(([time, slot1, slot2], idx) => 
              <Flex key={idx} itemPosition={["start", "center"]} size={[1, true]} border={[false, false, (idx === 2 || idx === 5) ? { t: "-", c: { s: 1, l: 1 }, w: 2 } : false, false]}>
                <Flex size={[1/8, true]} padding={0.5} border={[false, { t: "-", c: { s: 1, l: 1 }, w: 2 }, false, false]}>
                  <Text size={_textSize(1)} weight={2} color={{ s: 1, l: 1 }}>{time}</Text>
                </Flex>
                <Flex size={[5/8, true]} padding={0.5} border={[false, { t: "-", c: { s: 1, l: 1 }, w: 2 }, false, false]}>
                  <Text size={_textSize(1)} weight={2} color={{ s: 1, l: 1 }}>{slot1}</Text>
                </Flex>
                <Flex size={[2/8, true]} padding={0.5}>
                  <Text size={_textSize(1)} weight={2} color={{ s: 1, l: 1 }}>{slot2}</Text>
                </Flex>
              </Flex>
            )
          }
        </Flex>
      </Flex>
    </Flex>
  );
};

const OnlineTeachingSector = ({ t, router, pastpaper }) => {
  const _onlineDescription = t("index:online-description", { returnObjects: true });
  return (
    <Flex id="online-sector" itemPosition={["center", "start"]} size={[1, true]} gap={1.5} padding={[0, 5]}>
      <ColorBackground color={{ s: 0.2, l: 0.23 }} />
      <Block size={[1, true]}>
        <Text size={_textSize(5)} weight={2} color={{ s: 0.9, l: 0.65 }}>{t("index:home-online-title")}</Text>
      </Block>

      <Flex itemPosition={["center", "center"]} size={[1, true]} gap={1.5} padding={2}>
        <ImageBackground size="cover" src="/imgs/landing_online_bg.jpg" />
        <ColorBackground color={{ s: 0, l: 0, a: 0.75 }} />
        <Block size={[1, true]}>
          <Text size={_textSize(4)} weight={2} color={{ h: -240, s: 0.4, l: 0.5 }}>{_onlineDescription[0]}</Text>
        </Block>
        
        <Flex size={M([1, true], "#", [0.2, true], "#", "#")}>
          <Text size={_textSize(2)} weight={1} color={{ s: 0.8, l: 0.8 }}>{_onlineDescription[1]}</Text>
        </Flex>
        <Flex size={M([1, true], "#", [0.05, true], "#", "#")}>
          <Icon fill name="add_circle" size={2.5} weight={2} color={{ s: 1, l: 1 }}/>
        </Flex>
        <Flex size={M([1, true], "#", [0.2, true], "#", "#")}>
          <Text size={_textSize(2)} weight={1} color={{ s: 0.6, l: 0.6 }}>{_onlineDescription[2]}</Text>
        </Flex>
        <Flex size={M([1, true], "#", [0.05, true], "#", "#")}>
          <Icon name="equal" size={2.5} weight={2} color={{ s: 1, l: 1 }} />
        </Flex>
        <Flex size={M([1, true], "#", [0.2, true], "#", "#")}>
          <Text size={_textSize(3)} weight={2} color={{ s: 0.7, l: 0.7 }}>{_onlineDescription[3]}&nbsp;!!</Text>
        </Flex>
      </Flex>

      <Flex itemPosition={["start", "start"]} size={[1, true]} padding={_padding()}>
        <Flex itemPosition={["center", "start"]} size={[1, true]} gap={2} padding={2}>
          <Block align="start" size={[1, true]}>
            <Text underline size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.7 }}>{t("index:online-title")}</Text>
          </Block>
          {["video", "note"].map(type => 
            <Flex itemPosition={["center", "start"]} size={M([1, true], "#", "#", [0.4, true], "#")} rounded="{}" shadow gap={2} padding={2}>
              <ColorBackground color={{ s: 0.5, l: 0.9 }} />
              <Block size={[1, true]}>
                <Text size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.3 }}>~&nbsp;{t(`index:online-${type}-title`)}&nbsp;~</Text>
              </Block>
              <Flex size={[0.2, "s"]} rounded>
                <ImageBackground size="cover" src={`/imgs/landing_${type}_icon.png`} />
              </Flex>
              <Flex size={[0.6, true]}>
                <Text size={_textSize(1.5)} weight={2} color={{ s: 0.8, l: 0.65 }}>{t(`index:online-${type}-content`)}</Text>
              </Flex>
            </Flex>
          )}
          <Block size={[1, true]}>
            <Text size={_textSize(2.2)} weight={2} color={{ s: 0.8, l: 0.7 }}>{t("index:online-join")}</Text>
            <br />
            <Text size={_textSize(1.5)} weight={1} color={{ h: -240, s: 0.5, l: 0.8 }}>{t("google-signin-warning")}</Text>
          </Block>
          {["CORE", "M1", "M2"].map(course => 
            <FillBtn rounded="{}" size={true} color={{ h: -120, s: 0.5, l: 0.5 }} focusScaleEffect={0.8} padding={[2.5, 1]} onClick={() => router.replace(`/${course.toLowerCase()}`) }>
              <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{`${t("signin")}${course}${t("course")}`}</Text>
            </FillBtn>
          )}
        </Flex>

        <Flex itemPosition={["center", "start"]} size={[1, true]} gap={2} padding={2}>
          <Block align="start" size={[1, true]}>
            <Text underline size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.7 }}>{t("index:online-telegram-title")}</Text>
          </Block>
          <Flex itemPosition={["center", "center"]} size={[1, true]} rounded="{}" shadow gap={2} padding={2}>
            <ColorBackground color={{ s: 0.5, l: 0.9 }} />
            <Flex size={M([0.4, "s"], [0.3, "s"], [0.2, "s"], [0.1, "s"], "#")} rounded>
              <ImageBackground size="cover" src={"/imgs/landing_telegram_icon.png"} />
            </Flex>
            <Flex size={[0.6, true]}>
              <Text size={_textSize(2)} weight={2} color={{ s: 0.8, l: 0.3 }}>~&nbsp;{t(`index:online-telegram-subtitle`)}&nbsp;~</Text>
              <br />
              <br />
              <Text size={_textSize(1.5)} weight={2} color={{ s: 0.8, l: 0.65 }}>{t("index:online-telegram-content")}</Text>             
            </Flex>
            <FillBtn rounded="{}" size={[1, true]} color={{ h: -120, s: 0.5, l: 0.5 }} focusScaleEffect={0.8} onClick={() => window.open(process.env.TELEGRAM, "_blank")}>
              <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{t("join")}</Text>
            </FillBtn> 
          </Flex>        
        </Flex>

        <Flex itemPosition={["center", "start"]} size={[1, true]} gap={2} padding={2}>
          <Block align="start" size={[1, true]}>
            <Text underline size={_textSize(2.5)} weight={2} color={{ s: 0.8, l: 0.7 }}>{t("index:online-pastpaper-title")}</Text>
          </Block>
          
          {["core", "m1", "m2"].map(course =>
            <Flex key={course} itemPosition={["start", "start"]} size={[1, true]} gap={0.5}>
              <Block align="start" size={[1, true]}>
                <Text size={_textSize(1.5)} weight={2} color={{ s: 0.5, l: 0.8 }}>{course.toUpperCase()}</Text>
              </Block>
              {pastpaper[course].map(({ src, year }) => 
                <FillBtn
                  key={`${course}_${year}`}
                  rounded="{}"
                  size={true}
                  color={{ s: 0.2, l: 0.2 }}
                  hoverColorEffect
                  focusScaleEffect={0.8}
                  onClick={() => {
                    callMethod("index-pdf-modal", "setPDFSrc", { title: `${course.toUpperCase()} - ${year}`, src });
                    return setOverlayDisplay("index-pdf-modal");
                  }}
                >
                  <Text size={_textSize(1)} weight={1} color={{ s: 0.2, l: 0.8 }}>{year}</Text>
                </FillBtn>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const AboutSector = ({ t }) => {
  const _teachersList = t("index:about-teachers-list", { returnObjects: true });
  return (
    <Flex id="about-sector" itemPosition={["center", "start"]} size={[1, true]} gap={1.5} padding={_padding()}>
      <Block size={[1, true]}>
        <Text size={_textSize(5)} weight={2} color={{ s: 0.9, l: 0.65 }}>{t("about")}</Text>
      </Block>

      {Object.entries(_teachersList).map(([key, { name, subjects, introduction }]) => 
        <Flex key={key} itemPosition={["center", "center"]} size={[1, true]} rounded="{}" shadow gap={2} padding={2}>
          <ColorBackground color={{ s: 0.5, l: 0.9 }} />
          <Flex size={[1, true]}>
            <Text size={_textSize(2)} weight={2} color={{ s: 0.8, l: 0.3 }}>~&nbsp;{name} - {subjects}&nbsp;~</Text>
          </Flex>
          <Flex size={M([0.4, "s"], [0.3, "s"], [0.2, "s"], [0.1, "s"], "#")} rounded>
            <ImageBackground size="cover" src={`/imgs/${key}_icon.png`} />
          </Flex>
          <Flex size={[0.6, true]}>
            <Text size={_textSize(1.5)} weight={2} color={{ s: 0.8, l: 0.65 }}>{introduction}</Text>             
          </Flex>
          <FillBtn
            rounded="{}"
            size={[1, true]}
            color={{ h: -120, s: 0.5, l: 0.5 }}
            focusScaleEffect={0.8}
            onClick={() => {
              callMethod("index-pdf-modal", "setPDFSrc", { title: `${t("index:about-view-resume")} - ${name}`, src: `/documents/resume/${key}_profile.pdf` });
              return setOverlayDisplay("index-pdf-modal");
            }}>
            <Text size={_textSize(1.5)} weight={2} color={{ s: 1, l: 1 }}>{t("index:about-view-resume")}</Text>
          </FillBtn> 
        </Flex>
      )}

      <Flex itemPosition={["start", "center"]} size={[1, true]} rounded="{}" shadow padding={0}>
        <ColorBackground color={{ s: 0.5, l: 0.9 }} />
        <Flex size={M([1, true], "#", "#", [0.6, true], "#")} padding={2}>
          {[
            { icon: "home_pin", content: t("address"), onClick: () => window.open(process.env.ADDRESS, "_blank") },
            { icon: "whatsapp", content: `+852 ${process.env.CONTACT.replace("852", "")}`, onClick: () => whatsapp({ phone: process.env.CONTACT}) },
            { icon: "mail", content: process.env.EMAIL.split(":")[1], onClick: () => window.open(process.env.EMAIL, "_blank") }
          ].map(({ icon, content, onClick }, idx) =>
            <Flex key={idx} itemPosition={["start", "center"]} size={[1, true]}>
              <OutlineBtn size={true} hoverScaleEffect focusScaleEffect={0.8} onClick={onClick}>
                {(icon === "whatsapp") ? <Logo size={2} color={{ s: 0.8, l: 0.65 }} name={icon} /> : <Icon size={2} color={{ s: 0.8, l: 0.65 }} name={icon} />}
                &nbsp;
                <Text size={_textSize(1.2)} weight={1} color={{ s: 0.8, l: 0.65 }}>{content}</Text>
              </OutlineBtn>
            </Flex>
          )}
        </Flex>
        <Flex itemPosition={["end", "center"]} size={M([1, true], "#", "#", [0.4, true], "#")}>
          <Block size={[1, "r"]} rounded={M(["[", "[", "}", "}"], "#", "#", "[}", "#")}>
            <ImageBackground size="cover" src="/imgs/room_image_1.jpg"/>
          </Block>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default function Index({ locale, pastpaper }) {
  const { t } = useTranslation(["common", "app", "index"]);
  const _router = useRouter();
  return (
    <Layout t={t} title={t("app:app-title")}>
      <PDFModal id="index-pdf-modal" errorContent={t("download-error")} />
      <HomeSector t={t} router={_router} />
      <OnlineTeachingSector t={t} router={_router} pastpaper={pastpaper} />
      <TutorialSector t={t} />
      <AboutSector t={t} />
      <Flex size={[1, true]}>
        <Footer shareLabel={t("share")} />
      </Flex>
    </Layout>
  )
}

import fs from 'fs';
import path from 'path';

export async function getServerSideProps({ locale, req, res }) {
  const _pastpaper = { "core": "", "m1": "", "m2": "" };
  Object.keys(_pastpaper).forEach(course => {
    const _dirRelativeToPublicFolder = path.resolve('./public', "documents", "pastpaper", course);
    const _filenames = fs.readdirSync(_dirRelativeToPublicFolder);
    _pastpaper[course] = _filenames.map(name => ({ src: path.join('/', "documents", "pastpaper", course, name), year: parseInt(name.split(".")[0], 10) })).sort((a, b) => a.year - b.year);
    return;
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "app",
        "index"
      ])),
      pastpaper: _pastpaper,
      locale
    }
  };
}
