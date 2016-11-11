/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-es6-class */
/* eslint-disable react/no-string-refs */

import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
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
    const Demo = React.createClass({
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
    expect(formFieldNode.getLabelNode().innerHTML).to.be('test');
    done();
  });

  it('Do not show label', (done) => {
    const Demo = React.createClass({
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
    expect(formFieldNode.getLabelNode()).to.be(undefined);
    done();
  });

  it('tips', (done) => {
    const Demo = React.createClass({
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
    const Demo = React.createClass({
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

  it('validate', (done) => {
    const Demo = React.createClass({
      render() {
        return (
          <Form>
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
    const Demo = React.createClass({
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
    const Demo = React.createClass({
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
    const Demo = React.createClass({
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

  it('validate should return true when no jsxruls', (done) => {
    const Demo = React.createClass({
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
    const Demo = React.createClass({
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
    const Demo = React.createClass({
      render() {
        return (
          <Form>
            <FormField ref="formfield" jsxname="test" jsxlabel="test" labelMatchInputHeight />
          </Form>
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    // className kuma-uxform-tip-box only appear in labelMatchInputHeight mode.
    expect($('.kuma-uxform-tip-box').length).not.to.be(0);
    done();
  });
});
