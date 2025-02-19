const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const presets = require('./presets')
const actions = require('./actions')
const variables = require('./variables')
const feedback = require('./feedbacks')

class ModuleInstance extends InstanceBase {
	//Variables of decoders
		decoderA;
		decoderB;
	//An object array of all the clips in the current rundown
		clips;
	//Variables of the current selection ()
		selectedClipId;
		selectedClipIndex;
	//Variables for the string concatenation during the http request  
		httpStudioPlayer;
		httpEndpoint;
		httpAuthorizationHeader;
		httpRecorder;
		httpChannelPlayer;
		actionEndPoint;
	//Variables of the token
		token = '';
		tokenExpireDate;
		checkStatusTime;
	//Variables for control the promise
		openConnectionForToken;
		openConnectionForStatus;
	//Variable for chack if there is a match between clips when open a new rundown
		checkListOfClips;
	constructor(internal) {
		super(internal)
		Object.assign(this, {
			...presets,
			...actions,
			...variables,
			...feedback
		})
	}
	async destroy() {
		this.endTokenAndStatus()
		this.log('debug', 'destroy')
	}
	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'user',
				label: 'Username',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'pass',
				label: 'Password',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port (Yes API Gateway)',
				default:5030,
				width: 6,
				regex: this.REGEX_PORT,
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Hostname (Yes API Gateway)',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'studioId',
				label: 'Current Studio ID',
				width: 6,
				required: true,
			},
			{
				type: 'number',
				id: 'requestStatus',
				label: 'Request Status Time (Min 500 Max 2000)',
				width: 6,
				default: 750,
        		min: 500,
        		max: 2000,
			},
			{
				type: 'textinput',
				id: 'encoderId',
				label: 'Current Encoder ID',
				width: 6
			},
			{
				type: 'textinput',
				id: 'channelId',
				label: 'Current Channel ID',
				width: 6
			}
		]
	}
	async init(config) {
		this.updateStatus(InstanceStatus.Disconnected)
		this.config = config
		this.initPresets()
		this.initActions()
		this.initVariables()
		this.initFeedback()
		this.checkListOfClips = true;
		this.loadingOrder();
	}
	async configUpdated(config) {
		this.config = config
		this.openConnectionForToken = false
		this.openConnectionForStatus = false
		this.updateStatus(InstanceStatus.Connecting)
		setTimeout(() => {
			this.lanchConfig()
			}, 3000)
	}

	/** lanch Config */
	lanchConfig(){
		if (this.config.host && this.config.port && this.config.pass && this.config.user) {
			try {
				if ( this.openConnectionForToken === true || this.openConnectionForStatus === true){
				this.endTokenAndStatus()
				}
			}catch (error){
				this.endTokenAndStatus()
				console.log('Config error: ', error)
			}finally{
				this.loadingOrder();
			}
		}else{
			console.log('Missing Confing unable to connect')
		}
	}

	/** Close the calls for token refresher and status request */
	endTokenAndStatus(){
		this.openConnectionForToken = false;
		this.openConnectionForStatus = false;
		this.updateStatus(InstanceStatus.Disconnected)
	}

	/** Start Token and Status requests */
	async loadingOrder(){
		this.updateStatus(InstanceStatus.Connecting)
		this.openConnectionForToken = true;
		this.openConnectionForStatus = true;
		this.checkStatusTime = this.config.requestStatus;
		this.selectedClipIndex = 0;
		this.createUrl();
		this.createEncriptedHeader();
		await this.connectToYesApyGatweway();
		await this.getCurrentStatus();
	}

	/** String concatenarion to create the endpoints */
	createUrl(){
		this.httpEndpoint = `http://${this.config.host}:${this.config.port}/v1/`;
		this.httpStudioPlayer = `http://${this.config.host}:${this.config.port}/v1/studios/${this.config.studioId}/player/`;
		this.httpRecorder = `http://${this.config.host}:${this.config.port}/v1/recorders/`;
		this.httpChannelPlayer =  `http://${this.config.host}:${this.config.port}/v1/channels/${this.config.channelId}/player/`;
	}

	/** String concatenarion to create and encripted the header */
	createEncriptedHeader(){
		this.httpAuthorizationHeader = `Basic ${(Buffer.from((`${this.config.user}:${this.config.pass}`), 'utf-8')).toString('base64')}`;
	}

	/** Request to obtain the token from YES API GATEWAY  */
	async connectToYesApyGatweway(){	
		try {
			const url = `${this.httpEndpoint}token`;
			const body = JSON.stringify({})
			const response = await fetch(url, {
				method: 'post',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': this.httpAuthorizationHeader
				}
			});
			const data = await response.json();
			if (data.accessToken){
				this.updateStatus(InstanceStatus.Ok)
				this.token = data.accessToken;
				this.tokenExpireDate = Date.parse(data.expireDate);
				console.log('Connected to: YES API GATEWAY')
			} else {
				this.status(this.STATUS_WARNING, 'Connecting')
			}
		} catch(error) {
			this.updateStatus(InstanceStatus.ConnectionFailure)
		console.log('Error in connection with Yes Api Gateway: ',error)
		}
		this.tokenStatusRefresher()
	}

	/** Promise for setting the time of token refresher */
	async tokenStatusRefresher(){
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.openConnectionForToken === true) {
					resolve([
						this.connectToYesApyGatweway()
					])
				} else {
					reject(console.log('Connection with YES API Gateway: Closed'))
				}
			}, 300000)
		}).catch(function () {
     console.log("Refresh token Ended");
		})
	}

	/** Request the status of the player */
	async getCurrentStatus(){
		try {	
			const url = `${this.httpStudioPlayer}status`;
			const response = await fetch(url, {
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.token}`
				}
			});
			const data = await response.json();
			/*
			Check if the selected clip (with action method 'selectById') is the same of the current clip id
			The selection of the clip (variable:selectedClipId) is made by the button 'up' and 'down' 
			The current selection of the clip (variable: currentClip...) is made in this method and use in the request of the other buttons(play, pause,...)
			When you open a rundown or init the app, checkListOfClips true set for only once the selected clip at the first element of the clips.
			*/
			this.decoderA = data.decoderA;
			this.decoderB = data.decoderB;
			this.clips = data.clips;
			if (data.clips.length){
				console.log('< Working with clip:',this.selectedClipId,'>')
				if (this.checkListOfClips === true){
					this.doActions(`${this.httpStudioPlayer}select?clipId=${data.clips[0].id}`)
					this.checkListOfClips = false;
				}				
				if (data.selectedClip.id !== this.selectedClipId) {					
					this.selectedClipId = data.selectedClip.id;
					this.selectedClipIndex = data.clips.findIndex(object => {
						return object.id === data.selectedClip.id;
					})
					if (this.selectedClipIndex === -1){this.selectedClipIndex = 0}
				}
			} else {
					console.log(`< Rundown or Clip not found >`)
					this.checkListOfClips = true;
			}
			this.setVariableNameAndStatus();
			this.checkFeedbacks();

		} catch (error) {
			console.log('Error in reach the current clip status: ',error)
		}
		this.clipStatusRefresher();
	}

	/** Change the name of the button preset (check in presets.js) "Show Currtent Clip" and "Show Currtent Status" */
	setVariableNameAndStatus(){
		this.setVariableValues({ [`SELECTED_CLIP_TITLE`]: `${this.clips[this.selectedClipIndex]?.title || 'NO DATA'}` });
		switch (this.clips[this.selectedClipIndex]?.status) {
			case 0: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'CUEING'}); break;
			case 1: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'CUED'}); break;
			case 2: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'PREROLL'}); break;
			case 3: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'ON AIR'}); break;
			case 4: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'READY'}); break;
			case 5: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'OFFLINE'}); break;
			case 6: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'NOT LINKED'}); break;
			case 7: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'EXCLUDED'}); break;
			case 8: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'AS RUN'}); break;
			case 9: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'PAUSED'}); break;
			case 10: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'PLACEHOLDER'}); break;
			case 11: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'LOOP'}); break;
			case 12: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP1'}); break;
			case 13: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'EMPTY STORY'}); break;
			case 14: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP1 ON AIR'}); break;
			case 15: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP2'}); break;
			case 16: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP2 ON AIR'}); break;
			case 17: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP3'}); break;
			case 18: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP3 ON AIR'}); break;
			case 19: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP1 CUED'}); break;
			case 20: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP2 CUED'}); break;
			case 21: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'TP3 CUED'}); break;
			default: 	this.setVariableValues({['SELECTED_CLIP_STATUS']: 'NO STATUS'});break;
		}
		this.setVariableValues({ [`DECODER_A_CLIP_TITLE`]: `${this.decoderA?.currentClip?.title || 'NO DATA'}` });
		switch (this.decoderA?.currentClip?.status) {
			case 0: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'CUEING'}); break;
			case 1: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'CUED'}); break;
			case 2: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'PREROLL'}); break;
			case 3: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'ON AIR'}); break;
			case 4: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'READY'}); break;
			case 5: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'OFFLINE'}); break;
			case 6: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'NOT LINKED'}); break;
			case 7: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'EXCLUDED'}); break;
			case 8: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'AS RUN'}); break;
			case 9: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'PAUSED'}); break;
			case 10: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'PLACEHOLDER'}); break;
			case 11: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'LOOP'}); break;
			case 12: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP1'}); break;
			case 13: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'EMPTY STORY'}); break;
			case 14: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP1 ON AIR'}); break;
			case 15: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP2'}); break;
			case 16: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP2 ON AIR'}); break;
			case 17: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP3'}); break;
			case 18: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP3 ON AIR'}); break;
			case 19: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP1 CUED'}); break;
			case 20: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP2 CUED'}); break;
			case 21: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'TP3 CUED'}); break;
			default: 	this.setVariableValues({['DECODER_A_CLIP_STATUS']: 'NO STATUS'});break;
		}
		this.setVariableValues({ [`DECODER_B_CLIP_TITLE`]: `${this.decoderB?.currentClip?.title || 'NO DATA'}` });
		switch (this.decoderB?.currentClip?.status) {
			case 0: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'CUEING'}); break;
			case 1: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'CUED'}); break;
			case 2: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'PREROLL'}); break;
			case 3: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'ON AIR'}); break;
			case 4: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'READY'}); break;
			case 5: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'OFFLINE'}); break;
			case 6: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'NOT LINKED'}); break;
			case 7: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'EXCLUDED'}); break;
			case 8: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'AS RUN'}); break;
			case 9: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'PAUSED'}); break;
			case 10: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'PLACEHOLDER'}); break;
			case 11: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'LOOP'}); break;
			case 12: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP1'}); break;
			case 13: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'EMPTY STORY'}); break;
			case 14: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP1 ON AIR'}); break;
			case 15: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP2'}); break;
			case 16: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP2 ON AIR'}); break;
			case 17: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP3'}); break;
			case 18: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP3 ON AIR'}); break;
			case 19: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP1 CUED'}); break;
			case 20: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP2 CUED'}); break;
			case 21: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'TP3 CUED'}); break;
			default: 	this.setVariableValues({['DECODER_B_CLIP_STATUS']: 'NO STATUS'});break;
		}
	}

	/** clip Status Refresher */
	async clipStatusRefresher(){
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (this.openConnectionForStatus === true) {
					resolve([
						this.getCurrentStatus()
					])
				} else {
					reject(console.log('clipStatusRefresher: STOPPED'))
				}
			}, this.checkStatusTime)
		}).catch(function () {
     console.log("Clips status check: ENDED");
		})
	}

	/** Create Endpoint based on the different ACTIONS params */
	actionCallManager(module, action, param = '', body = null){
		switch (module)
		{
			case 'studio':
				if(param){
					switch(param){
						case 'id':
						this.doActions(`${this.httpStudioPlayer}${action}${`?clipId=${this.selectedClipId || 0}`}`) 
						break; 
						case 'clipUp':
						this.changeClipInInUseUp(`${this.httpStudioPlayer}${action}`)
						break; 
						case 'clipDown':
						this.changeClipInInUseDown(`${this.httpStudioPlayer}${action}`)
						break; 
						case 'loop':
						this.setLoopClipById(`${this.httpStudioPlayer}${action}${`?clipId=${this.selectedClipId || 0}`}`)
						break;
						case 'decA':
						this.doActions(`${this.httpStudioPlayer}${action}${`?clipId=${this.decoderA?.currentClip?.id || 0}`}`) 
						break; 
						case 'decACue':
						this.doActions(`${this.httpStudioPlayer}${action}${`?decoderIndex=0&clipId=${this.selectedClipId || 0}`}`)
						break;
						case 'decANext':
						this.doActions(`${this.httpStudioPlayer}${action}${`?decoderIndex=0`}`)
						break;			
						case 'decALoop':
						this.setLoopClipById(`${this.httpStudioPlayer}${action}${`?clipId=${this.decoderA?.currentClip?.id || 0}`}`)
						break;
						case 'decB':
						this.doActions(`${this.httpStudioPlayer}${action}${`?clipId=${this.decoderB?.currentClip?.id || 0}`}`) 
						break; 	
						case 'decBCue':
						this.doActions(`${this.httpStudioPlayer}${action}${`?decoderIndex=1&clipId=${this.selectedClipId || 0}`}`)
						break;
						case 'decBNext':
						this.doActions(`${this.httpStudioPlayer}${action}${`?decoderIndex=1`}`)
						break;			
						case 'decBLoop':
						this.setLoopClipById(`${this.httpStudioPlayer}${action}${`?clipId=${this.decoderB?.currentClip?.id || 0}`}`)
						break;
					}
				} else {
						this.doActions(`${this.httpStudioPlayer}${action}`) 
						return 
				}
			break;
			case 'recorder':
				this.doActions(`${this.httpRecorder}${action}${`?encoderId=${this.config.encoderId}`}`, body)
			break;
			case 'channel':
				this.doActions(`${this.httpChannelPlayer}${action}${param}`)
			break;
		}		
	}

	/** Call for all the action  */
	doActions(endpoint, body = null){
	const response = fetch(endpoint,{
		method: 'put',
		body: body ? JSON.stringify(body) : null,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${this.token}`, 
			},
		});
	}

	/** Method in the button ArrowUp that change the id of the selection */
	changeClipInInUseUp(endpoint){
		if(this.selectedClipIndex === 0){
			return
		} else {
			this.doActions(`${endpoint}?clipId=${this.clips[this.selectedClipIndex-1].id}`);
		}
	}

	/** Method in the button ArrowDown that change the id of the selection */
	changeClipInInUseDown(endpoint){
		if(this.selectedClipIndex === (this.clips.length - 1)){
			return
		} else {
			this.doActions(`${endpoint}?clipId=${this.clips[this.selectedClipIndex+1].id}`);
		}
	}

	/** Check if the clip is already on loop or not  */
	setLoopClipById(endpoint){
		let loop = 1
		if (this.clips[this.selectedClipIndex]?.status === 11){
			loop = 0
		}
    this.doActions(`${endpoint}&loop=${loop}`);
	}
}
runEntrypoint(ModuleInstance, UpgradeScripts)