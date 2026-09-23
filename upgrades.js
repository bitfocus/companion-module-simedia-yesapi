export default [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	// Move the password from the plain config to the secrets store (field became 'secret-text')
	function (context, props) {
		const config = props.config
		if (!config || config.pass === undefined) {
			return { updatedConfig: null, updatedSecrets: null, updatedActions: [], updatedFeedbacks: [] }
		}
		const { pass, ...updatedConfig } = config
		return {
			updatedConfig,
			updatedSecrets: { ...(props.secrets ?? {}), pass },
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
]
