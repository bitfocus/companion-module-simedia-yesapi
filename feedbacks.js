import { combineRgb } from '@companion-module/base'

export function initFeedback() {
	let feedbacks = {}

	const colorCuing = combineRgb(0, 151, 167)
	const colorCued = combineRgb(0, 151, 167)
	const colorReady = combineRgb(50, 142, 60)
	const colorOnAir = combineRgb(255, 170, 0)
	const colorPaused = combineRgb(233, 95, 52)
	const colorLoop = combineRgb(201, 51, 110)
	const colorOffline = combineRgb(211, 47, 47)
	const greyBackgroud = combineRgb(66, 66, 66)
	const whiteColor = combineRgb(255, 255, 255)
	const greyDisabled = combineRgb(123, 123, 123)

	/**
	 * Feedback ['buttonsDeactivated'] change the icon of the buttons from white to grey
	 * The other Feedbacks change the colour of the status button based on the current status of the clip
	 */
	feedbacks['buttonsDeactivated'] = {
		type: 'boolean',
		name: 'All buttons deactivated',
		defaultStyle: {
			color: greyDisabled,
			bgcolor: greyBackgroud,
		},
		options: [],
		callback: () => {
			if (this.clips[this.selectedClipIndex]?.status === undefined) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['noClip'] = {
		type: 'boolean',
		name: 'Selected clip: no clip',
		defaultStyle: {
			color: greyDisabled,
			bgcolor: greyBackgroud,
		},
		options: [],
		callback: () => {
			if (
				this.clips[this.selectedClipIndex]?.status === undefined ||
				this.clips[this.selectedClipIndex]?.status === 13
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsCuing'] = {
		type: 'boolean',
		name: 'Selected clip: cueing',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorCuing,
		},
		options: [],
		callback: () => {
			if (this.clips[this.selectedClipIndex]?.status === 0) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsCued'] = {
		type: 'boolean',
		name: 'Selected clip: cued',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorCued,
		},
		options: [],
		callback: () => {
			if (
				this.clips[this.selectedClipIndex]?.status === 1 ||
				this.clips[this.selectedClipIndex]?.status === 19 ||
				this.clips[this.selectedClipIndex]?.status === 20 ||
				this.clips[this.selectedClipIndex]?.status === 21
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsOnAir'] = {
		type: 'boolean',
		name: 'Selected clip: on air',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorOnAir,
		},
		options: [],
		callback: () => {
			if (
				this.clips[this.selectedClipIndex]?.status === 3 ||
				this.clips[this.selectedClipIndex]?.status === 14 ||
				this.clips[this.selectedClipIndex]?.status === 16 ||
				this.clips[this.selectedClipIndex]?.status === 18
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsReady'] = {
		type: 'boolean',
		name: 'Selected clip: ready',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorReady,
		},
		options: [],
		callback: () => {
			if (this.clips[this.selectedClipIndex]?.status === 4) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsOffline'] = {
		type: 'boolean',
		name: 'Selected clip: offline',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorOffline,
		},
		options: [],
		callback: () => {
			if (this.clips[this.selectedClipIndex]?.status === 5) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsPaused'] = {
		type: 'boolean',
		name: 'Selected clip: paused',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorPaused,
		},
		options: [],
		callback: () => {
			if (this.clips[this.selectedClipIndex]?.status === 9) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['clipIsInLoop'] = {
		type: 'boolean',
		name: 'Selected clip: loop',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorLoop,
		},
		options: [],
		callback: () => {
			if (this.clips[this.selectedClipIndex]?.status === 11) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decANoClip'] = {
		type: 'boolean',
		name: 'Decoder A: no clip',
		defaultStyle: {
			color: greyDisabled,
			bgcolor: greyBackgroud,
		},
		options: [],
		callback: () => {
			if (this.decoderA?.currentClip?.status === undefined || this.decoderA?.currentClip?.status === 13) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsCuing'] = {
		type: 'boolean',
		name: 'Decoder A: cueing',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorCuing,
		},
		options: [],
		callback: () => {
			if (this.decoderA?.currentClip?.status === 0) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsCued'] = {
		type: 'boolean',
		name: 'Decoder A: cued',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorCued,
		},
		options: [],
		callback: () => {
			if (
				this.decoderA?.currentClip?.status === 1 ||
				this.decoderA?.currentClip?.status === 19 ||
				this.decoderA?.currentClip?.status === 20 ||
				this.decoderA?.currentClip?.status === 21
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsOnAir'] = {
		type: 'boolean',
		name: 'Decoder A: on air',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorOnAir,
		},
		options: [],
		callback: () => {
			if (
				this.decoderA?.currentClip?.status === 3 ||
				this.decoderA?.currentClip?.status === 14 ||
				this.decoderA?.currentClip?.status === 16 ||
				this.decoderA?.currentClip?.status === 18
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsReady'] = {
		type: 'boolean',
		name: 'Decoder A: ready',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorReady,
		},
		options: [],
		callback: () => {
			if (this.decoderA?.currentClip?.status === 4) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsOffline'] = {
		type: 'boolean',
		name: 'Decoder A: offline',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorOffline,
		},
		options: [],
		callback: () => {
			if (this.decoderA?.currentClip?.status === 5) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsPaused'] = {
		type: 'boolean',
		name: 'Decoder A: paused',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorPaused,
		},
		options: [],
		callback: () => {
			if (this.decoderA?.currentClip?.status === 9) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decAClipIsInLoop'] = {
		type: 'boolean',
		name: 'Decoder A: loop',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorLoop,
		},
		options: [],
		callback: () => {
			if (this.decoderA?.currentClip?.status === 11) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBNoClip'] = {
		type: 'boolean',
		name: 'Decoder B: no clip',
		defaultStyle: {
			color: greyDisabled,
			bgcolor: greyBackgroud,
		},
		options: [],
		callback: () => {
			if (this.decoderB?.currentClip?.status === undefined || this.decoderB?.currentClip?.status === 13) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsCuing'] = {
		type: 'boolean',
		name: 'Decoder B: cueing',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorCuing,
		},
		options: [],
		callback: () => {
			if (this.decoderB?.currentClip?.status === 0) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsCued'] = {
		type: 'boolean',
		name: 'Decoder B: cued',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorCued,
		},
		options: [],
		callback: () => {
			if (
				this.decoderB?.currentClip?.status === 1 ||
				this.decoderB?.currentClip?.status === 19 ||
				this.decoderB?.currentClip?.status === 20 ||
				this.decoderB?.currentClip?.status === 21
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsOnAir'] = {
		type: 'boolean',
		name: 'Decoder B: on air',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorOnAir,
		},
		options: [],
		callback: () => {
			if (
				this.decoderB?.currentClip?.status === 3 ||
				this.decoderB?.currentClip?.status === 14 ||
				this.decoderB?.currentClip?.status === 16 ||
				this.decoderB?.currentClip?.status === 18
			) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsReady'] = {
		type: 'boolean',
		name: 'Decoder B: ready',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorReady,
		},
		options: [],
		callback: () => {
			if (this.decoderB?.currentClip?.status === 4) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsOffline'] = {
		type: 'boolean',
		name: 'Decoder B: offline',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorOffline,
		},
		options: [],
		callback: () => {
			if (this.decoderB?.currentClip?.status === 5) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsPaused'] = {
		type: 'boolean',
		name: 'Decoder B: paused',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorPaused,
		},
		options: [],
		callback: () => {
			if (this.decoderB?.currentClip?.status === 9) {
				return true
			} else {
				return false
			}
		},
	}

	feedbacks['decBClipIsInLoop'] = {
		type: 'boolean',
		name: 'Decoder B: loop',
		defaultStyle: {
			color: whiteColor,
			bgcolor: colorLoop,
		},
		options: [],
		callback: () => {
			if (this.decoderB?.currentClip?.status === 11) {
				return true
			} else {
				return false
			}
		},
	}
	this.setFeedbackDefinitions(feedbacks)
}
