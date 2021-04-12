import React from "react";
import PropTypes from "prop-types";
import {ReactTinyLink} from "react-tiny-link";
import TableContainer from '@material-ui/core/TableContainer';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TreeView from '@material-ui/lab/TreeView';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import TablePagination from '@material-ui/core/TablePagination';
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Items
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : null }
        </Toolbar>
    );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
};

function EnhancedTableHead(props) {
    const { tableHead } = props;

    return (
        <TableHead>
            <TableRow>
                {tableHead.map((headCell, key) => (
                    <TableCell key={key}>
                        { headCell }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function ItemTable(props) {
    const classes = useStyles();
    const { tableHead, tableData } = props;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [dense] = React.useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);

    return (
        <div className={classes.tableResponsive}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table className={classes.table}>
                        <EnhancedTableHead
                            classes={classes}
                            tableHead={tableHead}
                        />
                        <TableBody>
                            {tableData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((child) => {
                                    let item = child.item
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
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[4, 8, 16]}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
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
