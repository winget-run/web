import { h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.scss";

interface IProps {
  title: string;
  org: string;
  description: string;
  id: string;
}

const Card = (props: IProps) => {
  return (
    <div class={style.card}>
      <button class={style.add} label="Add to multi-download" />
      <h2>{props.title}</h2>
      <h3>{props.org}</h3>
      <p>{props.description}</p>
      <button class={style.copy}>Copy command</button>
    </div>
  );
};

export default Card;
