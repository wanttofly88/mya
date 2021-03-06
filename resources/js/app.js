"use strict";

var path;
var pathElements =  document.getElementsByName('resources-path');
if (pathElements && pathElements.length) {
	path = pathElements[0].content;
} else {
	path = document.getElementsByTagName('head')[0].getAttribute('data-path');
}

if (path.slice(-1) !== '/') path += '/';

require.config({
	baseUrl: path + 'js/modules',
	paths: {
		fastClick: '../libs/fstClick',
		TweenMax: '../libs/TweenMax',
		skrollr: '../libs/skrollr'
	},
	shim: {

	}
});


require([
	'domReady',
	'resize/vhUnits.view',
	'touch/touch.view',
	'resize/main-minHeight.view',
	'synthetic-scroll/synthetic-scroll.view',
	'synthetic-scroll/anchor.view',
	'form/form.view',
	'form/gender.view',
	'form/form-populate.view',
	'parents/parents.view',
	'popup/popup.view',
	'popup/popup-close.view',
	'parallax/parallax.view',
	'timeline/timeline.view',
	'popular/popular.view'
	], function(
		domReady,
		touch,
		vhUnits,
		mainMinHeight,
		syntheticScrollView,
		anchor,
		form,
		gender,
		formPopulate,
		parents,
		popup,
		popupClose,
		parallax,
		timeline,
		popular
	) {
	domReady(function () {
		touch.init();
		vhUnits.init();
		mainMinHeight.init();
		syntheticScrollView.init();
		anchor.init();
		form.init();
		gender.init();
		formPopulate.init();
		parents.init();
		popup.init();
		popupClose.init();
		parallax.init();
		timeline.init();
		popular.init();
	});
});