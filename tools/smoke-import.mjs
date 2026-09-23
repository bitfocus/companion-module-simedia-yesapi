// Smoke test: load the module entrypoint and check the exports the API 2.x
// loader expects — a default-exported class and a named `UpgradeScripts` array.
// Run with: yarn smoke
try {
	const module = await import('../main.js')

	if (typeof module.default !== 'function') {
		throw new Error('main.js must have a default export (the ModuleInstance class)')
	}
	if (!Array.isArray(module.UpgradeScripts)) {
		throw new Error('main.js must export a named `UpgradeScripts` array')
	}

	console.log('smoke-import: OK (default export and UpgradeScripts found)')
} catch (error) {
	console.error(`smoke-import: FAILED — ${error.message}`)
	process.exit(1)
}
