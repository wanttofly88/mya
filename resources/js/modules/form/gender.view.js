define(['dispatcher', 'form/gender.store'], function(dispatcher, store) {

	"use strict";

	var container;
	var input;

	var _handleChange = function() {
		var storeData = store.getData();

		if (!container) return;

		if (storeData.gender === 'male') {
			container.classList.remove('fm');
			container.classList.add('ml');
			input.checked = true;
		}
		if (storeData.gender === 'female') {
			container.classList.remove('ml');
			container.classList.add('fm');
			input.checked = false;
		}
	}

	var _handleMutate = function() {
		var mlSwitch = document.querySelector('.switch.male');
		var fmSwitch = document.querySelector('.switch.female');
		container = document.getElementsByClassName('gender')[0];
		input = document.getElementById('male-checkbox');

		if (!mlSwitch || !fmSwitch || !container) return;

		mlSwitch.addEventListener('click', function(e) {
			dispatcher.dispatch({
				type: 'gender-switch',
				gender: 'male'
			});
		});

		fmSwitch.addEventListener('click', function(e) {
			dispatcher.dispatch({
				type: 'gender-switch',
				gender: 'female'
			});
		});
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});