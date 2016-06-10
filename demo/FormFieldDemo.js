/**
 * FormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let FormField = require('../src');
let Form = require('uxcore-form/build/Form');
let FormRow = require('uxcore-form-row');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <Form>
                    <FormRow>
                        <FormField jsxname="test1" jsxlabel="表单1" jsxflex={2} jsxrules={{validator: function() {return false;}, errMsg: 'error test'}}/>
                        <FormField jsxname="test2" jsxlabel="表单2" />
                    </FormRow>
                </Form>
                <FormField standalone={true} jsxname="1" jsxlabel="test" message={{type: 'error', message: 'error test'}}/>
            </div>
        );
    }
};

module.exports = Demo;
