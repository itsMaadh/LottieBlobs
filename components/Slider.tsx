import React from "react";
import styles from "./Slider.module.css";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: any;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  onChange,
  value
}: SliderProps) => (
  <>
    <input
      type="range"
      role="slider"
      min={min}
      max={max}
      defaultValue={value}
      className={styles.seeker}
      onChange={onChange}
    />
  </>
);
