'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _EntityEditor = require('./EntityEditor');

var _EntityEditor2 = _interopRequireDefault(_EntityEditor);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _TextDefaults = require('./TextDefaults');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// EntityEditorDefault higher order component
//
// Default UI for entity editor for modals, headings and error messages
// This component's child component can implement the UI for the editor itself
//
// EntityEditorDefault is just an example, you are encouraged to create your own custom 'EntityEditorXYZ' for your own projects
//

exports.default = function (config) {
    return function (ComposedComponent) {
        var EntityEditorDefault = function (_Component) {
            (0, _inherits3.default)(EntityEditorDefault, _Component);

            function EntityEditorDefault() {
                (0, _classCallCheck3.default)(this, EntityEditorDefault);
                return (0, _possibleConstructorReturn3.default)(this, (EntityEditorDefault.__proto__ || (0, _getPrototypeOf2.default)(EntityEditorDefault)).apply(this, arguments));
            }

            (0, _createClass3.default)(EntityEditorDefault, [{
                key: 'render',


                //
                // render
                //

                value: function render() {
                    if (this.props.isReading) {
                        return _react2.default.createElement(
                            'p',
                            null,
                            'Loading...'
                        );
                    }

                    if (this.props.errorOnRead) {
                        return _react2.default.createElement(
                            'p',
                            null,
                            'Error: ',
                            this.props.errorOnRead.message
                        );
                    }

                    var propsToRemove = _immutable.List.of(
                    // prompts
                    'prompt', 'closePrompt',
                    // after callbacks
                    'afterRead', 'afterCreate', 'afterUpdate', 'afterDelete', 'afterClose');

                    var filteredProps = propsToRemove.reduce(function (filteredProps, propToRemove) {
                        return filteredProps.delete(propToRemove);
                    }, (0, _immutable.fromJS)(this.props)).toJS();

                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'h2',
                            null,
                            this.props.actionName('first'),
                            ' ',
                            this.props.entityName()
                        ),
                        _react2.default.createElement(ComposedComponent, filteredProps),
                        this.renderModal()
                    );
                }
            }, {
                key: 'renderModal',
                value: function renderModal() {
                    if (!this.props.prompt) {
                        return null;
                    }

                    var _props$prompt = this.props.prompt;
                    var title = _props$prompt.title;
                    var message = _props$prompt.message;
                    var status = _props$prompt.status;
                    var type = _props$prompt.type;
                    var yes = _props$prompt.yes;
                    var no = _props$prompt.no;
                    var onYes = _props$prompt.onYes;
                    var onNo = _props$prompt.onNo;


                    if (type == "error") {
                        return _react2.default.createElement(
                            _Modal2.default,
                            {
                                isOpen: true,
                                onRequestClose: this.props.closePrompt,
                                title: title,
                                yes: yes,
                                no: no || null,
                                onYes: onYes,
                                onNo: onNo || null },
                            _react2.default.createElement(
                                'h3',
                                null,
                                'Error ',
                                status,
                                ': ',
                                title
                            ),
                            _react2.default.createElement(
                                'p',
                                null,
                                message
                            )
                        );
                    }

                    return _react2.default.createElement(
                        _Modal2.default,
                        {
                            isOpen: true,
                            onRequestClose: this.props.closePrompt,
                            title: title,
                            yes: yes,
                            no: no || null,
                            onYes: onYes,
                            onNo: onNo || null },
                        _react2.default.createElement(
                            'p',
                            null,
                            message
                        )
                    );
                }
            }]);
            return EntityEditorDefault;
        }(_react.Component);

        return (0, _EntityEditor2.default)({
            prompts: _TextDefaults.defaultPrompts,
            words: _TextDefaults.defaultWords
        })(EntityEditorDefault);
    };
};