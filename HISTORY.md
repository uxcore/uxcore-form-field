# history

## 0.3.20 / 2022-04-19
* `FIXED` break down when there's react element in props.value

## 0.3.17 / 2019-06-18
`NEW` add new prop showTipAlways

## 0.3.16 / 2019-06-12
* `FIXED` when required && requiredErrMsg is set, jsxrules will auto add not empty rule
* `NEW` add new prop requiredErrMsg for required prop

## 0.3.15 / 2019-06-12
* `CHANGED` revert to 0.3.11

## 0.3.14 / 2019-06-10
* `FIXED` when required is set, jsxrules will auto add not empty rule

## 0.3.12 / 2019-05-20
* `FIXED` when required is set, jsxrules will auto add not empty rule
* `NEW` add new prop requiredErrMsg for required prop

## 0.3.11 / 2019-04-12

* `CHANGED` remove errMsg type check
* `FIXED` remove jquery method in test case

## 0.3.10 / 2018-09-11

* `CHANGED` support js style export

## 0.3.8 / 2018-09-11

* `CHANGED` remove jQuery dev dependency
* `FIXED` validate bug if instantValidate is undefined

## 0.3.7 / 2018-09-10

* `CHNAGED` fix eslint errors
* `CHANGED` use prefixCls for every dom node
* `NEW` support new prop `tipInLabel`

## 0.3.6 / 2018-06-29

* `FIXED` async doValidate typo

## 0.3.0 / 2018-06-07

* `CHANEGD` support React@16

## 0.2.38 / 2018-06-04

* `CHANGED` support new prop `renderFieldAddon`

## 0.2.36 / 2018-03-14

* `CHANGED` remove useless `jsxplaceholder` propType & defaultProps config

## 0.2.35 / 2018-03-12

* `CHANGED` change grid percent to match the expected behaviour

## 0.2.33 / 2018-01-03

* `NEW` support new prop `gridLayout`

## 0.2.32 / 2017-12-13

* `FIXED` message whose type is error fail to make field content error status

## 0.2.30 / 2017-11-20

* `CHANGED` label support jsx
* `NEW` new prop `labelWidth`

## 0.2.29 / 2017-11-20

* `CHANGED` support `processValue` prop to filter the value change

## 0.2.27 / 2017-11-16

* `CHANGED` add new prop `inputBoxMaxWidth`

## 0.2.26 / 2017-11-16

* `CHANGED` remove icon in tips & error message

## 0.2.25 / 2017-11-14

* `CHANGED` add new _prop `isAllViewMode`

## 0.2.24 / 2017-10-31

* `CHANGED` add root className for different layout

## 0.2.23 / 2017-10-13

* `CHANGED` fit React@15

## 0.2.22 / 2017-09-27

* `CHANGED` createFormField support new option `specificClass`

## 0.2.20 / 2017-09-22

* `CHANGED` add method `getSize`

## 0.2.19 / 2017-09-20

* `FIXED` global verticalAlign will override single field's.

## 0.2.18 / 2017-08-21

* `CHANGED` cjs module to es module
* `CHANGED` replace `deep-equal` with `lodash/isEqual`

## 0.2.17 / 2017-08-15

* `CHANGED` instant validation fails to work due to fromRest logic.

## 0.2.15 / 2017-08-15

* `CHANGED` do not validate when props.value is changed.

## 0.2.14 / 2017-06-19

* `CHANGED` support `data-*` props

## 0.2.13 / 2017-04-20

* `CHANEGD` add view className in root mode.

## 0.2.12 / 2017-04-07

* `FIXED` when labelMatchInputHeight is set, empty tips will take up place.

## 0.2.11 / 2017-03-29

* `FIXED` createFormField default renderView does not return value
* `CHANGED` labelMatchInputHeight only work in edit mode

## 0.2.10 / 2017-03-23

* `FIXED` label position bug if jsxshowLabel is false

## 0.2.9

* `CHANGED` add more propTypes validation

## 0.2.8

* `CHANGED` add additional className for message content.

## 0.2.7

* `CHANGED` createFormField will prevent `valuePropName` & `changePropName` passing to the component

## 0.2.6

* `NEW` add new API `createFormField`

## 0.2.5

* `CHANGED` optimize `addSpecificClass` logic

## 0.2.4

* `CHANGED` add new method `getFieldCore`

## 0.2.3

* `FIXED` handleDataChange logic bug in async validate mode.

## 0.2.2

* `CHANGED` validation will be triggered if value is changed.

## 0.2.1

* `FIXED` resolve will fail in async validation mode.

## 0.2.0

* `CHANGED` remove `_isEqual` method
* `NEW` support async validation

## 0.1.9

* `CHANGED` doValidate support always params. (form [#114](https://github.com/uxcore/uxcore-form/issues/114))

## 0.1.8

* `FIX` fix key warnings.

## 0.1.7

* `FIX` selectFormField depends on the _isEqual method of FormField

## 0.1.6

* `NEW` support a new prop `labelMatchInputHeight` which can make the label match input height.

## 0.1.5

* `CHANGED` add getProps() method

## 0.1.4

* `CHANGED` add silence param in `handleDataChange` method

## 0.1.3

* `FIX` width calculation bug in standalone mode
* `CHANGED` add setValue method which enable slient value setting.

## 0.1.2

`CHANGED` add `totalFlex` prop
