import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import EntityEditorTRCPermissions from 'trc-client-core/src/components/EntityEditorTRCPermissions';

import {
    requestUserGet,
    requestUserList,
    requestUserCreate,
    requestUserUpdate,
    requestUserDelete,
    requestOrganizationList
} from 'trc-client-core/src/utils/APIActions';

import {
    TRC_USER_GET_FETCH,
    TRC_USER_GET_ERROR,
    TRC_USER_CREATE_FETCH,
    TRC_USER_CREATE_ERROR,
    TRC_USER_UPDATE_FETCH,
    TRC_USER_UPDATE_ERROR,
    TRC_USER_DELETE_FETCH,
    TRC_USER_DELETE_ERROR
} from 'trc-client-core/src/utils/APIActionTypes';

//
// UserEntityEditorConnect higher order component
// Provides connection with redux for user editor
//

export default (config) => (ComposedComponent) => {

	class UserEntityEditorConnect extends Component {

		componentWillMount() {
	        this.props.dispatch(requestOrganizationList());
        	this.props.dispatch(requestUserList());
	    }

	    getWriteError() {
	    	const error = this.props.writeError;
	    	if(!error) {
	    		return null;
	    	}
	    	const status = error.get('status');
	    	if(status == 409) {
	    		return error
	    			.set('message', 'A user already exists with this email address. Please choose a different email address.');
	    	}
	    	return error;
	    }

	    handleRead(id) {
	        return this.props.dispatch(requestUserGet(id));
	    }

	    handleCreate(dataObject) {
	        return this.props
	            .dispatch(requestUserCreate(dataObject))
	            .then(
	                (data) => Promise.resolve({
	                	dataObject: data.payload,
						newId: data.payload.userId
	                })
	            );
	    }

	    handleUpdate(id, dataObject) {
	        return this.props
	            .dispatch(requestUserUpdate(id, dataObject));
	    }

	    handleDelete(id) {
	        return this.props
	            .dispatch(requestUserDelete(id));
	    }

	    handleWriteError(error) {
	    	console.log(error);
	    	return error;
	    }

	    // no default close behaviour as it's specific to each form usage
	    // pass a close function in as an "onClose" prop

		render() {

			const {
				id,
	            users
	        } = this.props;

			const initialValues = users
	            ? users
	                .toMap()
	                .get(id, Map())
	                .toJS()
	            : {};

			return (
				<ComposedComponent
					{...this.props}
	                entityName="user"
	                initialValues={initialValues}
	                onRead={this.handleRead.bind(this)}
                	onCreate={this.handleCreate.bind(this)}
                	onUpdate={this.handleUpdate.bind(this)}
                	onDelete={this.handleDelete.bind(this)}
                	writeError={this.getWriteError()}
				/>
			);
		}
	}

	UserEntityEditorConnect.propTypes = {
		// from props list
		id: PropTypes.any,
		willCopy: PropTypes.bool,
	    permitCreate: PropTypes.bool,
        permitUpdate: PropTypes.bool,
        permitDelete: PropTypes.bool,
        // from redux
		dispatch: PropTypes.func,
	    history: PropTypes.object,
	    reading: PropTypes.bool,
	    creating: PropTypes.bool,
	    updating: PropTypes.bool,
	    deleting: PropTypes.bool
	};

	const connectWithRedux = connect(
	    (state) => ({
	        users: state.user.get('collection'),
	        reading: state.async.get(TRC_USER_GET_FETCH),
	        creating: state.async.get(TRC_USER_CREATE_FETCH),
	        updating: state.async.get(TRC_USER_UPDATE_FETCH),
	        deleting: state.async.get(TRC_USER_DELETE_FETCH),
	        readError: state.async.get(TRC_USER_GET_ERROR),
	        writeError: state.async.get(TRC_USER_CREATE_ERROR)
	            || state.async.get(TRC_USER_UPDATE_ERROR)
	            || state.async.get(TRC_USER_DELETE_ERROR),
	        organizations: state.organization.get('collection').toList(),
	        jobTitles: state.user.get('jobTitles').toList()
	    })
	);

	return EntityEditorTRCPermissions({
		apiPermission: 'USER'
	})(connectWithRedux(UserEntityEditorConnect));
};
