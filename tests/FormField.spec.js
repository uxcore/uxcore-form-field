import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Form from 'uxcore-form/build/Form';
import FormField from '../src';
import $ from 'jquery';

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
                )
            }
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
                )
            }
        });
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;
        expect(formFieldNode.getLabelNode()).to.be(undefined);
        done();
    })

    it('tips', (done) => {
        const Demo = React.createClass({
            render() {
                return (
                    <Form>
                        <FormField ref="formfield" jsxname="test" jsxtips="tips" />
                    </Form>
                )
            }
        });
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;
        expect(formFieldNode.getTipsNode().innerHTML).to.be("tips");
        done();
    });

    it('required', (done) => {
        const Demo = React.createClass({
            render() {
                return (
                    <Form>
                        <FormField ref="formfield" jsxname="test" jsxtips="tips" required={true}/>
                    </Form>
                )
            }
        });
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;
        expect(formFieldNode.getRequiredNode().innerHTML).to.be("* ");
        done();
    });

    it('validate', (done) => {
        const Demo = React.createClass({
            render() {
                return (
                    <Form>
                        <FormField ref="formfield" jsxname="test" jsxrules={{validator: function() {return false;}, errMsg: 'error test'}}/>
                    </Form>
                )
            }
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
        const Demo = React.createClass({
            render() {
                return (
                    <Form>
                        <FormField ref="formfield" jsxname="test" jsxrules={[
                            {validator: function() {return true;}, errMsg: 'error test'},
                            {validator: function() {return false;}, errMsg: 'error test2'},
                        ]}/>
                    </Form>
                )
            }
        });
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
                        <FormField ref="formfield" jsxname="test" jsxrules={[
                            {validator: function() {return true;}, errMsg: 'error test'},
                            {validator: function() {return false;}, errMsg: 'error test2'},
                        ]} instantValidate={false} />
                    </Form>
                )
            }
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
                        <FormField ref="formfield" jsxname="test" jsxrules={[
                            {validator: function() {return true;}, errMsg: 'error test'},
                            {validator: function() {return false;}, errMsg: 'error test2'},
                        ]} instantValidate={false} />
                    </Form>
                )
            }
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
                        <FormField ref="formfield" jsxname="test" jsxrules={[
                            {validator: function() {return true;}, errMsg: 'error test'},
                            {validator: function() {return false;}, errMsg: 'error test2'},
                        ]} instantValidate={false} />
                        <FormField ref="formfield2" jsxname="test" jsxrules={[
                            {validator: function() {return true;}, errMsg: 'error test'},
                            {validator: function() {return false;}, errMsg: 'error test2'},
                        ]} instantValidate={false} />
                    </Form>
                )
            }
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
                )
            }
        });
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;
        formFieldNode.doValidate();
        setTimeout(() => {
            expect(formFieldNode.getErrorNode()).to.be(undefined);
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
                )
            }
        });
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;
        expect($('.kuma-uxform-tip-box').length).not.to.be(0);
        done();
    })
});