/**
 * FormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';

import Form from 'uxcore-form/build/Form';
import FormRow from 'uxcore-form-row';
import Button from 'uxcore-button';
import Icon from 'uxcore-icon';
import Tooltip from 'uxcore-tooltip';
import FormField from '../src';

const { createFormField } = FormField;
const CustomField = createFormField();

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        custom: '111',
      },
    };
  }

  render() {
    return (
      <div>
        <Form
          jsxvalues={this.state.value}
        >
          <FormRow>
            <FormField
              inputBoxMaxWidth="middle"
              data-spm="2"
              jsxname="test1"
              jsxlabel={(
                <div>
                  <span>
                    表单1
                  </span>
                  <Icon name="tishi-full" style={{ color: '#3C99D8' }} />
                </div>
              )}
              required
              jsxflex={2}
              jsxrules={{
                validator: () => false,
                errMsg: 'error test',
              }}
            />
            <FormField jsxname="test2" jsxlabel="表单2" />
          </FormRow>
          <CustomField
            jsxname="custom"
            jsxlabel="标题很长标题很长标题很长标题很长标题很长"
            placeholder="111"
            tipInLabel
            required
            requiredErrMsg={123123}
            jsxtips="提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提
            示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示
            文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字提示文字"
            labelMatchInputHeight={false}
            renderFieldAddon={() => (
              <div>
                表单域定制部分
              </div>
            )}
          // verticalAlign
          />
        </Form>
        <FormField
          standalone
          jsxname="1"
          jsxlabel="test"
          message={{
            type: 'error',
            message: 'error test',
          }}
        />
        <Button
          onClick={() => {
            this.setState({
              value: {
                custom: '111111',
              },
            });
          }}
        >
          改变表单的值

        </Button>
      </div>
    );
  }
}

export default Demo;
