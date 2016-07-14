define(['dispatcher'], function(dispatcher) {

	"use strict";
	var active;
	var elements;

	var _handleMutate = function() {
		var i;

		var handleClick = function(element, i) {
			element.addEventListener('click', function(e) {
				if (active === i) return;
				if (elements[active]) {
					elements[active].classList.remove('active');
				}
				active = i;
				if (elements[active]) {
					elements[active].classList.add('active');
				}
			});
		}

		elements = document.getElementsByClassName('timeline-item');

		for (i = 0; i < elements.length; i++) {
			if (elements[i].classList.contains('active')) {
				active = i;
			}
			handleClick(elements[i], i);
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