define(['dispatcher', 'resize/resize.store', 'utils'], function(dispatcher, resizeStore, utils) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'new-id-';
	var idNum  = 1;
	var pw;


	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var position = element.getAttribute('data-position');
		var anchorId = element.getAttribute('href');
		var anchorElement;

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		if (!anchorId && !position) {
			console.warn('anchor id is missing');
			return;
		}

		if (anchorId) {
			anchorId = anchorId.substr(1);
			anchorElement = document.getElementById(anchorId);
			if (!anchorElement) {
				console.warn('anchor element is missing');
				return;
			}
		}


		element.addEventListener('click', function(e) {
			var offset;
			var pwHeight = pw.clientHeight;

			if (anchorElement) {
				offset = utils.offset(anchorElement).top;
			} else if (position) {
				offset = parseInt(position);
			}

			

			dispatcher.dispatch({
				type: 'popup-close'
			});

			e.preventDefault();
			if (offset + resizeStore.getData().height > pwHeight) {
				dispatcher.dispatch({
					type: 'scroll-to',
					position: pwHeight - resizeStore.getData().height
				});
			} else {
				dispatcher.dispatch({
					type: 'scroll-to',
					position: offset
				});
			}


		});

		items[id] = {
			id: id,
			element: element
		}
	}

	var _remove = function(items, item) {
		delete items[item.id];
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

		pw = document.getElementsByClassName('page-wrapper')[0];
		if (!pw) {
			console.warn('page-wrapper is missing');
			return;
		}

		//-------
		elements = document.getElementsByClassName('anchor');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
		//-------
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