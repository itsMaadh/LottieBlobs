import type { NextPage } from 'next'
import { Color, Size, TOOLKIT_GENERATOR, Toolkit as ToolkitJS, Vector, Scene, Scalar, BezierInterpolator, CubicBezierShape } from '@lottiefiles/toolkit-js';
import { LottiePlugin } from '@lottiefiles/toolkit-plugin-lottie';
import { Player as LottiePlayer, Controls } from '@lottiefiles/react-lottie-player';
import { SvgImportOptions, SvgPlugin } from '@lottiefiles/toolkit-plugin-svg';
import { parse } from 'svg-parser';
var parseSVG = require('svg-path-parser');
import { useRef, useState } from 'react';
const RandomGenerator = require('random-points-generator');
import * as blobs2 from "blobs/v2";
export interface LottieData {
  lottie?: any;
  dom?: any;
}

const centroid = (points: [[number, number]]) => {
  if (typeof points === 'undefined') {
    return [];
  }

  let dimensions = points[0].length;
  let accumulation = points.reduce((acc, point) => {
    point.forEach((dimension, idx) => {
      acc[idx] += dimension;
    });

    return acc;
  }, Array(dimensions).fill(0));

  return accumulation.map(dimension => dimension / points.length);
}

const sortPoints = (points: any) => {
  var radianidx: any = [];

  let c = centroid(points);

  points.map((point: any, i: any) => {
    let v = [point[0] - c[0], point[1] - c[1]];
    let r = Math.atan2(v[1], v[0]);
    radianidx.push([i, r]);
  });
  radianidx.sort(function (a: any, b: any) {
    return b[1] - a[1];
  });

  return radianidx.map((idx: any) => points[idx[0]]);
};

