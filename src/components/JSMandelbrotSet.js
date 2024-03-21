import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const REAL_SET = { start: -2, end: 1 };
const IMAGINARY_SET = { start: -1, end: 1 };

const colors = new Array(16)
  .fill(0)
  .map((_, i) =>
    i === 0 ? "#000" : `#${(((1 << 24) * Math.random()) | 0).toString(16)}`
  );

// function mandelbrot(c, maxIteration, width, height) {
//   let z = { x: 0, y: 0 },
//     n = 0,
//     p,
//     d;
//   do {
//     p = {
//       x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
//       y: 2 * z.x * z.y,
//     };
//     z = {
//       x: p.x + c.x,
//       y: p.y + c.y,
//     };
//     d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2));
//     n += 1;
//   } while (d <= 2 && n < maxIteration);
//   return [n, d <= 2];
// }

// function mandelbrot(maxIterationsPerPoint, width, height) {
//   const REAL_SET = { start: -2, end: 1 };
//   const IMAGINARY_SET = { start: -1, end: 1 };

//   const output = [];

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const c_re = REAL_SET.start + (x / width) * (REAL_SET.end - REAL_SET.start);
//       const c_im = IMAGINARY_SET.start + (y / height) * (IMAGINARY_SET.end - IMAGINARY_SET.start);

//       let z_re = 0;
//       let z_im = 0;
//       let m = 0;
//       let isMandelbrotSet = true;

//       while (m < maxIterationsPerPoint) {
//         const z_re_sq = z_re * z_re;
//         const z_im_sq = z_im * z_im;

//         if (z_re_sq + z_im_sq > 4) {
//           isMandelbrotSet = false;
//           break;
//         }

//         z_im = 2 * z_re * z_im + c_im;
//         z_re = z_re_sq - z_im_sq + c_re;

//         m++;
//       }

//       output.push({ x, y, m, isMandelbrotSet });
//     }
//   }

//   return output;
// }

function mandelbrot(maxIterationsPerPoint, width, height) {
  const REAL_SET = { start: -2, end: 1 };
  const IMAGINARY_SET = { start: -1, end: 1 };

  const output = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const c_re =
        REAL_SET.start + (x / width) * (REAL_SET.end - REAL_SET.start);
      const c_im =
        IMAGINARY_SET.start +
        (y / height) * (IMAGINARY_SET.end - IMAGINARY_SET.start);

      let z_re = 0;
      let z_im = 0;
      let m = 0;
      let isMandelbrotSet = true;

      while (m < maxIterationsPerPoint) {
        const z_re_sq = z_re * z_re;
        const z_im_sq = z_im * z_im;

        if (z_re_sq + z_im_sq > 4) {
          isMandelbrotSet = false;
          break;
        }

        z_im = 2 * z_re * z_im + c_im;
        z_re = z_re_sq - z_im_sq + c_re;

        m++;
      }

      output.push({ x, y, isMandelbrotSet, m });
    }
  }

  return output;
}

const MandelbrotSet = () => {
  const canvasRef = useRef(null);

  const [maxIterations, setMaxIterations] = useState(20);
  const [width, setWidth] = useState(1500);
  const [height, setHeight] = useState(100);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    const output = mandelbrot(maxIterations, width, height);

    for (let i = 0; i < output.length; i++) {
      const { x, y, isMandelbrotSet, m } = output[i];
      ctx.fillStyle = colors[isMandelbrotSet ? 0 : (m % colors.length) - 1 + 1];
      ctx.fillRect(x, y, 1, 1);
    }
  };

  useEffect(() => {
    draw();
  }, [maxIterations, width, height]);

  return (
    <div className="flex">
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
            onClick={draw}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Calculate Mandelbrot Set
          </button>
        </div>
      </header>
      <div className="flex-1">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default MandelbrotSet;
