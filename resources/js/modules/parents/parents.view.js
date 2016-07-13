define(['dispatcher', 'parents/parents.store', 'resize/resize.store'], function(dispatcher, store, resizeStore) {

	"use strict";

	var items = {};
	var container;
	var active = false;

	var _handleChange = function() {
		var storeData = store.getData();

		if (storeData.active === active) return;

		if (items.hasOwnProperty(active)) {
			items[active].element.classList.remove('active');
		}
		active = storeData.active;
		if (items.hasOwnProperty(active)) {
			items[active].element.classList.add('active');
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');
		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		if (element.classList.contains('active')) {
			dispatcher.dispatch({
				type: 'parents-switch',
				active: id
			});
		}

		items[id] = {
			element: element
		}
	}

	var _handleReize = function() {
		var maxHeight = 0;
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				if (items[id].element.clientHeight > maxHeight) {
					maxHeight = items[id].element.clientHeight;
				}
			}
		}
		container.style.height = maxHeight + 'px';
	}

	var _handleMutate = function() {
		var switches  = document.getElementsByClassName('parents-switch');
		var elements  = document.getElementsByClassName('parents-item');

		var _handle = function(element) {
			var id = element.getAttribute('data-id');
			if (!id) {
				console.warn('data-id attribute is missing');
				return;
			}

			element.addEventListener('click', function(e) {
				dispatcher.dispatch({
					type: 'parents-switch',
					active: id
				});
			});
		}

		items = {};

		for (var i = 0; i < switches.length; i++) {
			_handle(switches[i]);
		}

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		container = document.getElementsByClassName('parents-container')[0];
	}

	var init = function() {
		_handleMutate();
		_handleChange();
		_handleReize();

		store.eventEmitter.subscribe(_handleChange);
		resizeStore.eventEmitter.subscribe(_handleReize);

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