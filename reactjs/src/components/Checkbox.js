import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {
  state = {
    isChecked: false,
  }

  componentDidMount(){
    const { checked } = this.props;
    this.setState({isChecked: checked})
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label, value } = this.props;
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(value);
  }

  render() {
    const { label, value} = this.props;
    const { isChecked } = this.state;

    return (
      <div className="checkbox">
        <label>
            <input
              type="checkbox"
              value={value}
              checked={isChecked}
              onChange={this.toggleCheckboxChange}
            />
          {label}
        </label>
      </div>
    );
  }
}

export default Checkbox;