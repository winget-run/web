import { FunctionalComponent, h } from "preact";
import * as style from "./style.scss";
import Card from "../../components/card";

const Home: FunctionalComponent = () => {
  return (
    <div class={style.home}>
      <div className="container">
        <div className="row">
          {Array.from(new Array(16)).map(e => (
            <div className="col-3">
              <Card
                title="arduino"
                org="test"
                description="test"
                id="test.test"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
