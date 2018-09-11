/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-es6-class */

import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormField from '../src';

Enzyme.configure({ adapter: new Adapter() });

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
      <FormField standalone message={{ type: 'tip', message: 'tip test' }} />, div,
    );
    expect(instance.getTipsNode().innerHTML).to.be('tip test');
    done();
  });

  it('error', (done) => {
    const wrapper = mount(
      <FormField standalone message={{ type: 'error', message: 'error test' }} />, div,
    );
    expect(wrapper.instance().getErrorNode().innerHTML).to.be('error test');
    expect(wrapper.find('.has-error').length).to.be(1);
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
    class Demo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: 'test1',
        };
      }

      changeValue() {
        this.setState({
          value: 'test2',
        });
      }

      handleChange(context, values, silence) {
        expect(context).to.be(this.formfield);
        expect(values).to.have.keys('value', 'pass');
        expect(values.pass).to.be.a('boolean');
        expect(silence).tßo.be.a('boolean');
        done();
      }

      render() {
        const { value } = this.state;
        return (
          <FormField
            standalone
            ref={(c) => { this.formfield = c; }}
            jsxname="test"
            value={value}
            handleDataChange={this.handleChange}
          />
        );
      }
    }
    instance = ReactDOM.render(<Demo />, div);
    instance.changeValue();
  });

  it('getProps', (done) => {
    class Demo extends React.Component {
      static handleChange(context, data, silence) {
        expect(silence).to.be(true);
      }

      constructor(props) {
        super(props);
        this.state = {
          value: 'test1',
        };
      }

      changeValue() {
        this.setState({
          value: 'test2',
        });
      }


      render() {
        const { value } = this.state;
        return (
          <FormField
            standalone
            jsxname="test"
            value={value}
            handleDataChange={Demo.handleChange}
          />
        );
      }
    }
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;

    expect(formFieldNode.getProps().standalone).to.be(true);
    done();
  });
});
