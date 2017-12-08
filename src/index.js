import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Menu, SubMenu, MenuItem, Table, Col, Form, Modal, Grid, Button, Input } from 'asumi'
import { colorsMap, defaultColors } from './constants/colors'
import ColorPicker from 'rc-color-picker'
import Header from './components/header'
import data from './constants/data'
import assign from 'object-assign'
import FileSaver from 'file-saver'
import blobUtil from 'blob-util'
import ColorFunc from 'color'
import JSZip from 'jszip'

import 'asumi/style/asumi-default-theme.css'
import 'rc-color-picker/assets/index.css'
import './assets/style/public.css'

const Row = Grid.Row
const GridCol = Grid.Col

class Index extends Component {
  constructor () {
    super()
    this.styleText = ''
    this.state = {
      canDownload: false,
      theme_name: '',
      colors: assign({}, defaultColors),
      search: {
        name: '',
        sex: -1
      }
    }
  }

  componentWillMount () {
    fetch('https://raw.githubusercontent.com/EleanorMao/asumi-ui/master/style/asumi-default-theme.css')
      .then(text => { return text.text() })
      .then(data => {
        this.styleText = this.getStyleTemplate(data, colorsMap)
      })
  }

  getStyleTemplate (data, maps) {
    Object.keys(maps).forEach(key => {
      const value = maps[key]
      data = data.replace(new RegExp(key.replace(/\$/g, '\\$'), 'ig'), value)
    })
    return data
  }

  handleChange ({name, value}) {
    this.setState(prev => {
      prev.search[name] = value
      return prev
    })
  }

  handleDownload () {
    this.zip = new JSZip()
    const css = blobUtil.createBlob([this.newStyleText], { type: 'text/css' })
    this.zip.file(`asumi-${this.state.theme_name || 'custom'}-theme.css`, css)
    this.zip.generateAsync({ type: 'blob' })
      .then(blob => {
        FileSaver.saveAs(blob, `asumi-${this.state.theme_name || 'custom'}-theme.zip`)
      })
  }

  toggerColorModal () {
    let colors = this.state.colors
    Modal.confirm({
      title: '修改配色',
      close: false,
      content: (
        <Row className='theme-rows'>
          <GridCol col={2}>
            <p>默认色</p>
            <div>
              <ColorPicker color={colors['$default$']} animation='slide-up' onChange={this.handlePick.bind(this, '$default$')} />
            </div>
          </GridCol>
          <GridCol col={2}>
            <p>主题色</p>
            <div>
              <ColorPicker color={colors.$primary$} animation='slide-up' onChange={this.handlePick.bind(this, '$primary$')} />
            </div>
          </GridCol>
          <GridCol col={2}>
            <p>成功色</p>
            <div>
              <ColorPicker color={colors.$success$} animation='slide-up' onChange={this.handlePick.bind(this, '$success$')} />
            </div>
          </GridCol>
          <GridCol col={2}>
            <p>危险色</p>
            <div>
              <ColorPicker color={colors.$error$} animation='slide-up' onChange={this.handlePick.bind(this, '$error$')} />
            </div>
          </GridCol>
          <GridCol col={2}>
            <p>警告色</p>
            <div>
              <ColorPicker color={colors.$warning$} animation='slide-up' onChange={this.handlePick.bind(this, '$warning$')} />
            </div>
          </GridCol>
          <GridCol col={2}>
            <p>失效色</p>
            <div>
              <ColorPicker color={colors.$disabled$} animation='slide-up' onChange={this.handlePick.bind(this, '$disabled$')} />
            </div>
          </GridCol>
          <GridCol col={12} style={{marginTop: 70, textAlign: 'center'}}>
            <Input onChange={({value}) => {
              this.setState({theme_name: value})
            }} placeholder='请输入主题名' style={{display: 'block'}} />
          </GridCol>
        </Row>
      ),
      onOk: () => {
        if (this.styleElement) {
          document.getElementsByTagName('head')[0].removeChild(this.styleElement)
          this.styleElement = null
        }
        let style = document.createElement('style')
        this.styleElement = style
        style.type = 'text/css'
        this.newStyleText = this.getStyleTemplate(this.styleText.slice(), this.state.colors)
        try {
          style.appendChild(document.createTextNode(this.newStyleText))
        } catch (ex) {
          style.styleSheet.cssText = this.newStyleText
        }
        var head = document.getElementsByTagName('head')[0]
        head.appendChild(style)
        this.setState({canDownload: true})
      }
    })
  }

