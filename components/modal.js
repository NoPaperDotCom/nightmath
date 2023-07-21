import React from "react";
import { Player, LoadingSpinner } from "video-react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import 'video-react/dist/video-react.css';

import {
  setOverlayDisplay,
  Overlay,
  ColorBackground,
  Block,
  Flex,
  Text,
  Icon,
  OutlineBtn,
  FillBtn,
  Spin
} from "de/components";
import { useEventListener, useMethod } from "de/hooks";
import { M } from "de/utils";

import { callMethod } from "@/utils/parse";

const Modal = ({ id = "", title = "", onLoad = () => true, itemPosition=["start", "start"], onClose = () => false, children }) => {
  return (
    <Overlay id={id} color={{ s: 0, l: 0, a: 0.8 }} onLoad={(display) => (display) ? onLoad() : false}>
      <Block size={1} padding={1.5}>
        <Flex rounded="{}" itemPosition={["start", "start"]} size={1} padding={M(0, 1, 2, "#", "#")}>
          <ColorBackground color={{ s: 0.2, l: 0.23 }} />
          <Flex size={[1, 0.08]} border={["", "", { c: { s: 0.3, l: 0.8 }, w: 4 }, ""]}>
            <Flex size={[0.8, 1]} itemPosition={["start", "center"]} padding={M([0, 0, 0, 1], 0, "#", "#", "#")}>
              <Text size={M(0.9, "#", "#", 1.2, "#")} color={{ s: 0.3, l: 0.8 }}>{title}</Text>
            </Flex>
            <Flex size={[0.2, 1]} itemPosition={["end", "center"]}>
              <OutlineBtn size={["s", 1]} color={{ s: 0.3, l: 0.8 }} onClick={() => { onClose(); return setOverlayDisplay(id, false); }}>
                <Icon size={M(1.5, "#", "#", 2, "#")} name="cancel"/>
              </OutlineBtn>
            </Flex>
          </Flex>
          <Flex itemPosition={itemPosition} size={[1, 0.92]} padding={[0, 2]} baseStyle={{ overflow: [false, true] }}>
            {children}
          </Flex>
        </Flex>
      </Block>
    </Overlay>
  );
};

export const IntroductionModal = ({ id = "", btnText = "", course }) => {
  const [_setting, _setSetting] = React.useState({ loading: true, title: "", content: "", onClick: () => true });
  useMethod(id, "setContent", ({ content, title, onClick }) => _setSetting({ loading: false, title, content, onClick }));

  return (
    <Modal id={id} title={_setting.title}>
      {(_setting.loading) ? (
        <Flex>
          <Spin size={0.25} color={{ s: 0.5, l: 0.5 }} />
        </Flex>
      ) : ( 
        <>
          <Flex itemPosition={["start", "start"]} size={[1, 0.8]} padding={2}>
            <Text size={M(0.9, "#", "#", 1.2, "#")} weight={1} color={{ s: 0.8, l: 0.8 }}>{_setting.content}</Text>
          </Flex>
          <Flex size={[1, 0.2]} padding={2}>
            <FillBtn size={[1, true]} color={{ h: -120, s: 0.5, l: 0.5 }} onClick={_setting.onClick} rounded>
              <Text size={M(0.9, "#", "#", 1.2, "#")} color={{ s: 1, l: 1 }}>{btnText}</Text>
            </FillBtn>
          </Flex>
        </>
      )}
    </Modal>
  );
};

export const PDFModal = ({ id = "", errorContent = "" }) => {
  const _width = () => 0.00045 * (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
  const { event } = useEventListener(false, "resize", true, true);
  const [_setting, _setSetting] = React.useState({ width: 0, title: "", src: "", numOfPages: 0 });

  React.useEffect(() => {
    _setSetting(oldSetting => ({ ...oldSetting, width: _width() }));
    return () => true;
  }, [event]);

  useMethod(id, "setPDFSrc", ({ src, title }) => {
    _setSetting({ width: _width(), src, title, numOfPages: 0 });
  });

  const _onDocumentLoadSuccess = (pdf) => _setSetting(oldSetting => ({ ...oldSetting, width: _width(), numOfPages: pdf.numPages }));
  const _onDocumentLoadError = () => (
    <Flex>
      <Text size={2} weight={2} color={{ h: -240, s: 0.5, l: 0.5 }} >{errorContent}</Text>
    </Flex>
  );

  const _onDocumentLoading = () => (
    <Flex>
      <Spin size={0.5} color={{ s: 0.5, l: 0.5 }} />
    </Flex>
  );

  return (
    <Modal id={id} title={_setting.title} itemPosition={["center", "center"]}>
      <Document
        file={_setting.src}
        loading={_onDocumentLoading}
        error={_onDocumentLoadError}
        noData={_onDocumentLoadError}
        onLoadSuccess={_onDocumentLoadSuccess}
      >
        {_setting.numOfPages === 0
          ? null
          : Array.from({ length: _setting.numOfPages }, (_, i) => (
              <Page
                key={`page_${i}`}
                pageNumber={i + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                scale={_setting.width}
              />
            ))}
      </Document>      
    </Modal>
  );
};

export const VideoModal = ({ id = "", errorContent = "" }) => {
  const _playerRef = React.useRef();
  const [_setting, _setSetting] = React.useState({ error: false, title: "", src: "" });

  useMethod(id, "setVideoSrc", ({ src, title }) => {
    _setSetting(oldSetting => ({ ...oldSetting, error: false, title, src }));
  });

  React.useEffect(() => {
    if (!_setting.error) {
      _playerRef.current.actions.toggleFullscreen = () => false;
      _playerRef.current.load();
    }
  }, [_setting]);

  const onClose = () => {
    if (!_setting.error) {
      _playerRef.current.pause();
    }
  };

  return (
    <Modal id={id} title={_setting.title} itemPosition={["center", "center"]} onClose={onClose}>
      {
        _setting.error ? (
          <Flex>
            <Text size={2} weight={2} color={{ h: -240, s: 0.5, l: 0.5 }} >{errorContent}</Text>
          </Flex>
        ) : (
          <Player
            ref={_playerRef}
            playsInline
            fluid={false}
            height={"100%"}
            width={"100%"}
            onError={() => _setSetting(oldSetting => ({ ...oldSetting, error: true }))}
          >
            <LoadingSpinner />
            <source src={_setting.src} />
          </Player>
        )
      }
    </Modal>
  );
};
