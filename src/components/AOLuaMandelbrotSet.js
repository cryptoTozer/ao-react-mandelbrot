import React, { useEffect, useRef, useState } from "react";
import { dryrun } from "@permaweb/aoconnect";
import { processID } from "../utils/constants";
import { Link } from "react-router-dom";
import { createDataItemSigner, message } from "@permaweb/aoconnect";
import { ArweaveWebWallet } from "arweave-wallet-connector";

const MandelbrotSet = () => {
  const canvasRef = useRef(null);
  const [data, setData] = useState([]);

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [wallet, setWallet] = useState(null);

  const [maxIterations, setMaxIterations] = useState(100);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const handleConnectWallet = async () => {
    try {
      const arweaveWallet = new ArweaveWebWallet();
      arweaveWallet.setUrl("arweave.app");

      await arweaveWallet.connect();

      if (!arweaveWallet.connected) {
        throw new Error("Arweave wallet not connected");
      }

      setWallet(arweaveWallet);
      setIsWalletConnected(true);

      console.log("CONNECTED.");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(error.message);
    }
  };

  const handleCalculateMandelbrotSet = async () => {
    try {
      if (!wallet) {
        throw new Error("Wallet not connected");
      }

      const signer = createDataItemSigner(wallet);

      const res = await message({
        process: processID,
        signer,
        tags: [
          {
            name: "Action",
            value: "CalculateMandelbrotSet",
          },
          {
            name: "MaxIterationsPerPoint",
            value: String(maxIterations),
          },
          {
            name: "Width",
            value: String(width),
          },
          {
            name: "Height",
            value: String(height),
          },
        ],
      });

      console.log("Message sent to AO");
      console.log("RESULT: ", { res });
    } catch (error) {
      console.error("Error sending message to AO:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dryRunResult = await dryrun({
          process: processID,
          data: "",
          tags: [{ name: "Action", value: "GetLatestMandelbrotSet" }],
        });

        const latestMandelbrotData = JSON.parse(dryRunResult.Messages[0].Data);
        setData(latestMandelbrotData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 100;

    if (data && data.length > 0) {
      const pixelSize = Math.min(
        window.innerWidth / Math.sqrt(data.length),
        (window.innerHeight - 100) / Math.sqrt(data.length)
      );

      for (let i = 0; i < data.length; i++) {
        const { x, y, isMandelbrotSet, m } = data[i];
        ctx.fillStyle = isMandelbrotSet
          ? "#000"
          : `hsl(${(m / 50) * 360}, 100%, 50%)`;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  };

  useEffect(() => {
    draw();
  }, [data]);

  return (
    <div className="flex items-center">
      <header className="p-6 bg-white shadow-lg flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold mb-4">Mandelbrot Set</h1>
        <nav>
          <ul className="flex space-x-4 mb-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              AO Version
            </Link>
            <li>
              <Link to="/js" className="text-blue-500 hover:text-blue-700">
                JS In-Browser
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col items-center space-y-4">
          {isWalletConnected ? (
            <>
              <div className="flex items-center space-x-2">
                <label htmlFor="maxIterations" className="font-bold">
                  Max Iterations:
                </label>
                <input
                  id="maxIterations"
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="width" className="font-bold">
                  Width:
                </label>
                <input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="height" className="font-bold">
                  Height:
                </label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <button
                onClick={handleCalculateMandelbrotSet}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Calculate Mandelbrot Set
              </button>
            </>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>
      <div className="mt-8 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="w-screen"
          style={{ height: "calc(100vh - 100px)" }}
        />
      </div>
    </div>
  );
};

export default MandelbrotSet;
