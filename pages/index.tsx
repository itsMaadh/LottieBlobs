import type { NextPage } from 'next'
import Head from 'next/head';

import { Color, Size, TOOLKIT_GENERATOR, Toolkit as ToolkitJS, Vector, Scene, Scalar, BezierInterpolator } from '@lottiefiles/toolkit-js';
import { LottiePlugin } from '@lottiefiles/toolkit-plugin-lottie';
import { Player as LottiePlayer, Controls } from '@lottiefiles/react-lottie-player';
import { useRef, useState } from 'react';
import { ShapeType } from '@lottiefiles/lottie-js';

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
      .setSize(new Size(512, 512));
    scene.timeline.setFrameRate(30).setStartAndEndFrame(0, 100);

    const shapeLayer = scene
      .createShapeLayer()
      .setName('Layer 1')
      .setStartAndEndFrame(0, 100)
      .setId('layer_1')
      .setHeight(300)
      .setWidth(300);

    // Create a new group 
    const group = shapeLayer.createGroupShape();

    // Add a rectangle to the group
    const rect = group.createShape(ShapeType.PATH)

    const timeline = scene.timeline.addTrack(rect.tracks[0]);
    const easing = new BezierInterpolator(new Vector(1 / 3, 0), new Vector(2 / 3, 1));
    timeline.tracks[0].addKeyFrame(0, new Size(200, 200), easing);
    timeline.tracks[0].addKeyFrame(scene.timeline.endFrame / 2, new Size(100, 300), easing);
    timeline.tracks[0].addKeyFrame(scene.timeline.endFrame, new Size(200, 200), easing);

    group.createFillShape()
      .setColor(new Color(128, 0, 255));
    const result = await toolkit.export('com.lottiefiles.lottie', { scene });
    console.log("Generating...", result)
    setSrc(result);

  }

  const checkBlob = async () => {
    console.log(data.lottie.animationData)

  }
  return (
    <div>
      <button onClick={() => { setSrc(items[0]) }}>Animation One</button>
      <button onClick={() => { setSrc(items[1]) }}>Animation Two</button>
      <button onClick={generateBlob}>Generate Blob</button>
      <button onClick={checkBlob}>Check Blob</button>

      <div style={{ display: "flex" }}>
        <div style={{ width: '50%' }} >
          <LottiePlayer
            renderer="svg"
            lottieRef={(instance) => {
              setData({ lottie: instance, dom: lottieRef.current?.container?.innerHTML });
            }}
            src={src} loop autoplay />
        </div>
        <div style={{ width: '50%' }}>
          <pre>{JSON.stringify(data.lottie, getCircularReplacer(), 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Home
