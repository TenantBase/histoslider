import React, { Component, PropTypes } from 'react'
import { extent as e } from 'd3-array'
import { scaleLog, scaleLinear } from 'd3-scale'

import Histogram from './Histogram'
import Slider from './Slider'

const histosliderStyle = {
  position: 'relative',
  backgroundColor: '#fafafa',
  border: '1px solid #eaeaea'
}

export default class Histoslider extends Component {

  constructor () {
    super()
    this.state = {
      dragging: false
    }
  }

  dragChange (dragging) {
    this.setState({ dragging })
  }

  render () {
    const extent = e(this.props.data)

    const startMinimum = this.props.scale == 'linear' ? 0 : 1;
    const start = Math.max(startMinimum, this.props.start || extent[0])
    const end = this.props.end || extent[1]

    const selectedScale = {
      'linear': scaleLinear(),
      'log': scaleLog().base(1.7),
    }[this.props.scale];
    const scale = selectedScale
      .domain([start, end])
      .range([0, 100])
      .clamp(true)
    let selection = this.props.selection ? this.props.selection : [start, end]
    const selectionSorted = e(selection)

    // TODO: selection layer
    return (
      <div style={Object.assign(histosliderStyle, { paddingTop: this.props.padding })} className='Histoslider Histoslider-wrapper'>

        {
          !this.props.showOnDrag || this.state.dragging
          ? <Histogram
            {...Object.assign(
            {},
            this.props,
              {
                start,
                end,
                extent,
                selection: selectionSorted,
                scale,
                height: this.props.height - 40
              }
          )
          } />
          : null
        }

        <Slider {...Object.assign({}, this.props, { start, end, dragChange: this.dragChange.bind(this), extent, selection, selectionSorted, scale, height: 50 })} />
      </div>
    )
  }
}

Histoslider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  selectionColor: PropTypes.string,
  bucketSize: PropTypes.number,
  padding: PropTypes.number,
  selection: PropTypes.arrayOf(PropTypes.number),
  histogramHeight: PropTypes.number,
  histogramPadding: PropTypes.number,
  height: PropTypes.number,
  showOnDrag: PropTypes.bool,
  style: PropTypes.object,
  barBorderRadius: PropTypes.number,
  selectionFormat: PropTypes.string,
  scale: PropTypes.string,
  sliderPrefix: PropTypes.string,
}

Histoslider.defaultProps = {
  bucketSize: 1,
  selectionColor: '#2ecc71',
  showOnDrag: false,
  histogramPadding: 4,
  padding: 20,
  height: 200,
  barBorderRadius: 0,
  style: {
    border: '1px solid red'
  },
  selectionFormat: ',d',
  scale: 'linear',
  sliderPrefix: '',
}
