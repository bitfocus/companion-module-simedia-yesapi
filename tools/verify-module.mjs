// Static check of the module definitions against the API 2.1 schema.
// Companion is not needed: the initX functions are called against a stub
// standing in for InstanceBase, which captures the definitions they produce.
// Run with: yarn run check (plain `yarn check` is a Yarn 1 built-in and would
// not run this script)
import { readFileSync } from 'node:fs'
import { initActions } from '../actions.js'
import { initFeedback } from '../feedbacks.js'
import { initVariables } from '../variables.js'
import { initPresets } from '../presets.js'

const errors = []
const fail = (msg) => errors.push(msg)

// --- manifest -------------------------------------------------------------
const manifest = JSON.parse(readFileSync(new URL('../companion/manifest.json', import.meta.url), 'utf8'))
if (manifest.type !== 'connection') fail(`manifest.type must be "connection", found ${JSON.stringify(manifest.type)}`)
if (manifest.runtime?.type !== 'node22' && manifest.runtime?.type !== 'node26')
	fail(`manifest.runtime.type must be "node22" or "node26", found ${JSON.stringify(manifest.runtime?.type)}`)
if (manifest.runtime?.apiVersion !== '2.1.0')
	fail(`manifest.runtime.apiVersion must be "2.1.0", found ${JSON.stringify(manifest.runtime?.apiVersion)}`)

// --- collect the definitions ----------------------------------------------
const collected = { actions: {}, feedbacks: {}, variables: {}, structure: null, presets: null }
const stub = {
	setActionDefinitions: (a) => void (collected.actions = a),
	setFeedbackDefinitions: (f) => void (collected.feedbacks = f),
	setVariableDefinitions: (v) => void (collected.variables = v),
	setPresetDefinitions: (structure, presets) => {
		collected.structure = structure
		collected.presets = presets
	},
}
initActions.call(stub)
initFeedback.call(stub)
initVariables.call(stub)
initPresets.call(stub)

// --- actions --------------------------------------------------------------
for (const [id, action] of Object.entries(collected.actions)) {
	if (!Array.isArray(action.options)) fail(`action "${id}": options must be an array`)
	if (typeof action.callback !== 'function') fail(`action "${id}": callback is missing`)
	if (action.subscribe && !Array.isArray(action.optionsToMonitorForSubscribe))
		fail(`action "${id}": a subscribe hook requires optionsToMonitorForSubscribe (API 2.1)`)
}

// --- feedbacks ------------------------------------------------------------
for (const [id, fb] of Object.entries(collected.feedbacks)) {
	if (!Array.isArray(fb.options)) fail(`feedback "${id}": options must be an array`)
	for (const [i, opt] of fb.options.entries()) {
		if (!opt || typeof opt.id !== 'string' || typeof opt.type !== 'string')
			fail(`feedback "${id}": options[${i}] is not a valid input field (id and type are required)`)
	}
	if (fb.type === 'boolean' && (!fb.defaultStyle || Object.keys(fb.defaultStyle).length === 0))
		fail(`feedback "${id}": a boolean feedback needs a non-empty defaultStyle`)
	if (fb.type === 'advanced' && !Array.isArray(fb.affectedProperties))
		fail(`feedback "${id}": an advanced feedback must declare affectedProperties (API 2.1)`)
}

// --- variables ------------------------------------------------------------
if (Array.isArray(collected.variables) || typeof collected.variables !== 'object' || !collected.variables) {
	fail('setVariableDefinitions must be called with an object keyed by variable id, not an array (API 2.0)')
} else {
	for (const [id, v] of Object.entries(collected.variables)) {
		if (typeof v?.name !== 'string') fail(`variable "${id}": name is required`)
	}
}

// --- presets --------------------------------------------------------------
if (!Array.isArray(collected.structure)) {
	fail('setPresetDefinitions must be called with two arguments: (structure, presets)')
} else if (collected.presets) {
	const referenced = []
	for (const section of collected.structure) {
		if (typeof section.id !== 'string' || typeof section.name !== 'string')
			fail(`preset section: id and name are required (found ${JSON.stringify(section.id)})`)
		if (!Array.isArray(section.definitions)) {
			fail(`section "${section.id}": definitions must be an array`)
			continue
		}
		for (const entry of section.definitions) {
			if (typeof entry === 'string') referenced.push(entry)
			else if (entry?.type === 'simple' && Array.isArray(entry.presets)) referenced.push(...entry.presets)
			else fail(`section "${section.id}": unrecognised entry in definitions`)
		}
	}

	for (const id of referenced) {
		if (!collected.presets[id]) fail(`structure references the unknown preset "${id}"`)
	}
	for (const id of Object.keys(collected.presets)) {
		if (!referenced.includes(id)) fail(`preset "${id}" is not referenced by any section of structure`)
	}
	const duplicates = referenced.filter((id, i) => referenced.indexOf(id) !== i)
	if (duplicates.length) fail(`presets referenced more than once in structure: ${[...new Set(duplicates)].join(', ')}`)

	for (const [id, preset] of Object.entries(collected.presets)) {
		if (preset.type !== 'simple') fail(`preset "${id}": type must be "simple", found ${JSON.stringify(preset.type)}`)
		if ('category' in preset) fail(`preset "${id}": the "category" property no longer exists, use structure`)
		if (typeof preset.name !== 'string') fail(`preset "${id}": name is missing`)

		const style = preset.style ?? {}
		for (const key of ['text', 'size', 'color', 'bgcolor']) {
			if (style[key] === undefined) fail(`preset "${id}": style.${key} is required`)
		}

		for (const [s, step] of (preset.steps ?? []).entries()) {
			for (const setName of ['down', 'up']) {
				for (const [a, action] of (step[setName] ?? []).entries()) {
					if (!collected.actions[action.actionId])
						fail(`preset "${id}" step ${s} ${setName}[${a}]: actionId "${action.actionId}" does not exist`)
					if (!action.options || typeof action.options !== 'object')
						fail(`preset "${id}" step ${s} ${setName}[${a}]: options is required (use {})`)
				}
			}
		}

		for (const [f, fb] of (preset.feedbacks ?? []).entries()) {
			const definition = collected.feedbacks[fb.feedbackId]
			if (!definition) {
				fail(`preset "${id}" feedbacks[${f}]: feedbackId "${fb.feedbackId}" does not exist`)
				continue
			}
			if (!fb.options || typeof fb.options !== 'object')
				fail(`preset "${id}" feedbacks[${f}]: options is required (use {})`)
			if (definition.type === 'boolean' && !fb.style)
				fail(`preset "${id}" feedbacks[${f}]: a boolean feedback used in a preset needs a style`)
		}
	}
}

// --- report ---------------------------------------------------------------
if (errors.length) {
	console.error(`verify-module: ${errors.length} problem(s)\n`)
	for (const e of errors) console.error(`  - ${e}`)
	process.exit(1)
}
console.log(
	`verify-module: OK (${Object.keys(collected.actions).length} actions, ${Object.keys(collected.feedbacks).length} feedbacks, ${Object.keys(collected.variables).length} variables, ${Object.keys(collected.presets ?? {}).length} presets)`,
)
