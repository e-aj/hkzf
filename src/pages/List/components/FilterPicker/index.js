import React, { Component } from 'react';
import { PickerView } from 'antd-mobile';

import FilterFooter from '../../../../components/FilterFooter';

class FilterPicker extends Component {
    state = {
      value: this.props.defaultValue
    }

    onChange = (value) => {
      this.setState({
        value,
      });
    }

    render() {
        const { onCancel, onSave, data, cols, type } = this.props;
        const { value } = this.state;
        return (
            <>
                <PickerView data={data} value={value} cols={cols} onChange={this.onChange} />

                <FilterFooter onCancel={() => onCancel(type)} onOk={() => onSave(type, value)} />
            </>
        )
    }
}

export default FilterPicker;