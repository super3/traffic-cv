function mr_parallax() {
	'use strict'; function a(a) {
		for (let b = 0; b < a.length; b++) {
			if (typeof document.body.style[a[b]] !== 'undefined') {
				return a[b];
			}
		} return null;
	} function b() {
		let a; let b = 0; return f() ? (b = jQuery('.viu').find('nav:first').outerHeight(!0), a = jQuery('.viu').find('nav:first').css('position'), (a === 'absolute' || a === 'fixed') && (b = 0)) : b = jQuery(document).find('nav:first').outerHeight(!0), Math.floor(b);
	} function c() {
		return /Android/i.test(navigator.userAgent || navigator.vendor || window.opera) ? screen.height * window.devicePixelRatio : /iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) ? window.orientation === 0 && screen.height > screen.width ? screen.height : screen.width : Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	} function d() {
		p === !1 && (p = !0, h(q.mr_parallaxBackground));
	} function e(a) {
		const b = {}; return a && b.toString.call(a) === '[object Function]';
	} function f() {
		return typeof window.mr_variant === 'undefined' ? !1 : !0;
	} let g; var h = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; const i = ['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform']; const j = a(i); let k = 'translate3d(0,'; let l = 'px,0)'; let m = c(); let n = 0; let o = window; var p = (f(), !1); var q = this; jQuery(document).ready(() => {
		q.documentReady();
	}), jQuery(window).on('load', () => {
		q.windowLoad();
	}), this.documentReady = function (a) {
		return m = c(), jQuery('body').hasClass('parallax-2d') && (k = 'translate(0,', l = 'px)'), h && (q.profileParallaxElements(), q.setupParallax()), e(a) ? void a() : void 0;
	}, this.windowLoad = function () {
		m = c(), n = b(), window.mr_parallax.profileParallaxElements();
	}, this.setupParallax = function () {
		f() && (o = jQuery('.viu').get(0)), typeof o !== 'undefined' && ((typeof window.mr === 'undefined' || f()) && (o.addEventListener('scroll', d)), window.addEventListener('resize', () => {
			m = c(), n = b(), q.profileParallaxElements(), q.mr_parallaxBackground();
		}, !1), window.addEventListener('orientationchange', () => {}, !1), q.mr_parallaxBackground());
	}, this.profileParallaxElements = function () {
		let a; g = [], m = c(), n = b(); let d = '.parallax > .background-image-holder, .parallax ul.slides > li > .background-image-holder, .parallax ul.slides .owl-item > li > .background-image-holder'; f() && (d = '.viu .parallax > .background-image-holder, .viu .parallax ul.slides > li > .background-image-holder, .parallax ul.slides .owl-item > li > .background-image-holder'), a = jQuery(d), /Android|iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) && (a = a.not('.parallax-disable-mobile .background-image-holder, body.parallax-disable-mobile *')), jQuery(a).each(function (a) {
			const b = jQuery(this).closest('.parallax'); const c = f() ? b.position().top : b.offset().top; const d = screen.height; const e = screen.width; g.push({section: b.get(0), outerHeight: b.outerHeight(), elemTop: c, elemBottom: c + b.outerHeight(), isFirstSection: b.is(':nth-of-type(1)') ? !0 : !1, imageHolder: jQuery(this).get(0)}), /iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) && screen.width < 1024 && (window.orientation === 0 && d > e ? (jQuery(this).css('top', '-' + d / 2 + 'px'), jQuery(this).css({'min-height': b.is(':nth-of-type(1)') ? 1.5 * d : 1.2 * d})) : (jQuery(this).css('top', '-' + e / 2 + 'px'), jQuery(this).css({'min-height': b.is(':nth-of-type(1)') ? 1.5 * e : 1.2 * e}))), /iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) && screen.width >= 1024 && (window.orientation === 0 && d > e ? (jQuery(this).css('top', '-' + d / 2 + 'px'), jQuery(this).css({'min-height': b.is(':nth-of-type(1)') ? 1.5 * d : 1.2 * d})) : (jQuery(this).css('top', '-' + e / 2 + 'px'), jQuery(this).css({'min-height': b.is(':nth-of-type(1)') ? 1.5 * e : 1.2 * e}))), /Android/i.test(navigator.userAgent || navigator.vendor || window.opera) && (jQuery(this).css({top: '-' + d * window.devicePixelRatio / (b.is(':nth-of-type(1)') ? 8 : 2) + 'px'}), jQuery(this).css({'min-height': b.is(':nth-of-type(1)') ? 1.5 * d : 1.2 * d})), f() ? f() && (b.is(':nth-of-type(1)') ? q.mr_setTranslate3DTransform(jQuery(this).get(0), q.mr_getScrollPosition() === 0 ? 0 : q.mr_getScrollPosition() / 2) : q.mr_setTranslate3DTransform(jQuery(this).get(0), (q.mr_getScrollPosition() - c - n) / 2)) : b.is(':nth-of-type(1)') ? q.mr_setTranslate3DTransform(jQuery(this).get(0), q.mr_getScrollPosition() === 0 ? 0 : q.mr_getScrollPosition() / 2) : q.mr_setTranslate3DTransform(jQuery(this).get(0), (q.mr_getScrollPosition() + m - c) / 2);
		});
	}, this.mr_parallaxBackground = function () {
		for (var a, b = g.length, c = typeof mr === 'undefined' || f() ? q.mr_getScrollPosition() : mr.scroll.y; b--;) {
			a = g[b], f() ? c + m - n > a.elemTop && c - n < a.elemBottom && (a.isFirstSection ? a.imageHolder.style[j] = k + c / 2 + l : a.imageHolder.style[j] = k + (c - a.elemTop - n) / 2 + l) : c + m >= a.elemTop && c <= a.elemBottom && (a.isFirstSection ? a.imageHolder.style[j] = k + c / 2 + l : a.imageHolder.style[j] = k + (c + m - a.elemTop) / 2 + l);
		}p = !1;
	}, this.mr_setTranslate3DTransform = function (a, b) {
		a.style[j] = k + b + l;
	}, this.mr_getScrollPosition = function () {
		return o !== window ? o.scrollTop : document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;
	};
}window.mr_parallax = new mr_parallax();
