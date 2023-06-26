import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Layout, Footer, Navbar } from "@/components/brand";
import { PDFModal, VideoModal, IntroductionModal } from "@/components/modal";

import { validUserSessionToken, retrieveParseObjects, getAvailableCourse } from "@/utils/parse";
import AppError from "@/utils/error";

import {
  setOverlayDisplay,
  ColorBackground,
  Select,
  Flex,
  Block,
  Locator,
  Text,
  Icon,
  Logo,
  FillBtn,
  OutlineBtn,
  Spin
} from "de/components";

import { callMethod } from "de/hooks";
import { M, whatsapp } from "de/utils";

const _textSize = (normalSize) => M(normalSize/2, 3 * normalSize / 5, 4 * normalSize / 5, normalSize, "#");
const _padding = (scale = 1) => M(1 * scale, 2 * scale, 3 * scale, 5 * scale, "#");
const _gap = (scale = 1) => M(1 * scale, "#", "#", 2 * scale, "#");

const Loading = () => (
  <Flex padding={_padding(2)}>
    <Spin size={0.5} color={{ s: 0.25, l: 0.5 }} />
  </Flex>
);

const PurchaseContent = ({ t, router, course, newUser, payments, policyUrl }) => {
  const _title = t((newUser) ? "course:welcome-newuser" : "course:extend-period", { course });
  const _contents = t("course:course-content", { returnObjects: true });
  return (
    <Flex gap={_gap(1)} size={[1, true]} padding={M([2, 8], "#", "#", [2, 10], "#")}>
      <Block size={[1, true]}>
        <Text size={_textSize(3)} weight={2} color={{ s: 0.75, l: 0.65 }}>{_title}</Text>
      </Block>
      {
        _contents.map((c, idx) => (
          <Block key={idx} size={[1, true]}>
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1 }}>{`- ${c}`}</Text>
          </Block>
        ))
      }
      {
        payments.map(({ title, color, onClick }, idx) => (
          <FillBtn key={idx} size={M([1, true], "#", [0.4, true], "#", "#")} color={color} onClick={onClick} rounded="()" focusScaleEffect={0.8}>
            <Text size={_textSize(2)} weight={2} color={{ s: 1, l: 1 }}>{title}</Text>
          </FillBtn>
        ))
      }
      <Flex size={[1, true]}>
        <OutlineBtn size={M([0.5, true], "#", "#", [0.2, true], "#")} focusScaleEffect={0.8} onClick={() => window.open(process.env.TELEGRAM, "_blank")}>
          <Text size={_textSize(1.5)} weight={1} color={{ s: 0.6, l: 0.7 }}>#{t("telegram")}</Text>
        </OutlineBtn>
        <OutlineBtn size={M([0.5, true], "#", "#", [0.2, true], "#")} focusScaleEffect={0.8} onClick={() => window.open(policyUrl, "_blank")}>
          <Text size={_textSize(1.5)} weight={1} color={{ s: 0.6, l: 0.7 }}>#{t("course:policy")}</Text>
        </OutlineBtn>
      </Flex>
    </Flex>
  );
};

const SelectInput = React.forwardRef(({
  placeholder = "",
  datalist = [],
  onBlur = false
}, ref) => {
  return (
    <Flex itemPosition={["start", "center"]} size={M([0.5, true], "#", "#", [0.3, true], "#")}>
      <Select
        ref={ref}
        border
        rounded
        color={{ s: 0.4, l: 0.6 }}
        placeholder={placeholder}
        onBlur={onBlur}
        datalist={datalist}
      />
    </Flex>
  );
});
SelectInput.displayName = "SelectInput";

