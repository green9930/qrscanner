import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Main = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [url, setUrl] = useState("");
  const [options, setOptions] = useState<any[]>([]);

  const cofig = {
    fps: 10, // Optional, frame per seconds for qr code scanning
    qrbox: { width: 200, height: 200 }, // Optional, if you want bounded box UI
    videoConstraints: { facingMode: { exact: "environment" } }, // 후면 카메라 설정
  };

  let cameraId: string;
  let qrCodeReader: Html5Qrcode;

  const startScanning = async (cameraId: string) => {
    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      setUrl(decodedText);
      setIsShowPopup(true);
    };
    await qrCodeReader.start(cameraId, cofig, onScanSuccess, () => {});
  };

  useEffect(() => {
    if (isScanning) {
      console.log("IS SCANNING");
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            setOptions(devices);
            qrCodeReader = new Html5Qrcode("reader", true);
            startScanning(devices[0].id);
          }
        })
        .catch((err) => {});
    }
  }, [isScanning]);

  return (
    <StQrScanner isScanning={isScanning}>
      <h1>QR SCANNER</h1>
      <button onClick={() => setIsScanning(!isScanning)}>
        {isScanning ? "STOP" : "START"} SCANNING
      </button>
      {isScanning ? (
        <>
          <div id="qrString"></div>
          <StReader id="reader"></StReader>
          {isShowPopup ? (
            <StPopUp>
              <a href={url} target="_blank" rel="noreferrer">
                <span>Go to {url}</span>
              </a>
            </StPopUp>
          ) : null}
        </>
      ) : null}
    </StQrScanner>
  );
};

export default Main;

const StQrScanner = styled.div<{ isScanning: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    color: #272727;
    font-size: 2rem;
  }

  button {
    width: 12rem;
    height: auto;
    border: ${({ isScanning }) =>
      isScanning ? "2px solid #b60000" : "2px solid #007acc"};
    border-radius: 0.4rem;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 700;
    background-color: transparent;
    color: #272727;
    margin-bottom: 2rem;
  }
`;

const StReader = styled.div`
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 0.4rem;

  #qr-shaded-region {
    border-width: 50px !important; // qr scanner content width
  }
`;

const StPopUp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 16%;
  padding: 1.2rem;
  background-color: #ffffff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.4rem;
  box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, 0.4);

  a {
    text-decoration: none;
    color: #009b10;
    font-size: 1.2rem;
    font-weight: 500;
  }
`;
