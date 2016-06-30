import expect from 'expect.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, { Simulate } from 'react-addons-test-utils';
import Form from 'uxcore-form/build/Form';
import FormField from '../src';
import $ from 'jquery';

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
        instance = ReactDOM.render(<FormField standalone={true} message={{type: 'tip', message: 'tip test'}}/>, div);
        expect(instance.getTipsNode().innerHTML).to.be('tip test');
        done();
    });

    it('error', (done) => {
        instance = ReactDOM.render(<FormField standalone={true} message={{type: 'error', message: 'error test'}}/>, div);
        expect(instance.getErrorNode().innerHTML).to.be('error test');
        done();
    });

    it('willReceiveProps', (done) => {
       const Demo = React.createClass({
            getInitialState() {
                return {
                    value: 'test1',
                }
            },
            changeValue() {
                this.setState({
                    value: 'test2',
                })
            },
            handleChange(context, data, silence) {
                expect(silence).to.be(true); 
            },
            render() {
                return (
                    <FormField standalone={true} ref="formfield" jsxname="test" value={this.state.value} handleDataChange={this.handleChange} />
                )
            }
        }); 
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;
        expect(formFieldNode.getValue()).to.be('test1');
        instance.changeValue();
        setTimeout(() => {
            expect(formFieldNode.getValue()).to.be('test2');
            done();
        }, 50)
    });

    it('getProps', (done) => {
        const Demo = React.createClass({
            getInitialState() {
                return {
                    value: 'test1',
                }
            },
            changeValue() {
                this.setState({
                    value: 'test2',
                })
            },
            handleChange(context, data, silence) {
                expect(silence).to.be(true); 
            },
            render() {
                return (
                    <FormField standalone={true} ref="formfield" jsxname="test" value={this.state.value} handleDataChange={this.handleChange} />
                )
            }
        }); 
        instance = ReactDOM.render(<Demo />, div);
        const formFieldNode = instance.refs.formfield;

        expect(formFieldNode.getProps().standalone).to.be(true);
        done();
    })
})