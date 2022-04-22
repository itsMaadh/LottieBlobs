import type { NextPage } from 'next'
import Head from 'next/head';
import { PlusIcon } from '@heroicons/react/solid'
import { Color, Size, TOOLKIT_GENERATOR, Toolkit as ToolkitJS, Vector, Scene, Scalar, BezierInterpolator, CubicBezierShape } from '@lottiefiles/toolkit-js';
import { LottiePlugin } from '@lottiefiles/toolkit-plugin-lottie';
import { Player as LottiePlayer, Controls } from '@lottiefiles/react-lottie-player';
import { useRef, useState, useEffect } from 'react';
import { verify } from 'crypto';
import Image from 'next/image';

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
  const [visible, setVisible] = useState<any>(true);
  const [selected, setSelected] = useState<any>([]);
  const [combined, setCombined] = useState<any>([]);
  const lottieRef: any = useRef();
  const blob1 = [ '/blob1/blob1.svg', '/blob1/blob2.svg', '/blob1/blob3.svg', '/blob1/blob4.svg', '/blob1/blob5.svg',
  '/blob2/blob1.svg', '/blob2/blob2.svg', '/blob2/blob3.svg', '/blob2/blob4.svg', '/blob2/blob5.svg' ]
  const items = ['https://assets2.lottiefiles.com/packages/lf20_dt9nmo7x.json',
    'https://assets2.lottiefiles.com/private_files/lf30_gfxmthf0.json']

  const toolkit = new ToolkitJS();
  const lottiePlugin = new LottiePlugin();

  toolkit.addPlugin(lottiePlugin);

  useEffect(() => { // this hook will get called everytime when myArr has changed
    // perform some action which will get fired everytime when myArr gets updated

       if(selected.length == 5) {
        selected.map(svg => {
            extractPath(blob1[svg])
        })

        if(combined.length == 5) {
            generateBlobFromSVG();
        }
        
    }
    }, [selected, combined])


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

  const generateBlobFromSVG = async () => {
        //generateBlob
        const frameLength = 42;
        const frames = 6;
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

        combined.map((combine, i) => {
            if (i === 0) {
              pathShape.shape.setValue(combine)
            } else {
              pathShape.shape.setValueAtKeyFrame(combine, i * frameLength)
            }
          })  

        pathShape.shape.setValueAtKeyFrame(combined[0], frames * frameLength)

        // pathShape.shape
        // .setValue(cubicGenerated)

        const fill = group.createFillShape();

        fill.setColor(new Color(136, 222, 242));

        // fill.color.setValueAtKeyFrame(Color.from('red'), 50);
        // fill.color.setValueAtKeyFrame(Color.from('grey'), 100);
        // fill.color.setValueAtKeyFrame(Color.from('green'), 150);

        const blob = await toolkit.export('com.lottiefiles.lottie', { scene });
        console.log(JSON.parse(blob as any))

        setSrc(blob);

        setVisible(true);
  }

  const extractPath = (chosen) => {
    let path = 'svg' + chosen;
    let parse = require('parse-svg-path')
    let extract = require('extract-svg-path').parse
    let load = require('load-svg')
    let paths = null;
    let points = [];
    let point = [];
    let cubic = new CubicBezierShape()

    load(path, function(err: string, svg: string) {
        paths = parse(extract(svg))

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

        setCombined(combined => [...combined, cubic]);        
    })


  
  }

  const selectedSVG = (index:number) => {
    if(selected.length > 5) {
        setSelected([]);
        setCombined([]);
    } else {
        setSelected(selected => [...selected, index])
    }
      
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
          onClick={() => {setVisible(false);}}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate blob from SVG
        </button>
      </div>

      {!visible && (
           <div style={{ width: '500px', margin: 'auto' }}>
               <p className="my-5">Please select a few SVGs from below (maximum of 5)</p>
               

                 <div className="flex flex-wrap">
                     {blob1.map((blob:string, index:number) => (
                        <div onClick={() => selectedSVG(index)} key={index} className="m-3 border"><Image src={'/svg/' + blob} width={200} height={200} alt='svg' /></div>

                     ))}

                    
                 </div>
            </div>

         

      )}

        {visible && (
            <div style={{ width: '500px', margin: 'auto' }}>
        <LottiePlayer
          renderer="svg"
          style={{ height: "500px" }}
          src={src} loop autoplay controls >
          <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
        </LottiePlayer>
      </div>)}
      
      {visible && (
      <div className="mt-6">
        <button
          onClick={() => saveBlob()}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download lottie
        </button>
      </div>)}
    </div>
  )
}


export default Home
