webpackJsonp([5], {
    201: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0}), e.default = function (t, e) {
            for (var i = e || ",", s = new RegExp("(\\" + i + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + i + "\\r\\n]*))", "gi"), n = [[]], a = s.exec(t); a;) {
                var r = a[1];
                r.length && r !== i && n.push([]);
                var o = void 0;
                o = a[2] ? a[2].replace(new RegExp('""', "g"), '"') : a[3], n[n.length - 1].push(o), a = s.exec(t)
            }
            return n
        }
    }, 202: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        var s = Object.assign || function (t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s])
            }
            return t
        }, n = e.Sidler = function (t, e) {
            this.el = t, this.settings = this.xtend(e || {}), this.slides = Array.prototype.slice.call(t.children), this.container = document.createElement("div"), this.x = 0, this.dragging = !1, this.disabled = !1, this.setup()
        };
        n.prototype = {
            disable: function () {
                this.disabled = !0
            }, enable: function () {
                this.disabled = !1
            }, xtend: function (t) {
                return s({
                    pagination: null, onPage: function () {
                    }, threshold: 20, over: null, finish: null, projection: 8
                }, t)
            }, setup: function () {
                this.wrap(), this.resize(), this.buildPagination(), this.el.addEventListener("touchstart", this.onStart.bind(this), !1), this.el.addEventListener("touchmove", this.onMove.bind(this), !1), this.el.addEventListener("touchend", this.onEnd.bind(this), !1), window.addEventListener("resize", this.setWidth.bind(this), !1)
            }, wrap: function () {
                this.container.className = "sidler-container", this.el.insertAdjacentElement("afterend", this.container), this.el.classList.add("sidler-wrapper"), this.container.appendChild(this.el)
            }, setWidth: function () {
                this.width = parseInt(window.getComputedStyle(this.container).width), this.scrollTo(this.currentSlide())
            }, resize: function () {
                this.el.style.width = 100 * this.slides.length + "%", this.slides.forEach(this.resizeSlide.bind(this))
            }, buildPagination: function () {
                null !== this.settings.pagination && (this.selectedPage = 0, this.pages = this.slides.map(this.page.bind(this)), this.pages.forEach(this.appendPage.bind(this)))
            }, page: function (t, e) {
                var i = this, s = document.createElement("li");
                return s.className = "sidler-page", s.innerHTML = '<span class="sidler-page-span">' + (e + 1) + "</span>", s.addEventListener("click", function () {
                    i.setPage(e)
                }, !1), this.selectedPage === e && s.classList.add("sidler-page-active"), s
            }, appendPage: function (t) {
                this.settings.pagination.appendChild(t)
            }, setPage: function (t) {
                !0 !== this.disabled && (this.width = parseInt(window.getComputedStyle(this.container).width), this.scrollTo(-t * this.width, 500), this.settings.onPage(t))
            }, resizeSlide: function (t) {
                t.style.width = 100 / this.slides.length + "%"
            }, onStart: function (t) {
                var e = t.touches[0];
                !0 !== this.disabled && (this.width = parseInt(window.getComputedStyle(this.container).width), this.lastFrame = e.screenX, this.start = e.screenX)
            }, onMove: function (t) {
                var e = t.touches[0], i = e.screenX - this.lastFrame;
                if (!0 !== this.disabled) {
                    if (!1 === this.dragging) {
                        if (Math.abs(i) < this.settings.threshold) return;
                        this.start = e.screenX, this.lastFrame = e.screenX, this.dragging = !0, i = e.screenX - this.lastFrame
                    }
                    t.preventDefault(), this.x += i, this.lastFrame = e.screenX, this.lastDelta = i, window.requestAnimationFrame(this.translate.bind(this))
                }
            }, onEnd: function () {
                var t = this.lastDelta * this.settings.projection, e = this.currentSlide(t);
                !0 !== this.disabled && (this.scrollTo(e * this.width, 500), this.dragging = !1)
            }, currentSlide: function (t) {
                var e = t || 0;
                return this.x = this.x || 0, void 0 === this.width && this.setWidth(), Math.max(Math.min(Math.round((this.x + e) / this.width), 0), 1 - this.slides.length)
            }, translate: function () {
                this.el.style.transform = "translate(" + this.x + "px, 0)", null !== this.settings.over && this.settings.over(this.currentSlide()), null !== this.settings.pagination && this.showPage(Math.abs(this.currentSlide()))
            }, showPage: function (t) {
                t !== this.selectedPage && (this.pages[this.selectedPage].classList.remove("sidler-page-active"), this.pages[t].classList.add("sidler-page-active"), this.selectedPage = t)
            }, easeOutQuint: function (t) {
                return 1 + --t * Math.pow(t, 4)
            }, tick: function () {
                var t = +new Date - this.startTime, e = t / this.duration, i = this.easeOutQuint(e);
                e < 1 ? (window.requestAnimationFrame(this.tick.bind(this)), this.x = this.scrollX + (this.scrollTargetX - this.scrollX) * i, this.translate()) : (this.x = this.scrollTargetX, this.translate(), null !== this.settings.finish && this.settings.finish(this.currentSlide()))
            }, scrollTo: function (t, e) {
                if (void 0 === e) return this.x = t, void window.requestAnimationFrame(this.translate.bind(this));
                this.scrollX = this.x, this.scrollTargetX = t, this.startTime = +new Date, this.duration = e, window.requestAnimationFrame(this.tick.bind(this))
            }
        }, window.Sidler = n
    }, 203: function (t, e, i) {
        "use strict";
        (function (t) {
            function s(t) {
                return t && t.__esModule ? t : {default: t}
            }

            function n() {
                var t = window.location.pathname.replace(/^\/[a-z]{2}-[a-z]{2}/, "");
                return t.endsWith("/") && t.length > 1 ? t.replace(/\/$/, "") : t
            }

            Object.defineProperty(e, "__esModule", {value: !0}), e.analyticsService = void 0;
            var a = i(260), r = (s(a), i(19)), o = s(r), l = (e.analyticsService = {
                trackEvent: function (t, e) {
                    var i = o.default.chain(o.default.clone(l)).extend(i, {delocalized_path: n()}).extend(i, e).value();
                    try {
                        analytics.track(t, i)
                    } catch (t) {
                    }
                }, aliasUser: function (t) {
                    try {
                        analytics.alias(t)
                    } catch (t) {
                    }
                }
            }, {Platform: "WWW", "Platform Type": "Client-side"});
            t(function () {
                try {
                    analytics.track("Scrolled Down Page", o.default.extend({
                        category: "Scroll Depth",
                        label: "0%",
                        value: 0,
                        delocalized_path: n(),
                        Type: "Scroll"
                    }, l)), t.scrollDepth({
                        userTiming: !1, pixelDepth: !1, eventHandler: function (t) {
                            analytics.track("Scrolled Down Page", o.default.extend({
                                category: t.eventCategory,
                                label: t.eventLabel,
                                value: parseFloat(t.eventLabel),
                                delocalized_path: n(),
                                Type: "Scroll"
                            }, l))
                        }
                    })
                } catch (t) {
                }
            }), t(".cta-button").on("click", function (e) {
                try {
                    analytics.track("Click WWW CTA", o.default.extend({
                        cta_text: t(e.currentTarget).text(),
                        delocalized_path: n(),
                        Type: "Button"
                    }, l))
                } catch (e) {
                }
            }), t(".cta-portfolio-review").on("click", function (e) {
                try {
                    analytics.track("Click Portfolio Review CTA", o.default.extend({
                        cta_text: t(e.currentTarget).text(),
                        delocalized_path: n(),
                        Type: "Button"
                    }, l))
                } catch (e) {
                }
            }), t(".header-nav-link-signup").on("click", function (e) {
                try {
                    analytics.track("Click WWW CTA", o.default.extend({
                        cta_text: t(e.currentTarget).text(),
                        delocalized_path: n(),
                        Type: "Navigation"
                    }), l)
                } catch (e) {
                }
            }), t(".sticky-details-button").on("click", function (e) {
                try {
                    analytics.track("Click WWW CTA", o.default.extend({
                        cta_text: t(e.currentTarget).text(),
                        delocalized_path: n(),
                        Type: "Navigation"
                    }, l))
                } catch (e) {
                }
            }), t(".js-sign-up-form").on("submit", function (e) {
                try {
                    analytics.track("Finish Signup", o.default.extend({
                        cta_text: t(e.currentTarget).find(".js-sign-up-button").text().trim(),
                        delocalized_path: n(),
                        Type: "Button"
                    }, l))
                } catch (e) {
                }
            })
        }).call(e, i(1))
    }, 204: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        var s = {
            en: {
                conservative: "안전형",
                balanced: "밸런스형",
                growth: "성장형",
                today: "투자시점",
                year: "Year"
            },
        }, n = "en";
        e.FutureYouTranslations = {
            t: function (t) {
                return s[n][t]
            }
        }
    }, 210: function (t, e, i) {
        "use strict";
        i(58), i(68), i(72), i(73), i(74), i(75), i(76), i(77), i(78), i(79), i(80), i(82), i(83), i(84), i(85), i(86), i(87), i(88), i(89), i(90), i(91), i(92), i(93), i(94), i(95), i(96), i(97), i(98), i(100), i(101), i(102), i(103), i(104), i(105), i(106), i(107), i(108), i(109), i(110), i(111), i(112), i(113), i(114), i(115), i(116), i(117), i(118), i(119), i(122), i(123), i(124), i(125), i(126), i(127), i(128), i(129), i(131), i(132), i(133), i(134), i(135), i(46), i(136), i(137), i(138), i(139), i(140), i(141), i(142), i(143), i(144), i(145), i(146), i(148), i(149), i(150), i(152), i(153), i(154), i(155), i(156), i(157), i(158), i(159), i(160), i(161), i(162), i(163), i(164), i(165), i(166), i(168), i(169), i(170), i(171), i(172), i(199), i(1), i(48), i(200), i(201),i(49),i(228),i(229),i(230),i(202),i(231),i(232),i(233),i(50),i(39),i(51),i(6),i(234),i(235),i(236),i(237),i(238),i(239),i(240),i(241),i(242),i(243),i(244),i(245),i(246),i(247),i(248),i(249),i(250),i(251),i(252),i(253),i(254),i(255),i(256),i(257),i(258),i(259),i(203),i(261),i(263),i(268),i(272)
    }, 228: function (t, e, i) {
        "use strict";
        var s = function (t, e) {
            this.el = document.createElement("canvas"), this.poster = t, this.context = this.el.getContext("2d"), this.loadedImages = 0, this.sprites = [], this.numSprites = e.urls.length, this.loadedSprites = 0, this.height = parseInt(e.height), this.width = parseInt(e.width), this.frames = parseInt(e.frames), this.tiles = 0, this.head = 0, this.loop = e.loop || !1, this.stopAtLastFrame = e.stopAtLastFrame || !1, this.animateScroll = e.animateScroll, this.autoplay = e.autoplay, this.el.className = t.className, this.el.play = this.play.bind(this), this.el.pause = this.pause.bind(this), this.el.width = this.width, this.el.height = this.height, this.el.style.width = "100%", this.lastRenderTime = +new Date, this.lastPageYOffset = window.pageYOffset, this.fetch(e.urls)
        };
        s.prototype = {
            onLoad: function () {
                if (!(++this.loadedSprites < this.numSprites)) {
                    this.tiles = this.sprites[0].width / this.width, !0 === this.autoplay && this.play(), this.animateScroll ? (this.drawPoster(), window.addEventListener("scroll", this.onScroll.bind(this), !1)) : this.drawPoster(), this.poster.parentNode.replaceChild(this.el, this.poster);
                    var t = new CustomEvent("load");
                    this.el.dispatchEvent(t)
                }
            }, fetch: function (t) {
                var e = void 0;
                for (e = this.numSprites - 1; e >= 0; e--) this.sprites[e] = new Image, this.sprites[e].src = t[e], this.sprites[e].addEventListener("load", this.onLoad.bind(this), !1)
            }, play: function () {
                this.playing = !0, this.renderFrame()
            }, pause: function () {
                this.playing = !1
            }, coordsAt: function (t) {
                var e = Math.floor(t / this.frames * this.numSprites), i = t - e * this.frames / this.numSprites,
                    s = i % this.tiles, n = Math.floor(i / this.tiles);
                return {x: s * this.width, y: n * this.height, sprite: e}
            }, drawFrame: function (t) {
                var e = this.coordsAt(t);
                this.lastRenderTime = +new Date, this.context.drawImage(this.sprites[e.sprite], e.x, e.y, this.width, this.height, 0, 0, this.width, this.height)
            }, drawPoster: function () {
                this.context.drawImage(this.poster, 0, 0, this.width, this.height)
            }, renderFrame: function () {
                return +new Date - this.lastRenderTime < 31.25 ? void window.requestAnimationFrame(this.renderFrame.bind(this)) : (this.drawFrame(this.head), ++this.head === this.frames && !1 === this.loop ? void(this.stopAtLastFrame || (this.head = 0, this.drawPoster())) : (this.head === this.frames && (this.head = 0), void(!1 !== this.playing && window.requestAnimationFrame(this.renderFrame.bind(this)))))
            }, onScroll: function () {
                var t = window.pageYOffset, e = t, i = t + window.innerHeight, s = this.el.offsetTop - 100;
                if (this.el.offsetTop + this.el.offsetHeight + 100 >= e && s <= i) {
                    var n = void 0;
                    t < this.lastPageYOffset ? n = "UP" : t > this.lastPageYOffset && (n = "DOWN"), Math.abs(t - this.lastPageYOffset) < 25 && this.animate(t, n)
                }
                this.lastPageYOffset = t
            }, animate: function (t, e) {
                this.drawFrame(this.head), "UP" === e ? (0 === this.head && (this.head = this.frames), this.head--) : "DOWN" === e && ++this.head === this.frames && (this.head = 0)
            }
        }, window.MJPlayer = s
    }, 229: function (t, e, i) {
        "use strict";
        window.PinMagic = function (t) {
            this.triggers = [], this.disabled = t.disabled || !1, this.triggerPosition = t.triggerPosition || 0, document.addEventListener("scroll", this.test.bind(this), !1), window.addEventListener("resize", this.debounce(this.resize.bind(this), 100), !1), window.addEventListener("load", this.resize.bind(this), !1)
        }, window.PinMagic.prototype = {
            noop: function () {
            }, add: function (t) {
                this.triggers.push(this.createTrigger(t))
            }, disable: function () {
                this.disabled = !0, this.triggers.filter(this.isActive).forEach(this.unpin.bind(this)), this.triggers.forEach(this.showSpacers.bind(this))
            }, enable: function () {
                this.disabled = !1, this.triggers.forEach(this.showSpacers.bind(this)), this.test()
            }, resize: function () {
                var t = this;
                !0 !== t.disabled && (t.triggers.filter(t.isActive).forEach(t.unpin.bind(t)), t.triggers.forEach(t.resizeSpacersToDuration), t.triggers.forEach(t.resetSpacers), setTimeout(function () {
                    t.triggers.forEach(t.setY.bind(t)), t.test()
                }, 20))
            }, setY: function (t) {
                t.y = this.elementPosition(t.el).top - this.triggerPosition + t.offset
            }, test: function () {
                !0 !== this.disabled && (this.triggers.filter(this.isInactive).filter(this.isInsideView).forEach(this.pin.bind(this)), this.triggers.filter(this.isActive).filter(this.isOutsideView).forEach(this.unpin.bind(this)), this.triggers.filter(this.isActive).filter(this.isInsideView).forEach(this.onProgress))
            }, onProgress: function (t) {
                t.onProgress.call(t, (window.pageYOffset - t.y) / t.duration)
            }, createTrigger: function (t) {
                var e = {
                    active: !1,
                    el: t.triggerEl,
                    duration: t.duration || 0,
                    offset: t.offset || 0,
                    onStart: t.onStart || this.noop,
                    onEnd: t.onEnd || this.noop,
                    onProgress: t.onProgress || this.noop,
                    beforeSpacer: this.createSpacer(t),
                    afterSpacer: this.createSpacer(t),
                    y: this.elementPosition(t.triggerEl).top - this.triggerPosition + (t.offset || 0)
                };
                return e.el.insertAdjacentElement("beforebegin", e.beforeSpacer), e.el.insertAdjacentElement("afterend", e.afterSpacer), e.beforeSpacer.style.display = "none", this.resizeSpacersToDuration(e), e
            }, createSpacer: function () {
                var t = document.createElement("div");
                return t.className = "pinmagic-spacer", t
            }, setSpacerHeights: function () {
                this.triggers.forEach(this.resizeSpacersToDuration.bind(this))
            }, isActive: function (t) {
                return !0 === t.active
            }, isInactive: function (t) {
                return !1 === t.active
            }, isInsideView: function (t) {
                return window.pageYOffset >= t.y && window.pageYOffset < t.y + t.duration
            }, isOutsideView: function (t) {
                return window.pageYOffset < t.y || window.pageYOffset >= t.y + t.duration
            }, pin: function (t) {
                t.active = !0, this.resizeSpacersToHeight(t), t.el.style.cssText = "position:fixed;top:" + this.triggerPosition + "px;left:0;width:100%;z-index:10;", t.onStart.call(t)
            }, unpin: function (t) {
                t.active = !1, t.el.style.cssText = "", this.resizeSpacersToDuration(t), this.showSpacers(t), !0 !== this.disabled && t.onEnd.call(t)
            }, resizeSpacersToHeight: function (t) {
                var e = this.heightOf(t.el) + t.duration + "px";
                t.beforeSpacer.style.height = e, t.afterSpacer.style.height = e
            }, resizeSpacersToDuration: function (t) {
                var e = t.duration + "px";
                t.beforeSpacer.style.height = e, t.afterSpacer.style.height = e
            }, resetSpacers: function (t) {
                t.beforeSpacer.style.display = "none", t.afterSpacer.style.display = "block"
            }, showSpacers: function (t) {
                var e = Math.round((window.pageYOffset - t.y) / t.duration);
                if (!0 === this.disabled) return t.beforeSpacer.style.display = "none", void(t.afterSpacer.style.display = "none");
                e > 0 ? (t.beforeSpacer.style.display = "block", t.afterSpacer.style.display = "none") : (t.beforeSpacer.style.display = "none", t.afterSpacer.style.display = "block")
            }, debounce: function (t, e, i) {
                var s = void 0;
                return function () {
                    for (var n = arguments.length, a = Array(n), r = 0; r < n; r++) a[r] = arguments[r];
                    var o = this, l = function () {
                        s = null, i || t.apply(o, a)
                    }, c = i && !s;
                    clearTimeout(s), s = setTimeout(l, e), c && t.apply(o, a)
                }
            }, heightOf: function (t) {
                var e = window.getComputedStyle(t), i = parseFloat(e.marginTop) + parseFloat(e.marginBottom);
                return Math.ceil(t.offsetHeight + i)
            }, scrollSlideToPercent: function (t, e) {
                var i = this.triggers.filter(function (e) {
                    return e.el === t
                })[0];
                window.scrollTo(0, i.y + i.duration * e)
            }, elementPosition: function (t) {
                var e = 0, i = 0, s = t;
                if (s.offsetParent) {
                    do {
                        e += s.offsetLeft, i += s.offsetTop, s = s.offsetParent
                    } while (s);
                    return {left: e, top: i}
                }
                return {left: 0, top: 0}
            }
        }
    }, 230: function (t, e, i) {
        "use strict";
        var s = function (t) {
            this.onFinish = t || this.noop
        };
        s.prototype = {
            noop: function () {
            }, easeInOutQuint: function (t) {
                var e = t / .5;
                return e < 1 ? .5 * Math.pow(e, 5) : .5 * (Math.pow(e - 2, 5) + 2)
            }, tick: function () {
                var t = +new Date - this.startTime, e = t / this.duration, i = this.easeInOutQuint(e);
                e < 1 ? (window.requestAnimationFrame(this.tick.bind(this)), window.scrollTo(0, this.scrollY + (this.scrollTargetY - this.scrollY) * i)) : (window.scrollTo(0, this.scrollTargetY), this.onFinish())
            }, scrollTo: function (t, e) {
                this.scrollY = window.scrollY, this.scrollTargetY = t, this.startTime = +new Date, this.duration = e, window.requestAnimationFrame(this.tick.bind(this))
            }
        }, window.Scrolly = s
    }, 231: function (t, e, i) {
        "use strict";
        var s = function () {
            this.triggers = [], this.disabled = !1, window.addEventListener("scroll", this.test.bind(this), !1), window.addEventListener("resize", this.resize.bind(this), !1)
        };
        s.prototype = {
            enable: function () {
                this.disabled = !1
            }, disable: function () {
                this.disabled = !0
            }, test: function () {
                !0 !== this.disabled && this.triggers.filter(this.isInactive).filter(this.hasScrolledPast).forEach(this.activate)
            }, resize: function () {
                this.triggers.forEach(this.resizeTrigger.bind(this))
            }, resizeTrigger: function (t) {
                t.y = this.elementPosition(t.el).top
            }, add: function (t) {
                this.triggers.push({
                    el: t.el,
                    y: this.elementPosition(t.el).top,
                    offset: t.offset || 0,
                    onActivate: t.onActivate,
                    active: !1
                })
            }, isInactive: function (t) {
                return !1 === t.active
            }, hasScrolledPast: function (t) {
                return window.pageYOffset >= t.y + t.offset
            }, activate: function (t) {
                t.active = !0, t.onActivate.apply(t.el, [t])
            }, elementPosition: function (t) {
                var e = 0, i = 0, s = t;
                if (s.offsetParent) {
                    do {
                        e += s.offsetLeft, i += s.offsetTop, s = s.offsetParent
                    } while (s);
                    return {left: e, top: i}
                }
                return {left: 0, top: 0}
            }
        }, window.SimpleTriggers = s
    }, 232: function (t, e, i) {
        "use strict";
        var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        };
        window.styleSelect = function () {
            var t = document.querySelector.bind(document), e = document.querySelectorAll.bind(document),
                i = {SPACE: 32, UP: 38, DOWN: 40, ENTER: 13};
            NodeList.prototype.forEach || (NodeList.prototype.forEach = Array.prototype.forEach), HTMLCollection.prototype.forEach || (HTMLCollection.prototype.forEach = Array.prototype.forEach), Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector);
            var n = function (t, e) {
                var i = e || {bubbles: !1, cancelable: !1, detail: void 0}, s = document.createEvent("CustomEvent");
                return s.initCustomEvent(t, i.bubbles, i.cancelable, i.detail), s
            };
            if (n.prototype = window.Event.prototype, window.CustomEvent = n, !(document.documentElement.dataset || Object.getOwnPropertyDescriptor(Element.prototype, "dataset") && Object.getOwnPropertyDescriptor(Element.prototype, "dataset").get)) {
                var a = {
                    enumerable: !0, get: function () {
                        var t = void 0, e = this, i = void 0, s = void 0, n = void 0, a = void 0, r = void 0,
                            o = this.attributes, l = o.length, c = function (t) {
                                return t.charAt(1).toUpperCase()
                            }, u = function () {
                                return this
                            }, d = function (t, e) {
                                return void 0 !== e ? this.setAttribute(t, e) : this.removeAttribute(t)
                            };
                        try {
                            ({}).__defineGetter__("test", function () {
                            }), i = {}
                        } catch (t) {
                            i = document.createElement("div")
                        }
                        for (t = 0; t < l; t++) if ((r = o[t]) && r.name && /^data-\w[\w-]*$/.test(r.name)) {
                            s = r.value, n = r.name, a = n.substr(5).replace(/-./g, c);
                            try {
                                Object.defineProperty(i, a, {
                                    enumerable: this.enumerable,
                                    get: u.bind(s || ""),
                                    set: d.bind(e, n)
                                })
                            } catch (t) {
                                i[a] = s
                            }
                        }
                        return i
                    }
                };
                try {
                    Object.defineProperty(Element.prototype, "dataset", a)
                } catch (t) {
                    a.enumerable = !1, Object.defineProperty(Element.prototype, "dataset", a)
                }
            }
            var r = function (t, e, i) {
                var s = t.parentNode;
                if (i && t.matches(e)) return !0;
                for (; s && s.nodeType && 1 === s.nodeType;) {
                    if (s.matches(e)) return !0;
                    s = s.parentNode
                }
                return !1
            }, o = function () {
                return "ss-xxxx-xxxx-xxxx-xxxx-xxxx".replace(/x/g, function (t) {
                    var e = 16 * Math.random() | 0;
                    return ("x" === t ? e : 3 & e | 8).toString(16)
                })
            };
            return function (a) {
                var l = "object" === (void 0 === a ? "undefined" : s(a)) ? a : t(a), c = l.children,
                    u = l.selectedIndex, d = o(),
                    h = '<div class="style-select" aria-hidden="true" data-ss-uuid="' + d + '">', f = void 0,
                    p = c.length - 1;
                l.setAttribute("data-ss-uuid", d), l.setAttribute("aria-hidden", "false");
                var g = void 0, v = '<div class="ss-dropdown">';
                c.forEach(function (t, e) {
                    var i = t.textContent, s = t.getAttribute("value") || "", n = "ss-option";
                    "Magazine" === i && (i = "fr-ca" === window.currentLocale ? "Les sujets" : "Topics"), e === u && (g = '<div class="ss-selected-option" tabindex="0" data-value="' + s + '">' + i + "</div>"), t.disabled && (n += " disabled"), v += '<div class="' + n + '" data-value="' + s + '">' + i + "</div>"
                }), v += "</div>", h += g += v += "</div>", l.insertAdjacentHTML("afterend", h);
                var m = t('.style-select[data-ss-uuid="' + d + '"]'), w = m.querySelectorAll(".ss-option"),
                    y = m.querySelector(".ss-selected-option"), b = function (t, e) {
                        m.classList.remove("open"), y.textContent = e, y.dataset.value = t, w.forEach(function (e) {
                            e.dataset.value === t ? e.classList.add("ticked") : e.classList.remove("ticked")
                        }), l.value = t;
                        var i = new n("change");
                        l.dispatchEvent(i)
                    };
                w.forEach(function (t, e) {
                    var i = w.item(e);
                    i.className.match(/\bdisabled\b/) || (i.addEventListener("click", function (t) {
                        var e = t.target, i = e.getAttribute("data-value"), s = e.textContent;
                        b(i, s)
                    }), i.dataset.value === l.value && (f = e, i.classList.add("ticked"), i.classList.add("highlighted")), i.addEventListener("mouseover", function (t) {
                        i.parentNode.childNodes.forEach(function (e, i) {
                            e === t.target ? (e.classList.add("highlighted"), f = i) : e.classList.remove("highlighted")
                        })
                    }))
                });
                var S = function (t) {
                    e(".style-select").forEach(function (e) {
                        e !== t && e.classList.remove("open")
                    })
                }, k = function (t) {
                    t.classList.contains("open") || S(t), t.classList.toggle("open")
                }, $ = t('.style-select[data-ss-uuid="' + d + '"] .ss-selected-option');
                $.addEventListener("touchend", function (t) {
                    t.preventDefault(), t.stopPropagation(), k(t.target.parentNode)
                }), $.addEventListener("keydown", function (t) {
                    var e = t.target.parentNode;
                    switch (t.keyCode) {
                        case i.SPACE:
                            k(e);
                            break;
                        case i.DOWN:
                        case i.UP:
                            e.classList.contains("open") ? (t.keyCode === i.UP ? 0 !== f && (f -= 1) : f < p && (f += 1), w.forEach(function (t, e) {
                                e === f ? t.classList.add("highlighted") : t.classList.remove("highlighted")
                            })) : k(e), t.preventDefault(), t.stopPropagation();
                            break;
                        case i.ENTER:
                            var s = $.parentNode.querySelectorAll(".ss-option")[f], n = s.dataset.value,
                                a = s.textContent;
                            b(n, a), t.preventDefault(), t.stopPropagation()
                    }
                }), t("body").addEventListener("touchstart", function (t) {
                    r(t.target, ".style-select", !0) || S()
                })
            }
        }()
    }, 233: function (t, e, i) {
        "use strict";
        var s = function (t) {
            this.threshold = t.threshold, this.up = t.up, this.down = t.down, this.onTouchStartListener = this.onTouchStart.bind(this), this.onTouchMoveListener = this.onTouchMove.bind(this), this.onTouchEndListener = this.onTouchEnd.bind(this), this.startX = 0, this.lastX = 0, this.startY = 0, this.lastY = 0, this.blackList = ["noUi", "graph-preview", "js-pagination"], this.enable()
        };
        s.prototype = {
            disable: function () {
                document.removeEventListener("touchstart", this.onTouchStartListener, !1), document.removeEventListener("touchmove", this.onTouchMoveListener, !1), document.removeEventListener("touchend", this.onTouchEndListener, !1)
            }, enable: function () {
                document.addEventListener("touchstart", this.onTouchStartListener, !1), document.addEventListener("touchmove", this.onTouchMoveListener, !1), document.addEventListener("touchend", this.onTouchEndListener, !1)
            }, isInBlacklist: function (t) {
                var e = void 0;
                for (e = this.blackList.length - 1; e >= 0; e--) if (t.indexOf(this.blackList[e]) > -1) return !0;
                return !1
            }, onTouchStart: function (t) {
                this.startY = t.touches[0].clientX, this.startY = t.touches[0].clientY, this.lastY = t.touches[0].clientX, this.lastY = t.touches[0].clientY
            }, onTouchMove: function (t) {
                this.lastY = t.touches[0].clientX, this.lastY = t.touches[0].clientY
            }, onTouchEnd: function (t) {
                var e = "string" == typeof t.target.className ? t.target.className : "";
                return !!this.isInBlacklist(e) || (Math.abs(this.startY - this.lastY) < Math.abs(this.startX - this.lastX) || (Math.abs(this.startY - this.lastY) < this.threshold || 0 === this.startY || 0 === this.lastY || (this.startY < this.lastY ? (this.startY = 0, this.lastY = 0, this.up()) : (this.startY = 0, this.lastY = 0, this.down()))))
            }
        }, window.SwipeDetection = s
    }, 234: function (t, e, i) {
        "use strict";
        (function (t) {
            var e = i(6);
            window.Experiments = function () {
            }, window.Experiments.prototype = {
                start: function (t, i) {
                    return this._sendExperimentRequest(t, "start", i).then(function (t) {
                        try {
                            Object.keys(t).forEach(function (i) {
                                e.ws.util.cookieGet(i, !0) || (e.ws.util.cookieSetGlobal(i, t[i], !0), analytics.track("Start AB Experiment", {
                                    "Experiment ID": i,
                                    Treatment: t[i]
                                }))
                            })
                        } catch (t) {
                        }
                    })
                }, end: function (t, e) {
                    this._sendExperimentRequest(t, "end", e)
                }, getTreatmentFromCookies: function (t) {
                    return e.ws.util.cookieGet("experiment_" + t)
                }, isControl: function (t) {
                    return "control" === this.getTreatmentFromCookies(t)
                }, isTreatment: function (t, e) {
                    var i = e || "alternate";
                    return this.getTreatmentFromCookies(t) === i
                }, _sendExperimentRequest: function (i, s, n) {
                    if (null == i) throw new Error("Must provide an experimentId");
                    var a = n || e.ws.util.cookieGet("global_visitor_id"), r = {event: s, id: i, visitor_id: a};
                    return t.ajax({
                        url: Routes.api_root_url + "/ab-experiments",
                        type: "POST",
                        headers: {
                            "X-WS-API-Version": "12",
                            "X-Request-Origin": window.location.origin,
                            Accept: "application/json"
                        },
                        data: JSON.stringify(r),
                        contentType: "application/json",
                        dataType: "json"
                    })
                }
            }
        }).call(e, i(1))
    }, 235: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s);
        window.Tab = function (t) {
            this.el = t, this.target = (0, n.default)("#" + this.el.getAttribute("data-tab-content")), this.group = this.el.getAttribute("data-tab-group"), (0, n.default)(this.el).on("click", this.showTabContent.bind(this))
        }, window.Tab.prototype = {
            showTabContent: function (t) {
                if (t.preventDefault(), null === this.group) return (0, n.default)(".js-tab-content").each(this.removeActiveClass), void this.target.addClass("tab-active");
                (0, n.default)('.js-tab-content[data-tab-group="' + this.group + '"]').removeClass("tab-active"), (0, n.default)('.js-tab[data-tab-group="' + this.group + '"]').removeClass("active"), this.target.addClass("tab-active"), this.el.classList.add("active")
            }, removeActiveClass: function (t, e) {
                e.classList.remove("tab-active")
            }
        }, (0, n.default)(".js-tab").each(function (t, e) {
            return new window.Tab(e)
        })
    }, 236: function (t, e, i) {
        "use strict";
        var s = Object.assign || function (t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s])
            }
            return t
        }, n = i(1), a = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(n), r = i(200), o = function (t) {
            if (t && t.__esModule) return t;
            var e = {};
            if (null != t) for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            return e.default = t, e
        }(r), l = function (t) {
            this.el = t, this.el.value = this.el.defaultValue, this.sliderEl = document.createElement("div"), (0, a.default)(this.sliderEl).insertAfter(this.el), this.slider = this.createSlider(), this.slider.on("slide", this.onUpdate.bind(this)), this.changeEvent = document.createEvent("Event"), this.changeEvent.initEvent("change", !0, !0)
        };
        l.prototype = {
            createSlider: function () {
                return o.create(this.sliderEl, {
                    start: parseInt(this.el.value),
                    step: parseInt(this.el.step),
                    connect: [!0, !1],
                    range: this.parseRange(this.el.min, this.el.max, this.el.getAttribute("range"))
                })
            }, parseRange: function (t, e, i) {
                var n = {min: parseInt(t)};
                if (null === i) return {min: parseInt(t), max: parseInt(e)};
                var a = JSON.parse(i);
                return n = s({}, n, a), n.max = parseInt(e), n
            }, onUpdate: function () {
                this.el.value = parseInt(this.slider.get()), this.el.dispatchEvent(this.changeEvent)
            }
        }, (0, a.default)('input[type="range"]').each(function (t, e) {
            e.type = "hidden", e.range = new l(e)
        })
    }, 237: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = i(6), r = function (t) {
            t.insertAdjacentHTML("beforeend", '<source src="' + t.getAttribute("data-src-mp4") + '" type="video/mp4">')
        }, o = function (t, e) {
            return 0 === e || new MJPlayer(t, {
                urls: JSON.parse(t.getAttribute("data-urls")),
                width: t.getAttribute("data-width"),
                height: t.getAttribute("data-height"),
                frames: t.getAttribute("data-frames"),
                autoplay: null !== t.getAttribute("data-autoplay"),
                animateScroll: !!t.getAttribute("data-animateScroll"),
                loop: null !== t.getAttribute("data-loop"),
                stopAtLastFrame: null !== t.getAttribute("data-stopAtLastFrame")
            })
        };
        (0, n.default)(".js-video-placeholder").each(function (t, e) {
            var i = e.parentNode.querySelector(".js-video-gif").innerHTML,
                s = e.parentNode.querySelector(".js-video-desktop").innerHTML, n = a.ws.isMobile() ? i : s;
            e.outerHTML = n
        }), (0, n.default)(".js-video-mouseover-play").on("mouseenter", function () {
            (0, n.default)(this).find(".js-animation").each(function (t, e) {
                "none" !== (0, n.default)(e).css("display") && e.play()
            })
        }), (0, n.default)(".js-video-mouseover-play").on("mouseleave", function () {
            (0, n.default)(this).find(".js-animation").filter(function (t) {
                return "none" !== (0, n.default)(t).css("display")
            }).each(function (t, e) {
                "none" !== (0, n.default)(e).css("display") && e.pause()
            })
        }), (0, n.default)(".js-animation").first().on("load", function () {
            o(this).el.addEventListener("load", function () {
                (0, n.default)(".js-animation").each(function (t, e) {
                    return o(e, t)
                })
            })
        }), (0, n.default)(".js-video-main").first().on("loadeddata", function () {
            (0, n.default)(".js-video-main").each(function (t, e) {
                return r(e)
            }), window.indexDesktop ? window.indexDesktop.safariResize() : -1 !== navigator.userAgent.indexOf("Safari") && -1 === navigator.userAgent.indexOf("Chrome") && (0, n.default)(".js-video-main").each(function (t, e) {
                e.style.height = parseInt((0, n.default)(e).height()) - .5 + "px"
            })
        })
    }, 238: function (t, e, i) {
        "use strict";
        (function (t) {
            window.IndexVideoPlayer = function (t) {
                this.parent = t.parentNode, this.mainVideo = t
            }, window.IndexVideoPlayer.prototype = {
                onVideoOver: function (t) {
                    t === this.mainVideo && this.mainVideo.play()
                }, onVideoOut: function (t) {
                    t === this.mainVideo && t.currentTime > 0 && t.currentTime !== t.duration && t.play()
                }
            }, t(".js-video-main").each(function (e, i) {
                t(i).prop("muted", !0), new window.IndexVideoPlayer(i)
            })
        }).call(e, i(1))
    }, 239: function (t, e, i) {
        "use strict";
        var s = i(6);
        (function (t) {
            this.el = t, this.lastLocation = window.pageYOffset, this.stuck = this.stick(), this.lastCheck = +new Date, window.addEventListener("scroll", this.checkDirection.bind(this), !1)
        }).prototype = {
            stick: function () {
                return this.el.addClass("header-sticky"), !0
            }, unstick: function () {
                return this.el.removeClass("header-sticky"), !1
            }, checkDirection: function () {
                s.ws.isDesktop() || +new Date < this.lastCheck + 1e3 || (this.lastLocation > window.pageYOffset && !1 === this.stuck && (this.stuck = this.stick()), this.lastLocation < window.pageYOffset && !0 === this.stuck && (this.stuck = this.unstick()), this.lastCheck = +new Date, this.lastLocation = window.pageYOffset)
            }
        }
    }, 240: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = function (t) {
            this.slide = t, this.currentPage = 0, this.pages = (0, n.default)(".js-page", t), this.indicators = (0, n.default)(".js-pagination-indicator", t), this.indicators.on("click", this.scrollToPage.bind(this)), this.numPages = this.pages.length - 1
        };
        a.prototype = {
            scrollToPage: function (t) {
                var e = (0, n.default)(t.target).parent().index();
                this.currentPage = e, this.updatePage(), this.updateIndicator(), n.default.publish("index-pagination/page", [this.slide, e / this.numPages]), t.preventDefault()
            }, onProgress: function (t, e) {
                var i = Math.round(e * this.numPages);
                t === this.slide && i !== this.currentPage && (this.currentPage = i, this.updatePage(), this.updateIndicator())
            }, setPageVisibility: function (t, e) {
                e.classList.remove("show"), t === this.currentPage && e.classList.add("show")
            }, setIndicatorStatus: function (t, e) {
                e.classList.remove("pagination-indicator-active"), t === this.currentPage && e.classList.add("pagination-indicator-active")
            }, updatePage: function () {
                this.pages.each(this.setPageVisibility.bind(this))
            }, updateIndicator: function () {
                this.indicators.each(this.setIndicatorStatus.bind(this))
            }
        }, window.IndexPagination = a
    }, 241: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = i(6), r = i(39), o = i(51);
        !function () {
            if (null !== document.querySelector(".js-black-graph")) {
                var t = {
                    US: {wealthsimpleBasic: .05, traditionalInvestor: .0415},
                    CA: {wealthsimpleBasic: .043, traditionalInvestor: .03},
                    GB: {wealthsimpleBasic: .0355, traditionalInvestor: .0195}
                }, e = function () {
                    this.maxYears = 30, this.monthlyContribution = 1e3, this.svg = (0, n.default)(".js-black-graph"), this.previewSum = "Wealthsimple", this.startingInvestmentSlider = (0, n.default)(".js-ws-black-slider"), this.blackFill = (0, n.default)(".js-black-fill"), this.standardFill = (0, n.default)(".js-standard-fill"), this.typicalFill = (0, n.default)(".js-typical-fill"), this.blackLine = (0, n.default)(".js-black-line"), this.standardLine = (0, n.default)(".js-standard-line"), this.typicalLine = (0, n.default)(".js-typical-line"), this.blackPoint = (0, n.default)(".js-black-point"), this.standardPoint = (0, n.default)(".js-standard-point"), this.typicalPoint = (0, n.default)(".js-typical-point"), this.$gainsEl = (0, n.default)(".js-ws-black-gains"), this.$savingsEl = (0, n.default)(".js-ws-black-savings"), this.startingInvestmentSum = (0, n.default)(".js-ws-black-slider-value"), this.startingInvestmentSlider.on("change", this.onSliderChange.bind(this)), this.feeSavingsModel = new o.FeeSavingsModel, this.annualReturnRates = t[window.currentJurisdiction] || t.CA, this.riskCalculatorModel = new r.RiskCalculatorModel({
                        startingAmount: this.currentStartingAmount(),
                        monthlyContribution: this.monthlyContribution,
                        annualReturnRate: this.annualReturnRates.wealthsimpleBasic
                    }), this.typicalRiskCalculatorModel = new r.RiskCalculatorModel({
                        startingAmount: this.currentStartingAmount(),
                        monthlyContribution: this.monthlyContribution,
                        annualReturnRate: this.annualReturnRates.traditionalInvestor
                    }), window.addEventListener("resize", a.ws.debounce(this.resizeGraph, 200).bind(this), !1), this.resizeGraph(), setTimeout(this.resizeGraph.bind(this), 6e3)
                };
                e.prototype = {
                    resizeGraph: function () {
                        var t = this.svg[0].parentNode.getBoundingClientRect();
                        this.graphWidth = parseInt(t.width), this.graphHeight = parseInt(.45 * this.graphWidth), this.sliderWidth = parseInt(this.startingInvestmentSlider.parent().width()) - 30, this.svg[0].setAttribute("viewBox", "0 0 " + this.graphWidth + " " + this.graphHeight), (document.documentMode || /Edge/.test(navigator.userAgent)) && (this.svg[0].style.width = this.graphWidth + "px", this.svg[0].style.height = this.graphHeight + "px"), this.onSliderChange()
                    }, normalize: function (t) {
                        return [0, t[1] / t[2], t[2] / t[2]]
                    }, createLine: function (t, e, i) {
                        var s = this.graphHeight - (t[0] - 1e5) / (e - 1e5) * this.graphHeight,
                            n = this.graphHeight - (t[1] - 1e5) / (e - 1e5) * this.graphHeight,
                            a = this.graphHeight - (t[2] - 1e5) / (e - 1e5) * this.graphHeight,
                            r = "M0," + s + " C0," + s + " " + this.graphWidth / 1.8 + "," + n + " " + this.graphWidth + "," + a;
                        return !0 === i ? r + " L" + this.graphWidth + "," + this.graphHeight + " L0," + this.graphHeight + " Z" : r
                    }, series: function (t, e, i) {
                        return [this.valueAtYear(0, e, i), this.valueAtYear(this.maxYears / 2, e, i), this.valueAtYear(this.maxYears, e, i)]
                    }, valueAtYear: function (t, e, i) {
                        e.startingAmount = this.currentStartingAmount();
                        var s = e.valueAtYear(t);
                        if ("black" === i) {
                            var n = e.startingAmount;
                            s += this.gains(n, t) + this.savings(n, t)
                        }
                        return Math.round(s)
                    }, onSliderChange: function () {
                        var t = this.currentStartingAmount();
                        this.black = this.series(t, this.riskCalculatorModel, "black"), this.standard = this.series(t, this.riskCalculatorModel, "standard"), this.typical = this.series(t, this.typicalRiskCalculatorModel, "typical"), this.blackLine[0].setAttribute("d", this.createLine(this.black, this.black[2])), this.standardLine[0].setAttribute("d", this.createLine(this.standard, this.black[2])), this.typicalLine[0].setAttribute("d", this.createLine(this.typical, this.black[2])), this.blackFill[0].setAttribute("d", this.createLine(this.black, this.black[2], !0)), this.standardFill[0].setAttribute("d", this.createLine(this.standard, this.black[2], !0)), this.typicalFill[0].setAttribute("d", this.createLine(this.typical, this.black[2], !0)), this.startingInvestmentSum.text(currencyForLocale(t)), this.updatePoint(this.blackPoint, this.blackLine, this.black[2]), this.updatePoint(this.standardPoint, this.standardLine, this.standard[2]), this.updatePoint(this.typicalPoint, this.typicalLine, this.typical[2]), this.$gainsEl.text(currencyForLocale(this.gains(t, this.maxYears))), this.$savingsEl.text(currencyForLocale(this.savings(t, this.maxYears)))
                    }, updatePoint: function (t, e, i) {
                        var s = e[0].getPointAtLength(e[0].getTotalLength());
                        return t.text(currencyForLocale(parseInt(i))), t.css("transform", "translate(0, " + s.y + "px)"), !0
                    }, gains: function (t, e) {
                        switch (window.currentJurisdiction) {
                            case"GB":
                                return 0;
                            default:
                                var i = window.ws.getBasicFee() / 100;
                                return parseInt(t * (Math.exp(e * i) - 1))
                        }
                    }, savings: function (t, e) {
                        return this.feeSavingsModel.savingsVsIndustry(e, t)
                    }, currentStartingAmount: function () {
                        return parseInt(this.startingInvestmentSlider.val())
                    }
                }, window.addEventListener("load", function () {
                    new e
                }, !1)
            }
        }()
    }, 242: function (t, e, i) {
        "use strict";
        var s = i(202), n = function (t) {
            var e = void 0, i = t.parentNode.querySelector(".js-carousel-arrow-left"),
                n = t.parentNode.querySelector(".js-carousel-arrow-right"), a = function () {
                    var t = -e.currentSlide();
                    t = Math.max(t - 1, 0), e.setPage(t)
                }, r = function () {
                    var t = -e.currentSlide();
                    t = Math.min(t + 1, e.slides.length - 1), e.setPage(t)
                }, o = function (t) {
                    i.classList.toggle("clickable", 0 !== t), n.classList.toggle("clickable", t !== e.slides.length - 1)
                };
            i && n && (i.addEventListener("click", a, !1), n.addEventListener("click", r, !1)), e = new s.Sidler(t, {
                threshold: 40,
                pagination: t.nextElementSibling,
                onPage: o
            })
        };
        Array.prototype.slice.call(document.querySelectorAll(".js-carousel")).forEach(n)
    }, 243: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = i(6), r = function () {
            this.swipeDetection = new SwipeDetection({
                threshold: 100,
                up: this.playSection.bind(this),
                down: this.playSection.bind(this)
            }), this.sections = Array.prototype.slice.call(document.querySelectorAll(".index-section")).filter(this.isVisible), this.sectionIndex = Math.round(window.pageYOffset / window.innerHeight)
        };
        r.prototype = {
            isVisible: function (t) {
                return t.offsetWidth > 0 && t.offsetHeight > 0
            }, isOnScreen: function (t) {
                var e = window.pageYOffset, i = window.pageYOffset + window.innerHeight, s = t.offsetTop;
                return t.offsetTop + t.offsetHeight >= e && s <= i
            }, playSection: function () {
                var t = this;
                this.sections.forEach(function (e, i) {
                    t.isOnScreen(e) && (t.sectionIndex = i, t.playCurrentVideo())
                })
            }, playCurrentVideo: function () {
                var t = this.sections[this.sectionIndex], e = (0, n.default)(".js-animation", t).get(0);
                this.playVideo(e)
            }, playVideo: function (t) {
                void 0 !== t && void 0 !== t.play && t.play()
            }
        }, a.ws.isMobile() && document.body.classList.contains("index") && window.addEventListener("load", function () {
            new r
        }, !1)
    }, 244: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = i(6), r = i(51), o = function (t) {
            return "black" === t ? window.ws.getBlackFee() : window.ws.getBasicFee()
        }, l = function (t) {
            this.el = t, this.activeBenefits = "standard", this.bubble = (0, n.default)(".js-details-slider-bubble"), this.accountBalance = (0, n.default)(".js-account-balance"), this.fee = o("basic"), this.feeSavingsModel = new r.FeeSavingsModel, this.setValues(), (0, n.default)(this.el).on("change", this.onChange.bind(this))
        };
        l.prototype = {
            onChange: function () {
                window.requestAnimationFrame(this.setValues.bind(this))
            }, setValues: function (t) {
                var e = "0" === this.el.value ? 500 : parseInt(this.el.value);
                switch (!0) {
                    case this.el.value >= 1e5:
                        this.enableBlack(o("black"));
                        break;
                    default:
                        this.enableStandard(o("basic"))
                }
                (0, n.default)(".js-details-value").text(currencyForLocale(this.feeSavingsModel.savingsVsIndustry(20, e))), !0 !== t && this.showBubble()
            }, enableBlack: function (t) {
                return "black" !== this.activeBenefits && ((0, n.default)(".js-details-fee").text(feePercentageForLocale(t)), (0, n.default)(".js-details-pricing").removeClass("pricing-standard").addClass("pricing-black"), (0, n.default)(".pricing-selected").removeClass("pricing-selected"), (0, n.default)(".js-pricing-black").addClass("pricing-selected"), this.fee = t, this.activeBenefits = "black", !0)
            }, enableStandard: function (t) {
                return this.fee = t, (0, n.default)(".js-details-fee").text(feePercentageForLocale(t)), "standard" !== this.activeBenefits && ((0, n.default)(".js-details-pricing").removeClass("pricing-black").addClass("pricing-standard"), (0, n.default)(".pricing-selected").removeClass("pricing-selected"), (0, n.default)(".js-pricing-standard").addClass("pricing-selected"), this.activeBenefits = "standard", !0)
            }, showBubble: function () {
                var t = "0" === this.el.value ? 500 : parseInt(this.el.value);
                this.accountBalance.text(currencyForLocale(t)), this.bubble.addClass("bubble-active"), a.ws.isMobile() || this.bubble.css("left", (0, n.default)(".noUi-origin", this.el.parentNode).get(0).style.left)
            }
        }, (0, n.default)(".js-details-slider").each(function (t, e) {
            new l(e)
        })
    }, 245: function (t, e, i) {
        "use strict";

        function s(t) {
            return t && t.__esModule ? t : {default: t}
        }

        var n = i(1), a = s(n), r = i(19), o = s(r), l = function () {
            this.enabled = !0, this.section = 0, this.sections = this.buildSectionTree((0, a.default)(".js-keyboard-section")), this.scrolly = new Scrolly, window.addEventListener("keydown", this.onKeyDown, !1), window.addEventListener("resize", this.recalculateY.bind(this), !1), window.addEventListener("load", this.recalculateY.bind(this), !1), a.default.subscribe("index-keyboard/change-section", this.changeSection.bind(this))
        };
        l.prototype = {
            recalculateY: function () {
                this.sections = this.buildSectionTree((0, a.default)(".js-keyboard-section"))
            }, buildSectionTree: function (t) {
                var e = Array.prototype.slice.call(t).map(this.sectionObject.bind(this));
                return o.default.flatten(e, !0)
            }, sectionObject: function (t) {
                var e = t.querySelectorAll(".js-page"), i = this, s = e.length - 1,
                    n = parseInt((0, a.default)(t).offset().top);
                return 0 === e.length ? [{el: t, y: n}] : Array.prototype.slice.call(e).map(function (t, e) {
                    return i.subSectionObject(t, n, s, e)
                })
            }, subSectionObject: function (t, e, i, s) {
                return {el: t, y: e + s / i * 5998}
            }, enable: function () {
                !0 !== this.enabled && window.addEventListener("keyup", this.onKeyDown, !1)
            }, disable: function () {
                !1 !== this.enabled && window.removeEventListener("keyup", this.onKeyDown, !1)
            }, onKeyDown: function (t) {
                switch (t.keyCode) {
                    case 37:
                    case 38:
                        t.preventDefault(), a.default.publish("index-keyboard/change-section", ["up", t]);
                        break;
                    case 39:
                    case 40:
                        t.preventDefault(), a.default.publish("index-keyboard/change-section", ["down", t])
                }
            }, changeSection: function (t) {
                "up" === t && (this.section = this.scrollToSection(this.section - 1)), "down" === t && (this.section = this.scrollToSection(this.section + 1))
            }, scrollToSection: function (t) {
                var e = Math.min(Math.max(t, 0), this.sections.length - 1);
                return this.scrolly.scrollTo(this.sections[e].y, 600), e
            }
        }, window.IndexKeyboard = l
    }, 246: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = i(6), r = function () {
            this.slides = (0, n.default)(".js-slide"), this.desktopEnabled = !0, this.init(), window.addEventListener("resize", a.ws.debounce(this.onResize.bind(this), 200), !1), window.addEventListener("scroll", this.onScroll.bind(this), !1)
        };
        r.prototype = {
            init: function () {
                this.detectDesktop(), this.setupFirstSlideFadeIns(), this.setupFirstVideo()
            }, setupFirstSlideFadeIns: function () {
                !1 !== this.desktopEnabled && (0, n.default)(".js-fade").each(function (t, e) {
                    var i = parseInt(e.getAttribute("data-fade-delay")) || 200;
                    e.classList.add("fade"), setTimeout(function () {
                        e.classList.add("fadein")
                    }, i)
                })
            }, setupFirstVideo: function () {
                if (!1 !== this.desktopEnabled) {
                    setTimeout(function () {
                        (0, n.default)(".js-video-main").get(0).play()
                    }, 1e3)
                }
            }, onScroll: function () {
                var t = this;
                if (!1 !== this.desktopEnabled) {
                    this.slides.each(function (e, i) {
                        t.isOnScreen(i.querySelector(".video-section-content")) && i.querySelector(".js-video").play()
                    });
                    var e = document.querySelector(".js-last-video");
                    this.isOnScreen(e) && e.play()
                }
            }, onResize: function () {
                this.detectDesktop()
            }, detectDesktop: function () {
                var t = a.ws.isDesktop();
                this.safariResize(), t !== this.desktopEnabled && (this.desktopEnabled = t)
            }, safariResize: function () {
                -1 !== navigator.userAgent.indexOf("Safari") && -1 === navigator.userAgent.indexOf("Chrome") && (0, n.default)(".js-video-main").each(function (t, e) {
                    e.style.height = parseInt((0, n.default)(e).height()) - .5 + "px"
                })
            }, isOnScreen: function (t) {
                if (!t) return !1;
                var e = t.getBoundingClientRect(), i = e.top, s = e.bottom;
                return i >= 0 && s <= window.innerHeight
            }
        }, document.body.classList.contains("index") && (window.indexDesktop = new r)
    }, 247: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s);
        (function () {
            this.setupCampaignPlayer()
        }).prototype = {
            setupCampaignPlayer: function () {
                function t(t) {
                    t.target.mute()
                }

                function e(t) {
                    c || 1 !== t.data || ((0, n.default)(".player-drawer .title-background").on("click", i), (0, n.default)(window).on("keydown", function (t) {
                        32 === t.which && u && (t.preventDefault(), a())
                    }), c = !0)
                }

                function i() {
                    !d && c && (l.seekTo(0), d = !0), u || ((0, n.default)(".player-drawer").addClass("with-transition"), setTimeout(function () {
                        (0, n.default)(".player-drawer").removeClass("collapsed"), l.unMute(), l.playVideo(), u = !0, setTimeout(function () {
                            (0, n.default)(".player-drawer").removeClass("with-transition"), (0, n.default)(window).trigger("resize")
                        }, o)
                    }, 0))
                }

                function s() {
                    u && ((0, n.default)(".player-drawer").addClass("with-transition"), setTimeout(function () {
                        (0, n.default)(".player-drawer").addClass("collapsed"), l.pauseVideo(), u = !1, (0, n.default)(".js-video-main").get(0).play(), setTimeout(function () {
                            (0, n.default)(".player-drawer").removeClass("with-transition"), (0, n.default)(window).trigger("resize")
                        }, o)
                    }, 0))
                }

                function a() {
                    1 === l.getPlayerState() ? l.pauseVideo() : l.playVideo()
                }

                var r = this, o = 500, l = void 0, c = !1, u = !1, d = !1, h = document.createElement("script");
                h.src = "https://www.youtube.com/iframe_api";
                var f = document.getElementsByTagName("script")[0];
                f.parentNode.insertBefore(h, f), (0, n.default)(".controls-container").on("click", function (t) {
                    t.target === r && a()
                }), (0, n.default)(".toggle-button").on("click", function () {
                    s()
                }), (0, n.default)(".next-button").on("click", function () {
                    l.nextVideo()
                }), window.onYouTubeIframeAPIReady = function () {
                    l = new YT.Player("yt-player", {
                        videoId: "ChSD-Tn-SZc",
                        playerVars: {
                            listtype: "playlist",
                            list: "PLH2ZY82du82SbzA0gEzecYDSLTxYGuiYS",
                            rel: 0,
                            disablekb: 1,
                            controls: 0,
                            showinfo: 0,
                            autohide: 1,
                            autoplay: 1,
                            modestbranding: 1,
                            loop: 1,
                            iv_load_policy: 3,
                            fs: 0,
                            widget_referrer: "wealthsimple.com"
                        },
                        events: {onReady: t, onStateChange: e}
                    })
                }
            }
        }
    }, 248: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s);
        i(6).ws.initMap = function () {
            var t = (0, n.default)(".who-we-are-location-toronto > .location-map"),
                e = (0, n.default)(".who-we-are-location-ny > .location-map"), i = {
                    disableDefaultUI: !0,
                    styles: [{
                        featureType: "administrative",
                        elementType: "all",
                        stylers: [{visibility: "simplified"}, {saturation: "-100"}]
                    }, {
                        featureType: "landscape",
                        elementType: "all",
                        stylers: [{saturation: -100}, {lightness: 50}, {visibility: "on"}]
                    }, {
                        featureType: "landscape.man_made",
                        elementType: "all",
                        stylers: [{visibility: "off"}]
                    }, {featureType: "poi", elementType: "all", stylers: [{visibility: "off"}]}, {
                        featureType: "transit",
                        elementType: "all",
                        stylers: [{visibility: "off"}]
                    }, {
                        featureType: "road.highway",
                        elementType: "all",
                        stylers: [{visibility: "off"}]
                    }, {
                        featureType: "road.arterial",
                        elementType: "all",
                        stylers: [{visibility: "simplified"}]
                    }, {
                        featureType: "road.local",
                        elementType: "all",
                        stylers: [{visibility: "simplified"}]
                    }, {
                        featureType: "water",
                        elementType: "all",
                        stylers: [{visibility: "simplified"}, {lightness: 30}, {saturation: -100}]
                    }]
                };
            new google.maps.Map(t[0], n.default.extend(i, {
                center: new google.maps.LatLng(43.6446, -79.4115),
                zoom: 17
            })), new google.maps.Map(e[0], n.default.extend(i, {
                center: new google.maps.LatLng(40.7235, -73.996),
                zoom: 16
            }))
        }, document.body.insertAdjacentHTML("beforeend", '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC0w0bDxV0KfU7ck8KpKJwdxIJbPkDBY80&callback=ws.initMap;"><\/script>')
    }, 249: function (t, e, i) {
        "use strict";

        function s(t) {
            return t && t.__esModule ? t : {default: t}
        }

        function n(t) {
            return function () {
                var e = t.apply(this, arguments);
                return new Promise(function (t, i) {
                    function s(n, a) {
                        try {
                            var r = e[n](a), o = r.value
                        } catch (t) {
                            return void i(t)
                        }
                        if (!r.done) return Promise.resolve(o).then(function (t) {
                            s("next", t)
                        }, function (t) {
                            s("throw", t)
                        });
                        t(o)
                    }

                    return s("next")
                })
            }
        }

        var a = function () {
            function t(t, e) {
                var i = [], s = !0, n = !1, a = void 0;
                try {
                    for (var r, o = t[Symbol.iterator](); !(s = (r = o.next()).done) && (i.push(r.value), !e || i.length !== e); s = !0) ;
                } catch (t) {
                    n = !0, a = t
                } finally {
                    try {
                        !s && o.return && o.return()
                    } finally {
                        if (n) throw a
                    }
                }
                return i
            }

            return function (e, i) {
                if (Array.isArray(e)) return e;
                if (Symbol.iterator in Object(e)) return t(e, i);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }(), r = i(1), o = s(r), l = i(201), c = s(l), u = i(6), d = function (t) {
            this.svg = t, this.wealthsimpleLine = t.querySelector(".js-wealthsimple-line"), this.typicalLine = t.querySelector(".js-typical-line"), this.wealthsimpleArea = t.querySelector(".js-wealthsimple-area"), this.typicalArea = t.querySelector(".js-typical-area"), this.riskLevelSlider = (0, o.default)(".js-risk-level-slider"), this.riskLevelLabel = (0, o.default)(".js-performance-graph-selector--risk"), this.portfolioTypeRadios = (0, o.default)(".js-performance-radio"), this.bubble = document.querySelector(".js-portfolio-performance-bubble"), this.descenderHigh = document.querySelector(".js-portfolio-performance__descender--high"), this.graphContainer = document.querySelector(".js-portfolio-performance__graph"), this.riskLevel = parseInt(this.riskLevelSlider.val()), this.portfolioType = (0, o.default)(".js-performance-radio:checked").val(), this.parsedWsPerformance = {}, this.parsedTypicalPerformance = {}, this.min = 9e3, this.max = 12500 - this.min, this.isMobileDevice = u.ws.isMobileDevice, this.riskLevelSlider.on("change", this.setRiskLevel.bind(this)), this.portfolioTypeRadios.on("change", this.setPortfolioType.bind(this)), this.initChartInteractivity(), this.setDimensions(), window.addEventListener("resize", u.ws.debounce(this.setDimensions.bind(this), 200), !1)
        };
        d.prototype = {
            initChartInteractivity: function () {
                var t = this;
                u.ws.isMobileDevice() ? this.svg.addEventListener("touchmove", function (e) {
                    e.preventDefault(), t.updateBubble(e)
                }) : this.svg.addEventListener("mousemove", function (e) {
                    t.updateBubble(e)
                })
            }, setDimensions: function () {
                var t = this.svg.getBoundingClientRect();
                this.width = parseInt(t.width), window.innerHeight > 620 ? (this.wealthsimpleLine.setAttribute("stroke-width", 2), this.typicalLine.setAttribute("stroke-width", 2), this.height = parseInt(.45 * this.width)) : (this.wealthsimpleLine.setAttribute("stroke-width", 2), this.typicalLine.setAttribute("stroke-width", 2), this.height = this.width), this.svg.setAttribute("viewBox", "0 0 " + this.width + " " + this.height), (document.documentMode || /Edge/.test(navigator.userAgent)) && (this.svg.style.width = this.width + "px", this.svg.style.height = this.height + "px"), this.draw()
            }, setRiskLevel: function () {
                this.riskLevel = parseInt(this.riskLevelSlider.val());
                var t = "Balanced";
                this.riskLevel >= 2 ? t = "Growth" : this.riskLevel <= 0 && (t = "Conservative"), this.riskLevelLabel.text(t), this.draw()
            }, setPortfolioType: function () {
                this.portfolioType = (0, o.default)(".js-performance-radio:checked").val(), this.draw()
            }, historicalWsData: function () {
                var t = this.parsedWsPerformance[this.portfolioType] || this.getWsPortfolio(this.portfolioType).then(function (t) {
                    var e = t.data;
                    return (0, c.default)(e)
                });
                return this.parsedWsPerformance[this.portfolioType] = t, t
            }, historicalTypicalData: function () {
                var t = this.parsedTypicalPerformance[this.portfolioType] || this.getTypicalPortfolio(this.portfolioType).then(function (t) {
                    var e = t.data;
                    return (0, c.default)(e)
                });
                return this.parsedTypicalPerformance[this.portfolioType] = t, t
            }, getWsPortfolio: function (t) {
                return "regular" === t ? i.e(4).then(i.bind(null, 303)) : i.e(3).then(i.bind(null, 304))
            }, getTypicalPortfolio: function (t) {
                return "regular" === t ? i.e(1).then(i.bind(null, 305)) : i.e(2).then(i.bind(null, 306))
            }, pointAt: function (t, e, i) {
                var s = parseInt(this.width / i * e),
                    n = parseInt(this.height - this.height * (t - this.min) / this.max), a = "L";
                return 0 === e && (a = "M"), a + s + "," + n
            }, line: function (t) {
                var e = [], i = 0, s = !0, n = !1, a = void 0;
                try {
                    for (var r, o = t[Symbol.iterator](); !(s = (r = o.next()).done); s = !0) {
                        var l = r.value;
                        i % 5 == 0 && e.push(l), i++
                    }
                } catch (t) {
                    n = !0, a = t
                } finally {
                    try {
                        !s && o.return && o.return()
                    } finally {
                        if (n) throw a
                    }
                }
                var c = this, u = [2, 4, 8][this.riskLevel], d = e.map(function (t) {
                    return parseFloat(t[u])
                }), h = d.length;
                return d.map(function (t, e) {
                    return c.pointAt(t, e, h)
                }).join(" ")
            }, area: function (t) {
                return this.line(t) + " L" + this.width + "," + this.height + " L0," + this.height + " Z"
            }, draw: function () {
                function t() {
                    return e.apply(this, arguments)
                }

                var e = n(regeneratorRuntime.mark(function t() {
                    var e, i, s, n, r = this;
                    return regeneratorRuntime.wrap(function (t) {
                        for (; ;) switch (t.prev = t.next) {
                            case 0:
                                return t.next = 2, Promise.all([this.historicalWsData(), this.historicalTypicalData()]);
                            case 2:
                                e = t.sent, i = a(e, 2), s = i[0], n = i[1], window.requestAnimationFrame(function () {
                                    r.wealthsimpleArea.setAttribute("d", r.area(s)), r.typicalArea.setAttribute("d", r.area(n)), r.wealthsimpleLine.setAttribute("d", r.line(s)), r.typicalLine.setAttribute("d", r.line(n)), r.wealthsimpleArea.setAttribute("fill", "#40c9d0"), r.typicalArea.setAttribute("fill", "url(#PerformanceGradient)"), r.drawLabels(s)
                                });
                            case 7:
                            case"end":
                                return t.stop()
                        }
                    }, t, this)
                }));
                return t
            }(), drawLabels: function (t) {
                if (0 !== t.length) {
                    var e = this.portfolioType;
                    (0, o.default)(".js-dot").remove();
                    var i = new Date(t[0][0]), s = new Date(t[t.length - 1][0]), n = this.monthDiff(i, s) + 1,
                        a = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    0 === (0, o.default)(".js-dot").length && (0, o.default)(".portfolio-performance-legend").each(function (t, i) {
                        i.classList.remove("regular", "socially-responsible"), i.classList.add(e);
                        for (var s = 0; s < n; s++) (0, o.default)(this).append('<li class="portfolio-performance-legend-dot js-dot"><span class="dot-label js-dot-label"></span></li>')
                    }), (0, o.default)(".js-dot").each(function (t, s) {
                        var n = new Date(i.getTime());
                        n.setMonth(i.getMonth() + t);
                        var r = n.getMonth();
                        "regular" !== e || (6 !== r || u.ws.isMobile()) && 0 !== r ? "socially-responsible" !== e || 6 !== r && 0 !== r || (s.classList.add("labeled"), s.querySelector(".js-dot-label").innerText = a[r] + " " + n.getFullYear()) : (s.classList.add("labeled"), s.querySelector(".js-dot-label").innerText = a[r] + " " + n.getFullYear())
                    })
                }
            }, monthDiff: function (t, e) {
                var i = void 0;
                return i = 12 * (e.getFullYear() - t.getFullYear()), i -= t.getMonth(), i += e.getMonth(), i <= 0 ? 0 : i
            }, getDataAtPercent: function () {
                function t(t, i) {
                    return e.apply(this, arguments)
                }

                var e = n(regeneratorRuntime.mark(function t(e, i) {
                    var s, n, a, r;
                    return regeneratorRuntime.wrap(function (t) {
                        for (; ;) switch (t.prev = t.next) {
                            case 0:
                                return t.next = 2, "ws" === i ? this.parsedWsPerformance[this.portfolioType] : this.parsedTypicalPerformance[this.portfolioType];
                            case 2:
                                return s = t.sent, n = Math.round(e * (s.length - 1)), a = [2, 4, 8][this.riskLevel], r = Math.round(s[n][a] / 100) - 100, t.abrupt("return", r > 0 ? "+" + r + "%" : r + "%");
                            case 7:
                            case"end":
                                return t.stop()
                        }
                    }, t, this)
                }));
                return t
            }(), updateBubble: function () {
                function t(t) {
                    return e.apply(this, arguments)
                }

                var e = n(regeneratorRuntime.mark(function t(e) {
                    var i, s, n, r, o, l, c, u, d, h;
                    return regeneratorRuntime.wrap(function (t) {
                        for (; ;) switch (t.prev = t.next) {
                            case 0:
                                return i = void 0, i = "touchmove" === e.type ? e.touches[0].clientX : e.offsetX, s = Math.min(Math.max(i / this.width, 0), 1), t.next = 5, Promise.all([this.getDataAtPercent(s, "ws"), this.getDataAtPercent(s, "typical")]);
                            case 5:
                                n = t.sent, r = a(n, 2), o = r[0], l = r[1], c = this.typicalLine.getPointAtLength(s * this.typicalLine.getTotalLength()), u = this.wealthsimpleLine.getPointAtLength(s * this.wealthsimpleLine.getTotalLength()), d = window.locales, h = void 0, t.t0 = window.currentLocale, t.next = t.t0 === d.FR_CA ? 16 : 18;
                                break;
                            case 16:
                                return h = "Investisseur<br/>traditionnel", t.abrupt("break", 19);
                            case 18:
                                h = "Traditional<br/>investor";
                            case 19:
                                this.bubble.innerHTML = '<div class="performance-graph-bubble-inner"><div class="percent-left"><div class="percent">' + o + '</div><div class="legend">Wealthsimple<br/>investor</div></div><div class="percent-right"><div class="percent">' + l + '</div><div class="legend">' + h + "</div></div></div>", this.descenderHigh.style.transform = "translate(" + parseInt(u.x) + "px," + parseInt(u.y) + "px)", this.descenderHigh.style.display = "block", this.bubble.style.display = "block";
                            case 23:
                            case"end":
                                return t.stop()
                        }
                    }, t, this)
                }));
                return t
            }()
        }, (0, o.default)(".js-portfolio-performance-graph").each(function (t, e) {
            window.addEventListener("load", function () {
                new d(e)
            }, !1)
        })
    }, 250: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = i(6), r = function (t) {
            this.el = t, this.stuck = !1, this.y = 0, this.body = (0, n.default)("body"), this.sections = (0, n.default)(".js-details-section"), this.sectionMenuItems = (0, n.default)(".js-sticky-details-link"), this.activeSection = null, window.addEventListener("scroll", this.onScroll.bind(this), !1), this.onScroll()
        };
        r.prototype = {
            onScroll: function () {
                var t = void 0;
                if (!0 === this.stuck && window.pageYOffset < 96) return void window.requestAnimationFrame(this.unstick.bind(this));
                !1 === this.stuck && (t = (0, n.default)(this.el).offset().top - 20, window.pageYOffset > 96 && (this.y = t, this.sectionYValues = this.getSectionYValues(), window.requestAnimationFrame(this.stick.bind(this)))), !0 === this.stuck && this.markActiveSection(window.pageYOffset)
            }, stick: function () {
                this.stuck = !0, this.el.classList.add("sticky-details-active"), this.markActiveSection(window.pageYOffset)
            }, unstick: function () {
                this.stuck = !1, this.el.classList.remove("sticky-details-active")
            }, getOffset: function (t) {
                return (0, n.default)(t).offset().top
            }, getSectionYValues: function () {
                return Array.prototype.slice.call(this.sections).map(this.getOffset)
            }, markActiveSection: function (t) {
                var e = 0, i = void 0;
                for (i = 0; i < this.sectionYValues.length && t + 200 > this.sectionYValues[i]; i++) e = i;
                e !== this.activeSection && (this.activeSection = e, this.sectionMenuItems.removeClass("sticky-details-link-active"), this.sectionMenuItems[e].classList.add("sticky-details-link-active"))
            }
        }, null !== document.querySelector(".js-sticky-details-nav") && window.addEventListener("load", function () {
            (0, n.default)(".js-sticky-details-nav").each(function (t, e) {
                a.ws.isDesktop() && new r(e)
            })
        }, !1)
    }, 251: function (t, e, i) {
        "use strict";

        function s(t) {
            return Math.round(10 * t) / 10
        }

        var n = i(1), a = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(n), r = i(6), o = {
            US: {
                conservative: [15.5, 2.5, 5, 9, 3, 34.5, 3.5, 20.5, 6.5],
                balanced: [22, 4, 7, 13, 4, 26.5, 2.5, 16, 5],
                growth: [35.5, 6, 11.5, 20.5, 6.5, 12, 0, 8, 0],
                halal: [5.62, 49.66, 12.83, 30.69, 1.2],
                sri_conservative: [20.3, 4.4, 4.9, 5.4, 26.3, 38.7],
                sri_balanced: [29, 6.2, 7, 7.8, 20.3, 29.7],
                sri_growth: [46.4, 9.9, 11.3, 12.4, 8.1, 11.9]
            },
            CA: {
                conservative: [15, 7.5, 42.5, 7.5, 7.5, 7.5, 7.5, 5, 0],
                balanced: [15, 5, 30, 10, 10, 10, 10, 5, 5],
                growth: [7.5, 0, 12.5, 0, 0, 32.5, 22.5, 15, 10],
                halal: [25.52, 39.96, 10.18, 24.33],
                sri_conservative: [20, 0, 0, 15, 65],
                sri_balanced: [20, 7.5, 7.5, 15, 50],
                sri_growth: [27.5, 15, 15, 22.5, 20]
            },
            GB: {
                conservative: [46.69, 23.31, 0, 0, 1.89, 2.22, 2.63, 3, 8.46, 11.8],
                balanced: [10.8, 21.2, 4, 4, 3.79, 4.43, 5.26, 6, 16.92, 23.6],
                growth: [2.7, 5.3, 1, 1, 5.7, 6.65, 7.89, 9, 25.36, 35.4],
                sri_conservative: [28.34, 1.67, 3.5, 66.5],
                sri_balanced: [47.5, 2.5, 7.5, 42.5],
                sri_growth: [85.5, 4.5, 1.5, 8.5]
            }
        }, l = function (t, e) {
            var i = this;
            this.el = t, this.allocations = (0, a.default)(".js-allocation", this.el), window.addEventListener("load", function () {
                i.setProfile(e)
            }, !1)
        };
        l.prototype = {
            setProfile: function (t) {
                this.height = (0, a.default)(this.el).height(), this.portfolio = t, this.allocations.each(this.setAllocation.bind(this))
            }, setAllocation: function (t, e) {
                var i = o[window.currentJurisdiction] || o.CA, n = i[this.portfolio], a = n[t] / 100;
                r.ws.isDesktop() ? (e.style.height = Math.max(a * this.height * 1.5, 25) + "px", e.style.width = "auto", e.style.background = "", 0 === a && (e.style.height = "5px", e.style.background = "#dedede")) : (e.style.width = 130 * a + 5 + "%", e.style.height = "auto", e.style.background = "", 0 === a && (e.style.width = "5px", e.style.background = "#dedede")), e.setAttribute("percent", s(100 * a) + "%"), 0 === a && e.setAttribute("percent", "")
            }
        }, (0, a.default)(".js-portfolio-bar-chart").each(function (t, e) {
            var i = (0, a.default)(".js-portfolio-radio:checked").val(), s = new l(e, i);
            (0, a.default)(".js-portfolio-radio").on("change", function (t) {
                s.setProfile(t.target.value)
            })
        })
    }, 252: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s), a = function (t) {
            this.speed = 1200, this.area = t, this.toggleTop = this.area.querySelectorAll(".js-faq-toggle")[0], this.toggleTop && (this.toggleBottom = this.area.querySelectorAll(".js-faq-toggle")[1], this.target = this.createTarget(), this.locale = window.currentLocale, this.section = this.toggleTop.getAttribute("data-section"), this.text = this.area.querySelector(".js-faq-toggle-text"), this.texts = {
                open: this.toggleTop.innerText,
                close: this.text.getAttribute("data-close-text")
            }, this.loaded = !1, this.opened = !1, this.toggleTop.addEventListener("click", this.toggle.bind(this), !1), this.toggleBottom.addEventListener("click", this.toggle.bind(this), !1), (0, n.default)(this.area).on("click", ".js-article-header", this.toggleQuestion))
        };
        a.prototype = {
            toggleQuestion: function (t) {
                t.preventDefault(), this.nextElementSibling.classList.toggle("hide")
            }, toggle: function (t) {
                if (t.preventDefault(), !1 === this.loaded) return void this.load();
                this.opened = !0 === this.opened ? this.close() : this.open()
            }, open: function () {
                return this.area.classList.remove("loading"), this.toggleTop.insertAdjacentElement("afterend", this.target), this.animate(0, this.targetHeight(), this.onOpened), this.area.classList.add("opening"), !0
            }, close: function () {
                return this.area.classList.remove("open"), this.area.classList.add("closing"), this.text.innerText = this.texts.open, this.animate(this.targetHeight(), 0, this.onClosed), !1
            }, load: function () {
                var t = new XMLHttpRequest;
                this.area.classList.add("loading"), t.onreadystatechange = this.onLoaded.bind(this), t.open("GET", "/inline-faq/" + this.section + "?locale=" + this.locale), t.send()
            }, createTarget: function () {
                var t = document.createElement("div");
                return t.className = "faq-area-target", t
            }, targetHeight: function () {
                return this.area.clientHeight
            }, animate: function (t, e, i) {
                var s = this.target;
                s.style.height = t + "px", s.style.transition = "height " + this.speed + "ms cubic-bezier(0.580, 0.000, 0.290, 0.845)", window.requestAnimationFrame(function () {
                    window.getComputedStyle(s).opacity, s.style.height = e + "px"
                }), setTimeout(i.bind(this), this.speed)
            }, onLoaded: function (t) {
                var e = t.target;
                e.readyState === XMLHttpRequest.DONE && 200 === e.status && (this.target.innerHTML = e.responseText, this.loaded = !0, this.opened = this.open())
            }, onOpened: function () {
                this.text.innerText = this.texts.close, this.area.classList.remove("opening"), this.area.classList.add("open"), this.target.style.height = "auto"
            }, onClosed: function () {
                this.area.classList.remove("closing"), this.area.removeChild(this.target), this.target.style.height = "auto"
            }
        };
        var r = document.querySelectorAll(".js-faq-area");
        Array.prototype.slice.call(r).forEach(function (t) {
            new a(t)
        })
    }, 253: function (t, e, i) {
        "use strict";
        window.console && (console.log('\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢ ¢¢¢¢¢                 .¢¢$     .   .¢¢$                ¢$¢                           .¢¢$\n  ‟$$$.  "$$$.    $/                   $$$   ,¢$    $$$                `"`                            $$$\n   ‟$$$.  "$$$.   /.¢"^"¢.   .¢\'^$$¢   $$$ -¢$$$¢¢  $$$ .¢$$. .¢"`"$$ .¢¢$  .¢¢$.¢$$..¢$$. .¢¢$¢\'"$¢. $$$  .¢"^"¢.\n    ‟$$$. /"$$$. /.$$___$$$ $$$  $$$   $$$   $$$    $$$   $$$ $$$¢. "  $$$   $$$  $$$  $$$  $$$   $$$ $$$ .$$___$$$\n     ‟$$$/  "$$$" $$$       `",¢`$$$   $$$   $$$    $$$   $$$  "$$$$¢. $$$   $$$  $$$  $$$  $$$   $$$ $$$ $$$\n      "$"    "$"  "$$$.  .\' ¢$$  $$$.  $$$   $$$    $$$   $$$ $   "$$" $$$   $$$  $$$  $$$  $$$   $$" $$$ "$$$.  .\n       $      $     "$$$"`  `"$¢\'"$$$`.$$$.  "$$¢" .$$$. .$$$."¢._.¢` .$$$. .$$$..$$$..$$$. $$$¢.¢"" .$$$.  "$$$"\n                                                                                            $$$\n                                                                                          .$$$¢.'), console.log("We're looking for talented people like you to join our team!"), console.log("Interested? Visit https://www.wealthsimple.com/work-with-us"))
    }, 254: function (t, e, i) {
        "use strict";
        i(6).ws.isMobile() && null !== document.querySelector(".sub-nav-select") && styleSelect(".sub-nav-select")
    }, 255: function (t, e, i) {
        "use strict";

        function s(t) {
            return t && t.__esModule ? t : {default: t}
        }

        var n = i(48), a = s(n), r = i(1), o = s(r), l = function (t) {
                if (t) return (0, o.default)("<div>").text(t).html()
            }, c = function (t) {
                return "https://my.wealthsimple.com/app/beta?token=" + t
            }, u = document.querySelector(".beta-invite-bar"), d = l(a.default.get("beta-referrer-name")),
            h = l(a.default.get("beta-referrer-token"));
        u && d && h && (function (t, e, i) {
            t.style.display = "block", t.innerHTML = "Your friend " + e + ' invited you to sign up for the Wealthsimple UK beta. <a class="beta-link" href="' + c(i) + '">Get early access</a>'
        }(u, d, h), function (t) {
            (0, o.default)(".join-beta").attr("href", c(t))
        }(h))
    }, 256: function (t, e, i) {
        "use strict";

        function s() {
            window.setTimeout(function () {
                return l.addClass("hamburger-open")
            }, 500)
        }

        function n() {
            l.removeClass("hamburger-open")
        }

        function a() {
            l = (0, o.default)("body"), l.on("click", '[data-hamburger-action="open"]', s), l.on("click", '[data-hamburger-action="close"]', n)
        }

        var r = i(1), o = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(r), l = void 0;
        (0, o.default)(a)
    }, 257: function (t, e, i) {
        "use strict";
        (function (t) {
            var e = i(1), s = function (t) {
                return t && t.__esModule ? t : {default: t}
            }(e);
            (0, s.default)(function () {
                function e(e, n) {
                    var a = (0, s.default)(n), r = a.find(".email-subscribe-form"),
                        o = a.find(".email-subscribe-input"), l = a.find(".email-subscribe-success"), c = {
                            email: o.val(),
                            promos_and_tips: !0,
                            news_and_announcements: !0,
                            locale: window.currentLocale
                        }, u = {
                            ".footer-cta-learn-container": "Learn",
                            ".footer-cta-halal-container": "Halal",
                            ".footer-cta-index-container": "Home",
                            ".footer-cta-sri-container": "SRI",
                            ".footer-cta-details-container": "Details",
                            ".footer-cta-who-we-are-container": "Who We Are",
                            ".footer-cta-black-container": "Black",
                            ".footer-cta-savings-container": "Smart Savings"
                        }, d = u[n] || "Unmapped", h = window.location.href;
                    h = h.substr(0, h.indexOf(window.currentLocale) + window.currentLocale.length) + "/", t.ajax({
                        url: h + "magazine/email-subscribe",
                        method: "POST",
                        data: JSON.stringify(c),
                        success: function () {
                            try {
                                analytics.track("Submit Email Success", {"Page Area": "Footer", "Site Area": d})
                            } catch (t) {
                            }
                            r.css("display", "none"), l.css("display", "block")
                        },
                        error: function () {
                            r.css("display", "none"), l.text(i()), l.css("color", "#ed5a3f"), l.css("display", "block")
                        }
                    }), e.preventDefault()
                }

                function i() {
                    return window.currentLocale.includes("fr") ? "Oups! Une erreur est survenue. Nous tentons de régler le problème." : "Whoops! Something broke. We're working on fixing it."
                }

                var n = [".footer-cta-learn-container", ".footer-cta-halal-container", ".footer-cta-index-container", ".footer-cta-sri-container", ".footer-cta-details-container", ".footer-cta-who-we-are-container", ".footer-cta-black-container", ".footer-cta-savings-container"];
                (0, s.default)(n).each(function (t, i) {
                    (0, s.default)(i + " .email-subscribe-form").on("submit", function (t) {
                        t.preventDefault(), e(t, i)
                    })
                })
            })
        }).call(e, i(1))
    }, 258: function (t, e, i) {
        "use strict";
        (function (t) {
            function e(e, i) {
                var n = (0, a.default)(i), r = n.find(".transfer-email-subscribe-form"),
                    o = n.find(".transfer-email-subscribe-input"), l = n.find(".transfer-email-subscribe-success"),
                    c = {
                        email: o.val(),
                        promos_and_tips: !0,
                        news_and_announcements: !0,
                        locale: window.currentLocale,
                        source: "rollover"
                    }, u = window.location.href;
                u = u.substr(0, u.indexOf(window.currentLocale) + window.currentLocale.length) + "/", t.ajax({
                    url: u + "magazine/email-subscribe",
                    method: "POST",
                    data: JSON.stringify(c),
                    success: function () {
                        try {
                            analytics.track("Submit Email Success", {"Page Area": "Rollover", "Site Area": "Rollover"})
                        } catch (t) {
                        }
                        r.css("display", "none"), l.css("display", "block")
                    },
                    error: function () {
                        r.css("display", "none"), l.text(s()), l.css("color", "#ed5a3f"), l.css("display", "block")
                    }
                }), e.preventDefault()
            }

            function s() {
                return window.currentLocale.includes("fr") ? "Oups! Une erreur est survenue. Nous tentons de régler le problème." : "Whoops! Something broke. We're working on fixing it."
            }

            var n = i(1), a = function (t) {
                return t && t.__esModule ? t : {default: t}
            }(n), r = [".transfer-email-capture__container"];
            (0, a.default)(r).each(function (t, i) {
                (0, a.default)(i + " .transfer-email-subscribe-form").on("submit", function (t) {
                    t.preventDefault(), e(t, i)
                })
            })
        }).call(e, i(1))
    }, 259: function (t, e, i) {
        "use strict";
        if (/mob=1/.test(window.location.search)) {
            var s = document.createElement("style");
            s.innerHTML = ".hide-webview { display: none; }", document.head.appendChild(s)
        }
    }, 261: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s);
        i(262), (0, n.default)(document).ready(function () {
            (0, n.default)("#howitworks-slides").cycle({
                fx: "fade",
                speed: "500",
                timeout: 0,
                next: "#howitworks-slides-right",
                prev: "#howitworks-slides-left",
                cleartypeNoBg: !0
            })
        })
    }, 263: function (t, e, i) {
        "use strict";
        (function (t) {
            var e = i(264), s = function (t) {
                return t && t.__esModule ? t : {default: t}
            }(e), n = i(6), a = i(203), r = i(266), o = function () {
                this.el = t(".js-sign-up-form"), this.submitButton = this.el.find(".js-sign-up-button"), this.email = null, this.password = null, this.jurisdiction = null, this.emailUpdates = null, this.laddaButton = null, this.riskSurveyFlow = document.querySelector(".js-risk-survey-flow") && document.querySelector(".js-risk-survey-flow").innerText.trim() || null, this.init()
            };
            o.prototype = {
                init: function () {
                    var t = this;
                    this.autosetLocale(), this.initLaddaSpinner(), this.el.on("submit", function (e) {
                        e.preventDefault(), t.clearErrors(), t.collectFormFields(), t.submitForm()
                    })
                }, autosetLocale: function () {
                    var t = window.currentLocale.split("-")[1];
                    this.el.find("select[name='jurisdiction']").val(t.toUpperCase()).change()
                }, initLaddaSpinner: function () {
                    this.laddaButton = s.default.create(document.querySelector(".js-sign-up-button"))
                }, collectFormFields: function () {
                    this.email = this.el.find("input[name='email']")[0].value, this.password = this.el.find("input[name='password']")[0].value, this.jurisdiction = this.el.find("select[name='jurisdiction']")[0].value, this.emailUpdates = this.el.find("input[name='email-updates']").is(":checked")
                }, submitForm: function () {
                    var e = this;
                    this.laddaButton.start(), t.ajax({
                        type: "POST",
                        url: n.ws.apiHost() + "/api/users",
                        xhrFields: {withCredentials: !0},
                        data: JSON.stringify(this.formatFormFields()),
                        headers: {
                            "X-WS-API-Version": 12,
                            "content-type": "application/json;charset=UTF-8",
                            "accept-language": window.snakecaseLocale() + ",en;q=0.9,fr;q=0.8"
                        }
                    }).then(function (t) {
                        r.apiService.authenticate({
                            grantType: "password",
                            scope: "read write",
                            username: e.email,
                            password: e.password
                        }).then(function () {
                            e.handleSuccessResponse(t)
                        })
                    }).catch(function (t) {
                        if (422 == t.status) {
                            e.laddaButton.stop();
                            var i = t.responseJSON.errors;
                            i.password && e.displayError("password", i.password[0]), i.email && e.displayError("email", i.email[0])
                        }
                    })
                }, clearErrors: function () {
                    this.el.find(".input-errors").text("")
                }, displayError: function (t, e) {
                    var i = e.replace(/^is /, "");
                    this.el.find(".input-errors--" + t).text(i)
                }, handleSuccessResponse: function (t) {
                    n.ws.user = {
                        id: t.id,
                        email: t.email,
                        primary_jurisdiction: t.jurisdictions[0],
                        canonical_id: t.canonical_id
                    }, a.analyticsService.aliasUser(t.canonical_id), a.analyticsService.trackEvent("Finish Signup", {}), window.location.href = n.ws.loggedInHost()
                }, formatFormFields: function () {
                    var t = window.snakecaseLocale(), e = this.email, i = this.password, s = [this.jurisdiction],
                        a = this.emailUpdates, r = n.ws.util.getExperimentsFromCookies(),
                        o = n.ws.util.cookieGet("referrer_url", !0), l = this.riskSurveyFlow,
                        c = n.ws.util.cookieGet("tags") || null, u = JSON.parse(c),
                        d = n.ws.util.cookieGet("utm_medium", !0), h = n.ws.util.cookieGet("utm_source", !0);
                    n.ws.util.cookieGet("utm_campaign", !0);
                    u ? u.push("www-signup") : u = ["www-signup"];
                    var f = n.ws.util.cookieGet("promo");
                    return f = f ? f.split(" ").join("-") : null, {
                        locale: t,
                        risk_survey_flow: l,
                        user: {
                            application_family_id: null,
                            email: e,
                            email_updates: a,
                            experiments: r,
                            jurisdictions: s,
                            password: i,
                            phone: null,
                            promo_code: f,
                            referrer_url: o,
                            tags: u,
                            utm_medium: d,
                            utm_source: h
                        }
                    }
                }
            }, document.body.classList.contains("has-sign-up-form") && new o
        }).call(e, i(1))
    }, 266: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0}), e.apiService = void 0;
        var s = i(6), n = i(267), a = {
            staging: {
                env: "sandbox",
                clientId: "476a51893b1c1c9c633f85b976706baa653bea41c1b1c62913128cc588b47e26",
                clientSecret: null
            },
            production: {
                env: "production",
                clientId: "4da53ac2b03225bed1550eba8e4611e086c7b905a3855e6ed12ea08c246758fa",
                clientSecret: null
            }
        }, r = s.ws.util.cookieGet("_oauth2_access", !0), o = Object.assign({}, function () {
            return "production" === window.env() ? a.production : a.staging
        }(), {
            auth: r && JSON.parse(r), deviceId: s.ws.util.cookieGet("wssdi", !0), onAuthSuccess: function (t) {
                s.ws.util.cookieSetGlobal("_oauth2_access", JSON.stringify(t), !0), console.info("[WS.js] Successful authentication, received access token", t)
            }
        }), l = new n(o);
        window.wealthsimple = l;
        e.apiService = l
    }, 268: function (t, e, i) {
        "use strict";
        (function (t) {
            function e(t) {
                return Math.max(Math.min(100 * t, 100), 0) / 100
            }

            function s(t, e) {
                var i = e.getTotalLength(), s = e.getPointAtLength(i);
                return Math.round(t) >= Math.round(s.x) ? s : h(e, t, 0, i)
            }

            var n = i(19), a = i(40), r = function (t) {
                return t && t.__esModule ? t : {default: t}
            }(a), o = i(6), l = i(269), c = i(270), u = i(204), d = function () {
                this.$component = t(".future-you-graph"), this.$graphContainer = t(".future-you-graph__graph-container"), this.$graphDescender = t(".future-you-graph__descender"), this.$graphMarkerWealthsimple = t(".future-you-graph__descender-marker--wealthsimple"), this.$svgContainer = t(".future-you-graph__svg"), this.$futureYouGraphSvg = null, this.chartOptions = l.futureYouGraphConfig.options, this.initialDeposit = 5e4, this.monthlyContribution = 1e3, this.riskLevel = 7, this.jurisdiction = window.currentJurisdiction, this.isRevealed = !1, this.model = null, this.modelSeries = null, this.activeYear = 25, this.isMobile = o.ws.isMobile(), this.isIE = o.ws.isIE(), this.$startingInvestmentSum = t(".js-graph-starting-investment-sum"), this.$monthlyDepositSum = t(".js-graph-monthly-deposit-sum"), this.$riskLevelSliderValue = t(".js-value--risk-level"), this.$startingInvestmentSlider = t(".js-graph-starting-investment"), this.$monthlyDepositSlider = t(".js-graph-monthly-deposit"), this.$riskLevelSlider = t(".js-slider-risk-level"), this.$wealthsimpleValue = t(".js-wealthsimple-value"), this.$traditionalAdvisorValue = t(".js-traditional-value"), this.$bankValue = t(".js-bank-value"), this.$wealthsimpleWorstValue = t(".js-value--wealthsimple-worst-case"), this.$traditionalAdvisorWorstValue = t(".js-value--traditional-advisor-worst-case"), this.$startingInvestmentSlider.on("change", this.onSliderChange.bind(this)), this.$monthlyDepositSlider.on("change", this.onSliderChange.bind(this)), this.$riskLevelSlider.on("change", this.onSliderChange.bind(this)), t(window).on("scroll", this.onScroll.bind(this)), this.init()
            };
            d.prototype = {
                init: function () {
                    this.initModel(), this.initDisplayValues(), this.initChart(), this.$component.addClass("future-you-graph--" + this.jurisdiction.toLowerCase())
                }, initModel: function () {
                    this.model = new c.FutureYouModel(this.initialDeposit, this.monthlyContribution, this.riskLevel, this.jurisdiction), this.modelSeries = this.model.buildSeries(this.initialDeposit, this.monthlyContribution, this.riskLevel)
                }, onScroll: function () {
                    this.isOnScreen() && this.revealGraph()
                }, initChart: function () {
                    var t = this;
                    this.$futureYouGraphSvg = new r.default.Line(".future-you-graph__svg", this.formattedChartData(), this.chartOptions), this.$futureYouGraphSvg.on("draw", function (t) {
                        "label" === t.type && l.futureYouGraphConfig.drawLabels(t)
                    }), this.$futureYouGraphSvg.on("created", function (e) {
                        l.futureYouGraphConfig.drawAxis(e), l.futureYouGraphConfig.defineGradients(e), l.futureYouGraphConfig.drawDescender(e), "GB" === t.jurisdiction && l.futureYouGraphConfig.defineBestWorstCaseComponents(e), !1 === t.isRevealed && !1 === t.isIE && l.futureYouGraphConfig.defineRevealAnimationClipPath(e), t.initChartInteractivity(), (t.isOnScreen() && !1 === t.isRevealed || t.isMobile) && t.revealGraph()
                    })
                }, initChartInteractivity: function () {
                    var e = this;
                    this.displayActiveYear(this.activeYear), this.updateDescender(this.activeYear / 30), this.setDisplayValues(this.activeYear), o.ws.isMobileDevice() ? (t(".future-you-graph__overlay").on("touchmove", function (t) {
                        e.updateDisplayFromMousemove(t.touches[0].clientX)
                    }), t(".future-you-graph__descender-marker").attr({r: "10px"})) : t(".future-you-graph__overlay").on("mousemove", function (t) {
                        e.updateDisplayFromMousemove(t.clientX)
                    })
                }, updateDisplayFromMousemove: function (t) {
                    var e = this.getPercentHoverFromMousemove(t), i = this.getActiveYearFromPercentHover(e);
                    this.activeYear = i, this.displayActiveYear(i), this.updateDescender(e), this.setDisplayValues(i)
                }, updateDescender: function (e) {
                    var i = this.$svgContainer.width(),
                        n = (this.$svgContainer.height(), this.$svgContainer.height(), i * e),
                        a = parseInt(t(".future-you-graph__x-axis").attr("y2")),
                        r = s(n, t(".ct-series--wealthsimple .ct-line")[0]);
                    t(".future-you-graph__descender-marker--wealthsimple").attr({
                        cx: r.x,
                        cy: r.y
                    }), t(".future-you-graph__descender").attr({x1: n, x2: n, y1: a, y2: r.y});
                    var o = s(n, t(".ct-series--traditional-advisor .ct-line")[0]);
                    if (t(".future-you-graph__descender-marker--traditional-advisor").attr({
                        cx: o.x,
                        cy: o.y
                    }), "GB" === this.jurisdiction) {
                        var l = s(n, t(".ct-series--wealthsimple-worst-case .ct-line")[0]),
                            c = s(n, t(".ct-series--traditional-advisor-worst-case .ct-line")[0]);
                        t(".future-you-graph__descender-marker--traditional-advisor-worst-case").attr({
                            cx: l.x,
                            cy: l.y
                        }), t(".future-you-graph__descender-marker--wealthsimple-worst-case").attr({cx: c.x, cy: c.y})
                    } else {
                        var u = s(n, t(".ct-series--bank .ct-line")[0]);
                        t(".future-you-graph__descender-marker--bank").attr({cx: u.x, cy: u.y})
                    }
                }, isOnScreen: function () {
                    return (window.scrollY + window.outerHeight - this.$graphContainer.offset().top) / this.$graphContainer.height() > 1
                }, revealGraph: function () {
                    1 != this.isRevealed && (t(".future-you-graph__clip-path__rect").attr({width: "120%"}), t(".future-you-graph").addClass("future-you-graph--revealed"), this.isRevealed = !0)
                }, turnOffGraphListeners: function () {
                    t(".future-you-graph__overlay").off("touchmove"), t(".future-you-graph__overlay").off("mousemove")
                }, getPercentHoverFromMousemove: function (t) {
                    var i = this.$svgContainer.width();
                    return e((t - this.$svgContainer.offset().left) / i)
                }, getActiveYearFromPercentHover: function (t) {
                    return Math.max(Math.min(Math.round(30 * t), 30), 0)
                }, displayActiveYear: function (e) {
                    t(".future-you-graph__x-label").removeClass("future-you-graph__x-label--active"), t(".future-you-graph__x-label--" + e).addClass("future-you-graph__x-label--active")
                }, initDisplayValues: function () {
                    this.$startingInvestmentSlider.val(this.initialDeposit), this.$monthlyDepositSlider.val(this.monthlyContribution), this.$riskLevelSlider.val(this.riskLevel), this.$startingInvestmentSum.text(currencyForLocale(this.initialDeposit)), this.$monthlyDepositSum.text(currencyForLocale(this.monthlyContribution)), this.setRiskLevelLabel(this.riskLevel), this.$wealthsimpleValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.wealthsimple.getValueAtYear(this.activeYear)))), this.$traditionalAdvisorValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.traditionalAdvisor.getValueAtYear(this.activeYear)))), this.$bankValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.bank.getValueAtYear(this.activeYear))))
                }, setDisplayValues: function (t) {
                    this.$wealthsimpleValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.wealthsimple.getValueAtYear(t)))), this.$traditionalAdvisorValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.traditionalAdvisor.getValueAtYear(t)))), this.$bankValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.bank.getValueAtYear(t)))), "GB" === this.jurisdiction && (this.$wealthsimpleWorstValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.wealthsimple.getWorstValueAtYear(t)))), this.$traditionalAdvisorWorstValue.html(currencyForLocaleHTML(parseInt(this.modelSeries.traditionalAdvisor.getWorstValueAtYear(t)))))
                }, formattedChartData: function () {
                    var t = this.modelSeries.xAxisLabels, e = [{
                        name: "wealthsimple",
                        className: "ct-series--wealthsimple",
                        data: this.normalizeSeries(this.modelSeries.wealthsimple.series)
                    }, {
                        name: "traditional-advisor",
                        className: "ct-series--traditional-advisor",
                        data: this.normalizeSeries(this.modelSeries.traditionalAdvisor.series)
                    }, {
                        name: "bank",
                        className: "ct-series--bank",
                        data: this.normalizeSeries(this.modelSeries.bank.series)
                    }];
                    return "GB" === this.jurisdiction && (e = e.concat([{
                        name: "wealthsimple-worst-case",
                        className: "ct-series--wealthsimple-worst-case",
                        data: this.normalizeSeries(this.modelSeries.wealthsimple.worstCaseSeries)
                    }, {
                        name: "traditional-advisor-worst-case",
                        className: "ct-series--traditional-advisor-worst-case",
                        data: this.normalizeSeries(this.modelSeries.traditionalAdvisor.worstCaseSeries)
                    }])), e = e.sort(function (t, e) {
                        return n._.last(t.data) < n._.last(e.data)
                    }), {labels: t, series: e}
                }, redrawChart: function () {
                    this.turnOffGraphListeners(), this.$futureYouGraphSvg.update(this.formattedChartData())
                }, refreshModel: function () {
                    this.initialDeposit = this.$startingInvestmentSlider.val(), this.monthlyContribution = this.$monthlyDepositSlider.val(), this.riskLevel = this.$riskLevelSlider.val(), this.modelSeries = this.model.buildSeries(this.initialDeposit, this.monthlyContribution, this.riskLevel)
                }, updatePreviewValues: function () {
                    this.$wealthsimpleValue.text(currencyForLocale(parseInt(this.modelSeries.wealthsimple.getValueAtYear(this.activeYear)))), this.$traditionalAdvisorValue.text(currencyForLocale(parseInt(this.modelSeries.traditionalAdvisor.getValueAtYear(this.activeYear)))), this.$bankValue.text(currencyForLocale(parseInt(this.modelSeries.bank.getValueAtYear(this.activeYear))))
                }, setRiskLevelLabel: function (t) {
                    var e = u.FutureYouTranslations.t("balanced");
                    t >= 7 ? e = u.FutureYouTranslations.t("growth") : t <= 3 && (e = u.FutureYouTranslations.t("conservative")), this.$riskLevelSliderValue.text(e)
                }, onSliderChange: function () {
                    var t = parseInt(this.$startingInvestmentSlider.val()),
                        e = parseInt(this.$monthlyDepositSlider.val()), i = parseInt(this.$riskLevelSlider.val());
                    this.$startingInvestmentSum.text(currencyForLocale(t)), this.$monthlyDepositSum.text(currencyForLocale(e)), this.setRiskLevelLabel(i), this.refreshModel(), this.updatePreviewValues(), this.redrawChart()
                }, getSliderPercent: function (e) {
                    return t(e + " .noUi-connect").width() / t(e + " .noUi-base").width()
                }, normalizeSeries: function (t) {
                    var e = this.initialDeposit, i = this.riskLevel / 10 * .1,
                        s = .1 * this.getSliderPercent(".future-you-graph__slider--monthly-deposit"),
                        a = .1 * this.getSliderPercent(".future-you-graph__slider--starting-investment"),
                        r = this.modelSeries.wealthsimple.getValueAtYear(30), o = i + s + a, l = r - e - (r - e) * o;
                    return n._.map(t, function (t) {
                        return (t - e + a * l) / l
                    })
                }
            };
            var h = function t(e, i, s, n) {
                var a = Math.floor((s + n) / 2), r = (e.getPointAtLength(s), e.getPointAtLength(a));
                e.getPointAtLength(n);
                return Math.round(r.x) === Math.round(i) ? e.getPointAtLength(a) : n - s == 0 ? e.getPointAtLength(s) : i > r.x ? t(e, i, a, n) : i < r.x ? t(e, i, s, a) : void 0
            };
            !function () {
                null !== document.querySelector(".future-you-graph") && window.addEventListener("load", function () {
                    setTimeout(function () {
                        new d
                    }, 2e3)
                }, !1)
            }()
        }).call(e, i(1))
    }, 269: function (t, e, i) {
        "use strict";
        (function (t) {
            Object.defineProperty(e, "__esModule", {value: !0}), e.futureYouGraphConfig = void 0;
            var s = i(40), n = function (t) {
                return t && t.__esModule ? t : {default: t}
            }(s), a = i(204), r = function (t) {
                return new n.default.Svg("circle", {
                    cx: 0,
                    cy: 0,
                    r: ["7.5px"],
                    fill: "white",
                    filter: "url(#dotShadow)"
                }, t)
            };
            e.futureYouGraphConfig = {
                options: {
                    axisX: {
                        showGrid: !1,
                        showLabel: !0,
                        labelInterpolationFnc: function (t) {
                            return 0 === t ? a.FutureYouTranslations.t("today") : a.FutureYouTranslations.t("year") + " " + t
                        }
                    },
                    axisY: {low: 0, high: 1.55, showGrid: !1, showLabel: !1, offset: 0, type: n.default.FixedScaleAxis},
                    showArea: !0,
                    showLine: !0,
                    showPoint: !0,
                    smoothLine: !0,
                    fullWidth: !0,
                    chartPadding: {top: 0, right: 0, bottom: 15, left: 0}
                }, drawLabels: function (t) {
                    var e = "future-you-graph__x-label future-you-graph__x-label--" + t.index;
                    t.element.attr({class: e})
                }, defineRevealAnimationClipPath: function (t) {
                    t.svg.elem("defs").elem("clipPath", {id: "future-you-graph__clip-path"}).elem("rect", {
                        class: "future-you-graph__clip-path__rect",
                        x: "-20",
                        y: "0",
                        height: "120%"
                    })
                }, defineBestWorstCaseComponents: function (e) {
                    var i = e.svg.elem("defs");
                    i.elem("mask", {
                        id: "future-you-graph__mask--wealthsimple-worst-case",
                        class: "future-you-graph__mask--wealthsimple-worst-case",
                        maskUnits: "userSpaceOnUse"
                    }).elem("rect", {
                        class: "future-you-graph__mask--wealthsimple-worst-case",
                        x: "0",
                        y: "0",
                        height: "100%",
                        width: "100%",
                        fill: "white"
                    }), i.elem("mask", {
                        id: "future-you-graph__mask--traditional-advisor-worst-case",
                        class: "future-you-graph__mask--traditional-advisor-worst-case",
                        maskUnits: "userSpaceOnUse"
                    }).elem("rect", {
                        x: "0",
                        y: "0",
                        height: "100%",
                        width: "100%",
                        fill: "white"
                    }), i.elem("pattern", {
                        id: "traditionalAdvisorGradientForGB",
                        width: "3",
                        height: "10",
                        patternTransform: "rotate(35 0 0)",
                        patternUnits: "userSpaceOnUse"
                    }).elem("line", {x1: "0", y1: "0", x2: "0", y2: "10", style: "stroke: #54575a; stroke-width: 1;"});
                    var s = r("future-you-graph__descender-marker future-you-graph__descender-marker--wealthsimple-worst-case"),
                        n = r("future-you-graph__descender-marker future-you-graph__descender-marker--traditional-advisor-worst-case");
                    t(".ct-series--wealthsimple-worst-case .ct-area").clone().appendTo("#future-you-graph__mask--wealthsimple-worst-case"), t(".ct-series--traditional-advisor-worst-case .ct-area").clone().appendTo("#future-you-graph__mask--traditional-advisor-worst-case"), e.svg.elem("g").append(s).append(n)
                }, drawAxis: function (t) {
                    t.svg.elem("line", {
                        x1: t.chartRect.x1,
                        x2: t.chartRect.x2,
                        y1: t.chartRect.y1,
                        y2: t.chartRect.y1
                    }, "future-you-graph__x-axis")
                }, drawDescender: function (t) {
                    var e = (new n.default.Svg("g", {}), r("future-you-graph__descender-marker future-you-graph__descender-marker--wealthsimple")),
                        i = r("future-you-graph__descender-marker future-you-graph__descender-marker--traditional-advisor"),
                        s = r("future-you-graph__descender-marker future-you-graph__descender-marker--bank"),
                        a = new n.default.Svg("line", {class: "future-you-graph__descender", x: 0, y1: 0, y2: 600});
                    t.svg.elem("g").append(a).append(e).append(i).append(s)
                }, defineGradients: function (t) {
                    var e = t.svg.elem("defs");
                    e.elem("linearGradient", {
                        id: "wealthsimpleGradient",
                        x1: 0,
                        y1: 1,
                        x2: 1,
                        y2: 0
                    }).elem("stop", {offset: "0%", "stop-color": "#F9F8F6"}).parent().elem("stop", {
                        offset: "2%",
                        "stop-color": "#F9F8F6"
                    }).parent().elem("stop", {
                        offset: "10%",
                        "stop-color": "#a5eff5"
                    }).parent().elem("stop", {
                        offset: "20%",
                        "stop-color": "#95e0e9"
                    }).parent().elem("stop", {
                        offset: "30%",
                        "stop-color": "#68d0d9"
                    }).parent().elem("stop", {
                        offset: "100%",
                        "stop-color": "#40c9d0"
                    }), e.elem("linearGradient", {
                        id: "traditionalAdvisorGradient",
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: 0
                    }).elem("stop", {offset: "0%", "stop-color": "#F9F8F6"}).parent().elem("stop", {
                        offset: "2%",
                        "stop-color": "#d4f3f6"
                    }).parent().elem("stop", {
                        offset: "20%",
                        "stop-color": "#b5f7f5"
                    }).parent().elem("stop", {
                        offset: "30%",
                        "stop-color": "#aaf8f8"
                    }).parent().elem("stop", {
                        offset: "50%",
                        "stop-color": "#89f0f2"
                    }).parent().elem("stop", {
                        offset: "100%",
                        "stop-color": "#63eef2"
                    }), e.elem("linearGradient", {
                        id: "bankGradient",
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: 0
                    }).elem("stop", {offset: "0%", "stop-color": "#F9F8F6"}).parent().elem("stop", {
                        offset: "20%",
                        "stop-color": "#edfff6"
                    }).parent().elem("stop", {
                        offset: "30%",
                        "stop-color": "#e1feff"
                    }).parent().elem("stop", {
                        offset: "50%",
                        "stop-color": "#e1feff"
                    }).parent().elem("stop", {
                        offset: "100%",
                        "stop-color": "#cffeff"
                    }), e.elem("filter", {
                        id: "dotShadow",
                        x: 0,
                        y: 0,
                        width: "300%",
                        height: "300%"
                    }).elem("feOffset", {
                        result: "offOut",
                        in: "SourceAlpha",
                        dx: "3",
                        dy: "3"
                    }).parent().elem("feColorMatrix", {
                        type: "matrix",
                        result: "matrixOut",
                        in: "offOut",
                        values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                    }).parent().elem("feGaussianBlur", {
                        result: "blurOut",
                        in: "matrixOut",
                        stdDeviation: "2"
                    }).parent().elem("feBlend", {in: "SourceGraphic", in2: "blurOut", mode: "normal"})
                }
            }
            // 그래프 색상
        }).call(e, i(1))
    }, 270: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0}), e.FutureYouModel = void 0;
        var s = i(19), n = i(39), a = i(271), r = s._.range(0, 31, 1);
        (e.FutureYouModel = function (t, e, i, s) {
            this.initialDeposit = t, this.monthlyContribution = e, this.riskLevel = i, this.jurisdiction = s, this.years = r, this.showBestAndWorstCase = !1
        }).prototype = {
            buildSeries: function (t, e, i) {
                this.initialDeposit = t, this.monthlyContribution = e, this.riskLevel = i;
                var s = a.jurisdictionAnnualReturnRates[this.jurisdiction].wealthsimple[this.riskLevel],
                    n = a.jurisdictionAnnualReturnRates[this.jurisdiction].traditionalAdvisor[this.riskLevel],
                    r = a.jurisdictionAnnualReturnRates[this.jurisdiction].bank, o = this.buildFutureYouSeries(s),
                    l = this.buildFutureYouSeries(n), c = this.buildFutureYouSeries(r), u = [], d = [];
                if ("GB" === this.jurisdiction) {
                    var h = a.jurisdictionAnnualReturnRates[this.jurisdiction].wealthsimpleWorstCase[this.riskLevel],
                        f = a.jurisdictionAnnualReturnRates[this.jurisdiction].traditionalAdvisorWorstCase[this.riskLevel];
                    u = this.buildFutureYouSeries(h), d = this.buildFutureYouSeries(f)
                }
                return {
                    xAxisLabels: this.years,
                    wealthsimple: {
                        series: o, worstCaseSeries: u, getValueAtYear: function (t) {
                            return o[t]
                        }, getWorstValueAtYear: function (t) {
                            return u[t]
                        }
                    },
                    traditionalAdvisor: {
                        series: l, worstCaseSeries: d, getValueAtYear: function (t) {
                            return l[t]
                        }, getWorstValueAtYear: function (t) {
                            return d[t]
                        }
                    },
                    bank: {
                        series: c, getValueAtYear: function (t) {
                            return c[t]
                        }
                    }
                }
            }, buildFutureYouSeries: function (t) {
                var e = new n.RiskCalculatorModel({
                    startingAmount: this.initialDeposit,
                    monthlyContribution: this.monthlyContribution,
                    annualReturnRate: t
                });
                return s._.map(r, function (t) {
                    return o(100, e.valueAtYear(t))
                })
            }
        };
        var o = function (t, e) {
            return Math.floor(e / t) * t
        }
    }, 271: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        e.jurisdictionAnnualReturnRates = {
            CA: {
                wealthsimple: {
                    1: .0364,
                    2: .038,
                    3: .0385,
                    4: .0412,
                    5: .044,
                    6: .0454,
                    7: .0473,
                    8: .0488,
                    9: .0501,
                    10: .0516
                },
                traditionalAdvisor: {
                    1: .0185,
                    2: .02,
                    3: .0205,
                    4: .0232,
                    5: .0259,
                    6: .0273,
                    7: .0283,
                    8: .0298,
                    9: .0311,
                    10: .0325
                },
                bank: .0065
            },
            US: {
                wealthsimple: {
                    1: .0414,
                    2: .0438,
                    3: .0461,
                    4: .0507,
                    5: .0553,
                    6: .0576,
                    7: .0617,
                    8: .0641,
                    9: .0665,
                    10: .0689
                },
                traditionalAdvisor: {
                    1: .0311,
                    2: .0334,
                    3: .0357,
                    4: .0403,
                    5: .0449,
                    6: .0472,
                    7: .0513,
                    8: .0537,
                    9: .0561,
                    10: .0585
                },
                bank: .0189
            },
            GB: {
                wealthsimple: {
                    1: .0353,
                    2: .0489,
                    3: .0589,
                    4: .0729,
                    5: .082,
                    6: .0911,
                    7: .1002,
                    8: .1093,
                    9: .1184,
                    10: 0
                },
                wealthsimpleWorstCase: {
                    1: .0215,
                    2: .0235,
                    3: .0255,
                    4: .0275,
                    5: .0296,
                    6: .0317,
                    7: .0337,
                    8: .0358,
                    9: .0378,
                    10: 0
                },
                traditionalAdvisor: {
                    1: .0248,
                    2: .0386,
                    3: .0485,
                    4: .0625,
                    5: .0715,
                    6: .0806,
                    7: .0896,
                    8: .0987,
                    9: .1077,
                    10: 0
                },
                traditionalAdvisorWorstCase: {
                    1: .0193,
                    2: .0203,
                    3: .0213,
                    4: .0222,
                    5: .0232,
                    6: .0242,
                    7: .0251,
                    8: .0261,
                    9: .0271,
                    10: 0
                },
                bank: .00406
            }
        }
    }, 272: function (t, e, i) {
        "use strict";

        function s(t) {
            return t && t.__esModule ? t : {default: t}
        }

        function n() {
            function t() {
                e.hasClass("faq__item--is-open") ? e.removeClass("faq__item--is-open") : e.addClass("faq__item--is-open")
            }

            var e = (0, l.default)(this);
            e.on("click", ".faq__top", t)
        }

        function a() {
            function t() {
                window.pageYOffset > 420 && window.innerWidth < 580 ? e.addClass("header__visible") : window.pageYOffset > 170 && window.innerWidth > 580 ? e.addClass("header__visible") : e.removeClass("header__visible")
            }

            var e = (0, l.default)(this);
            (0, l.default)(window).on("scroll", t), t()
        }

        function r() {
            function t(t) {
                var e = t.index + 1;
                e > d && (e = 1), (0, l.default)(".js-ws-trade-video").removeClass("visible");
                var i = (0, l.default)(".js-ws-trade-video-" + e), s = i.get(0);
                s.pause(), s.load(), s.currentTime = 0, i.addClass("visible"), s.play()
            }

            function e() {
                i.resize()
            }

            (0, l.default)(this).removeClass("hide");
            var i = (0, u.default)();
            i.setup({
                container: ".ws-trade-sticky-area",
                step: ".js-sticky-step",
                offset: .4,
                debug: !1
            }).onStepEnter(t), e(), window.addEventListener("resize", e)
        }

        var o = i(1), l = s(o);
        i(273);
        var c = i(274), u = s(c), d = 4;
        (0, l.default)(".js-ws-trade-faq-toggle").each(n), (0, l.default)(".js-ws-trade-scroll-header").each(a), (0, l.default)(function () {
            (0, l.default)(".js-ws-trade-screen-sticky").each(r), "scrollRestoration" in history || (0, l.default)(window).on("beforeunload", function () {
                (0, l.default)(window).scrollTop(0)
            })
        })
    }, 39: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        var s = e.RiskCalculatorModel = function (t) {
            this.startingAmount = t.startingAmount, this.monthlyContribution = t.monthlyContribution, this.annualReturnRate = t.annualReturnRate
        };
        s.prototype.valueAtYear = function (t) {
            var e = this.annualReturnRate / 12, i = this.startingAmount, s = void 0;
            for (s = 0; s < 12 * t; s++) i = i * (1 + e) + 1 * this.monthlyContribution;
            return i
        }, s.prototype.valueAtYearMinusFees = function (t, e) {
            var i = this.annualReturnRate / 12, s = this.startingAmount, n = void 0;
            for (n = 0; n < 12 * t; n++) s = s * (1 + i) + 1 * this.monthlyContribution - Math.round(s * e / 12);
            return parseInt(s)
        }, window.RiskCalculatorModel = s
    }, 49: function (t, e, i) {
        "use strict";
        var s = i(1), n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(s);
        /*!
 * MinPubSub
 * Copyright(c) 2011 Daniel Lamb <daniellmb.com>
 * MIT Licensed
 *
 * Customized for wealthsimple use.
 */
        !function (t) {
            var e = {}, i = t.c_ || {};
            e.publish = function (e, s) {
                for (var n = i[e], a = n ? n.length : 0; a--;) n[a].apply(t, s || [])
            }, e.subscribe = function (t, e) {
                return i[t] || (i[t] = []), i[t].push(e), [t, e]
            }, e.unsubscribe = function (t, e) {
                for (var s = i[e ? t : t[0]], n = e || t[1], a = s ? s.length : 0; a--;) s[a] === n && s.splice(a, 1)
            }, t.publish = e.publish, t.subscribe = e.subscribe, t.unsubscribe = e.unsubscribe
        }(n.default)
    }, 50: function (t, e, i) {
        "use strict";
        window.locales = {EN_CA: "en-ca", EN_GB: "en-gb", EN_US: "en-us", FR_CA: "fr-ca"};
        var s = void 0;
        Object.keys(window.locales).forEach(function (t) {
            var e = window.locales[t];
            window.location.pathname.substring(1, e.length + 1) === e && (s = e)
        }), window.currentLocale = s || window.locales.EN_CA, window.currentJurisdiction = window.currentLocale.split("-")[1].toUpperCase(), console.info("Setting locale to " + window.currentLocale + " and jurisdiction to " + window.currentJurisdiction + ".")
    }, 51: function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        var s = e.FeeSavingsModel = function () {
            this.freeAmount = 0, this.basicFee = window.ws.getBasicFee() / 100, this.blackFee = window.ws.getBlackFee() / 100
        }, n = {CA: .02, US: .0072, GB: .0256};
        s.prototype = {
            industryFee: function () {
                return n[window.currentJurisdiction] || n.CA
            }, wealthsimpleFee: function (t) {
                switch (!0) {
                    case t <= this.freeAmount:
                        return 0;
                    case t < 1e5:
                        return this.basicFee;
                    default:
                        return this.blackFee
                }
            }, savingsVsIndustry: function (t, e) {
                var i = this.wealthsimpleFee(e) + .002, s = void 0;
                return s = e <= 5e3 ? e * Math.exp((.043 - i) * t) - e * Math.exp((.043 - this.industryFee(e)) * t) : 5e3 * Math.exp((.043 - .002) * t) + (e - 5e3) * Math.exp((.043 - i) * t) - e * Math.exp((.043 - this.industryFee(e)) * t), Math.floor(s)
            }, savingsVsBlack: function (t, e) {
                var i = this.wealthsimpleFee(e) + .002;
                return 5e3 * Math.exp((.043 - .002) * t) + (e - 5e3) * Math.exp((.043 - i) * t) - e * Math.exp((.043 - this.industryFee(e)) * t)
            }
        }, window.FeeSavingsModel = s
    }, 6: function (t, e, i) {
        "use strict";

        function s(t) {
            return t && t.__esModule ? t : {default: t}
        }

        Object.defineProperty(e, "__esModule", {value: !0}), e.ws = void 0;
        var n = i(48), a = s(n), r = i(19), o = s(r);
        window.env = function () {
            return "www.wealthsimple.com" == window.location.host ? "production" : "development"
        };
        var l = e.ws = {
            onboardingDefaults: {investment_amount: 25e3, investment_timeframe: 20},
            how_it_works_amt: 25e3,
            fees: {black: {CA: .4, US: .4, GB: .5}, basic: {CA: .5, US: .5, GB: .7}},
            util: {
                cookieSet: function (t, e, i) {
                    i ? a.default.set(t, e) : a.default.set("ws_" + t, e)
                }, cookieSetGlobal: function (t, e, i, s) {
                    var n = s || {};
                    n.domain = window.location.hostname.replace(/^(.*?)\./, "."), i ? a.default.set(t, e, n) : a.default.set("ws_" + t, e, n)
                }, cookieGet: function (t, e) {
                    return e ? a.default.get(t) : a.default.get("ws_" + t)
                }, cookieRemove: function (t, e) {
                    return e ? a.default.remove(t) : a.default.remove("ws_" + t)
                }, getExperimentsFromCookies: function () {
                    var t = a.default.get();
                    return Object.keys(t).filter(function (t) {
                        return t.startsWith("ws_experiment_")
                    }).filter(function (t) {
                        return a.default.get(t)
                    }).map(function (t) {
                        return t + ":" + a.default.get(t)
                    })
                }
            },
            apiHost: function () {
                return "production" == window.env() ? "https://my.wealthsimple.com" : "https://staging.wealthsimple.com"
            },
            loggedInHost: function () {
                return "production" == window.env() ? "https://my.wealthsimple.com" : "https://staging.wealthsimple.com"
            },
            isCoreCanada: function () {
                return "CA" === window.currentJurisdiction && "en-ca" === window.currentLocale
            },
            isMobileDevice: function () {
                return /Mobile|Opera M(obi|ini)/i.test(navigator.userAgent)
            },
            isMobile: function () {
                return window.innerWidth < 620
            },
            isDesktop: function () {
                return window.innerWidth > 619
            },
            isIE: function () {
                return !(!navigator.userAgent.match("Trident/") && !navigator.userAgent.match("MSIE/"))
            },
            getCurrentOnboardingSettings: function () {
                var t = void 0;
                return window.ws.util.cookieGet("onboarding_params") && (t = JSON.parse(window.ws.util.cookieGet("onboarding_params")), t.investment_amount && t.investment_timeframe) ? t : window.ws.onboardingDefaults
            },
            debounce: function (t, e, i) {
                var s = void 0;
                return function () {
                    for (var n = arguments.length, a = Array(n), r = 0; r < n; r++) a[r] = arguments[r];
                    var o = this, l = function () {
                        s = null, i || t.apply(o, a)
                    }, c = i && !s;
                    clearTimeout(s), s = setTimeout(l, e), c && t.apply(o, a)
                }
            }
        };
        window.ws = l, window.commaSeparate = function (t) {
            return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }, window.spaceSeparate = function (t) {
            return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }, window.currencyForLocale = function (t) {
            var e = window.locales, i = void 0;
            switch (window.currentLocale) {
                case e.FR_CA:
                    i = window.spaceSeparate(t) + " $";
                    break;
                case e.EN_GB:
                    i = "£" + window.commaSeparate(t);
                    break;
                default:
                    i = "$" + window.commaSeparate(t)
            }
            return i
        }, window.currencyForLocaleHTML = function (t) {
            var e = window.locales, i = void 0;
            switch (window.currentLocale) {
                case e.FR_CA:
                    i = window.spaceSeparate(t) + " <span class='currency-symbol'>$</span></span>";
                    break;
                case e.EN_GB:
                    i = "<span class='currency-symbol'>£</span>" + window.commaSeparate(t);
                    break;
                default:
                    i = "<span class='currency-symbol'>$</span>" + window.commaSeparate(t)
            }
            return i
        }, window.currencySymbolForLocale = function () {
            var t = window.locales;
            switch (window.currentLocale) {
                case t.EN_GB:
                    return "£";
                default:
                    return "$"
            }
        }, window.snakecaseLocale = function () {
            return o.default.invert(window.locales)[window.currentLocale]
        }, window.feePercentageForLocale = function (t) {
            var e = window.locales, i = void 0;
            switch (window.currentLocale) {
                case e.FR_CA:
                    i = t.toString().replace(".", ",") + "%";
                    break;
                default:
                    i = t.toString() + "%"
            }
            return i
        }, window.ws.getBasicFee = function () {
            var t = window.currentJurisdiction || "CA";
            return window.ws.fees.basic[t]
        }, window.ws.getBlackFee = function () {
            var t = window.currentJurisdiction || "CA";
            return window.ws.fees.black[t]
        }
    }
}, [210]);