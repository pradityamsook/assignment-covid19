import React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
// import Covid19 from "./Covid19";

// import css
import "./App.css";
import "./table.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCovid: [],
      isLoaded: false,
      sort: "desc",
      searchByCountry: [],
    };
  }

  // async getDataCovid19 () {
  //   const res = await axios.get("https://api.covid19api.com/summary");
  //   const data = await res.json();
  //   return data.results;
  // }

  handleSearch = (text) => {
    const data = this.state.dataCovid;

    let arr = [];
    data.filter((val) => {
      if (val.Country.includes(text)) {
        arr.push(val);
      }
    });

    if (text === "") {
      this.setState({
        dataCovid: this.state.searchByCountry,
      });
    } else {
      this.setState({
        dataCovid: arr,
      });
    }
  };

  sortByTotalConfirmed() {
    const dataList = this.state;
    let newDataList = dataList;
    if (this.state.sort === "desc") {
      newDataList.dataCovid.sort((a, b) => a.TotalConfirmed > b.TotalConfirmed);
    } else {
      newDataList.dataCovid.sort((a, b) => a.TotalConfirmed < b.TotalConfirmed);
    }

    this.setState({
      dataCovid: newDataList.sort(
        (a, b) => a.TotalConfirmed > b.TotalConfirmed
      ),
    });
  }

  async componentDidMount() {
    await axios
      .get("https://api.covid19api.com/summary")
      .then((res) => {
        this.setState({
          isLoaded: true,
          dataCovid: res.data.Countries,
          searchByCountry: res.data.Countries,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { dataCovid, searchByCountry, isLoaded } = this.state; //extracter
    dataCovid.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
    dataCovid.reverse((a) => a.TotalConfirmed);

    if (!isLoaded) {
      return <div>waiting data...</div>;
    }

    return (
      <div className="App">
        <Helmet>
          <title>Report COVID19</title>
        </Helmet>
        <header>Report COVID-19</header>
        <div>Total country: {searchByCountry.length}</div>
        <input
          type="text"
          placeholder="Search country name..."
          onChange={(e) => this.handleSearch(e.target.value)}
        />
        {}
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Total confirmed</th>
              <th>Total deaths</th>
              <th>Total recovered</th>
            </tr>
          </thead>
          {dataCovid.length > 0 ? (
            dataCovid.map((covid) =>
              covid.TotalConfirmed > 0 ||
              covid.TotalDeaths > 0 ||
              covid.TotalRecovered > 0 ? (
                <tr key={covid.ID}>
                  <td>{covid.Country}</td>
                  <td>{covid.TotalConfirmed}</td>
                  <td>{covid.TotalDeaths}</td>
                  <td>{covid.TotalRecovered}</td>
                </tr>
              ) : (
                <tr key={covid.ID}>
                  <td>{covid.Country}</td>
                  <td>
                    {covid.TotalConfirmed > 0 ? (
                      <div>{covid.TotalConfirmed}</div>
                    ) : null}
                  </td>
                  <td>
                    {covid.TotalDeaths > 0 ? (
                      <div>{covid.TotalDeaths}</div>
                    ) : null}
                  </td>
                  <td>
                    {covid.TotalRecovered > 0 ? (
                      <div>{covid.TotalRecovered}</div>
                    ) : null}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td style={{ textAlign: "center" }} colSpan={4}>
                ไม่พบข้อมูล
              </td>
            </tr>
          )}
        </table>
      </div>
    );
  }
}
export default App;
