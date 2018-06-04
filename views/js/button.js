! function e(t, n, o) {
    function a(i, s) {
        if (!n[i]) {
            if (!t[i]) {
                var d = "function" == typeof require && require;
                if (!s && d) return d(i, !0);
                if (r) return r(i, !0);
                var l = new Error("Cannot find module '" + i + "'");
                throw l.code = "MODULE_NOT_FOUND", l
            }
            var c = n[i] = {
                exports: {}
            };
            t[i][0].call(c.exports, function(e) {
                var n = t[i][1][e];
                return a(n || e)
            }, c, c.exports, e, t, n, o)
        }
        return n[i].exports
    }
    for (var r = "function" == typeof require && require, i = 0; i < o.length; i++) a(o[i]);
    return a
}({
    1: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = window.addEventListener ? "addEventListener" : "attachEvent";
        n.eventMethod = o;
        var a = window.removeEventListener ? "removeEventListener" : "detachEvent";
        n.removeEventMethod = a;
        var r = function() {
                return "attachEvent" === o
            },
            i = r() ? "onkeydown" : "keydown";
        n.keydownEvent = i;
        var s = r() ? "onmessage" : "message";
        n.messageEvent = s;
        var d = r() ? "onload" : "load";
        n.loadEvent = d;
        var l = r() ? "onclick" : "click";
        n.clickEvent = l
    }, {}],
    2: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.onModalOpenHandler = function(e) {
            if ("object" == typeof e.handlers) {
                var t = e.handlers.onOpen;
                "function" == typeof t && t()
            }
        }, n.onModalCloseHandler = function(e) {
            if ("object" == typeof e.handlers) {
                var t = e.handlers.onClose;
                "function" == typeof t && t()
            }
        }, n.onPaymentSuccessHandler = function(e, t) {
            if ("object" == typeof e.handlers) {
                var n = e.handlers.onSuccess;
                "function" == typeof n && n(t)
            }
        }, n.onPaymentFailureHandler = function(e, t) {
            if ("object" == typeof e.handlers) {
                var n = e.handlers.onFailure;
                "function" == typeof n && n(t)
            }
        }
    }, {}],
    3: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o, a = e("./clientHandlers"),
            r = e("./EventUtils"),
            i = e("./utils"),
            s = e("../modal"),
            d = !1,
            l = null,
            c = !1;

        function m(e) {
            var t, r = e[e.message ? "message" : "data"];
            if (c || "onRequestShow" === r && (f(!0), n.freezeBackgroundScrolling(), d || (a.onModalOpenHandler(o), d = !0)), "onRequestClose" === r && u(o), "changingIframeUrl" === r && (t = i.getIframeContainer(), i.addClass(i.closest(t, ".iframe-container"), "loader"), c = !1), "object" == typeof r && r.paymentId) {
                var s = r.status;
                "success" === s ? a.onPaymentSuccessHandler(o, r) : "failure" === s && a.onPaymentFailureHandler(o, r)
            }
        }

        function u(e) {
            window[r.removeEventMethod](r.messageEvent, m),
                function() {
                    try {
                        document.getElementById("instamojo-viewport").remove(), l && document.head.appendChild(l)
                    } catch (e) {}
                }(), n.restoreBackgroundScrolling(), a.onModalCloseHandler(e), d = !1, c = !1
        }

        function f(e) {
            var t = i.getIframeContainer();
            if (i.removeClass(i.closest(t, ".iframe-container"), "loader"), e) try {
                var n = document.querySelector('meta[name="viewport"]');
                (l = n ? n.cloneNode() : null) && i.remove(n);
                var o = document.createElement("meta");
                o.name = "viewport", o.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no", o.id = "instamojo-viewport", document.head.appendChild(o)
            } catch (e) {}
            window.innerWidth < 640 && (i.closest(t, ".im-modal-container").style.position = "absolute", window.scrollTo(0, 0)), c = !0
        }
        n.getModalOptions = function(e) {
            var t, n, a, r, s = {
                content: '<div class="im-background-overlay"></div><div class="iframe-container loader"><div class="iframe-loader-wrapper"><div class="iframe-loader"></div></div><iframe class="iframe" src="' + (t = e, n = o.isInternalCheckout, a = o.directPaymentMode, r = t + (t.indexOf("?") > 0 ? "&" : "?"), (n ? r + "iframe=1&embed=form" : r + "checkout=remote&iframe=1&embed=form") + (a ? "&directPaymentMode=" + a : "")) + '" seamless id="imojo-rc-iframe"></iframe></div>'
            };
            return i.isIOSDevice || (s.modalContentStyle = {
                position: "fixed",
                width: "100%",
                height: "100%"
            }), s
        }, n.preLoadHandler = function() {
            var e = i.getIframeContainer();
            window[r.eventMethod](r.messageEvent, m, !1), e[r.eventMethod](r.loadEvent, function() {
                c || f(!1)
            })
        }, n.loadPaymentModal = function(e, t, a) {
            e && (o = a, t(), s.loadModal(n.getModalOptions(e)), n.preLoadHandler())
        }, n.closePaymentModal = function(e) {
            s.closeModal(), u(e)
        }, n.freezeBackgroundScrolling = function() {
            document.getElementsByTagName("html")[0].style.overflowY = "hidden", i.isIOSDevice && document.body.clientHeight < 1500 && (document.getElementsByTagName("body")[0].style.height = "1500px")
        }, n.restoreBackgroundScrolling = function() {
            document.getElementsByTagName("html")[0].style.overflowY = "auto", document.getElementsByTagName("body")[0].style.height = "auto"
        }, n.defaultModalOptions = {
            isInternalCheckout: !1,
            directPaymentMode: "",
            handlers: {}
        }, n.configureOptions = function(e) {
            try {
                var t = !0;
                if (!("object" == typeof e)) return console && console.error("Invalid Options", e), n.defaultModalOptions;
                var o = e.handlers,
                    a = e.handlers,
                    r = void 0 === a ? {} : a,
                    i = r.onOpen,
                    s = void 0 === i ? function() {} : i,
                    d = r.onClose,
                    l = void 0 === d ? function() {} : d,
                    c = r.onSuccess,
                    m = void 0 === c ? function(e) {} : c,
                    u = r.onFailure;
                return (!o || "object" == typeof o) && (!o || o && "function" == typeof s) && (!o || o && "function" == typeof l) && (!o || o && "function" == typeof m) && (!o || o && "function" == typeof(void 0 === u ? function(e) {} : u)) || (t = !1), t ? e : (console && console.error("Invalid Options", e), n.defaultModalOptions)
            } catch (e) {}
        }
    }, {
        "../modal": 6,
        "./EventUtils": 1,
        "./clientHandlers": 2,
        "./utils": 4
    }],
    4: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.isIOSDevice = /iPhone|iPad|iPod/i.test(window.navigator.userAgent), n.getIframeContainer = function() {
            return document.getElementById("imojo-rc-iframe")
        }, n.closest = function(e, t) {
            var n, o, a = e;
            for (["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"].some(function(e) {
                    return "function" == typeof document.body[e] && (n = e, !0)
                }); a;) {
                if ((o = a.parentElement) && o[n](t)) return o;
                a = o
            }
            return null
        }, n.remove = function(e) {
            return e.parentNode.removeChild(e)
        }, n.hasClass = function(e, t) {
            return e.classList ? e.classList.contains(t) : !!e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"))
        }, n.addClass = function(e, t) {
            e.classList ? e.classList.add(t) : n.hasClass(e, t) || (e.className += " " + t)
        }, n.removeClass = function(e, t) {
            if (e.classList) e.classList.remove(t);
            else if (n.hasClass(e, t)) {
                var o = new RegExp("(\\s|^)" + t + "(\\s|$)");
                e.className = e.className.replace(o, " ")
            }
        }
    }, {}],
    5: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var o = e("./common/modules"),
            a = e("./common/EventUtils");
        (function() {
            function e() {
                if (!document.getElementById("#im-embed-css")) {
                    var e = document.getElementsByTagName("head")[0],
                        t = document.createElement("style");
                    t.setAttribute("id", "im-embed-css"), t.innerHTML = '.btn_container{display:inline}.im-checkout-btn.btn--light{color:#fff;letter-spacing:1px;text-shadow:rgba(0,0,0,0.6) 0 1px 1px;padding:0.6em 0.7em;border:1px solid rgba(59,122,50,0.3);border-bottom:1px solid rgba(0,0,0,0.7);border-radius:4px;background:#75c26a;background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-o-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.25));box-shadow:inset 0 1px rgba(255,255,255,0.4),inset 0 0 0 1px rgba(255,255,255,0.15),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 3px rgba(0,0,0,0.2);line-height:1.2em;margin:0.3em 0}.im-checkout-btn.btn--light:focus,.im-checkout-btn.btn--light:hover{color:adjust-lightness(#fff, 5%);background:adjust-lightness(#75c26a, 5%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.15), rgba(0,0,0,0.35));box-shadow:inset 0 1px 0px rgba(255,255,255,0.45),inset 0 0 0 1px rgba(255,255,255,0.2),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 2px 1px rgba(0,0,0,0.25)}.im-checkout-btn.btn--light:active,.im-checkout-btn.btn--light.active{text-shadow:none;color:#eeeeee;background:adjust-lightness(#75c26a, -4%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-o-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));box-shadow:inset 0 1px 4px rgba(0,0,0,0.3),0 2px 2px rgba(255,255,255,0.3)}.im-checkout-btn.btn--light:hover,.im-checkout-btn.btn--light:focus,.im-checkout-btn.btn--light.active{text-decoration:none}.im-checkout-btn.btn--dark{color:#302b2f;letter-spacing:1px;text-shadow:rgba(0,0,0,0.6) 0 1px 1px;padding:0.6em 0.7em;border:1px solid rgba(186,160,19,0.3);border-bottom:1px solid rgba(0,0,0,0.7);border-radius:4px;background:#efd85d;background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-o-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.25));box-shadow:inset 0 1px rgba(255,255,255,0.4),inset 0 0 0 1px rgba(255,255,255,0.15),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 3px rgba(0,0,0,0.2);line-height:1.2em;margin:0.3em 0;letter-spacing:0px;font-weight:bold;text-shadow:rgba(255,255,255,0.4) 0 1px}.im-checkout-btn.btn--dark:focus,.im-checkout-btn.btn--dark:hover{color:adjust-lightness(#302b2f, 5%);background:adjust-lightness(#efd85d, 5%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.15), rgba(0,0,0,0.35));box-shadow:inset 0 1px 0px rgba(255,255,255,0.45),inset 0 0 0 1px rgba(255,255,255,0.2),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 2px 1px rgba(0,0,0,0.25)}.im-checkout-btn.btn--dark:active,.im-checkout-btn.btn--dark.active{text-shadow:none;color:#eeeeee;background:adjust-lightness(#efd85d, -4%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-o-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));box-shadow:inset 0 1px 4px rgba(0,0,0,0.3),0 2px 2px rgba(255,255,255,0.3)}.im-checkout-btn.btn--flat{background:#75c26a;box-shadow:none;border:1px solid adjust-lightness(#75c26a, -10%);text-shadow:none;border-radius:1.5em;padding:0.6em 1em;color:#fff}.im-checkout-btn.btn--flat:focus,.im-checkout-btn.btn--flat:hover{background:#fff;color:#75c26a;text-shadow:none;box-shadow:none}.im-checkout-btn.btn--flat-dark{background:#fff;box-shadow:none;border:1px solid adjust-lightness(#fff, -10%);text-shadow:none;border-radius:1.5em;padding:0.6em 1em;color:#75c26a}.im-checkout-btn.btn--flat-dark:focus,.im-checkout-btn.btn--flat-dark:hover{background:#75c26a;color:#fff;text-shadow:none;box-shadow:none}.im-modal{overflow-y:auto}.im-modal iframe{height:100%;width:100%}@-webkit-keyframes pace-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes pace-spinner{0%{-moz-transform:rotate(0deg);transform:rotate(0deg)}100%{-moz-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes pace-spinner{0%{-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-o-transform:rotate(360deg);transform:rotate(360deg)}}@-ms-keyframes pace-spinner{0%{-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes pace-spinner{0%{transform:rotate(0deg);transform:rotate(0deg)}100%{transform:rotate(360deg);transform:rotate(360deg)}}.iframe-container{height:100%}.iframe-container .iframe-loader-wrapper{display:none}.iframe-container .iframe{transition:all 0.2s;visibility:visible;opacity:1;height:100%;position:relative;background:none;display:block;border:0px none transparent;margin:0px;padding:0px}.iframe-container.loader .iframe-loader-wrapper{display:block;position:relative;height:100%}.iframe-container.loader .iframe-loader-wrapper .iframe-loader{display:block;position:fixed;top:50%;left:50%;margin-left:-20px;margin-top:-20px;width:40px;height:40px;border:solid 2px transparent;border-top-color:#46DF89;border-left-color:#46DF89;border-radius:40px;-webkit-animation:pace-spinner 800ms linear infinite;-moz-animation:pace-spinner 800ms linear infinite;-ms-animation:pace-spinner 800ms linear infinite;-o-animation:pace-spinner 800ms linear infinite;animation:pace-spinner 800ms linear infinite}.iframe-container.loader .iframe{visibility:hidden;opacity:0}.im-background-overlay{min-height:100%;transition:0.3s ease-out;position:fixed;top:0px;left:0px;width:100%;height:100%;background:rgba(0,0,0,0.85098)}iframe{border:none !important}', e.appendChild(t)
                }
            }

            function t(t, n) {
                var i = Math.floor(100 * Math.random() + 1),
                    s = '<div class="im-checkout btn-' + i + '"><a href="' + n.link + '" class="im-checkout-btn"';
                "false" === n.tab ? s += ">" : s += ' target="_blank">', "" !== n.verb ? s += n.verb.replace(/[\u00A0-\u9999<>\&]/gim, function(e) {
                    return "&#" + e.charCodeAt(0) + ";"
                }) : s += "Checkout with Instamojo", s += "</a></div>", t.outerHTML = s;
                var d, l = document.querySelector(".im-checkout.btn-" + i).querySelector('a[href="' + n.link + '"].im-checkout-btn');
                return "link" !== n.behavior && (l.setAttribute("rel", "modal"), (d = l)[a.eventMethod](a.clickEvent, function(t) {
                    t.preventDefault(), o.loadPaymentModal(d.getAttribute("href"), e, r)
                })), "light" === n.style ? l.className += " btn--light" : "dark" === n.style ? l.className += " btn--dark" : "flat" === n.style ? l.className += " btn--flat" : "flat-dark" === n.style && (l.className += " btn--flat-dark"), l
            }

            function n() {
                var n = function() {
                    Array.prototype.slice.call(document.querySelectorAll('a[rel="im-checkout"]')).forEach(function(n) {
                        var o;
                        t(n, {
                            behavior: (o = n).getAttribute("data-behavior") || o.getAttribute("data-behaviour"),
                            link: o.href,
                            style: o.getAttribute("data-style"),
                            tab: o.getAttribute("data-newtab"),
                            verb: o.getAttribute("data-text")
                        }), e()
                    })
                };
                "complete" === document.readyState || "loaded" === document.readyState ? n() : document.addEventListener("DOMContentLoaded", function() {
                    n()
                })
            }
            var r = o.defaultModalOptions;
            window.Instamojo = window.Instamojo || {}, window.Instamojo.open = function(t) {
                return o.loadPaymentModal(t, e, r)
            }, window.Instamojo.close = function() {
                return o.closePaymentModal(r)
            }, window.Instamojo.render = n, window.Instamojo.configure = function(e) {
                r = o.configureOptions(e)
            }, n()
        }).call(this)
    }, {
        "./common/EventUtils": 1,
        "./common/modules": 3
    }],
    6: [function(e, t, n) {
        "use strict";
        var o = this && this.__assign || Object.assign || function(e) {
            for (var t, n = 1, o = arguments.length; n < o; n++) {
                t = arguments[n];
                for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a])
            }
            return e
        };
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var a = e("./utils"),
            r = e("../common/EventUtils");
        n.loadModal = function(e) {
            void 0 === e && (e = a.defaultOptions);
            var t = o({}, a.defaultOptions, e);
            i(t), s(t), d(t)
        };
        var i = function(e) {
                var t = e.modalContainerClass,
                    n = e.modalClass,
                    o = e.modalContentClass;
                if (!document.querySelector("." + t)) {
                    var a = document.querySelector("body"),
                        r = document.documentElement,
                        i = a || r,
                        s = document.createElement("div");
                    s.setAttribute("class", t), s.style.display = "none", s.innerHTML = '<div class="' + n + '"><div class="' + o + '"></div></div>', i.appendChild(s)
                }
            },
            s = function(e) {
                window[r.eventMethod](r.keydownEvent, function(e) {
                    if (27 === e.keyCode) return n.closeModal()
                }), window[r.eventMethod](r.messageEvent, function(e) {
                    if ("onRequestClose" === e[e.message ? "message" : "data"]) return n.closeModal()
                }, !1)
            },
            d = function(e) {
                var t = e.content,
                    n = e.modalClass,
                    o = e.modalContainerClass,
                    r = e.modalContainerStyle,
                    i = e.modalContentClass,
                    s = e.modalContentStyle,
                    d = e.modalStyle,
                    l = document.querySelector("." + o),
                    c = l.querySelector("." + n),
                    m = l.querySelector("." + i);
                a.applyStyles(l, r), a.applyStyles(c, d), a.applyStyles(m, s), m.innerHTML = t
            };
        n.closeModal = function() {
            var e = a.defaultOptions.modalContainerClass,
                t = a.defaultOptions.modalContentClass,
                n = document.querySelector("." + e);
            n.style.display = "none", n.querySelector("." + t).innerHTML = ""
        }
    }, {
        "../common/EventUtils": 1,
        "./utils": 7
    }],
    7: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.defaultOptions = {
            content: "",
            modalClass: "im-modal",
            modalContainerClass: "im-modal-container",
            modalContentClass: "im-modal-content",
            modalContainer: !1,
            modalStyle: {
                position: "relative",
                top: "0",
                left: "0",
                width: "100%",
                "max-width": "100%",
                height: "100%",
                transform: "none!important",
                margin: "0 auto",
                background: "transparent",
                "box-shadow": "none",
                "overflow-y": "visible"
            },
            modalContainerStyle: {
                position: "fixed",
                top: "0px",
                display: "block",
                left: "0px",
                height: "100%",
                width: "100%",
                background: "transparent",
                "backface-visibility": "hidden",
                "-webkit-overflow-scrolling": "touch",
                "overflow-y": "visible",
                "z-index": "10000001"
            },
            modalContentStyle: {
                width: "100%",
                height: "100%"
            }
        }, n.applyStyles = function(e, t) {
            e.style.cssText = o(t)
        };
        var o = function(e) {
            return Object.keys(e).reduce(function(t, n, o) {
                return "" + t + n + ":" + e[n] + ";"
            }, "")
        }
    }, {}]
}, {}, [5]);
