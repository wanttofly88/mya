define(['dispatcher', 'resize/resize.store'], function(dispatcher, store) {

	"use strict";

	var main;
	var header;
	var footer;

	var _handleChange = function() {
		var storeData = store.getData();

		main.style.minHeight = (storeData.height - header.clientHeight - footer.clientHeight) + 'px';

	}


	var _handleMutate = function() {
		main   = document.getElementsByTagName('main')[0];
		footer = document.getElementsByTagName('footer')[0];
		header = document.getElementsByTagName('header')[0];
		if (!main || !footer || !header) return;
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

	}

	return {
		init: init
	}
});