  handlePick (name, {color, open}) {
    if (!open) {
      this.setState(prev => {
        prev.colors[name] = color
        if (name === '$primary$') {
          prev.colors.$darkp$ = ColorFunc(color).darken(0.1).cmyk().toString()
          prev.colors.$lightp$ = ColorFunc(color).lighten(0.3).cmyk().toString()
        }
        if (name === '$success$') {
          prev.colors.$darks$ = ColorFunc(color).darken(0.04).cmyk().toString()
          prev.colors.$lights$ = ColorFunc(color).lighten(0.3).cmyk().toString()
        }
        if (name === '$error$') {
          prev.colors.$darke$ = ColorFunc(color).darken(0.04).cmyk().toString()
          prev.colors.$lighte$ = ColorFunc(color).lighten(0.3).cmyk().toString()
        }
        if (name === '$default$') {
          prev.colors.$darkdf$ = ColorFunc(color).darken(0.04).cmyk().toString()
          prev.colors.$lightdf$ = ColorFunc(color).lighten(0.02).cmyk().toString()
        }
        if (name === '$warning$') {
          prev.colors.$darkw$ = ColorFunc(color).darken(0.04).cmyk().toString()
          prev.colors.$lightw$ = ColorFunc(color).lighten(0.35).cmyk().toString()
        }
        if (name === '$disabled$') {
          prev.colors.$lightd$ = ColorFunc(color).lighten(0.2).cmyk().toString()
        }
        return prev
      })
    }
  }

  render () {
    return (
      <div>
        <Header colors={this.state.colors} onDownload={this.handleDownload.bind(this)} onClick={this.toggerColorModal.bind(this)} canDownload={this.state.canDownload} />
        <Menu openAll style={{ top: 0, bottom: 0, width: 200, marginTop: 60, position: 'fixed', overflowY: 'auto' }}>
          <MenuItem> 选项1
          </MenuItem>
          <MenuItem> 选项2
          </MenuItem>
          <SubMenu title='选项3'>
            <MenuItem> 选项4
            </MenuItem>
            <MenuItem> 选项5
            </MenuItem>
          </SubMenu>
        </Menu>
        <div className='content'>
          <Form
            colon
            layout='inline'
            submitText='查询'
            labelWidth={50}
            data={this.state.search}
            onChange={this.handleChange.bind(this)}
            options={[{ name: 'name', label: '姓名', type: 'text' }, {name: 'sex', label: '性别', type: 'select', options: [{label: '全部', value: -1}, {label: '男', value: 1}, {label: '女', value: 2}]}]} />
          <Table
            striped
            pagination
            isKey='name'
            data={data}
            title='职员信息'>
            <Col dataField='name'> 姓名
            </Col>
            <Col dataField='age'> 年龄
            </Col>
            <Col dataField='sex'> 性别
            </Col>
            <Col dataField='address' width={250}> 住址
            </Col>
            <Col dataField='' width={300} dataFormat={(col, row) => {
              return [<Button type='error' size='small' key={-1}>删除</Button>,
                <Button style={{marginLeft: 10}} disabled size='small' key={0}>禁用</Button>,
                <Button style={{marginLeft: 10}} type='warning' size='small' key={1}>提醒</Button>,
                <Button style={{marginLeft: 10}} size='small' key={2}>编辑</Button>]
            }}> 操作
            </Col>
          </Table>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.querySelector('#app'))
