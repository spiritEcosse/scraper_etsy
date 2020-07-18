import React, {Component} from 'react';
import ChartistGraph from "react-chartist";
import {withStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Item from "components/Item/Item.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {completedTasksChart, dailySalesChart, emailsSubscriptionChart} from "variables/charts.js";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Tasks from "components/Tasks/Tasks.js";
import SearchForm from "components/Form/Search.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import {base_url, bugs, server, website} from "variables/general.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import SnackbarContent from "../../components/Snackbar/SnackbarContent";
import Button from "../../components/CustomButtons/Button";

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.response = ""
    this.state = {
      requests: []
    }
    this.nextUrl = base_url + 'api/items/'
    this.setRequests = this.setRequests.bind(this);
  }

  get() {
    fetch(this.nextUrl, {
      method : 'GET',
      headers : {
        Authorization : `Bearer ${localStorage.getItem('token')}`
      }
    })
        .then(res => {
          this.response = res
          return res.json();
        })
        .then(res => {
          if (! this.response.ok ) {
            switch (this.response.status) {
              case 401:
                break;
              default:
                break;
            }
          } else {
            this.nextUrl = res.next
            this.setState({
              requests: [
                ...this.state.requests,
                ...res.results
              ]
            });
          }
        })
        .catch(err => console.log(err));
  }

  componentDidMount() {
    this.get()
  }

  moreRequests = (e) => {
    this.get()
  }

  setRequests(request) {
    this.setState({
      requests: [
        request,
        ...this.state.requests,
      ]
    });
  }

  render() {
    const { classes } = this.props;

    return (
        <div>
          <SearchForm setRequests={this.setRequests}/>
          <GridContainer>
            {
              this.state.requests.map((request) => {
                return (
                    <GridItem xs={12} sm={12} md={6} key={request.id.toString()}>
                      <Card>
                        <CardHeader color="primary">
                          <h4 className={classes.cardTitleWhite}>Search: { request.search }</h4>
                          <p className={classes.cardCategoryWhite}>
                            started at: { request.started_at }, ended at: { request.ended_at },
                            status: { request.status }, code: { request.code }
                          </p>
                        </CardHeader>
                        <CardBody >
                          <div className={classes.typo}>
                            <div className={classes.note}>
                              Filter:
                              limit: { request.filter.limit }, count_tags: { request.filter.count_tags },
                              sales: { request.filter.sales }, year_store_base: { request.filter.year_store_base },
                              countries: { request.filter.list_countries.join(', ') }
                            </div>
                          </div>
                          { request.children.length ?
                              <Item
                                  tableHeaderColor="warning"
                                  tableHead={["Tags", "Item", "Shop"]}
                                  tableData={ request.children }
                              />
                              :
                              <SnackbarContent
                                  message={
                                    "Don't have any items."
                                  }
                                  color="info"
                              />
                          }
                        </CardBody>
                      </Card>
                    </GridItem>
                );
              })
            }
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Button
                  fullWidth
                  color="primary"
                  onClick={this.moreRequests}
                  disabled={this.nextUrl == null}
              >
                { this.nextUrl == null ? "No more" : "More" }
              </Button>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <CustomTabs
                  title="Tasks:"
                  headerColor="primary"
                  tabs={[
                    {
                      tabName: "Bugs",
                      tabIcon: BugReport,
                      tabContent: (
                          <Tasks
                              checkedIndexes={[0, 3]}
                              tasksIndexes={[0, 1, 2, 3]}
                              tasks={bugs}
                          />
                      )
                    },
                    {
                      tabName: "Website",
                      tabIcon: Code,
                      tabContent: (
                          <Tasks
                              checkedIndexes={[0]}
                              tasksIndexes={[0, 1]}
                              tasks={website}
                          />
                      )
                    },
                    {
                      tabName: "Server",
                      tabIcon: Cloud,
                      tabContent: (
                          <Tasks
                              checkedIndexes={[1]}
                              tasksIndexes={[0, 1, 2]}
                              tasks={server}
                          />
                      )
                    }
                  ]}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>content_copy</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Used Space</p>
                  <h3 className={classes.cardTitle}>
                    49/50 <small>GB</small>
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Danger>
                      <Warning/>
                    </Danger>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      Get more space
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Store/>
                  </CardIcon>
                  <p className={classes.cardCategory}>Revenue</p>
                  <h3 className={classes.cardTitle}>$34,245</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange/>
                    Last 24 Hours
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>info_outline</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Fixed Issues</p>
                  <h3 className={classes.cardTitle}>75</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <LocalOffer/>
                    Tracked from Github
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <Accessibility/>
                  </CardIcon>
                  <p className={classes.cardCategory}>Followers</p>
                  <h3 className={classes.cardTitle}>+245</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Update/>
                    Just Updated
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <Card chart>
                <CardHeader color="success">
                  <ChartistGraph
                      className="ct-chart"
                      data={dailySalesChart.data}
                      type="Line"
                      options={dailySalesChart.options}
                      listener={dailySalesChart.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Daily Sales</h4>
                  <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory}/> 55%
                </span>{" "}
                    increase in today sales.
                  </p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime/> updated 4 minutes ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card chart>
                <CardHeader color="warning">
                  <ChartistGraph
                      className="ct-chart"
                      data={emailsSubscriptionChart.data}
                      type="Bar"
                      options={emailsSubscriptionChart.options}
                      responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                      listener={emailsSubscriptionChart.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                  <p className={classes.cardCategory}>Last Campaign Performance</p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime/> campaign sent 2 days ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card chart>
                <CardHeader color="danger">
                  <ChartistGraph
                      className="ct-chart"
                      data={completedTasksChart.data}
                      type="Line"
                      options={completedTasksChart.options}
                      listener={completedTasksChart.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Completed Tasks</h4>
                  <p className={classes.cardCategory}>Last Campaign Performance</p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime/> campaign sent 2 days ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Dashboard);
