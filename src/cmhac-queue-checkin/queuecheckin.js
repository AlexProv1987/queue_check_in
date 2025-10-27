/**
 * 
 * createCustomElement('cmhac-queue-checkin', {
	renderer: {type: snabbdom},
	view,
	styles
});
 */
import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import queueActions from './actions'
import view from './view'

createCustomElement('cmhac-queue-checkin', {
	renderer: { type: snabbdom },
	view,
	styles,
	initialState: {
		user: null,
		message: null,
		items: null,
		loadingItems: true,
		updating: false,
	},
	properties: {
		pageTitle: {
			default: 'My Queue Capacities',
			schema: {
				type: 'string',
				title: 'Header Text',
				description: 'Main Header'
			}
		},
		submitLabel: {
			default: 'Submit',
			schema: {
				type: 'string',
				title: 'Submit Button',
				description: 'Button Text'
			}
		},
		checkOutLabel: {
			default: 'Check Out',
			schema: {
				type: 'string',
				title: 'Check out Button',
				description: 'Button Text'
			}
		},
		resetLabel: {
			default: 'Reset',
			schema: {
				type: 'string',
				title: 'Reset Button',
				description: 'Button Text'
			}
		}
	},
	...queueActions,
});
