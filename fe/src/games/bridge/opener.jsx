import React, { Component } from "react";
import { Table, Row, Col, Button, Card, Container } from "react-bootstrap";
import Deal from "./deal";
import Hand from "./hand";
import { paginate } from "../../common/paginate";

import axios from "axios";
import BidControls from "./bidControls";
import Pagination from "../../common/pagination";
const apiBase = "games";

class Opener extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deals: [],
      deal: new Deal().shuffle(),
      bid: null,
      bidding: true,
      currentPage: 1,
      pageSize: 3,
    };
  }

  componentDidMount() {
    console.log("Opener did mount");
    //const promise = axios.get("http://localhost:8000/games/api/deals/");
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  onBid = (bid) => {
    console.log("Setting bid:", bid);
    this.setState({ bid, bidding: false });
  };
  undoBid = () => {
    console.log("Undoing bid:");
    this.setState({ bid: null, bidding: true });
  };

  handleSave = () => {
    console.log("Save deals = ", this.state.deals);
    //await axios.post(apiBase, { a: 1 });
  };
  rmDeal = () => {
    this.setState({
      deal: null,
      bid: null,
      bidding: false,
    });
  };
  startOver = () => {
    console.log("Starting next deal");
    const { bid, deal } = this.state;

    const deals = [...this.state.deals];
    if (bid) {
      deals.push({ deal, bid });
    }
    this.setState({
      deal: new Deal().shuffle(),
      bid: null,
      deals,
      bidding: true,
    });
    console.log("# of deals = ", deals.length);
  };

  getBidController = (idx) => {
    let bid;
    if (idx === -1) bid = this.state.bid;
    else bid = this.state.deals[idx]["bid"];
    console.log("Bid is currently ", bid);
    let bidElement;
    if (idx === -1)
      if (this.state.bidding)
        bidElement = (
          <React.Fragment>
            <BidControls double={false} redouble={false} onBid={this.onBid} />
            <Button variant="link" size="sm" onClick={this.rmDeal}>
              <i className="fa fa-minus" aria-hidden="true"></i>{" "}
            </Button>
          </React.Fragment>
        );
      else {
        bidElement = (
          <React.Fragment>
            {bid}
            <Button variant="link" size="sm" onClick={this.undoBid}>
              <i className="fa fa-undo" aria-hidden="true"></i>{" "}
            </Button>
            <Button variant="link" size="sm" onClick={this.rmDeal}>
              <i className="fa fa-minus" aria-hidden="true"></i>{" "}
            </Button>
          </React.Fragment>
        );
      }
    else {
      bidElement = <React.Fragment>{bid}</React.Fragment>;
    }
    return bidElement;
  };

  showNextActions = () => {
    if (!this.state.bidding)
      return (
        <React.Fragment>
          <Button variant="link" size="sm" onClick={this.startOver}>
            <i className="fa fa-plus" aria-hidden="true"></i>{" "}
          </Button>
          <button onClick={this.handleSave} className="btn-link ml-6">
            <i className="fa fa-save" aria-hidden="true"></i>{" "}
          </button>
        </React.Fragment>
      );
  };

  getPagedDeals = () => {
    const { pageSize, currentPage, deals } = this.state;
    return paginate(deals, currentPage, pageSize);
  };

  showPageDeals = () => {
    const pageDeals = this.getPagedDeals();
    if (pageDeals && pageDeals.length > 0) {
      return pageDeals.map((deal, idx) => {
        return (
          <tr key={idx}>
            <td>N</td>
            <td>None</td>
            <td>
              <Hand
                player={pageDeals[idx]["deal"][3]}
                name="South"
                display={"line"}
                reveal={true}
              />
            </td>
            <td>{this.getBidController(idx)}</td>
            <td></td>
          </tr>
        );
      });
    } else {
      console.log("No deals:", pageDeals);
    }
  };
  showCurrentDeal = () => {
    if (this.state.deal)
      return (
        <React.Fragment>
          <Hand
            player={this.state.deal[3]}
            name="South"
            display={"line"}
            reveal={true}
          />
          {this.getBidController(-1)}
        </React.Fragment>
      );
  };
  render() {
    const pageDeals = this.getPagedDeals();
    console.log("Deals in page ", pageDeals);
    return (
      <React.Fragment>
        <Table>
          <thead>
            <tr>
              <td>D</td>
              <td>Vul</td>
              <td>Hand</td>
              <td>Bid</td>
              <td>By</td>
            </tr>
          </thead>
          <tbody>{this.showPageDeals()}</tbody>
        </Table>
        <Pagination
          itemsCount={this.state.deals.length}
          currentPage={this.state.currentPage}
          onPageChange={this.handlePageChange}
          pageSize={this.state.pageSize}
        />
        {this.showCurrentDeal()}
        <br />
        {this.showNextActions()}
      </React.Fragment>
    );
  }
}

export default Opener;
