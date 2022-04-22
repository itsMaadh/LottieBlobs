import type { NextPage } from 'next'
import Head from 'next/head';

import { Color, Size, TOOLKIT_GENERATOR, Toolkit as ToolkitJS, Vector, Scene, Scalar, BezierInterpolator, CubicBezierShape } from '@lottiefiles/toolkit-js';
import { LottiePlugin } from '@lottiefiles/toolkit-plugin-lottie';
import { Player as LottiePlayer, Controls } from '@lottiefiles/react-lottie-player';
import { useRef, useState } from 'react';
import { verify } from 'crypto';


export interface LottieData {
  lottie?: any;
  dom?: any;
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  }; 
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

  const generateBlob = async (generatedBlob) => {
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

    // const bc1 = new CubicBezierShape()
    // bc1.addPoint(new Vector(-42, -403.816), new Vector(-149.015, 0), new Vector(149.016, 0))
    // bc1.addPoint(new Vector(287.085, -134.236), new Vector(107.659, -103.03), new Vector(-165.076, 157.979))
    // bc1.addPoint(new Vector(16, 423.816), new Vector(277.36, -41.631), new Vector(-217.779, 32.688))
    // bc1.addPoint(new Vector(-384.256, 61.009), new Vector(49.73, 183.334), new Vector(-39.011, -143.818))
    // bc1.setIsClosed(true)

    // const bc2 = new CubicBezierShape()
    // bc2.addPoint(new Vector(-42, -403.816), new Vector(-240, 17.816), new Vector(148.607, -11.032))
    // bc2.addPoint(new Vector(401.817, -64), new Vector(-31.817, -180), new Vector(33.197, 187.812))
    // bc2.addPoint(new Vector(16, 423.816), new Vector(412, -25.816), new Vector(-219.788, 13.772))
    // bc2.addPoint(new Vector(-385.816, -18), new Vector(-14.184, 212), new Vector(20.393, -304.813))
    // bc2.setIsClosed(true)

    // const bc3 = new CubicBezierShape()
    // bc3.addPoint(new Vector(-10.411, -382.598), new Vector(-207.589, 8.598), new Vector(236.411, -21.402))
    // bc3.addPoint(new Vector(376.166, 70.53), new Vector(9.885, -185.411), new Vector(-28.058, 152.88))
    // bc3.addPoint(new Vector(-33.362, 406.598), new Vector(224.397, 3.796), new Vector(-219.945, -3.75))
    // bc3.addPoint(new Vector(-286.037, 72.778), new Vector(224.397, 3.796), new Vector(-165.963, -254.778))
    // bc3.setIsClosed(true)

    // const bc4 = new CubicBezierShape()
    // bc4.addPoint(new Vector(-82, -333.816), new Vector(-230, -34.184), new Vector(234, 25.816),)
    // bc4.addPoint(new Vector(410.997, -75.18), new Vector(-48.997, -234.82), new Vector(14.135, 180.256))
    // bc4.addPoint(new Vector(10, 353.816), new Vector(283.676, 1.562), new Vector(-219.903, 1.011),)
    // bc4.addPoint(new Vector(-353.652, 38.656), new Vector(35.652, 241.344), new Vector(-54.348, -378.656))
    // bc4.setIsClosed(true)

    // const bc5 = new CubicBezierShape()
    // bc5.addPoint(new Vector(-42, -403.816), new Vector(-149.015, 0), new Vector(149.016, 0))
    // bc5.addPoint(new Vector(287.085, -134.236), new Vector(107.659, -103.03), new Vector(-165.076, 157.979))
    // bc5.addPoint(new Vector(16, 423.816), new Vector(277.36, -41.631), new Vector(-217.779, 32.688))
    // bc5.addPoint(new Vector(-384.256, 61.009), new Vector(49.73, 183.334), new Vector(-39.011, -143.818))
    // bc5.setIsClosed(true)

    // const bc6 = new CubicBezierShape()
    // bc6.addPoint(new Vector(-42, -403.816), new Vector(-149.015, 0), new Vector(149.016, 0))
    // bc6.addPoint(new Vector(381.817, -44), new Vector(84.908, -122.459), new Vector(-81.817, 118))
    // bc6.addPoint(new Vector(16, 423.816), new Vector(148.868, 6.6422), new Vector(-220, -9.816))
    // bc6.addPoint(new Vector(-381.816, -2), new Vector(129.816, 152), new Vector(-96.776, -113.314))
    // bc6.setIsClosed(true)
   
    // const mf = new CubicBezierShape()
    // mf.addPoint(new Vector(-237.2010955810547, -413.6590270996094))
    // mf.addPoint(new Vector(-379.8522644042969, 271.1139831542969), new Vector(-149.015, 0), new Vector(149.016, 0))
    // mf.addPoint(new Vector(-63.72419738769531, -50.827999114990234),new Vector(-149.015, 0), new Vector(149.016, 0))
    // mf.addPoint(new Vector(153.8957061767578, -343.1533508300781),  new Vector(-149.015, 0), new Vector(149.016, 0) )
    // mf.addPoint(new Vector(-237.2010955810547, -413.6590270996094), new Vector(-149.015, 0), new Vector(149.016, 0) )
    // mf.setIsClosed(true)

    // //blob1
    // const blob1a = new CubicBezierShape()
    // .setVertices([new Vector(64.5, -35.9), new Vector(-4.9, 68.5), new Vector(-56.5, -31.6), new Vector(8.7, -61.8),  new Vector(52.3, -35.1)])
    // .setInTangents([new Vector(0, 0), new Vector(0, 100), new Vector(100, 100), new Vector(100, 0), new Vector(100, 0)])
    // .setOutTangents([new Vector(0, 0), new Vector(0, 100), new Vector(100, 100), new Vector(100, 0), new Vector(100, 0)]);
    // blob1a.setIsClosed(true)


    const pathShape = group.createPathShape()

    pathShape.shape
      .setValue(generatedBlob)

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

    const extractSVGPath = async () => {
        let path = 'svg/blob3/blob (3).svg';
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

                else {

                    
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
            console.log('cubic',cubic)
            generateBlob(cubic)

        })
    }


  const checkBlob = async () => {
    console.log(data.lottie.animationData)

  }


  return (
    <div>
      <button onClick={() => { setSrc2(items[0]) }}>Animation One</button>
      <button onClick={() => { setSrc(items[1]) }}>Animation Two</button>
      <button onClick={generateBlob}>Generate Blob</button>
      {/* <button onClick={checkBlob}>Check Blob</button> */}
      <button onClick={extractSVGPath}>Generate blob from SVG</button>





      <div style={{ display: "flex" }}>
        <div style={{ width: '50%' }} >
          <LottiePlayer
            renderer="svg"
    
            src={src} loop autoplay controls >
            <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
          </LottiePlayer>
        </div>
        <div style={{ width: '50%' }}>
        </div>
      </div>
    </div>
  )
}


export default Home
