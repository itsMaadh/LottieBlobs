import type { NextPage } from 'next'
import Head from 'next/head';
import { PlusIcon } from '@heroicons/react/solid'
import { Color, Size, TOOLKIT_GENERATOR, Toolkit as ToolkitJS, Vector, Scene, Scalar, BezierInterpolator, CubicBezierShape } from '@lottiefiles/toolkit-js';
import { LottiePlugin } from '@lottiefiles/toolkit-plugin-lottie';
import { Player as LottiePlayer, Controls } from '@lottiefiles/react-lottie-player';
import { useRef, useState } from 'react';
import { verify } from 'crypto';
const RandomGenerator = require('random-points-generator');


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
  const lottieRef: any = useRef();

  const items = ['https://assets2.lottiefiles.com/packages/lf20_dt9nmo7x.json',
    'https://assets2.lottiefiles.com/private_files/lf30_gfxmthf0.json']

  const toolkit = new ToolkitJS();
  const lottiePlugin = new LottiePlugin();

  toolkit.addPlugin(lottiePlugin);

  /*  generate random blob  */
  const generateBlob = async (sorted: boolean) => {

    const vertices = 8;
    const frames = 6;
    const frameLength = 42;
    const curves = [];

    for (let i = 0; i < frames; i++) {
      const generatedGeometry = RandomGenerator.random(vertices, { bbox: [-500, -500, 500, 500] });
      let points = generatedGeometry.features.map((p: any) => { return p.geometry.coordinates });
      points = sorted ? sortPoints(points) : points;
      const curve = new CubicBezierShape()
      points.map((p: any) => {
        curve.addPoint(new Vector(p[0], p[1]))
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


    // pathShape.shape
    //   .setValue(bc1)
    //   .setValueAtKeyFrame(bc2, 42)
    //   .setValueAtKeyFrame(bc3, 89)
    //   .setValueAtKeyFrame(bc4, 138)
    //   .setValueAtKeyFrame(bc4, 184)
    //   .setValueAtKeyFrame(bc5, 184.14453125)

    const fill = group.createFillShape();

    fill.setColor(new Color(136, 222, 242));

    fill.color.setValueAtKeyFrame(Color.from('red'), 50);
    fill.color.setValueAtKeyFrame(Color.from('grey'), 100);
    fill.color.setValueAtKeyFrame(Color.from('green'), 150);
    

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

  const generateBlobFromSVG = async (cubicGenerated) => {
        //generateBlob
        const scene = toolkit
        .createScene({})
        .setIs3D(false)
        .setName('myLottieAnimation')
        .setSize(new Size(1080, 1080));
        scene.timeline.setFrameRate(24).setStartAndEndFrame(0, 184);

        const shapeLayer = scene
        .createShapeLayer()
        .setName('Layer 1')
        .setStartAndEndFrame(0, 184)
        .setId('layer_1')
        .setHeight(1080)
        .setWidth(1080)
        .setAnchor(new Vector(49.816, 11.816))
        .setPosition(new Vector(543, 523))

        const group = shapeLayer.createGroupShape()
        const pathShape = group.createPathShape()

        pathShape.shape
        .setValue(cubicGenerated)

        const fill = group.createFillShape();

        fill.setColor(new Color(136, 222, 242));

        fill.color.setValueAtKeyFrame(Color.from('red'), 50);
        fill.color.setValueAtKeyFrame(Color.from('grey'), 100);
        fill.color.setValueAtKeyFrame(Color.from('green'), 150);

        const blob = await toolkit.export('com.lottiefiles.lottie', { scene });
        console.log(JSON.parse(blob as any))

        setSrc(blob);
  }

  const extractPath = () => {
    let path = 'svg/blob1/blob.svg';
    let parse = require('parse-svg-path')
    let extract = require('extract-svg-path').parse
    let load = require('load-svg')
    let paths = null;
    let points = [];
    let point = [];
    let cubic = new CubicBezierShape()

    load(path, function(err: string, svg: string) {
        paths = parse(extract(svg))

        console.log('paths',paths)

        for(let i = 0; i < paths.length - 1; i++) {
            if(points.length == 0) {
                if(paths[i][0] == 'M') {
                    point.push([paths[0][1], paths[0][2]])
                }

                if(paths[i][0] == 'C') {
                    point.push([paths[paths.length-2][3] - paths[0][1], paths[paths.length-2][4] - paths[0][2]])
                    point.push([paths[i][1] - paths[0][1], paths[i][2] - paths[0][2]])
                    points.push(point)
                }

            }

            else if(paths[i][0] == 'C') {


                point = [];
                point.push([paths[i-1][5], paths[i-1][6]])
                point.push([paths[i-1][3] - paths[i-1][5], paths[i-1][4] - paths[i-1][6]])
                point.push([paths[i][1] - paths[i-1][5], paths[i][2] - paths[i-1][6]])
                points.push(point)
            }
        }

        for(let x = 0; x < points.length; x++) {
            cubic.addPoint(new Vector(points[x][0][0], points[x][0][1]), new Vector(points[x][1][0], points[x][1][1]), new Vector(points[x][2][0], points[x][2][1]))
        }
        cubic.setIsClosed(true)

        generateBlobFromSVG(cubic);
        
        
    })


  
  }

  return (
    <div className="text-center">
      <p className="mt-4 text-sm text-gray-500">Some random shit</p>
      <div className="mt-6">
        <button
          onClick={() => generateBlob(false)}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate unsorted blob
        </button><button
          onClick={() => generateBlob(true)}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate sorted blob
        </button><button
          onClick={() => extractPath()}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate blob from SVG
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



const extractSVGPath = () => {
    var parse = require('parse-svg-path')
    var extract = require('extract-svg-path').parse
    var load = require('load-svg')

    load('svg/bc1.svg', function(err, svg) {
        var paths = parse(extract(svg))
        console.log(paths)
    })

}

export default Home
