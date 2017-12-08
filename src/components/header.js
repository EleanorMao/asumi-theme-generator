import React, { Component } from 'react'
import PropType from 'prop-types'

export default class Header extends Component {
  render () {
    return (
      <header className='header' style={{background: this.props.colors.$primary$}}>
        <h1 className='title'><a href='/'>ASUMI-UI</a></h1>
        <ul className='header-options clearfix'>
          <li onClick={this.props.onClick}>自定义配色</li>
          <li onClick={() => { location.reload() }}>重置主题</li>
          <li className={this.props.canDownload ? '' : 'invalid'} onClick={this.props.onDownload}>下载主题</li>
        </ul>
      </header>
    )
  }
}

Header.propTypes = {
  colors: PropType.object,
  onClick: PropType.func,
  onDownload: PropType.func,
  canDownload: PropType.bool
}
