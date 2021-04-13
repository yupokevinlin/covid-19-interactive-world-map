import React, {useEffect} from "react";

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {

}

export interface MapPageStyleProps {

}

export interface MapPageEventProps {
  handleLoaded(): void;
}

const MapPage: React.FC<MapPageProps> = (props) => {
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

export default MapPage;

