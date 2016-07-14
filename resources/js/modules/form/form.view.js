define(['dispatcher', 'form/form.store', 'form/gender.store', 'utils'], function(dispatcher, store, genderStore, utils) {

	"use strict";

	var items = {}

	var idName = 'form-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var id = item.id;

			if (!storeData.items.hasOwnProperty(id)) return;
			if (storeData.items[id].status === items[id].status) return;

			items[id].status = storeData.items[id].status;
			item.element.classList.remove('waiting');
			item.element.classList.remove('sending');
			item.element.classList.remove('submitted');
			item.element.classList.add(items[id].status);
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _handle = function(item) {
		var form  = item.element;
		var nameInput = document.getElementById('form-name');

		if (nameInput.setCustomValidity) {
			nameInput.addEventListener('input', function(e) {
				nameInput.setCustomValidity('');
			});
			nameInput.addEventListener('invalid', function(e) {
				if (nameInput.value === '') {
					nameInput.setCustomValidity(nameInput.getAttribute('data-default-error'));
				} else {
					nameInput.setCustomValidity(nameInput.getAttribute('data-invalid-error'));
				}
			});
		}

		item.element.addEventListener('submit', function(e) {
			var action = form.action;
			var data;
			
			if (nameInput.value)

			if (item.status !== 'waiting') {
				e.preventDefault();
				return;
			}

			if (!FormData) return;
			e.preventDefault();

			data = new FormData(form);

			dispatcher.dispatch({
				type: 'ajax-form-send',
				id: item.id
			});

			if ('localStorage' in window && window['localStorage'] !== null) {
				localStorage.setItem('form.name', data.get('name'));
				localStorage.setItem('form.description', data.get('description'));
				localStorage.setItem('form.male', data.get('is_male'));
			}

			// //реальный код-----------------------------------------
			utils.ajax.send(action, function(response) {
				var json = JSON.parse(response);
				dispatcher.dispatch({
					type: 'ajax-form-submit',
					id: item.id,
					response: json
				});
				dispatcher.dispatch({
					type: 'ajax-server-responce',
					response: json
				});
				if (json.hasOwnProperty('status') && json.status === 'success') {
					dispatcher.dispatch({
						type: 'popup-open',
						id: 'thanks-popup'
					});

					item.element.classList.add('hidden');

					if ('localStorage' in window && window['localStorage'] !== null) {
						localStorage.clear();
					}
				}
				if (json.hasOwnProperty('status') && json.status === 'social-error') {
					dispatcher.dispatch({
						type: 'popup-open',
						id: 'register-popup'
					});

					if ('localStorage' in window && window['localStorage'] !== null) {
						localStorage.setItem('form.name', data.get('name'));
						localStorage.setItem('form.description', data.get('description'));
						localStorage.setItem('form.male', data.get('is_male'));
					}
				}
				if (!json.hasOwnProperty('status') || json.status === 'error') {
					item.element.classList.add('hidden');
					setTimeout(function() {
						item.element.classList.remove('hidden');
					}, 3000);
				}
			}, 'POST', data, true);


		}, false);
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		dispatcher.dispatch({
			type: 'ajax-form-add',
			id: id
		});

		items[id] = {
			id: id,
			element: element,
			status: false
		}

		_handle(items[id]);
	}

	var _remove = function(items, item) {
		delete items[item.id];

		dispatcher.dispatch({
			type: 'ajax-form-remove',
			id: item.id
		});
	}

	var _handleMutate = function() {
		var elements;

		var check = function(items, element) {
			var found = false;
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					if (items[id].element === element) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				_add(items, element);
			}
		}

		var backCheck = function(items, elements, item) {
			var element = item.element;
			var found   = false;

			for (var i = 0; i < elements.length; i++) {
				if (elements[i] === item.element) {
					found = true;
					break;
				}
			}

			if (!found) {
				_remove(items, item);
			}
		}


		elements = document.getElementsByClassName('view-form');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
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