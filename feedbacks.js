const { combineRgb } = require('@companion-module/base')
exports.initFeedback = function () {
	let feedbacks = {}

  /**
   * Feedback ['buttonsDeactivated'] change the icon of the buttons from white to grey
   * The other Feedbacks change the colour of the status button based on the current status of the clip
   */
  feedbacks['buttonsDeactivated'] = {
		type: 'boolean',
    name: 'all Button Deactivated',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === undefined){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['noClip'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === undefined || this.clips[this.selectedClipIndex]?.status === 13){
        return true
      }else {
        return false
      }
    },
	}
  
  feedbacks['clipIsCuing'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 0){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['clipIsCued'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 1 || this.clips[this.selectedClipIndex]?.status === 19 || this.clips[this.selectedClipIndex]?.status === 20 || this.clips[this.selectedClipIndex]?.status === 21 ){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['clipIsOnAir'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 3 || this.clips[this.selectedClipIndex]?.status === 14 || this.clips[this.selectedClipIndex]?.status === 16 || this.clips[this.selectedClipIndex]?.status === 18){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['clipIsReady'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 4){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['clipIsOffline'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 5){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['clipIsPaused'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 9){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['clipIsInLoop'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.clips[this.selectedClipIndex]?.status === 11){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decANoClip'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === undefined || this.decoderA?.currentClip?.status === 13){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsCuing'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 0){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsCued'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 1 || this.decoderA?.currentClip?.status === 19 || this.decoderA?.currentClip?.status === 20 || this.decoderA?.currentClip?.status === 21 ){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsOnAir'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 3 || this.decoderA?.currentClip?.status === 14 || this.decoderA?.currentClip?.status === 16 || this.decoderA?.currentClip?.status === 18){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsReady'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 4){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsOffline'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 5){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsPaused'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 9){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decAClipIsInLoop'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderA?.currentClip?.status === 11){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBNoClip'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === undefined || this.decoderB?.currentClip?.status === 13){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsCuing'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 0){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsCued'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 1 || this.decoderB?.currentClip?.status === 19 || this.decoderB?.currentClip?.status === 20 || this.decoderB?.currentClip?.status === 21 ){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsOnAir'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 3 || this.decoderB?.currentClip?.status === 14 || this.decoderB?.currentClip?.status === 16 || this.decoderB?.currentClip?.status === 18){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsReady'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 4){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsOffline'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 5){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsPaused'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 9){
        return true
      }else {
        return false
      }
    },
	}

  feedbacks['decBClipIsInLoop'] = {
		type: 'boolean',
    name: 'Change color based on status',
    defaultStyle: {
    },
    options: [{
    }],
    callback: () => {
      if (this.decoderB?.currentClip?.status === 11){
        return true
      }else {
        return false
      }
    },
	}
	this.setFeedbackDefinitions(feedbacks)
}
