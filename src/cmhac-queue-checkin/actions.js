import { actionTypes, declarativeOperations } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import {
	CUSTOM_API_PATH,
	USER_API_PATH,
	CHECK_OUT,
	UPDATE,
	RESET
} from './constants';

export default {
	actionHandlers: {

		[actionTypes.COMPONENT_BOOTSTRAPPED]: ({ dispatch }) => {
			dispatch('HTTP_FETCH_USER');
		},

		'NOW_ALERT#ACTION_CLICKED': ({ action, updateState }) => {
			if (action?.payload?.action?.type === 'dismiss')
				updateState({ message: null })
		},

		HTTP_FETCH_USER: createHttpEffect(`${USER_API_PATH}`, {
			method: 'GET',
			successActionType: 'FETCH_USER_SUCCESS',
			errorActionType: 'FETCH_USER_ERROR'
		}),

		FETCH_USER_SUCCESS: ({ action, dispatch, updateState }) => {
			console.log('users result:', action.payload);
			/**
			 * {result: {
				"user_avatar": "a5d3c898c3222010ae17dd981840dd8b.iix?t=small",
				"user_sys_id": "6816f79cc0a8016401c5a33be04be441",
				"user_name": "admin",
				"user_display_name": "System Administrator",
				"user_initials": "SA"
				}}
			 */
			//operation required to set shouldRender to false per docs
			updateState({
				user: action.payload.result,
				operation: declarativeOperations.ASSIGN,
				shouldRender: false
			})

			dispatch('HTTP_FETCH_ITEMS', {
				sysparm_query: `user=${action.payload.result.user_sys_id}`,
				sysparm_display_value: true,
			})
		},

		FETCH_USER_ERROR: ({ action, updateState, }) => {
			console.log(action.payload || 'Request failed')
			updateState({ loadingUsers: false, message: { status: 'critical', icon: 'circle-exclamation-fill', content: 'Error Occured During Fetch User' } });
		},

		'NOW_DROPDOWN#SELECTED_ITEMS_SET': ({ action, updateState, state }) => {
			const payload = action.payload?.value?.[0];

			if (!payload)
				return

			const [sys_id, valueStr] = payload.split('|');
			const value = valueStr;

			if (!sys_id || !value)
				return;

			const items = state.items.map((item) =>
				item.sys_id === sys_id ? { ...item, max_capacity: value } : item
			);

			updateState({ items });
		},

		HTTP_FETCH_ITEMS: createHttpEffect('/api/now/table/awa_agent_capacity', {
			method: 'GET',
			queryParams: ['sysparm_query', 'sysparm_display_value'],
			successActionType: 'HTTP_FETCH_ITEMS_SUCCESS',
			errorActionType: 'HTTP_FETCH_ITEMS_ERROR'
		}),

		HTTP_FETCH_ITEMS_SUCCESS: ({ action, updateState }) => {
			console.log(action.payload.result)
			if (Array.isArray(action.payload.result) && action.payload.result.length !== 0) {
				updateState({ items: action.payload.result, loadingItems: false });
			}else{
				updateState({ items: [], loadingItems: false, message: { status: 'critical', icon: 'circle-exclamation-fill', content: 'You are not a member of any queues.' } })
			}
		},

		HTTP_FETCH_ITEMS_ERROR: ({ action, updateState }) => {
			console.log(action.payload || 'Request failed')
			updateState({ message: { status: 'critical', icon: 'circle-exclamation-fill', content: 'Error Occured During Fetch Items' } })
		},

		HTTP_SUBMIT: createHttpEffect(`${CUSTOM_API_PATH}/${UPDATE}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			dataParam: 'payload',
			successActionType: 'HTTP_SUBMIT_SUCCESS',
			errorActionType: 'HTTP_SUBMIT_ERROR'
		}),

		HTTP_SUBMIT_SUCCESS: ({ action, updateState }) => {
			console.log('results array:', action.payload.result)
			updateState({ updating: false, items: action.payload.result.items, message: { status: 'positive', icon: 'check-fill', content: 'Updated Succesfully!' } })
		},

		HTTP_SUBMIT_ERROR: ({ action, updateState }) => {
			console.log(action.payload || 'Request failed')
			updateState({ updating: false, message: { status: 'critical', icon: 'circle-exclamation-fill', content: 'Error Occured During Submit' } })
		},

		HTTP_CHECK_OUT: createHttpEffect(`${CUSTOM_API_PATH}/${CHECK_OUT}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			dataParam: 'payload',
			successActionType: 'HTTP_CHECK_OUT_SUCCESS',
			errorActionType: 'HTTP_CHECK_OUT_ERROR'
		}),

		HTTP_CHECK_OUT_SUCCESS: ({ action, updateState }) => {
			console.log('results array:', action.payload.result)
			updateState({ updating: false, items: action.payload.result.items, message: { status: 'positive', icon: 'check-fill', content: 'Updated Succesfully!' } })
		},

		HTTP_CHECK_OUT_ERROR: ({ action, updateState }) => {
			console.log(action.payload || 'Request failed')
			updateState({ updating: false, message: { status: 'critical', icon: 'circle-exclamation-fill', content: 'Error Occured During Check Out' } })
		},

		HTTP_RESET: createHttpEffect(`${CUSTOM_API_PATH}/${RESET}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			dataParam: 'payload',
			successActionType: 'HTTP_RESET_SUCCESS',
			errorActionType: 'HTTP_RESET_ERROR'
		}),

		HTTP_RESET_SUCCESS: ({ action, updateState }) => {
			console.log('results array:', action.payload.result)
			updateState({ updating: false, items: action.payload.result.items, message: { status: 'positive', icon: 'check-fill', content: 'Updated Succesfully!' } })
		},

		HTTP_RESET_ERROR: ({ action, updateState }) => {
			console.error(action.payload || 'Request failed')
			updateState({ updating: false, message: { status: 'critical', icon: 'circle-exclamation-fill', content: 'Error Occured During Reset' } })
		},
	},
}