/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-es6-class */

import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import FormField from '../src';

describe('Standalone', () => {
  let div;
  let instance;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('message', (done) => {
    instance = ReactDOM.render(
      <FormField standalone message={{ type: 'tip', message: 'tip test' }} />, div
    );
    expect(instance.getTipsNode().innerHTML).to.be('tip test');
    done();
  });

  it('error', (done) => {
    instance = ReactDOM.render(
      <FormField standalone message={{ type: 'error', message: 'error test' }} />, div
    );
    expect(instance.getErrorNode().innerHTML).to.be('error test');
    done();
  });

  it('willReceiveProps', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {
          value: 'test1',
        };
      },
      changeValue() {
        this.setState({
          value: 'test2',
        });
      },
      handleChange(context, data, silence) {
        expect(silence).to.be(true);
      },
      render() {
        return (
          <FormField
            standalone
            ref="formfield"
            jsxname="test"
            value={this.state.value}
            handleDataChange={this.handleChange}
          />
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getValue()).to.be('test1');
    instance.changeValue();
    setTimeout(() => {
      expect(formFieldNode.getValue()).to.be('test2');
      done();
    }, 50);
  });

  it('handleDataChange should keep value format', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {
          value: 'test1',
        };
      },
      changeValue() {
        this.setState({
          value: 'test2',
        });
      },
      handleChange(context, values, silence) {
        expect(context).to.be(instance.refs.formfield);
        expect(values).to.have.keys('value', 'pass');
        expect(values.pass).to.be.a('boolean');
        expect(silence).to.be.a('boolean');
        done();
      },
      render() {
        return (
          <FormField
            standalone
            ref="formfield"
            jsxname="test"
            value={this.state.value}
            handleDataChange={this.handleChange}
          />
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    instance.changeValue();
  });

  it('getProps', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {
          value: 'test1',
        };
      },
      changeValue() {
        this.setState({
          value: 'test2',
        });
      },
      handleChange(context, data, silence) {
        expect(silence).to.be(true);
      },
      render() {
        return (
          <FormField
            standalone
            ref="formfield"
            jsxname="test"
            value={this.state.value}
            handleDataChange={this.handleChange}
          />
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;

    expect(formFieldNode.getProps().standalone).to.be(true);
    done();
  });
});
