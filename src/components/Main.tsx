import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Main = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [url, setUrl] = useState("");
  const [options, setOptions] = useState<any[]>([]);

  const cofig = {
    fps: 10, // Optional, frame per seconds for qr code scanning
    qrbox: { width: 200, height: 200 }, // Optional, if you want bounded box UI
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

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    cameraId = e.target.value;
    console.log(cameraId);
    await qrCodeReader?.stop();
    await Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          qrCodeReader = new Html5Qrcode("reader", true);
          startScanning(cameraId);
        }
      })
      .catch((err) => {});
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
    <StQrScanner>
      <h1>QR SCANNER</h1>
      <button onClick={() => setIsScanning(true)}>START SCANNING</button>
      <button onClick={() => setIsScanning(false)}>STOP SCANNING</button>
      {isShowPopup ? <a href={url}>{url}</a> : null}
      {isScanning ? (
        <>
          <div id="qrString"></div>
          <StReader id="reader"></StReader>
          <select onChange={onChange} id="cameras">
            {options.map((device) => {
              return <option value={device.id}>{device.label}</option>;
            })}
          </select>
        </>
      ) : null}
    </StQrScanner>
  );
};

export default Main;

const StQrScanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    /* color: #ff0000; */
  }
`;

const StReader = styled.div`
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 15px;

  #qr-shaded-region {
    border-width: 50px !important; // qr scanner content width
  }
`;
