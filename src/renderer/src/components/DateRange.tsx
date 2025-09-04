import React, { JSX } from 'react'
import { DatePicker, Space } from 'antd'

const { RangePicker } = DatePicker

export const DateRange: React.FC = (): JSX.Element => (
  <Space direction="vertical" size={12}>
    <RangePicker />
    <RangePicker showTime />
    <RangePicker picker="week" />
    <RangePicker picker="month" />
    <RangePicker picker="quarter" />
    <RangePicker
      picker="year"
      id={{
        start: 'startInput',
        end: 'endInput'
      }}
      onFocus={(_, info) => {
        console.log('Focus:', info.range)
      }}
      onBlur={(_, info) => {
        console.log('Blur:', info.range)
      }}
    />
  </Space>
)
