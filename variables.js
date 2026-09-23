export function initVariables() {
	// API 2.x: setVariableDefinitions takes an object keyed by variable id,
	// not the array of { variableId, name } used up to 1.x.
	this.setVariableDefinitions({
		SELECTED_CLIP_TITLE: { name: 'Title of selected clip' },
		SELECTED_CLIP_STATUS: { name: 'Status of selected clip' },
		DECODER_A_CLIP_TITLE: { name: 'Title of decoder A clip' },
		DECODER_A_CLIP_STATUS: { name: 'Status of decoder A clip' },
		DECODER_B_CLIP_TITLE: { name: 'Title of decoder B clip' },
		DECODER_B_CLIP_STATUS: { name: 'Status of decoder B clip' },
	})
}
