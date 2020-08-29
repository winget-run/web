import {
  Container as ReactContainer,
  Row as ReactRow,
  Col as ReactCol,
} from "react-grid";

const styles = {
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1400 },
  containerMaxWidths: { sm: 540, md: 720, lg: 960, xl: 1478 },
  columns: 12,
  gutterWidth: 30,
};

export const Container = (props) => (
  <ReactContainer {...props} styles={styles} />
);
export const Row = (props) => <ReactRow {...props} styles={styles} />;
export const Col = (props) => <ReactCol {...props} styles={styles} />;
