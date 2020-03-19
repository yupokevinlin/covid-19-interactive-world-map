import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

describe("Root <App/>", () => {
  it("should render without crashing", () => {
    const div: HTMLDivElement = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
