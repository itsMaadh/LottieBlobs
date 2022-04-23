import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
  Color,
  Size,
  Toolkit as ToolkitJS,
  Vector,
  CubicBezierShape,
} from "@lottiefiles/toolkit-js";
import { LottiePlugin } from "@lottiefiles/toolkit-plugin-lottie";
import {
  Player as LottiePlayer,
  Controls,
} from "@lottiefiles/react-lottie-player";
import * as blobs2 from "blobs/v2";
import { Slider } from "../components/Slider";
import Image from "next/image";
import { ThreePoint } from "../components/svgs/three-point";
import { FivePoint } from "../components/svgs/five-point";
import { Circle } from "../components/svgs/circle";
import { Ellipse } from "../components/svgs/ellipse";
import { ColorResult, HuePicker } from "react-color";

let load = require("load-svg");
let parse = require("parse-svg-path");
let extract = require("extract-svg-path").parse;

const Home: NextPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [points, setPoints] = useState(0);
  const [randomness, setRandomness] = useState(0);
  const [src, setSrc] = useState<any>();
  const [color, setColor] = useState<{ r: number; b: number; g: number }>({
    r: 25,
    b: 215,
    g: 217,
  });
  const [randomSvg, setRandomSvg] = useState<any>();

  const changeHandler = (event: any) => {
    let fileURLs: any = [];
    for (let index = 0; index < event.target.files.length; index++) {
      fileURLs.push(URL.createObjectURL(event.target.files[index]));
    }
    setSelectedFiles(fileURLs);
  };

  const handleSubmission = async () => {
    if (selectedFiles && selectedFiles.length) {
      let svgPaths = await Promise.all(
        selectedFiles.map(async (selectedFile: any) => {
          return await getSVGPathInfo(selectedFile);
        })
      );
      let bezierCurves = await Promise.all(
        svgPaths.map(async (pathArray) => {
          return await getBezierCurve(pathArray);
        })
      );
      await generateBlobFromSVG(bezierCurves);
    }
  };

  const getSVGPathInfo = async (file: any) => {
    return new Promise((resolve, reject) => {
      load(file, (err: any, svg: any) => {
        if (err) {
          reject(null);
        } else {
          setRandomSvg(extract(svg));
          resolve(parse(extract(svg)));
        }
      });
    });
  };

  const getBezierCurve = async (paths: any) => {
    let points = [];
    let point = [];
    let cubic = new CubicBezierShape();
    for (let i = 0; i < paths.length - 1; i++) {
      if (points.length == 0) {
        if (paths[i][0] == "M") {
          point.push([paths[0][1], paths[0][2]]);
        }

        if (paths[i][0] == "C") {
          point.push([
            paths[paths.length - 2][3] - paths[0][1],
            paths[paths.length - 2][4] - paths[0][2],
          ]);
          point.push([paths[i][1] - paths[0][1], paths[i][2] - paths[0][2]]);
          points.push(point);
        }
      } else if (paths[i][0] == "C") {
        point = [];
        point.push([paths[i - 1][5], paths[i - 1][6]]);
        point.push([
          paths[i - 1][3] - paths[i - 1][5],
          paths[i - 1][4] - paths[i - 1][6],
        ]);
        point.push([
          paths[i][1] - paths[i - 1][5],
          paths[i][2] - paths[i - 1][6],
        ]);
        points.push(point);
      }
    }
    for (let x = 0; x < points.length; x++) {
      cubic.addPoint(
        new Vector(points[x][0][0], points[x][0][1]),
        new Vector(points[x][1][0], points[x][1][1]),
        new Vector(points[x][2][0], points[x][2][1])
      );
    }
    cubic.setIsClosed(true);
    return cubic;
  };

  const generateBlobFromSVG = async (curves: any) => {
    const toolkit = new ToolkitJS();
    const lottiePlugin = new LottiePlugin();

    toolkit.addPlugin(lottiePlugin);

    const frameLength = 42;
    const frames = 6;
    const scene = toolkit
      .createScene({})
      .setIs3D(false)
      .setName("myLottieAnimation")
      .setSize(new Size(1080, 1080));
    scene.timeline
      .setFrameRate(24)
      .setStartAndEndFrame(0, frames * frameLength);

    const shapeLayer = scene
      .createShapeLayer()
      .setName("Layer 1")
      .setStartAndEndFrame(0, frames * frameLength)
      .setId("layer_1")
      .setHeight(1080)
      .setWidth(1080)
      // .setAnchor(new Vector(49.816, 11.816))
      .setPosition(new Vector(540, 540));

    const group = shapeLayer.createGroupShape();
    const pathShape = group.createPathShape();

    curves.map((curve: any, i: any) => {
      if (i === 0) {
        pathShape.shape.setValue(curve);
      } else {
        pathShape.shape.setValueAtKeyFrame(curve, i * frameLength);
      }
    });

    pathShape.shape.setValueAtKeyFrame(curves[0], frames * frameLength);

    const fill = group.createFillShape();

    fill.setColor(new Color(color.r, color.g, color.b));

    // fill.color.setValueAtKeyFrame(Color.from('red'), 50);
    // fill.color.setValueAtKeyFrame(Color.from('grey'), 100);
    // fill.color.setValueAtKeyFrame(Color.from('green'), 150);

    const blob = await toolkit.export("com.lottiefiles.lottie", { scene });

    setSrc(blob);
  };

  const generateRandomBlobs = async () => {
    const randomSVGs = [];

    for (let i = 0; i < 6; i++) {
      const svgString = blobs2.svg(
        { seed: Math.random(), extraPoints: points, randomness, size: 500 },
        { fill: "black" }
      );
      randomSVGs.push(svgString);
    }
    setRandomSvg(randomSVGs[0] as any);

    let svgPaths = await Promise.all(
      randomSVGs.map(async (randomSVG: any) => {
        return parse(extract(randomSVG));
      })
    );

    let bezierCurves = await Promise.all(
      svgPaths.map(async (pathArray) => {
        return await getBezierCurve(pathArray);
      })
    );
    await generateBlobFromSVG(bezierCurves);
  };

  const saveBlob = async () => {
    const fileName = `random-bLottie.json`;
    const json = src;
    const blob = new Blob([json], { type: `application/ json` });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement(`a`);
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    generateRandomBlobs();
  }, [points, randomness, color]);

  return (
    <div className="container mx-auto max-h-screen md:px-2 md:pb-4">
      <div className="my-5">
        <Image
          src="/images/lottie-blobs.png"
          width={180}
          height={50}
          alt="LottieBlobs Logo"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        <div className="md:col-span-2 border-2 border-dashed border-gray-400 rounded-xl px-36 bg-gray-100">
          <LottiePlayer
            renderer="svg"
            style={{ height: "500px" }}
            src={src}
            loop
            autoplay
            controls
          >
            <Controls
              visible={true}
              buttons={["play", "repeat", "frame", "debug"]}
            />
          </LottiePlayer>
        </div>
        <div className="grid grid-rows-4 gap-6 h-full items-center">
          <div className="py-4 shadow-2xl rounded-xl px-5">
            <p className="font-bold text-gray-400 uppercase pb-3">
              Change Color
            </p>
            <div className="pb-3">
              <HuePicker
                color={color}
                onChangeComplete={(result: ColorResult) => setColor(result.rgb)}
                width={"100%"}
              />
            </div>
          </div>

          <div className="py-4 shadow-2xl rounded-xl px-5">
            <p className="font-bold text-gray-400 uppercase pb-3">Edges</p>
            <div className="flex">
              <ThreePoint className="h-8 w-8 mr-2" />
              <Slider
                min={0}
                max={10}
                value={points}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPoints(+event.target.value)
                }
              />
              <FivePoint className="h-8 w-8 ml-2" />
            </div>
          </div>

          <div className="py-4 shadow-2xl rounded-xl px-5">
            <p className="font-bold text-gray-400 uppercase pb-3">Curves</p>
            <div className="flex">
              <Circle className="h-8 w-8 mr-2" />
              <Slider
                min={10}
                max={30}
                value={randomness}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setRandomness(+event.target.value)
                }
              />
              <Ellipse className="h-8 w-8 ml-2" />
            </div>
          </div>

          <button
            onClick={() => saveBlob()}
            type="button"
            className="bg-teal-500 py-4 text-white font-bold tracking-wide rounded-md"
          >
            Download Lottie
          </button>
        </div>
      </div>

      <div className="text-center">
        {/* {randomSvg && <div dangerouslySetInnerHTML={{ __html: randomSvg }}></div>} */}

        {/*<div className="mt-6">*/}
        {/*  <input type="file" multiple onChange={changeHandler} />*/}

        {/*  <button*/}
        {/*    onClick={() => handleSubmission()}*/}
        {/*    type="button"*/}
        {/*    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"*/}
        {/*  >*/}
        {/*    Submit files*/}
        {/*  </button>*/}
        {/*  <br />*/}
        {/*  <br />*/}
        {/*  <button*/}
        {/*    onClick={() => generateRandomBlobs()}*/}
        {/*    type="button"*/}
        {/*    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"*/}
        {/*  >*/}
        {/*    Generate random*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Home;
