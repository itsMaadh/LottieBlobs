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

  const generateBlob = async () => {
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

    const bc = new CubicBezierShape()

    bc.addPoint(new Vector(-42, -403.816), new Vector(-149.015, 0), new Vector(149.016, 0))
    bc.addPoint(new Vector(287.085, -134.236), new Vector(107.659, -103.03), new Vector(-165.076, 157.979))
    bc.addPoint(new Vector(16, 423.816), new Vector(277.36, -41.631), new Vector(-217.779, 32.688))
    bc.addPoint(new Vector(-384.256, 61.009), new Vector(49.73, 183.334), new Vector(-39.011, -143.818))
    bc.setIsClosed(true)

    const shape = group.createPathShape().setName('Ellipse 1').setShape(bc)

    group.createFillShape().setColor(new Color(136, 222, 242));

    const blob = await toolkit.export('com.lottiefiles.lottie', { scene });
    console.log(JSON.parse(blob as any))

    setSrc(blob);


    // let result = {
    //   "v": "5.5.8", "fr": 24, "ip": 0, "op": 89, "w": 1080, "h": 1080, "nm": "lt blue blob", "ddd": 0, "assets": [], "layers": [
    //     {
    //       "ddd": 0, "ind": 1, "ty": 4, "nm": "Shape Layer 3", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 432, "ix": 10 }, "p": { "a": 0, "k": [543, 523, 0], "ix": 2 }, "a": { "a": 0, "k": [49.816, 11.816, 0], "ix": 1 }, "s": { "a": 0, "k": [83, 83, 100], "ix": 6 } }, "ao": 0,
    //       "shapes": [{
    //         "ty": "gr",
    //         "it": [
    //           {
    //             "ind": 0, "ty": "sh", "ix": 1, "ks": {
    //               "a": 1,
    //               "k": [
    //                 {
    //                   "i": { "x": 0.941, "y": 1 }, "o": { "x": 0.059, "y": 0 }, "t": 0,
    //                   "s": [{
    //                     "i": [[-149.015, 0], [107.659, -103.03], [277.36, -41.631], [49.73, 183.334]],
    //                     "o": [[149.016, 0], [-165.076, 157.979], [-217.779, 32.688], [-39.011, -143.818]],
    //                     "v": [[-42, -403.816], [287.085, -134.236], [16, 423.816], [-384.256, 61.009]],
    //                     "c": true
    //                   }]
    //                 },
    //                 {
    //                   "i": { "x": 0.941, "y": 1 }, "o": { "x": 0.059, "y": 0 }, "t": 60,
    //                   "s": [{
    //                     "i": [[-240, 17.816], [-31.817, -180], [412, -25.816], [-14.184, 212]],
    //                     "o": [[148.607, -11.032], [33.197, 187.812], [-219.788, 13.772], [20.393, -304.813]],
    //                     "v": [[-42, -403.816], [401.817, -64], [16, 423.816], [-385.816, -18]],
    //                     "c": true
    //                   }]
    //                 },
    //                 {
    //                   "i": { "x": 0.941, "y": 1 }, "o": { "x": 0.059, "y": 0 }, "t": 89,
    //                   "s": [{
    //                     "i": [[-207.589, 8.598], [9.885, -185.411], [224.397, 3.796], [142.037, 183.222]],
    //                     "o": [[236.411, -21.402], [-28.058, 152.88], [-219.945, -3.75], [-165.963, -254.778]],
    //                     "v": [[-10.411, -382.598], [376.166, 70.53], [-33.362, 406.598], [-286.037, 72.778]],
    //                     "c": true
    //                   }]
    //                 },
    //                 // {
    //                 //   "i": { "x": 0.941, "y": 1 }, "o": { "x": 0.059, "y": 0 }, "t": 138,
    //                 //   "s": [{
    //                 //     "i": [[-230, -34.184], [-48.997, -234.82], [283.676, 1.562], [35.652, 241.344]],
    //                 //     "o": [[234, 25.816], [14.135, 180.256], [-219.903, 1.011], [-54.348, -378.656]],
    //                 //     "v": [[-82, -333.816], [410.997, -75.18], [10, 353.816], [-353.652, 38.656]],
    //                 //     "c": true
    //                 //   }]
    //                 // },
    //                 // {
    //                 //   "i": { "x": 0.941, "y": 1 }, "o": { "x": 0.059, "y": 0 }, "t": 184,
    //                 //   "s": [{
    //                 //     "i": [[-149.015, 0], [107.659, -103.03], [277.36, -41.631], [49.73, 183.334]],
    //                 //     "o": [[149.016, 0], [-165.076, 157.979], [-217.779, 32.688], [-39.011, -143.818]],
    //                 //     "v": [[-42, -403.816], [287.085, -134.236], [16, 423.816], [-384.256, 61.009]],
    //                 //     "c": true
    //                 //   }]
    //                 // },
    //                 // {
    //                 //   "t": 184.14453125, "s": [{
    //                 //     "i": [[-149.015, 0], [84.908, -122.459], [148.868, 6.642], [129.816, 152]],
    //                 //     "o": [[149.016, 0], [-81.817, 118], [-220, -9.816], [-96.776, -113.314]],
    //                 //     "v": [[-42, -403.816], [381.817, -44], [16, 423.816], [-381.816, -2]],
    //                 //     "c": true
    //                 //   }]
    //                 // }
    //               ],
    //               "ix": 2
    //             }, "nm": "Path 1", "mn": "ADBE Vector Shape - Group", "hd": false
    //           },
    //           {
    //             "ty": "st", "c": { "a": 0, "k": [1, 0.945097979377, 0.898038976333, 1], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 0, "ix": 5 }, "lc": 1, "lj": 1, "ml": 4, "bm": 0, "nm": "Stroke 1", "mn": "ADBE Vector Graphic - Stroke", "hd": false
    //           },
    //           {
    //             "ty": "fl", "c": { "a": 0, "k": [0.533333333333, 0.870588235294, 0.949019607843, 1], "ix": 4 }, "o": { "a": 0, "k": 100, "ix": 5 }, "r": 1, "bm": 0, "nm": "Fill 1", "mn": "ADBE Vector Graphic - Fill", "hd": false
    //           },
    //           {
    //             "ty": "tr",
    //             "p": {
    //               "a": 0, "k": [49.816, 11.816], "ix": 2
    //             },
    //             "a": {
    //               "a": 0, "k": [0, 0], "ix": 1
    //             },
    //             "s": {
    //               "a": 0, "k": [100, 100], "ix": 3
    //             },
    //             "r": {
    //               "a": 0, "k": 0, "ix": 6
    //             },
    //             "o": {
    //               "a": 0, "k": 100, "ix": 7
    //             },
    //             "sk": {
    //               "a": 0, "k": 0, "ix": 4
    //             },
    //             "sa": {
    //               "a": 0, "k": 0, "ix": 5
    //             },
    //             "nm": "Transform"
    //           }
    //         ],
    //         "nm": "Ellipse 1", "np": 3, "cix": 2, "bm": 0, "ix": 1, "mn": "ADBE Vector Group", "hd": false
    //       }], "ip": 0, "op": 722, "st": 0, "bm": 0
    //     }], "markers": []
    // };

    // let min = -1 * Math.floor(Math.random() * 500);
    // let max = Math.floor(Math.random() * 500);

    // result.layers[0].shapes[0].it[0].ks?.k.map((k) => {
    //   let x = Math.floor(Math.random() * (max - min + 1) + min);
    //   let y = Math.floor(Math.random() * (max - min + 1) + min);
    //   console.log(x, y, min, max)
    //   // k.s[0].v.map((v) => {
    //   //   v[0] = v[0] + x;
    //   //   v[1] = v[1] + y;
    //   // })
    // })

  }

  const checkBlob = async () => {
    console.log(data.lottie.animationData)

  }
  return (
    <div>
      <button onClick={() => { setSrc2(items[0]) }}>Animation One</button>
      <button onClick={() => { setSrc(items[1]) }}>Animation Two</button>
      <button onClick={generateBlob}>Generate Blob</button>
      <button onClick={checkBlob}>Check Blob</button>

      <div style={{ display: "flex" }}>
        <div style={{ width: '50%' }} >
          {/* <LottiePlayer
            renderer="svg"
            lottieRef={(instance: any) => {
              console.log(instance.animationData)
            }}
            src={src2} loop autoplay >
            <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
          </LottiePlayer> */}
          <LottiePlayer
            renderer="svg"
            // lottieRef={(instance) => {
            //   setData({ lottie: instance, dom: lottieRef.current?.container?.innerHTML });
            // }}
            src={src} loop autoplay controls >
            <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
          </LottiePlayer>
        </div>
        <div style={{ width: '50%' }}>
          {/* <pre>{JSON.stringify(data.lottie, getCircularReplacer(), 2)}</pre> */}
        </div>
      </div>
    </div>
  )
}

export default Home
