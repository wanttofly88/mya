define(['dispatcher'], function(dispatcher) {

	"use strict";

	var _handleMutate = function() {
		var nm = document.getElementById('form-name');
		var cb = document.getElementById('male-checkbox');
		var ta = document.getElementById('form-description');
		var nmData, cbData, taData;

		if (!nm || !cb || !ta) {
			console.warn('some form elements are missing');
			return;
		}

		nmData = localStorage.getItem('form.name');
		cbData = localStorage.getItem('form.male');
		taData = localStorage.getItem('form.description');


		if (nmData) {
			nm.value = nmData;
		}
		if (!cbData || cbData !== 'on') {
			dispatcher.dispatch({
				type: 'gender-switch',
				gender: 'female'
			});
		}
		if (taData) {
			ta.value = nmData;
		}

	}

	var init = function() {
		if (!('localStorage' in window) || window['localStorage'] === null) return;

		_handleMutate();

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}
		});
	}

	return {
		init: init
	}
});