const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
const ProductListContent = ({ t, course, products, sessionToken, userRef }) => {
  const [_filter, _setFilter] = React.useState({ ext: { selected: "all", options: ["all"] }, courseNumber: { selected: 0, options: [0] } });
  React.useEffect(() => {
    const _filterSelection = { ext: new Set(["all"]), courseNumber: new Set([0]) };
    products.forEach(prod => {
      _filterSelection.ext.add(prod.ext);
      _filterSelection.courseNumber.add(parseInt(prod.courseNumber));
      return;
    });

    _filterSelection.ext = Array.from(_filterSelection.ext);
    _filterSelection.courseNumber = Array.from(_filterSelection.courseNumber);
    _setFilter({ ext: { selected: "all", options: _filterSelection.ext }, courseNumber: { selected: 0, options: _filterSelection.courseNumber } });
    return () => true;
  }, [products]);

  const _locales = t(`${course}:detail`, { returnObjects: true });
  const _onFilter = ({ ext = false, courseNumber = false }) => {
    if (ext !== false && ext !== _filter.ext.selected) { _setFilter(old => ({ ...old, ext: { ...old.ext, selected: ext }})); }
    if (courseNumber !== false && courseNumber !== _filter.courseNumber.selected) { _setFilter(old => ({ ...old, courseNumber: { ...old.courseNumber, selected: courseNumber }})); }
    return;
  };

  return (
    <Flex itemPosition={["start", "start"]} size={[1, true]} gap={_gap(1.5)} padding={[0, 5]}>
      <Flex size={[1, true]}>
        <ColorBackground color={{ s: 0, l: 0 }} />
        <Flex itemPosition={["start", "center"]} size={[1, true]} padding={[0.2, 0]}>
          <SelectInput
            placeholder={t("course:course-type")}
            datalist={_filter.ext.options.map(value => ({ value, label: t(value) }))}
            onBlur={(value) => _onFilter({ ext: value })}
          />
          <SelectInput
            placeholder={t("course:course-number")}
            datalist={_filter.courseNumber.options.map(value => ({ value, label: t((value === 0) ? "all" : "section", { courseNumber: value }) }))}
            onBlur={(value) => _onFilter({ courseNumber: value })}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={[1, true]} padding={[0.4, 0.05]}>
          <Text size={_textSize(1)} weight={1} color={{ h: -240, s: 0.4, l: 0.6 }} baseStyle={{ align: ["start", "center"] }} >{t("course:course-expired", { expiredDate: _formatDate(new Date(userRef.current.expiredDate)) })}</Text>
        </Flex>
      </Flex>
      {products.filter(prod => {
        if (_filter.ext.selected !== "all" && _filter.ext.selected !== prod.ext) { return false; }
        const _filterCourseNumber = parseInt(_filter.courseNumber.selected);
        return (_filterCourseNumber === 0) ? true : (_filterCourseNumber === parseInt(prod.courseNumber));
      }).map(prod => (
        <Flex itemPosition={["start", "center"]} size={M([1, true], "#", [0.4, true], "#", [0.3, true])}>
          <OutlineBtn
            key={prod.objectId}
            size={true}
            focusScaleEffect={0.8}
            baseStyle={{ itemPosition: ["start", "center"] }}
            onClick={() => {
              callMethod("course-introduction-modal", "setContent", {
                content: `(${t(prod.ext)}) - ${_locales[`${prod.courseNumber}`].description}`,
                title: _locales[`${prod.courseNumber}`].title,
                onClick: () => {
                  setOverlayDisplay("course-introduction-modal", false);
                  if (prod.ext === "mov") {
                    callMethod("course-video-modal", "setVideoSrc", { src: `${prod.src}?sessionToken=${sessionToken}`, title: _locales[`${prod.courseNumber}`].title });
                    setOverlayDisplay("course-video-modal", true);
                  } else if (prod.ext === "pdf") {
                    callMethod("course-pdf-modal", "setPDFSrc", { src: `${prod.src}?sessionToken=${sessionToken}`, title: _locales[`${prod.courseNumber}`].title });
                    setOverlayDisplay("course-pdf-modal", true);
                  }
                  
                  return;
                }
              });

              return setOverlayDisplay("course-introduction-modal", true);
            }}
          >
            <Icon name={(prod.ext === "mov") ? "movie" : "note"} fill={(prod.ext === "note")} type="rounded" color={{ h: -240, s: 0.3, l: 0.5 }} weight={2} size={_textSize(5)} />&nbsp;&nbsp;
            <Text size={_textSize(1.5)} weight={1} color={{ s: 1, l: 1}} baseStyle={{ align: ["start", "center"] }} >{_locales[`${prod.courseNumber}`].title}</Text>
          </OutlineBtn>
        </Flex>
      ))}
    </Flex>
  );
};

