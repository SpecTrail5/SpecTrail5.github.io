var _ = require('lodash');

function monitor(object, refreshRate, action, comp) {
	var base = comp ? comp : _.cloneDeep(object);
	var nextCall;
	
	var changes = getChanges(object, base);
	if (changes.length > 0){
		action(changes[0]);
		base = _.cloneDeep(object);
	}
	nextCall = function () {
		monitor(object, refreshRate, action, base);
	}
	setTimeout(nextCall, refreshRate);
}

function getChanges(test, original) {
	let changes = [];
	
	// Simple comparisons
	if (typeof test !== typeof original){
		changes.push(test);
		return changes;
	}
	if (typeof test !== "object"){
		if (test !== original) {
			changes.push(test);
		}
		return changes;
	}
	if (test === null && original === null){
		return changes;
	}
	
	// Array comparisons
	if (Array.isArray(test)) {
		if (!Array.isArray(original)){
			changes.push(test);
			return changes;
		}
		// if lengths are different we can't tell why so return the whole thing
		if (test.length !== original.length) {
			changes.push(test);
			return changes;
		}
		
		// return individual changes if lengths are the same
		let hadChanges = false;
		let tObj = {};
		for (let i = 0; i < test.length; i++){
			let subChanges = getChanges(test[i], original[i])
			if (subChanges.length > 0) {
				hadChanges = true;
				tObj[i] = subChanges[0];
			}
		}
		if (!hadChanges) {
			return [];
		}
		changes.push(tObj);
		return changes;
	}
	
	// Object comparisons
	let aKeys = Object.keys(test);
	let bKeys = Object.keys(original);
	let takeOut = [];
	let tObj = {};
	let hadChanges = false;

	// check for object additions
	for (let i = 0; i < aKeys.length; i++){
		if (!bKeys.includes(aKeys[i])) {
			tObj[aKeys[i]] = test[aKeys[i]];
			takeOut.push(aKeys[i]);
			hadChanges = true;
		}
	}
	aKeys = aKeys.filter(val => !takeOut.includes(val));
	
	// check for object removals
	takeOut = [];
	for (let i = 0; i < bKeys.length; i++){
		if (!aKeys.includes(bKeys[i])) {
			tObj[bKeys[i]] = undefined;
			takeOut.push(bKeys[i]);
			hadChanges = true;
		}
	}
	bKeys = bKeys.filter(val => !takeOut.includes(val));
	
	// check for object differences
	for (let i = 0; i < aKeys.length; i++){
		let subChanges = getChanges(test[aKeys[i]], original[aKeys[i]])
		if(subChanges.length > 0){
			hadChanges = true;
			tObj[aKeys[i]] = subChanges[0];
		}
	}
	if (!hadChanges) {
		return [];
	}
	changes.push(tObj);
	return changes;
}

exports.monitor = monitor;
exports.getChanges = getChanges;
