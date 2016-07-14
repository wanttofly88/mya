define(['dispatcher', 'utils'], function(dispatcher, utils) {

	"use strict";

	var _handleMutate = function() {
		var container = document.getElementsByClassName('popular-list')[0];
		var elements  = document.getElementsByClassName('vote-btn');
		var action;

		var handleClick = function(element) {
			var value = element.getAttribute('data-value');
			var data  = {'value': value};

			if (!value) {
				console.warn('data-value attribute is missing');
				return;
			}

			element.addEventListener('click', function() {
				utils.ajax.send(action, function(response) {
					var json = JSON.parse(response);

					if (json.hasOwnProperty('status') && json.status === 'social-error') {
						dispatcher.dispatch({
							type: 'popup-open',
							id: 'register-popup'
						});
					}

					if (json.hasOwnProperty('status') && json.status === 'success') {
						dispatcher.dispatch({
							type: 'popup-open',
							id: 'thanks-popup'
						});

						container.element.classList.add('hidden');
					}
				}, 'POST', data, true);
			});
		}

		if (!container) return;

		action = container.getAttribute('data-action');
		if (!action) {
			console.warn('data-action attribute is missing');
			return;
		}

		for (var i = 0; i < elements.length; i++) {
			handleClick(elements[i]);
		}
	}

	var init = function() {
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