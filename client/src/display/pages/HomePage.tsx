import React, {useEffect} from "react";

export type HomePageProps = HomePageDataProps & HomePageStyleProps & HomePageEventProps;

export interface HomePageDataProps {

}

export interface HomePageStyleProps {

}

export interface HomePageEventProps {
  handleLoaded(): void;
}

const HomePage: React.FC<HomePageProps> = (props) => {
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

export default HomePage;

