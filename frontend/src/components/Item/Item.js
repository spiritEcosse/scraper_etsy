import React from "react";
import PropTypes from "prop-types";
import {ReactTinyLink} from "react-tiny-link";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function ItemTable(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const { tableHead, tableData, tableHeaderColor } = props;
  return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? (
              <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
                <TableRow className={classes.tableHeadRow}>
                  {tableHead.map((prop, key) => {
                    return (
                        <TableCell
                            className={classes.tableCell + " " + classes.tableHeadCell}
                            key={key}
                        >
                          {prop}
                        </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
          ) : null}
          <TableBody>
            {tableData.map((item) => {
              return (
                  <TableRow key={item.id} className={classes.tableBodyRow}>
                    <TableCell className={classes.tableCell} key={item.id + 1}>
                      <List
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          className={classes.root}
                      >
                        <ListItem button onClick={handleClick}>
                          <ListItemIcon>
                            <InboxIcon />
                          </ListItemIcon>
                          <ListItemText primary="Tags" />
                          {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {item.tags.map((tag) => {
                              return (
                              <ListItem button className={classes.nested}>
                                <ListItemText primary={tag.name} />
                              </ListItem>
                              );
                            })}
                          </List>
                        </Collapse>
                      </List>
                    </TableCell>
                    <TableCell className={classes.tableCell} key={item.id + 2}>
                      <ReactTinyLink
                          cardSize="small"
                          showGraphic={true}
                          maxLine={2}
                          minLine={1}
                          url={ item.url }
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell} key={item.id + 3}>
                      <ReactTinyLink
                          cardSize="small"
                          showGraphic={true}
                          maxLine={2}
                          minLine={1}
                          url={ item.shop_url }
                      />
                    </TableCell>
                  </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
  );
}

ItemTable.defaultProps = {
  tableHeaderColor: "gray"
};

ItemTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
