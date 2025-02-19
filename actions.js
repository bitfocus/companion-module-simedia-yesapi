exports.initActions = function () {
	let self = this
	let actions = {}
	/**
	 * All actions here send a PUT to Yes Apiu gateway, now all the action are use to create a concatenated url for the fetch
	 * the URL is create by an ACTION CALL MANAGER that create the call with che parameters you send in che function actionCallManager()
	 * 
	 * The FIRST parameter is the name of the action (cue, play,stop...)
	 * 
	 * The SECOND parameter is what is necessary for YES APY GATEWAY to execute correwctly:
	 * 
	 * -id = action that require ID, for example the id of the item to play
	 * 
	 * -null = action that require only the name, stop all and next clip don't requires ID
	 * 
	 * -ClipUP & ClipDOWN = are required to start a funcion to set the new selection and change the ID of selected clip Globally and send a call for that
	 * 
	 * -LOOP = is required this parameter because the manager need to check the loop status if the object is already in lopp
	 */


	actions['cue'] = {
		name: 'cue',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'cue' , 'id');
		},
	}
	actions['recue'] = {
		name: 'recue',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'recue' , 'id');
		},
	}
	actions['play'] = {
		name: 'play',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'play' , 'id');
		},
	}
	actions['playGraphics'] = {
		name: 'playGraphics',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'playfirstgraphics' , 'id');
		},
	}
	actions['pause'] = {
		name: 'pause',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'pause' , 'id');
		},
	}
	actions['stop'] = {
		name: 'stop',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'stop' , 'id');
		},
	}
	actions['stopAll'] = {
		name: 'stopAll',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'stopall' , '');
		},
	}
	actions['nextClip'] = {
		name: 'nextClip',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'next' , '');
		},
	}
	actions['clipUp'] = {
		name: 'clipUp',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'select' , 'clipUp');
		},
	}
	actions['clipDown'] = {
		name: 'clipDown',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'select' , 'clipDown');
		},
	}
	actions['loop'] = {
		name: 'loop',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'loop' , 'loop');
		},
	}
	actions['decACue'] = {
		name: 'cue',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'decodercue' , 'decACue');
		},
	}
	actions['decARecue'] = {
		name: 'recue',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'recue' , 'decA');
		},
	}
	actions['decAPlay'] = {
		name: 'play',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'play' , 'decA');
		},
	}
	actions['decAPause'] = {
		name: 'pause',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'pause' , 'decA');
		},
	}
	actions['decANext'] = {
		name: 'next',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'decodernext' , 'decANext');
		},
	}
	actions['decALoop'] = {
		name: 'loop',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'loop' , 'decALoop');
		},
	}
	actions['decAStop'] = {
		name: 'stop',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'stop' , 'decA');
		},
	}
	actions['decBCue'] = {
		name: 'cue',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'decodercue' , 'decBCue');
		},
	}
	actions['decBRecue'] = {
		name: 'recue',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'recue' , 'decB');
		},
	}
	actions['decBPlay'] = {
		name: 'play',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'play' , 'decB');
		},
	}
	actions['decBPause'] = {
		name: 'pause',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'pause' , 'decB');
		},
	}
	actions['decBNext'] = {
		name: 'next',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'decodernext' , 'decBNext');
		},
	}
	actions['decBLoop'] = {
		name: 'loop',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'loop' , 'decBLoop');
		},
	}
	actions['decBStop'] = {
		name: 'stop',
		options: [],
		callback: () => {
			self.actionCallManager('studio', 'stop' , 'decB');
		},
	}
	actions['recorderRec'] = {
		name: 'rec',
		options: [],
		callback: () => {
			self.actionCallManager('recorder', 'rec', '', {recordingID: "", fileName: ""});
		},
	}
	actions['recorderStop'] = {
		name: 'stop',
		options: [],
		callback: () => {
			self.actionCallManager('recorder', 'stop');
		},
	}
	actions['channelPlay'] = {
		name: 'play',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'play');
		},
	}
	actions['channelEmergency'] = {
		name: 'emergency',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'emergency');
		},
	}
	actions['channelNext'] = {
		name: 'next',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'next');
		},
	}
	actions['channelLoop'] = {
		name: 'loop',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'loop', '?loop=1');
		},
	}
	actions['channelUnloop'] = {
		name: 'unloop',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'loop', '?loop=0');
		},
	}
	actions['channelPause'] = {
		name: 'pause',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'pause');
		},
	}
	actions['channelStop'] = {
		name: 'stop',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'stop');
		},
	}
	actions['channelRefresh'] = {
		name: 'refresh',
		options: [],
		callback: () => {
			self.actionCallManager('channel', 'refresh');
		},
	}
	this.setActionDefinitions(actions)
}
