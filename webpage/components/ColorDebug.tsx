import styled from "styled-components";
import { mean } from "lodash/fp";

import { Color as ColorType } from "../types";
import rgbaToColorString from "../utils/rgbaToColorString";
import standardDeviation from "../utils/standardDeviation";

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
  background-color: white;
  display: flex;
  gap: 2rem;
  align-items: center;
  border: 1px solid black;
  border-radius: 0.5rem;
  box-shadow: -0.25rem 0.5rem 1rem rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  margin: 0;
`;

const ColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const Color = styled.div<{ color: string }>`
  width: 4rem;
  height: 4rem;
  background-color: ${({ color }) => color};
`;

const ColorInfo = styled.div`
  font-size: 0.75rem;
  white-space: nowrap;
`;

const ColorDebug = ({ colors, title }: { colors: ColorType[]; title?: string }) => (
  <Wrapper>
    {title && <Title>{title}</Title>}
    {colors.map((color, idx) => (
      <ColorContainer key={idx}>
        <Color color={rgbaToColorString(color)} />
        <ColorInfo>
          <div>luma {color.luma.toFixed(3)}</div>
          <div>mean {mean(color.rgba.slice(0, 3)).toFixed(1)}</div>
          <div>𝝈 {standardDeviation(color.rgba.slice(0, 3)).toFixed(2)}</div>
          <div>R {color.rgba[0]}</div>
          <div>G {color.rgba[1]}</div>
          <div>B {color.rgba[2]}</div>
          <div>A {color.rgba[3]}</div>
        </ColorInfo>
      </ColorContainer>
    ))}
  </Wrapper>
);

export default ColorDebug;
