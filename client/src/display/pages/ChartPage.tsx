import React, {useEffect} from "react";

export type ChartPageProps = ChartPageDataProps & ChartPageStyleProps & ChartPageEventProps;

export interface ChartPageDataProps {

}

export interface ChartPageStyleProps {

}

export interface ChartPageEventProps {
  handleLoaded(): void;
}

const ChartPage: React.FC<ChartPageProps> = (props) => {
  const {
    handleLoaded,
  } = props;
  useEffect(() => {
    handleLoaded();
  }, []);

  return (
    <div/>
  )
};

export default ChartPage;