const Home: NextPage = () => {
  const [data, setData] = useState<LottieData>({});
  const [src, setSrc] = useState<any>();
  const [src2, setSrc2] = useState<any>();
  const [svg, setSvg] = useState();
  const lottieRef: any = useRef();

  const items = ['https://assets2.lottiefiles.com/packages/lf20_dt9nmo7x.json',
    'https://assets2.lottiefiles.com/private_files/lf30_gfxmthf0.json']

  const toolkit = new ToolkitJS();

  toolkit.addPlugin(new LottiePlugin());
  // toolkit.addPlugin(new SvgPlugin());

  const generateFromSVG = async () => {


    const frames = 1;
    const frameLength = 42;
    const curves = [];

    for (let i = 0; i < frames; i++) {
      const svgString = blobs2.svg(
        {
          seed: Math.random(),
          extraPoints: 2,
          randomness: 15,
          size: 300,
        },
        {
          fill: "black", // 🚨 NOT SANITIZED 
        },
      );
      setSvg(svgString as any)
      const parsed = parse(svgString).children[0] as any;

      const d = parsed.children[0].properties.d;
      const darray = parseSVG(d);
      const curve = new CubicBezierShape()

      darray.map((p: any, j: any) => {
        if (j === 0) {
          curve.addPoint(
            new Vector(p.x, p.y),
            new Vector(p.x - darray[j + 1].x1, p.y - darray[j + 1].y1)
          )
        } else if (j === darray.length - 1) {
          curve.addPoint(new Vector(p.x, p.y))
        } else {
          curve.addPoint(
            new Vector(p.x, p.y),
            new Vector(p.x - darray[j + 1].x1, p.y - darray[j + 1].y1),
            new Vector(p.x - p.x2, p.y - p.y2),

          )

        }

      })
      curve.setIsClosed(true);
      curves.push(curve);
    }

    const scene = toolkit
      .createScene({})
      .setIs3D(false)
      .setName('myLottieAnimation')
      .setSize(new Size(300, 300));
    scene.timeline.setFrameRate(24).setStartAndEndFrame(0, frames * frameLength);

    const shapeLayer = scene
      .createShapeLayer()
      .setName('Layer 1')
      .setStartAndEndFrame(0, frames * frameLength)
      .setId('layer_1')
      .setHeight(300)
      .setWidth(300)
      .setAnchor(new Vector(0, 0))
      .setPosition(new Vector(0, 0))

    const group = shapeLayer.createGroupShape()
    const pathShape = group.createPathShape()

    curves.map((curve, i) => {
      if (i === 0) {
        pathShape.shape.setValue(curve)
      } else {
        pathShape.shape.setValueAtKeyFrame(curve, i * frameLength)
      }
    })

    // pathShape.shape.setValueAtKeyFrame(curves[0], frames * frameLength)


    group.createFillShape().setColor(new Color(136, 222, 242));

    const blob = await toolkit.export('com.lottiefiles.lottie', { scene });
    console.log(JSON.parse(blob as any))

    setSrc(blob);


    // // setSvg(svgString as any);
    // const options: SvgImportOptions = {
    //   svgString,
    //   importOptions: {
    //     parsingOptions: {
    //       dpi: 72, endFrame: 90, frameRate: 25,
    //       screenSize: new Size(1920, 1080), startFrame: 0
    //     },
    //     sceneOptions: {
    //       author: 'wikipedia',
    //       backgroundColor: '#ffffff',
    //       description: 'Tiger',
    //       keywords: [],
    //       name: 'Tiger',
    //     },
    //   },
    // };

    // let s = await toolkit.import('com.lottiefiles.svg', options);
    // console.log(s)
  }

  /*  generate random blob  */
  const generateBlob = async (sorted: boolean) => {


    const vertices = 5;
    const frames = 6;
    const frameLength = 42;
    const curves = [];

    for (let i = 0; i < frames; i++) {
      const generatedGeometry = RandomGenerator.random(vertices, { bbox: [-500, -500, 500, 500] });
      let points = generatedGeometry.features.map((p: any) => { return p.geometry.coordinates });
      points = sorted ? sortPoints(points) : points;
      const curve = new CubicBezierShape()
      points.map((p: any) => {
        curve.addPoint(
          new Vector(p[0], p[1]),
          // new Vector(p[0] / 2, p[1] / 3),
          // new Vector(p[0] / 3, p[1] / 2)
        )
      })
      curve.setIsClosed(true);
      curves.push(curve);
    }

    const scene = toolkit
      .createScene({})
      .setIs3D(false)
      .setName('myLottieAnimation')
      .setSize(new Size(1080, 1080));
    scene.timeline.setFrameRate(24).setStartAndEndFrame(0, frames * frameLength);

    const shapeLayer = scene
      .createShapeLayer()
      .setName('Layer 1')
      .setStartAndEndFrame(0, frames * frameLength)
      .setId('layer_1')
      .setHeight(1080)
      .setWidth(1080)
      .setAnchor(new Vector(49.816, 11.816))
      .setPosition(new Vector(543, 523))

    const group = shapeLayer.createGroupShape()
    const pathShape = group.createPathShape()

    curves.map((curve, i) => {
      if (i === 0) {
        pathShape.shape.setValue(curve)
      } else {
        pathShape.shape.setValueAtKeyFrame(curve, i * frameLength)
      }
    })

    pathShape.shape.setValueAtKeyFrame(curves[0], frames * frameLength)


    group.createFillShape().setColor(new Color(136, 222, 242));

    const blob = await toolkit.export('com.lottiefiles.lottie', { scene });
    console.log(JSON.parse(blob as any))

    setSrc(blob);

  }

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
  }

  const checkBlob = async () => {
    console.log(data.lottie.animationData)
  }

  return (
    <div className="text-center">
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }}></div>}
      <p className="mt-4 text-sm text-gray-500">Some random shit</p>
      <div className="mt-6">
        <button
          onClick={() => generateBlob(false)}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate unsorted blob
        </button>
        <button
          onClick={() => generateBlob(true)}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate sorted blob
        </button>
        <button
          onClick={() => generateFromSVG()}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate from SVG
        </button>
      </div>
      <div style={{ width: '500px', margin: 'auto' }}>
        <LottiePlayer
          renderer="svg"
          style={{ height: "500px" }}
          src={src} loop autoplay controls >
          <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
        </LottiePlayer>
      </div>
      <div className="mt-6">
        <button
          onClick={() => saveBlob()}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download lottie
        </button>
      </div>
    </div>
  )
}

export default Home
