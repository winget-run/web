import { h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.scss";

const Header = () => {
  return (
    <header class={style.header}>
      <div class={style.topBar}>
        <div class="container">
          <div className="row">
            <div className="col-6">
              <h1>winget.run</h1>
            </div>
          </div>
        </div>
      </div>
      <div class={style.search}>
        <div className="container">
          <div className="row">
            <div class={style.searchContainer}>
              <h1>winget.run</h1>
              <div class={style.inputContainer}>
                <input type="text" placeholder="Search packages..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
