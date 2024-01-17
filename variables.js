exports.initVariables = function () {
	const variables = [
		{
			name: 'Title of selected clip',
			variableId: 'SELECTED_CLIP_TITLE',
		},
		{
			name: 'Status of selected clip',
			variableId: 'SELECTED_CLIP_STATUS',
		},
		{
			name: 'Title of decoder A clip',
			variableId: 'DECODER_A_CLIP_TITLE',
		},
		{
			name: 'Status of decoder A clip',
			variableId: 'DECODER_A_CLIP_STATUS',
		},
		{
			name: 'Title of decoder B clip',
			variableId: 'DECODER_B_CLIP_TITLE',
		},
		{
			name: 'Status of decoder B clip',
			variableId: 'DECODER_B_CLIP_STATUS',
		}
  ]
	this.setVariableDefinitions(variables)
}