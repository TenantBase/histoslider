import React, { Component, PropTypes } from 'react'
import { ascending } from 'd3-array'

const histogramStyle = {
  display: 'block'
}

export default class Histogram extends Component {

  selectBucket (bucket) {
    this.props.onChange([bucket.start, bucket.end])
  }

  bucket (data, start, end, ticks) {
    const sorted = data.sort(ascending)
    let buckets = []
    let tickIndex = 0
    let s = ticks[tickIndex]
    let i = 0
    let max = 0

    while (s < (end)) {
      let values = []

      while (sorted[i] < (ticks[tickIndex + 1])) {
        values.push(data[i])
        i++
      }

      buckets.push({
        start: s,
        end: ticks[tickIndex + 1] || end,
        values: values,
      })
      max = values.length > max ? values.length : max

      tickIndex += 1
      s = ticks[tickIndex]
    }

    return {
      buckets,
      max
    }
  }

  render () {
    const innerHeight = this.props.height - this.props.padding
    const numberOfTicks = 20;
    const ticks = [...Array(numberOfTicks).keys()]
      .map(v => this.props.scale.range()[0] + v * (this.props.scale.range()[1] - this.props.scale.range()[0]) / numberOfTicks )
      .map(this.props.scale.invert);

    const { buckets, max } = this.bucket(
      this.props.data,
      this.props.start,
      this.props.end,
      ticks,
    )
    const bucketWidth = this.props.innerWidth / buckets.length
    const selection = this.props.selection

    let style = this.props.showOnDrag ? {
      position: 'absolute',
      left: '-1px',
      right: '-1px',
      backgroundColor: '#fafafa',
      border: '1px solid #eaeaea',
      borderBottom: 'none',
      bottom: 'calc(100% - ' + this.props.padding + 'px)'
    } : {};

    return (
      <div>
        <svg style={Object.assign({}, style, histogramStyle)} width={this.props.width} height={this.props.height}>
          <g transform={'translate(0,' + this.props.height + ')'}>
            <g transform='scale(1,-1)'>
            {
              buckets.map((bucket, i) => {
                let opacity = 0

                if (selection[0] > bucket.end || selection[1] < bucket.start) {
                  opacity = 0
                } else if (selection[0] <= bucket.start && selection[1] >= bucket.end) {
                  // Entire block is covered
                  opacity = 1
                } else if (selection[0] > bucket.start && selection[1] > bucket.end) {
                  opacity = 1 - (selection[0] - bucket.start) / (bucket.end - bucket.start)
                  // Some of left block is covered
                } else if (selection[1] < bucket.end && selection[0] < bucket.start) {
                  // Some of right block is covered
                  opacity = (selection[1] - bucket.start) / (bucket.end - bucket.start)
                } else {
                  // Parital match
                  opacity = (selection[1] - selection[0]) / (bucket.end - bucket.start)
                }

                return (
                  <g key={i} transform={'translate(' + this.props.scale(bucket.start) + ', 0)'}>
                    <rect
                      fill='#f1f1f1'
                      width={this.props.scale(bucket.end) - this.props.scale(bucket.start) - this.props.histogramPadding}
                      height={(bucket.values.length / max) * innerHeight}
                      rx={this.props.barBorderRadius}
                      ry={this.props.barBorderRadius}
                      x={this.props.histogramPadding / 2}
                    />
                    <rect
                      fill={this.props.selectionColor}
                      onClick={this.selectBucket.bind(this, bucket)}
                      onDoubleClick={this.props.reset.bind(this)}
                      style={{ opacity, cursor: 'pointer' }}
                      width={this.props.scale(bucket.end) - this.props.scale(bucket.start) - this.props.histogramPadding}
                      height={(bucket.values.length / max) * innerHeight}
                      rx={this.props.barBorderRadius}
                      ry={this.props.barBorderRadius}
                      x={this.props.histogramPadding / 2}
                    />
                  </g>
                )
              })
            }
            </g>
          </g>
        </svg>
      </div>
    )
  }
}

Histogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  selection: PropTypes.arrayOf(PropTypes.number).isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  bucketSize: PropTypes.number,
  width: PropTypes.number,
  innerWidth: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  selectionColor: PropTypes.string,
  histogramPadding: PropTypes.number,
  showOnDrag: PropTypes.bool,
  reset: PropTypes.func,
  onChange: PropTypes.func,
  barBorderRadius: PropTypes.number
}

Histogram.defaultProps = {
  barBorderRadius: 0,
  histogramPadding: 1
}
