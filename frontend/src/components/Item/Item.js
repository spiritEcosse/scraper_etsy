import React from "react";
import PropTypes from "prop-types";
import {ReactTinyLink} from "react-tiny-link";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TreeView from '@material-ui/lab/TreeView';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function ItemTable(props) {
  const classes = useStyles();

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
                  <TableRow key={item.id.toString()} className={classes.tableBodyRow}>
                    <TableCell className={classes.tableCell}>
                      <TreeView
                          className={classes.root}
                          defaultCollapseIcon={<ExpandMoreIcon />}
                          defaultExpandIcon={<ChevronRightIcon />}
                      >
                        <TreeItem nodeId={item.id.toString()} label="Tags">
                          {item.tags.map((tag) => {
                            return (
                                <TreeItem
                                    nodeId={tag.id.toString()}
                                    key={tag.id.toString()}
                                    label={tag.name} />
                            );
                          })}
                        </TreeItem>
                      </TreeView>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <ReactTinyLink
                          cardSize="small"
                          showGraphic={true}
                          maxLine={2}
                          minLine={1}
                          url={ item.url }
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
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
};