export default function CourseIndex({ locale, course, policyUrl }) {
  const { t } = useTranslation(["common", "app", "course", course]);
  const _router = useRouter();
  const _userRef = React.useRef({});
  const [_setting, _setSetting] = React.useState({ status: "loading", products: [], sessionToken: "" });

  React.useEffect(() => {
    let _abortController = new AbortController();
    const _sessionToken = window.localStorage.getItem(`nightmaths:${course}-session-token`);
  
    if (!_sessionToken || _sessionToken.length === 0) { _router.replace(`/${course}/oauth/google?requestLink=1`); }
    else {
      validUserSessionToken(course, _sessionToken, _abortController)
      .then(user => {
        if (user instanceof Error) { throw user; }

        _userRef.current = user;
        if (user.expiredDate === 0) { throw new AppError({ text: "notpurchase", status: 401 }); }
        const _now = (new Date()).valueOf();
        if (user.expiredDate < _now) { throw new AppError({ text: "expired", status: 401 }); }

        _abortController = new AbortController();
        return retrieveParseObjects(course, "Product", "courseNumber,ext,src", _sessionToken, _abortController);
      })
      .then(products => {
        if (products instanceof Error) { throw products; }
        return _setSetting(old => ({ ...old, status: "purchased", sessionToken: _sessionToken, products: products.sort((a, b) => a.courseNumber - b.courseNumber) }));
      })
      .catch(error => {
        if (error.message.indexOf("session-invalidation") !== -1) { return _router.replace(`/${course}/oauth/google?requestLink=1`); }
        if (error.message.indexOf("notpurchase") !== -1){ return _setSetting(old => ({ ...old, status: "notpurchase" })); }
        if (error.message.indexOf("expired") !== -1) { return _setSetting(old => ({ ...old, status: "expired" })); }
        return _router.replace(`/${course}/error?message=${error.message}`);
      });
    }

    return () => _abortController.abort();
  }, []);

  const _paymentTitle = t("course:payment", { returnObjects: true });
  const _payments = [
    { title: _paymentTitle["stripe"], color: { s: 0.4, l: 0.8 }, onClick: () => { _setSetting(old => ({ ...old, status: "loading" })); return _router.replace(`/${course}/checkout/stripe?sessionToken=${_userRef.current.sessionToken}`); } },
    { title: _paymentTitle["fps"], color: { h: -240, s: 0.5, l: 0.5 }, onClick: () => whatsapp({ phone: process.env.CONTACT, text: `[RefId: ${_userRef.current.objectId}] - ${_paymentTitle["fps"]}${t("buy")}${course}${t("online")}${t("course")}` }) }
  ];

  return (
    <Layout t={t} title={t("app:app-title")}>
      <Navbar
        title={t("app:app-name")}
        subtitle={course.toUpperCase()}
        logoutText={t("signout")}
        logoutHandler={() => {
          window.localStorage.removeItem(`nightmaths:${course}-session-token`);
          return _router.replace("/");
        }}
      />
      <Flex size={(_setting.status !== "purchased") ? 1 : [1, true]} itemPosition={(_setting.status !== "purchased") ? ["center", "center"] : ["start", "start"]} baseStyle={(_setting.status !== "purchased") ? { minSize: [1, 1] } : {}}>
        {(_setting.status !== "loading") ? null : <Loading />}
        {(_setting.status !== "notpurchase" && _setting.status !== "expired") ? null : <PurchaseContent t={t} router={_router} policyUrl={policyUrl} course={course} newUser={_setting.status === "notpurchase"} payments={_payments} />}
        {(_setting.status !== "purchased") ? null : <IntroductionModal id="course-introduction-modal" btnText={t("view")} sessionToken={_setting.sessionToken} setSetting={_setSetting} course={course}/>}
        {(_setting.status !== "purchased") ? null : <PDFModal id="course-pdf-modal" errorContent={t("download-error")} />}
        {(_setting.status !== "purchased") ? null : <VideoModal id="course-video-modal" errorContent={t("download-error")} />}
        {
          (_setting.status !== "purchased") ? null : 
            <ProductListContent
              t={t}
              course={course}
              sessionToken={_setting.sessionToken}
              products={_setting.products}
              userRef={_userRef}
            />
        }
      </Flex>
      <Locator fixed reverse loc={[0, 0, 0]} size={[1, true]}>
        <Footer shareLabel={t("share")} />
      </Locator>
    </Layout>
  )
}

export async function getServerSideProps({ locale, params, query, req, res }) {
  const { course } = params;
  const _course = course.toLowerCase();
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const _policyUrl = `${_proto}://${req.headers.host}/policy`;

  if (getAvailableCourse().indexOf(_course) === -1) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };    
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "app",
        "course",
        _course
      ])),
      locale,
      policyUrl: _policyUrl,
      course: _course
    }
  };
}
