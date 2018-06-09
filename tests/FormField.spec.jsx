/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-es6-class */
/* eslint-disable react/no-string-refs */

import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import Form from 'uxcore-form/build/Form';
import $ from 'jquery';

import FormField from '../src';

describe('FormField', () => {
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

  it('label', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" jsxlabel="test" />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getLabelContentNode().innerHTML).to.be('test');
    done();
  });

  it('label support jsx', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" jsxlabel={<span>{'test' }</span>} />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getLabelContentNode().innerHTML).to.be('<span>test</span>');
    done();
  });

  it('label support user defined width', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField labelWidth="40px" ref="formfield" jsxname="test" jsxlabel="test" />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getLabelNode().style.width).to.be('40px');
    done();
  });

  it('Do not show label', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" jsxshowLabel={false} />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getLabelContentNode()).to.be(undefined);
    done();
  });

  it('tips', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" jsxtips="tips" />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getTipsNode().innerHTML).to.be('tips');
    done();
  });

  it('required', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" jsxtips="tips" required />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getRequiredNode().innerHTML).to.be('* ');
    done();
  });

  it('processValue', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {};
      },
      setValue(value) {
        this.setState({
          test: value,
        });
      },
      render() {
        return (
          <Form
            jsxonChange={(values, name) => { this.setState({ test: values[name] }); }}
            jsxvalues={{ test: this.state.test }}
          >
            <FormField
              processValue={(value) => {
                if (value) {
                  return value.slice(1);
                }
                return value;
              }}
              ref="formfield"
              jsxname="test"
              jsxrules={{ validator() { return false; }, errMsg: 'error test' }}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    instance.setValue('1111');
    setTimeout(() => {
      expect(instance.refs.formfield.state.value).to.be('111');
      done();
    }, 100);
  });

  it('validate pass', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {};
      },
      render() {
        return (
          <Form
            jsxonChange={(values, name) => { this.setState({ test: values[name] }); }}
            jsxvalues={{ test: this.state.test }}
          >
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={{ validator(value) { if (!value) { return false; } return true; }, errMsg: 'error test' }}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getErrorNode()).to.be(undefined);
    formFieldNode.handleDataChange('1');
    setTimeout(() => {
      expect(formFieldNode.getErrorNode()).to.be(undefined);
      done();
    }, 50);
  });

  it('validate not pass', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {};
      },
      render() {
        return (
          <Form
            jsxonChange={(values, name) => { this.setState({ test: values[name] }); }}
            jsxvalues={{ test: this.state.test }}
          >
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={{ validator() { return false; }, errMsg: 'error test' }}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getErrorNode()).to.be(undefined);
    formFieldNode.handleDataChange('1');
    setTimeout(() => {
      expect(formFieldNode.getErrorNode().innerHTML).to.be('error test');
      done();
    }, 50);
  });

  it('props.value change should not validate', (done) => {
    const Demo = createClass({
      getInitialState() {
        return {};
      },
      setValue(value) {
        this.setState({
          test: value,
        });
      },
      render() {
        return (
          <Form
            jsxonChange={(values, name) => { this.setState({ test: values[name] }); }}
            jsxvalues={{ test: this.state.test }}
          >
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={{ validator() { return false; }, errMsg: 'error test' }}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    instance.setValue('1');
    const formFieldNode = instance.refs.formfield;
    setTimeout(() => {
      expect(formFieldNode.getErrorNode()).to.be(undefined);
      done();
    }, 50);
  });

  it('jsxrules should support array', (done) => {
    class Demo extends React.Component {
      render() {
        return (
          <Form>
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={[
                { validator() { return true; }, errMsg: 'error test' },
                { validator() { return false; }, errMsg: 'error test2' },
              ]}
            />
          </Form>
        );
      }
    }

    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    formFieldNode.handleDataChange('1');
    setTimeout(() => {
      expect(formFieldNode.getErrorNode().innerHTML).to.be('error test2');
      done();
    }, 50);
  });

  it('no instant validate', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={[
                { validator() { return true; }, errMsg: 'error test' },
                { validator() { return false; }, errMsg: 'error test2' },
              ]}
              instantValidate={false}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    formFieldNode.handleDataChange('1');
    setTimeout(() => {
      expect(formFieldNode.getErrorNode()).to.be(undefined);
      done();
    }, 50);
  });

  it('no instant validate but force validate', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={[
                { validator() { return true; }, errMsg: 'error test' },
                { validator() { return false; }, errMsg: 'error test2' },
              ]}
              instantValidate={false}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    formFieldNode.doValidate(true);
    setTimeout(() => {
      expect(formFieldNode.getErrorNode().innerHTML).to.be('error test2');
      done();
    }, 50);
  });

  it('when always is defined, doValidate should follow always', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={[
                { validator() { return true; }, errMsg: 'error test' },
                { validator() { return false; }, errMsg: 'error test2' },
              ]}
              instantValidate={false}
            />
            <FormField
              ref="formfield2"
              jsxname="test"
              jsxrules={[
                { validator() { return true; }, errMsg: 'error test' },
                { validator() { return false; }, errMsg: 'error test2' },
              ]}
              instantValidate={false}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    const formFieldNode2 = instance.refs.formfield2;
    formFieldNode.doValidate(true, true);
    formFieldNode2.doValidate(true, false);
    setTimeout(() => {
      expect(formFieldNode.getErrorNode()).to.be(undefined);
      expect(formFieldNode2.getErrorNode().innerHTML).to.be('error test');
      done();
    }, 50);
  });

  it('validation should return true when no jsxrules', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    formFieldNode.doValidate();
    setTimeout(() => {
      expect(formFieldNode.getErrorNode()).to.be(undefined);
      done();
    }, 50);
  });

  it('should be able to support async validation', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form asyncValidate>
            <FormField
              ref="formfield"
              jsxname="test"
              jsxrules={(value, resolve, reject) => {
                reject('测试出错');
              }}
            />
            <FormField
              ref="formfield2"
              jsxname="test2"
              jsxrules={(value, resolve) => {
                resolve();
              }}
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    const formFieldNode2 = instance.refs.formfield2;
    formFieldNode.handleDataChange('1');
    formFieldNode2.handleDataChange('1');
    setTimeout(() => {
      expect(formFieldNode.getErrorNode().innerHTML).to.be('测试出错');
      expect(formFieldNode2.getErrorNode()).to.be(undefined);
      done();
    }, 50);
  });

  it('labelMatchInputHeight', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField
              ref="formfield" jsxname="test"
              jsxlabel="test" jsxtips="1" labelMatchInputHeight
            />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    // className kuma-uxform-tip-box only appear in labelMatchInputHeight mode.
    expect($('.kuma-uxform-tip-box').length).not.to.be(0);
    done();
  });

  it('should get field core', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getFieldCore().className).to.be('kuma-uxform-field-core');
    done();
  });

  it('should pass data-* prop', (done) => {
    const Demo = createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" data-spm="1" />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const formFieldNode = instance.refs.formfield;
    expect(formFieldNode.getDom().getAttribute('data-spm')).to.be('1');
    done();
  });
});
