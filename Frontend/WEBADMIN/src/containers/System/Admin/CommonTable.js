import React, { Component } from "react";
import Pagination from "react-js-pagination";
import "./CommonTable.scss";

class CommonTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  };

  // Reset trang về 1 nếu dữ liệu đầu vào thay đổi (ví dụ đổi ngày khám)
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ activePage: 1 });
    }
  }

  render() {
    let { data, columns, itemsPerPage = 10 } = this.props;
    let { activePage } = this.state;

    // Logic phân trang
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="common-table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>STT</th>
              {columns.map((col, index) => (
                <th key={index}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData && currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {/* Nếu có hàm render tùy chỉnh (như nút bấm, badge) thì dùng, không thì hiện text */}
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="common-pagination d-flex justify-content-center mt-3">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={data.length}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    );
  }
}

export default CommonTable;
