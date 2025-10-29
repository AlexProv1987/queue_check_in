import '@servicenow/now-button';
import '@servicenow/now-loader';
import '@servicenow/now-alert';
import '@servicenow/now-card';
import '@servicenow/now-dropdown';
import { CAPACITY_NUM_ARR } from './constants';

export default (state, { updateState, dispatch }) => {

	const {
		items,
		loadingItems,
		updating,
		message,
		user,
		properties: { pageTitle, submitLabel, checkOutLabel, resetLabel },
	} = state;

	return (
		<main>
			<div className='page'>
				<div className='alert-wrapper'>
					{message && (
						<now-alert
							status={message.status}
							icon={message.icon}
							header={message.header}
							content={message.content}
							action={{ type: 'dismiss' }}
						/>
					)}
				</div>
				{/**error/success msgs here */}
				<div className="header">
					<div className="header-title">{pageTitle}
						<span>
							<now-button-stateful
								disabled={loadingItems || items?.length === 0 ? true : false}
								icon="sync-fill"
								variant="primary"
								tooltip-content='Refresh'
								size='lg'
								on-click={() => {
									updateState({ loadingItems: true }), dispatch('HTTP_FETCH_ITEMS', {
										sysparm_query: `user=${user.user_sys_id}`,
										sysparm_display_value: true,
									})
								}}
							/>
						</span>
					</div>

					<div className="header-actions">
						{updating ? (
							<now-loader label="Updating..." size="lg" />
						) : (
							<div>
								<now-button
									disabled={loadingItems || items?.length === 0 ? true : false}
									style={{ marginRight: '3px' }}
									tooltip-content="Save Changes"
									size="md"
									variant="primary"
									label={submitLabel}
									on-click={() => { updateState({ updating: true }), dispatch('HTTP_SUBMIT', { payload: { items: items } }) }}
								/>
								<now-button
									disabled={loadingItems || items?.length === 0 ? true : false}
									style={{ marginRight: '3px' }}
									tooltip-content="Reset to default for all queues"
									size="md"
									variant="primary"
									label={resetLabel}
									on-click={() => { updateState({ updating: true }), dispatch('HTTP_RESET', { payload: { items: items } }) }}
								/>
								<now-button
									disabled={loadingItems || items?.length === 0 ? true : false}
									style={{ marginRight: '3px' }}
									tooltip-content="Sets all queues to 0 Capacity"
									size="md"
									variant="primary"
									label={checkOutLabel}
									on-click={() => { updateState({ updating: true }), dispatch('HTTP_CHECK_OUT', { payload: { items: items } }) }}
								/>
							</div>
						)}
					</div>
				</div>
				<div>
					{loadingItems ? (
						<now-loader label="Loading..." size="lg" />
					) : (
						<div className="card-grid">
							{items.map((item, index) => (
								<now-card size="lg" key={index}>
									<now-card-header
										style={{ marginTop: '10px' }}
										tagline={{ icon: 'document-outline', label: 'Queue' }}
										heading={{ label: item.channel.display_value, size: 'md', }} />
									<now-card-divider full-width />
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											padding: '5px 0'
										}}
									>
										<now-dropdown
											disabled={updating ? true : false}
											id={item.sys_id}
											tooltip-content="Select Capacity"
											select="single"
											config-label={{ label: 'Capacity' }}
											config-aria={{
												trigger: { 'aria-label': 'Select an item' },
												panel: { 'aria-label': 'Assigned to' }
											}}
											items={CAPACITY_NUM_ARR.map(capacity => ({ id: `${item.sys_id}|${capacity}`, label: String(capacity) }))}
											selected-items={[`${item.sys_id}|${item.max_capacity ? item.max_capacity : item.applied_max_capacity}`]}
											manage-selected-items
											style={{
												width: '80%',
												margin: '8px 0',
												'--now-dropdown-min-width': '100%'
											}}
										></now-dropdown>
									</div>
									<now-card-divider full-width />
									<now-card-footer label={{ start: 'Last Updated', end: `${item.sys_updated_on}` }} />
								</now-card>

							))}
						</div>
					)}
				</div>
			</div>
		</main>
	)
};
