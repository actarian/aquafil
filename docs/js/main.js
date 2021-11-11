/**
 * @license aquafil v1.0.0
 * (c) 2021 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(require('rxcomp'),require('rxcomp-form'),require('rxjs/operators'),require('rxjs')):typeof define==='function'&&define.amd?define(['rxcomp','rxcomp-form','rxjs/operators','rxjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.rxcomp,g.rxcomp.form,g.rxjs.operators,g.rxjs));}(this,(function(rxcomp, rxcompForm, operators, rxjs){'use strict';function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}var ScrollService = /*#__PURE__*/function () {
  function ScrollService() {}

  ScrollService.scroll = function scroll(_scroll) {
    // console.log('ScrollService.scroll', scroll);
    this.scroll$.next(_scroll);
  };

  ScrollService.init$ = function init$(node) {
    var previousY = window.pageYOffset;
    var event = {
      direction: null,
      scroll: {
        x: 0,
        y: 0
      },
      speed: 0
    };
    return rxjs.fromEvent(window, 'DOMContentLoaded').pipe( // tap(_ => console.log('ScrollService.DOMContentLoaded')),
    operators.first(), operators.delay(1), operators.switchMap(function (_) {
      return rxjs.fromEvent(window, 'scroll');
    }), operators.startWith(true), // tap(_ => console.log('ScrollService.scroll')),
    operators.map(function (_) {
      /*
      const body = document.querySelector('body');
      let previousY = body.scrollTop;
      body.addEventListener('scroll', () => {
      	const y = body.scrollTop;
      	const direction = y >= previousY ? 'down' : 'up';
      	if (Math.abs(y - previousY) > 90) {
      		// console.log('scroll', y, direction);
      		previousY = y;
      		event.direction = direction;
      		event.scroll.y = y;
      		ScrollService.scroll(event);
      	}
      }, true);
      */
      var y = window.pageYOffset;
      var direction = y >= previousY ? 'down' : 'up'; // console.log(Math.abs(y - previousY) > 90);
      // if (Math.abs(y - previousY) > 90) {

      previousY = y;
      event.direction = direction;
      event.scroll.y = y;
      ScrollService.scroll(event); // }

      return event;
    }));
  };

  ScrollService.scrollTo = function scrollTo(target, options) {
    if (options === void 0) {
      options = {
        offset: -130
      };
    }

    var body = document.querySelector('body');
    var currentTop = body.scrollTop; // window.pageYOffset; // body.scrollTop;

    var targetTop = currentTop + target.getBoundingClientRect().top + options.offset;
    var distance = targetTop - currentTop;
    var o = {
      pow: 0
    };
    gsap.set(body, {
      'scroll-behavior': 'auto'
    });

    if (options.disableLerp) {
      gsap.set(body, {
        'scrollTop': currentTop + distance
      });
      gsap.set(body, {
        'scroll-behavior': 'smooth'
      });
    } else {
      gsap.to(o, {
        duration: Math.abs(distance) / 2000,
        pow: 1,
        ease: Quad.easeOut,
        overwrite: 'all',
        onUpdate: function onUpdate() {
          gsap.set(body, {
            'scrollTop': currentTop + distance * o.pow
          }); // window.scrollTo(0, currentTop + distance * o.pow);
        },
        onComplete: function onComplete() {
          gsap.set(body, {
            'scroll-behavior': 'smooth'
          });
        }
      });
    } // target.scrollIntoView();

  };

  ScrollService.scrollToSelector = function scrollToSelector(selector, options) {
    var target = document.querySelector(selector);

    if (target) {
      ScrollService.scrollTo(target, options);
    }
  };

  return ScrollService;
}();

_defineProperty(ScrollService, "scroll$", new rxjs.ReplaySubject(1));var AppComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.remove('hidden');
    console.log('AppComponent.onInit');
    ScrollService.init$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var AltDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(AltDirective, _Directive);

  function AltDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = AltDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('alt', this.alt);
  };

  return AltDirective;
}(rxcomp.Directive);
AltDirective.meta = {
  selector: '[[alt]]',
  inputs: ['alt']
};var IntersectionService = /*#__PURE__*/function () {
  function IntersectionService() {}

  IntersectionService.observer = function observer() {
    var _this = this;

    if (!this.observer_) {
      this.readySubject_ = new rxjs.BehaviorSubject(false);
      this.observerSubject_ = new rxjs.Subject();
      this.observer_ = new IntersectionObserver(function (entries) {
        // console.log('IntersectionService.observer', entries);
        _this.observerSubject_.next(entries);
      }, {
        // root: document.querySelector('body'),
        root: null,
        // sets the framing element to the viewport
        rootMargin: '100px 0px 100px 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      });
    }

    return this.observer_;
  };

  IntersectionService.intersection$ = function intersection$(node) {
    if ('IntersectionObserver' in window) {
      var observer = this.observer();
      observer.observe(node);
      return this.observerSubject_.pipe( // tap(entries => console.log(entries.length)),
      operators.map(function (entries) {
        return entries.find(function (entry) {
          return entry.target === node;
        });
      }), // tap(entry => console.log('IntersectionService.intersection$', entry)),
      operators.filter(function (entry) {
        return entry !== undefined;
      }), // filter(entry => entry !== undefined && entry.isIntersecting && entry.intersectionRatio > 0), // entry.intersectionRatio > 0
      // first(),
      operators.finalize(function () {
        return observer.unobserve(node);
      }));
    } else {
      return rxjs.of({
        target: node
      });
    }
    /*
    function observer() {
    	if ('IntersectionObserver' in window) {
    		return new IntersectionObserver(entries => {
    			entries.forEach(function(entry) {
    				if (entry.isIntersecting) {
    					entry.target.classList.add('appear');
    				}
    			})
    		});
    	} else {
    		return { observe: function(node) { node.classList.add('appear')}, unobserve: function() {} };
    	}
    }
    observer.observe(node);
    observer.unobserve(node);
    */

  };

  return IntersectionService;
}();var AppearDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(AppearDirective, _Directive);

  function AppearDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = AppearDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('appear');
    IntersectionService.intersection$(node).pipe( // first(),
    operators.takeUntil(this.unsubscribe$)).subscribe(function (entry) {
      entry.intersectionRatio > 0.5 ? node.classList.add('appeared') : node.classList.remove('appeared');
    });
  };

  return AppearDirective;
}(rxcomp.Directive);
AppearDirective.meta = {
  selector: '[appear]'
};var ClickOutsideDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ClickOutsideDirective, _Directive);

  function ClickOutsideDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ClickOutsideDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.initialFocus = false;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node,
        parentInstance = _getContext.parentInstance,
        selector = _getContext.selector;

    var event$ = this.event$ = rxjs.fromEvent(document, 'click').pipe(operators.filter(function (event) {
      var target = event.target; // console.log('ClickOutsideDirective.onClick', this.element.nativeElement, target, this.element.nativeElement.contains(target));
      // const documentContained: boolean = Boolean(document.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINED_BY);
      // console.log(target, documentContained);

      var clickedInside = node.contains(target) || !document.contains(target);

      if (!clickedInside) {
        if (_this.initialFocus) {
          _this.initialFocus = false;
          return true;
        }
      } else {
        _this.initialFocus = true;
      }
    }), operators.shareReplay(1));
    var expression = node.getAttribute("(clickOutside)");

    if (expression) {
      var outputFunction = module.makeFunction(expression, ['$event']);
      event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        module.resolve(outputFunction, parentInstance, event);
      });
    } else {
      parentInstance.clickOutside$ = event$;
    }
  };

  return ClickOutsideDirective;
}(rxcomp.Directive);
ClickOutsideDirective.meta = {
  selector: "[(clickOutside)]"
};var Utils = /*#__PURE__*/function () {
  function Utils() {}

  Utils.merge = function merge(target, source) {
    var _this = this;

    if (typeof source === 'object') {
      Object.keys(source).forEach(function (key) {
        var value = source[key];

        if (typeof value === 'object' && !Array.isArray(value)) {
          target[key] = _this.merge(target[key], value);
        } else {
          target[key] = value;
        }
      });
    }

    return target;
  };

  return Utils;
}();var environmentServed = {
  flags: {
    production: true,
    cart: true
  },
  markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
  defaultMarket: 'IT',
  currentMarket: 'IT',
  languages: ['it', 'en', 'de', 'ch'],
  defaultLanguage: 'it',
  currentLanguage: 'it',
  api: '/api',
  assets: '/Client/docs/',
  slug: {
    configureProduct: "/it/it/products-configure",
    cart: "/it/it/cart",
    reservedArea: "/it/it/reserved-area"
  },
  template: {
    modal: {
      genericModal: '/template/modals/generic-modal.cshtml',
      sideModal: '/template/modals/side-modal.cshtml',
      contactModal: '/template/modals/contact-modal.cshtml',
      galleryModal: '/template/modals/gallery-modal.cshtml',
      userModal: '/template/modals/user-modal.cshtml'
    }
  },
  facebook: {
    appId: 610048027052371,
    fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
    scope: 'public_profile, email',
    // publish_stream
    tokenClient: '951b013fe59b05cf471d869aae9ba6ba',
    version: 'v11.0'
  },
  google: {
    clientId: '760742757246-61qknlmthbmr54bh7ch19kjr0sftm4q3.apps.googleusercontent.com'
  },
  linkedIn: {
    clientId: '77cg5ls5lgu3k3',
    clientSecret: 'gfBIl365EdckxCgK',
    scope: 'r_emailaddress r_liteprofile'
  },
  googleMaps: {
    apiKey: 'AIzaSyByTXqwtyFUcD6d4PY7ab4GBwS5IYjEVcc'
  },
  thron: {
    clientId: ''
  },
  workers: {
    image: '/Client/docs/js/workers/image.service.worker.js',
    prefetch: '/Client/docs/js/workers/prefetch.service.worker.js'
  },
  githubDocs: 'https://raw.githubusercontent.com/actarian/aquafil/main/docs/'
};var environmentStatic = {
  flags: {
    production: false,
    cart: true
  },
  markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
  defaultMarket: 'IT',
  currentMarket: 'IT',
  languages: ['it', 'en', 'de', 'ch'],
  defaultLanguage: 'it',
  currentLanguage: 'it',
  api: '/aquafil/api',
  assets: '/aquafil/',
  slug: {
    configureProduct: "/aquafil/products-configure.html",
    cart: "/aquafil/cart.html",
    reservedArea: "/aquafil/reserved-area.html"
  },
  template: {
    modal: {
      genericModal: '/aquafil/partials/modals/generic-modal.html',
      sideModal: '/aquafil/partials/modals/side-modal.html',
      contactModal: '/aquafil/partials/modals/contact-modal.html',
      galleryModal: '/aquafil/partials/modals/gallery-modal.html',
      userModal: '/aquafil/partials/modals/user-modal.html'
    }
  },
  facebook: {
    appId: 610048027052371,
    fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
    scope: 'public_profile, email',
    // publish_stream
    tokenClient: '951b013fe59b05cf471d869aae9ba6ba',
    version: 'v11.0'
  },
  google: {
    clientId: '760742757246-61qknlmthbmr54bh7ch19kjr0sftm4q3.apps.googleusercontent.com'
  },
  linkedIn: {
    clientId: '77cg5ls5lgu3k3',
    clientSecret: 'gfBIl365EdckxCgK',
    scope: 'r_emailaddress r_liteprofile'
  },
  googleMaps: {
    apiKey: 'AIzaSyDvGw6iAoKdRv8mmaC9GeT-LWLPQtA8p60'
  },
  thron: {
    clientId: ''
  },
  workers: {
    image: './js/workers/image.service.worker.js',
    prefetch: './js/workers/prefetch.service.worker.js'
  },
  githubDocs: 'https://raw.githubusercontent.com/actarian/aquafil/main/docs/'
};var NODE = typeof module !== 'undefined' && module.exports;
var PARAMS = NODE ? {
  get: function get() {}
} : new URLSearchParams(window.location.search);
var DEBUG =  PARAMS.get('debug') != null;
var BASE_HREF = NODE ? null : document.querySelector('base').getAttribute('href');
var HEROKU = NODE ? false : window && window.location.host.indexOf('herokuapp') !== -1;
var STATIC = NODE ? false : HEROKU || window && (window.location.port === '48481' || window.location.port === '5000' || window.location.port === '6443' || window.location.host === 'actarian.github.io');
var DEVELOPMENT = NODE ? false : window && ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
var PRODUCTION = !DEVELOPMENT;
var ENV = {
  STATIC: STATIC,
  DEVELOPMENT: DEVELOPMENT,
  PRODUCTION: PRODUCTION
};
var Environment = /*#__PURE__*/function () {
  var _proto = Environment.prototype;

  _proto.getAbsoluteUrl = function getAbsoluteUrl(path, params) {
    var url = "" + window.location.origin + path; // let url = `${window.location.protocol}//${window.location.host}${path}`;

    Object.keys(params).forEach(function (key) {
      url = url.replace("$" + key, params[key]);
    });
    return url;
  };

  _proto.getPath = function getPath(path) {
    return this.isLocal(path) ? this.href + path : path;
  };

  _proto.isLocal = function isLocal(path) {
    return path.indexOf('://') === -1;
  };

  function Environment(options) {
    if (options) {
      Object.assign(this, options);
    }
  }

  _createClass(Environment, [{
    key: "STATIC",
    get: function get() {
      return ENV.STATIC;
    },
    set: function set(STATIC) {
      ENV.STATIC = STATIC === true || STATIC === 'true';
      console.log('Environment.STATIC.set', ENV.STATIC);
    }
  }, {
    key: "href",
    get: function get() {
      if (HEROKU) {
        return this.githubDocs;
      } else {
        return BASE_HREF;
      }
    }
  }]);

  return Environment;
}();
var defaultOptions = {
  port: 5000,
  flags: {
    production: false,
    heroku: HEROKU
  },
  slug: {},
  markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
  defaultMarket: 'IT',
  currentMarket: 'IT',
  languages: ['it', 'en'],
  defaultLanguage: 'it',
  currentLanguage: 'it',
  labels: {
    select: 'Seleziona',
    browse: 'Sfoglia',
    cancel: 'Annulla',
    error_email: 'Email non valida',
    error_match: 'I campi non corrispondono',
    error_required: 'Campo obbligatorio',
    loading: 'caricamento',
    remove: 'Rimuovi',
    required: 'Richiesto',
    select_file: 'Seleziona una file...',
    update: 'Aggiorna',
    upload: 'Carica',
    drag_and_drop_images: 'Drag And Drop your images here'
  }
};
var environmentOptions = window.STATIC ? environmentStatic : environmentServed;
var options = Object.assign(defaultOptions, environmentOptions);
options = Utils.merge(options, window.environment);
var environment = new Environment(options); // console.log('environment', environment);
var DatePipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(DatePipe, _Pipe);

  function DatePipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  DatePipe.transform = function transform(value, options, language) {
    if (options === void 0) {
      options = {};
    }

    if (language === void 0) {
      language = null;
    }

    // = 'en-IN'
    if (value != null) {
      // !!! keep losing
      language = language || environment.currentLanguage;
      return new Intl.DateTimeFormat(language, options).format(value instanceof Date ? value : new Date(value));
    }
  }
  /*
  static transform(value, locale = 'it-IT-u-ca-gregory', options = {
  	dateStyle: 'short',
  	timeStyle: 'short',
  }) {
  	const localeDateString = new Date(value).toLocaleDateString(locale, options);
  	return localeDateString;
  }
  */
  ;

  return DatePipe;
}(rxcomp.Pipe);
DatePipe.meta = {
  name: 'date'
};var DownloadDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DownloadDirective, _Directive);

  function DownloadDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DownloadDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('download', this.download);
  };

  return DownloadDirective;
}(rxcomp.Directive);
DownloadDirective.meta = {
  selector: '[[download]]',
  inputs: ['download']
};var LocomotiveScrollService = /*#__PURE__*/function () {
  function LocomotiveScrollService() {}

  LocomotiveScrollService.scroll = function scroll(_scroll) {
    // console.log('LocomotiveScrollService.scroll', scroll);
    this.scroll$.next(_scroll);
  };

  LocomotiveScrollService.init = function init(node, options) {
    options = Object.assign({
      useKeyboard: true,
      smoothMobile: true,
      inertia: 0.5,
      // name:'scroll',
      // offset: [0,0], // bottom top
      // repeat: false,
      smooth: true,
      // initPosition: { x: 0, y: 0 }
      // direction: 'vertical',
      lerp: 0.01,
      getDirection: true,
      // add direction to scroll event
      getSpeed: true,
      // add speed to scroll event
      // class: 'is-inview',
      initClass: 'has-scroll-init',
      scrollingClass: 'has-scroll-scrolling',
      draggingClass: 'has-scroll-dragging',
      smoothClass: 'has-scroll-smooth',
      scrollbarContainer: false,
      scrollbarClass: 'c-scrollbar',
      multiplier: 1,
      firefoxMultiplier: 50,
      touchMultiplier: 2,
      scrollFromAnywhere: true,
      gestureDirection: 'vertical',
      reloadOnContextChange: false,
      resetNativeScroll: true
    }, options, {
      el: node
    });

    if (this.useLocomotiveScroll()) {
      var instance = new LocomotiveScroll(options);
      LocomotiveScrollService.instance = instance;
      return instance;
    } else {
      document.querySelector('html').classList.add('has-scroll-init');
    }
  };

  LocomotiveScrollService.useLocomotiveScroll = function useLocomotiveScroll() {
    return window.innerWidth >= 768 && !this.isTouchDevice();
  };

  LocomotiveScrollService.isTouchDevice = function isTouchDevice() {
    var userAgent = navigator.userAgent.toLowerCase();
    var isTablet = /(mac|ipad|tablet|(android(?!.*mobile))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    var isSmartphone = /(ipod|iphone|(android(?!.*mobile))|(windows(?!.*phone)(.*touch)))/.test(userAgent);
    return isTablet || isSmartphone;
  };

  LocomotiveScrollService.isMacLike = function isMacLike() {
    var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    return isMacLike;
  };

  LocomotiveScrollService.isIOS = function isIOS() {
    var isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
    return isIOS;
  };

  LocomotiveScrollService.isMacOs = function isMacOs() {
    var isMacOs = navigator.platform.toLowerCase().indexOf('mac') >= 0;
    return isMacOs;
  };

  LocomotiveScrollService.isSafari = function isSafari() {
    var isSafari = navigator.vendor.match(/apple/i) && !navigator.userAgent.match(/crios/i) && !navigator.userAgent.match(/fxios/i);
    return isSafari;
  };

  LocomotiveScrollService.init$ = function init$(node) {
    return rxjs.fromEvent(window, 'DOMContentLoaded').pipe(operators.delay(1), operators.switchMap(function (_) {
      // setTimeout(() => {
      var instance = LocomotiveScrollService.init(node);

      if (instance) {
        var showefy = document.querySelector('#showefy');
        instance.on('scroll', function (instance) {
          LocomotiveScrollService.scroll(instance);

          if (showefy) {
            var isShowefyDisabled = instance.speed > 0.1;

            if (isShowefyDisabled) {
              if (showefy.style.pointerEvents !== 'none') {
                showefy.style.pointerEvents = 'none';
              }
            } else {
              if (showefy.style.pointerEvents === 'none') {
                showefy.style.pointerEvents = 'auto';
              }
            }
          }
        });
      } else {
        var event = {
          direction: null,
          scroll: {
            x: 0,
            y: 0
          },
          speed: 0
        };
        var body = document.querySelector('body');
        var previousY = body.scrollTop; // window.pageYOffset; // body.scrollTop;

        body.addEventListener('scroll', function () {
          var y = body.scrollTop; // window.pageYOffset; // body.scrollTop;

          var direction = y >= previousY ? 'down' : 'up';

          if (Math.abs(y - previousY) > 90) {
            // console.log('scroll', y, direction);
            previousY = y;
            event.direction = direction;
            event.scroll.y = y;
            LocomotiveScrollService.scroll(event);
          }
        }, true);
      }

      return LocomotiveScrollService.scroll$; // }, 1);
    }));
  };

  LocomotiveScrollService.update = function update() {
    if (this.instance) {
      this.instance.update();
    }
  };

  LocomotiveScrollService.stop = function stop() {
    if (this.instance) {
      this.instance.stop();
    }
  };

  LocomotiveScrollService.start = function start() {
    if (this.instance) {
      this.instance.start();
    }
  };

  LocomotiveScrollService.scrollTo = function scrollTo(target, options) {
    if (options === void 0) {
      options = {
        offset: -130
      };
    }

    if (this.instance) {
      this.instance.scrollTo(target, options);
    } else {
      var body = document.querySelector('body');
      var currentTop = body.scrollTop; // window.pageYOffset; // body.scrollTop;

      var targetTop = currentTop + target.getBoundingClientRect().top + options.offset;
      var distance = targetTop - currentTop;
      var o = {
        pow: 0
      };
      gsap.set(body, {
        'scroll-behavior': 'auto'
      });

      if (options.disableLerp) {
        gsap.set(body, {
          'scrollTop': currentTop + distance
        });
        gsap.set(body, {
          'scroll-behavior': 'smooth'
        });
      } else {
        gsap.to(o, {
          duration: Math.abs(distance) / 2000,
          pow: 1,
          ease: Quad.easeOut,
          overwrite: 'all',
          onUpdate: function onUpdate() {
            gsap.set(body, {
              'scrollTop': currentTop + distance * o.pow
            }); // window.scrollTo(0, currentTop + distance * o.pow);
          },
          onComplete: function onComplete() {
            gsap.set(body, {
              'scroll-behavior': 'smooth'
            });
          }
        });
      } // target.scrollIntoView();

    }
  };

  LocomotiveScrollService.scrollToSelector = function scrollToSelector(selector, options) {
    var target = document.querySelector(selector);

    if (target) {
      LocomotiveScrollService.scrollTo(target, options);
    }
  };

  return LocomotiveScrollService;
}();

_defineProperty(LocomotiveScrollService, "scroll$", new rxjs.ReplaySubject(1));var DROPDOWN_ID = 1000000;
var DropdownDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DropdownDirective, _Directive);

  function DropdownDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DropdownDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var trigger = node.getAttribute('dropdown-trigger');
    this.trigger = trigger ? node.querySelector(trigger) : node;
    this.opened = null;
    this.onClick = this.onClick.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.addListeners();
    DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
      // console.log('DropdownDirective', id, this['dropdown-item']);
      if (_this.id === id) {
        node.classList.add('dropped');
      } else {
        node.classList.remove('dropped');
      }
    });
  };

  _proto.onClick = function onClick(event) {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    if (this.opened === null) {
      this.openDropdown();
    } else {
      var dropdownItemNode = node.querySelector('[dropdown-item]'); // console.log('dropdownItemNode', dropdownItemNode);

      if (!dropdownItemNode) {
        // if (this.trigger !== node) {
        this.closeDropdown();
      }
    }
  };

  _proto.onDocumentClick = function onDocumentClick(event) {
    var _getContext3 = rxcomp.getContext(this),
        node = _getContext3.node;

    var clickedInside = node === event.target || node.contains(event.target);

    if (!clickedInside) {
      this.closeDropdown();
    }
  };

  _proto.openDropdown = function openDropdown() {
    if (this.opened === null) {
      this.opened = true;
      this.addDocumentListeners();
      DropdownDirective.dropdown$.next(this.id);
      this.dropped.next(this.id);
    }
  };

  _proto.closeDropdown = function closeDropdown() {
    if (this.opened !== null) {
      this.removeDocumentListeners();
      this.opened = null;

      if (DropdownDirective.dropdown$.getValue() === this.id) {
        DropdownDirective.dropdown$.next(null);
        this.dropped.next(null);
      }
    }
  };

  _proto.addListeners = function addListeners() {
    this.trigger.addEventListener('click', this.onClick);
  };

  _proto.addDocumentListeners = function addDocumentListeners() {
    document.addEventListener('click', this.onDocumentClick);
  };

  _proto.removeListeners = function removeListeners() {
    this.trigger.removeEventListener('click', this.onClick);
  };

  _proto.removeDocumentListeners = function removeDocumentListeners() {
    document.removeEventListener('click', this.onDocumentClick);
  };

  _proto.onDestroy = function onDestroy() {
    this.removeListeners();
    this.removeDocumentListeners();
  };

  DropdownDirective.nextId = function nextId() {
    return DROPDOWN_ID++;
  };

  _createClass(DropdownDirective, [{
    key: "id",
    get: function get() {
      return this.dropdown || this.id_ || (this.id_ = DropdownDirective.nextId());
    }
  }]);

  return DropdownDirective;
}(rxcomp.Directive);
DropdownDirective.meta = {
  selector: '[dropdown]',
  inputs: ['dropdown', 'dropdown-trigger'],
  outputs: ['dropped']
};
DropdownDirective.dropdown$ = new rxjs.BehaviorSubject(null);var DropdownItemDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(DropdownItemDirective, _Directive);

  function DropdownItemDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = DropdownItemDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('dropdown-item');
    DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
      // console.log('DropdownItemDirective', id, this['dropdown-item']);
      if (_this.id === id) {
        node.classList.add('dropped'); // LocomotiveScrollService.stop();
      } else {
        node.classList.remove('dropped'); // LocomotiveScrollService.start();
      }
    });
    this.enter$(node).pipe(operators.takeUntil(this.unsubscribe$)).subscribe();
    this.leave$(node).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(); // this.addListeners();
  };

  _proto.enter$ = function enter$(node) {
    // const { node } = getContext(this);
    return rxjs.fromEvent(node, 'mouseenter').pipe(operators.tap(function (event) {
      LocomotiveScrollService.stop();
    }));
  };

  _proto.leave$ = function leave$(node) {
    // const { node } = getContext(this);
    return rxjs.fromEvent(node, 'mouseleave').pipe(operators.tap(function (event) {
      LocomotiveScrollService.start();
    }));
  }
  /*
  onDestroy() {
  	this.removeListeners();
  }
  
  onEnter(event) {
  	LocomotiveScrollService.stop();
  }
  
  onLeave(event) {
  	LocomotiveScrollService.start();
  }
  
  addListeners() {
  	const { node } = getContext(this);
  	node.addEventListener('mouseenter', this.onEnter);
  	node.addEventListener('mouseleave', this.onLeave);
  }
  
  removeListeners() {
  	const { node } = getContext(this);
  	node.removeEventListener('mouseenter', this.onEnter);
  	node.removeEventListener('mouseleave', this.onLeave);
  }
  */
  ;

  _createClass(DropdownItemDirective, [{
    key: "id",
    get: function get() {
      return this['dropdown-item'];
    }
  }]);

  return DropdownItemDirective;
}(rxcomp.Directive);
DropdownItemDirective.meta = {
  selector: '[dropdown-item], [[dropdown-item]]',
  inputs: ['dropdown-item']
};var EllipsisDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(EllipsisDirective, _Directive);

  function EllipsisDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = EllipsisDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.originalText = node.innerText;
    this.resize$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  _proto.resize$ = function resize$() {
    var _this = this;

    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    return rxjs.fromEvent(window, 'resize').pipe(operators.startWith(function (_) {
      return null;
    }), operators.tap(function (_) {
      var text = _this.originalText;
      node.innerText = text;

      while (node.scrollHeight - node.offsetHeight > 0) {
        var words = text.split(' ');
        words.pop();
        text = words.join(' ') + "...";
        node.innerText = text; // console.log(node.scrollHeight, node.offsetHeight);
      }
    }));
  };

  return EllipsisDirective;
}(rxcomp.Directive);
EllipsisDirective.meta = {
  selector: '[ellipsis]'
};var EnvPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(EnvPipe, _Pipe);

  function EnvPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  EnvPipe.transform = function transform(keypath) {
    var env = environment;
    var keys = keypath.split('.');
    var k = keys.shift();

    while (keys.length > 0 && env[k]) {
      env = env[k];
      k = keys.shift();
    }

    var value = env[k] || null;
    return value;
  };

  return EnvPipe;
}(rxcomp.Pipe);
EnvPipe.meta = {
  name: 'env'
};var FilterItemComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(FilterItemComponent, _Component);

  function FilterItemComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = FilterItemComponent.prototype;

  _proto.onInit = function onInit() {};

  _proto.closeFilter = function closeFilter() {
    this.filter.active = false;
    this.change.next(); // this.pushChanges();
  };

  _proto.toggleFilter = function toggleFilter(filter) {
    var _this = this;

    Object.keys(this.filters).forEach(function (key) {
      var f = _this.filters[key];

      if (f === filter) {
        f.active = !f.active;
      } else {
        f.active = false;
      }
    });
    this.change.next(); // this.pushChanges();
  };

  _proto.clearFilter = function clearFilter(event, filter) {
    event.preventDefault();
    event.stopImmediatePropagation();
    filter.clear();
    this.change.next(); // this.pushChanges();
  };

  _proto.onEnter = function onEnter() {
    LocomotiveScrollService.stop();
  };

  _proto.onLeave = function onLeave() {
    LocomotiveScrollService.start();
  };

  return FilterItemComponent;
}(rxcomp.Component);
FilterItemComponent.meta = {
  selector: '[filter], [[filter]]',
  outputs: ['change'],
  inputs: ['filter', 'filters', 'name'],
  template:
  /* html */
  "\n\t\t<div class=\"group--filter\" (click)=\"toggleFilter(filter)\" (clickOutside)=\"closeFilter(filter)\">\n\t\t\t<span class=\"label\" [innerHTML]=\"filter.getLabel() || name\"></span>\n\t\t\t<svg class=\"caret-down\" *if=\"!filter.hasAny()\"><use xlink:href=\"#caret-down\"></use></svg>\n\t\t\t<svg class=\"close-sm\" *if=\"filter.hasAny()\" (click)=\"clearFilter($event, filter)\"><use xlink:href=\"#close-sm\"></use></svg>\n\t\t</div>\n\t\t<div class=\"options\" *if=\"filter.active\" (mouseenter)=\"onEnter()\" (mouseleave)=\"onLeave()\">\n\t\t\t<div class=\"category\" [innerHTML]=\"name\"></div>\n\t\t\t<ul class=\"nav--options\">\n\t\t\t\t<li class=\"nav--options__item\" [class]=\"{ active: filter.has(item), disabled: item.disabled, empty: !item.value }\" *for=\"let item of filter.options\">\n\t\t\t\t\t<span class=\"option\" (click)=\"filter.set(item)\">\n\t\t\t\t\t\t<span class=\"name\" [innerHTML]=\"item.label | label\"></span>\n\t\t\t\t\t\t<!-- <span class=\"count\" [innerHTML]=\"item.count || ''\"></span> -->\n\t\t\t\t\t</span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t"
};var FlagPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(FlagPipe, _Pipe);

  function FlagPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  FlagPipe.transform = function transform(key) {
    var flags = environment.flags;
    return flags[key] || false;
  };

  return FlagPipe;
}(rxcomp.Pipe);
FlagPipe.meta = {
  name: 'flag'
};var ModalEvent = function ModalEvent(data) {
  this.data = data;
}; // export class ModalLoadEvent extends ModalEvent { }
// export class ModalLoadedEvent extends ModalEvent { }

var ModalResolveEvent = /*#__PURE__*/function (_ModalEvent) {
  _inheritsLoose(ModalResolveEvent, _ModalEvent);

  function ModalResolveEvent() {
    return _ModalEvent.apply(this, arguments) || this;
  }

  return ModalResolveEvent;
}(ModalEvent);
var ModalRejectEvent = /*#__PURE__*/function (_ModalEvent2) {
  _inheritsLoose(ModalRejectEvent, _ModalEvent2);

  function ModalRejectEvent() {
    return _ModalEvent2.apply(this, arguments) || this;
  }

  return ModalRejectEvent;
}(ModalEvent);
var ModalService = /*#__PURE__*/function () {
  function ModalService() {}

  ModalService.open$ = function open$(modal) {
    var _this = this;

    this.busy$.next(true);
    return this.getTemplate$(modal.src).pipe( // startWith(new ModalLoadEvent(Object.assign({}, modal.data, { $src: modal.src }))),
    operators.map(function (template) {
      return {
        node: _this.getNode(template),
        data: modal.data,
        modal: modal
      };
    }), operators.tap(function (node) {
      _this.modal$.next(node);

      _this.hasModal = true;

      _this.busy$.next(false); // this.events$.next(new ModalLoadedEvent(Object.assign({}, modal.data, { $src: modal.src })));

    }), operators.switchMap(function (node) {
      return _this.events$;
    }), operators.tap(function (_) {
      return _this.hasModal = false;
    }));
  };

  ModalService.load$ = function load$(modal) {};

  ModalService.getTemplate$ = function getTemplate$(url) {
    return rxjs.from(fetch(url).then(function (response) {
      return response.text();
    }));
  };

  ModalService.getNode = function getNode(template) {
    var div = document.createElement('div');
    div.innerHTML = template;
    var node = div.firstElementChild;
    return node;
  };

  ModalService.reject = function reject(data) {
    this.modal$.next(null);
    this.events$.next(new ModalRejectEvent(data));
  };

  ModalService.resolve = function resolve(data) {
    this.modal$.next(null);
    this.events$.next(new ModalResolveEvent(data));
  };

  return ModalService;
}();

_defineProperty(ModalService, "hasModal", false);

ModalService.modal$ = new rxjs.Subject();
ModalService.events$ = new rxjs.Subject();
ModalService.busy$ = new rxjs.Subject();var ModalOutletComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ModalOutletComponent, _Component);

  function ModalOutletComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ModalOutletComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.busy_ = false;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var body = document.querySelector('body');
    this.modalNode = node.querySelector('.modal-outlet__modal');
    ModalService.modal$.pipe(operators.tap(function (modal) {
      modal ? body.classList.add('modal--active') : body.classList.remove('modal--active');
    }), operators.takeUntil(this.unsubscribe$)).subscribe(function (modal) {
      return _this.modal = modal;
    });
    ModalService.busy$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (busy) {
      return _this.busy = busy;
    });
  };

  _proto.onClose = function onClose(event) {
    console.log('ModalOutletComponent.onClose', event);
    ModalService.reject();
  };

  _createClass(ModalOutletComponent, [{
    key: "modal",
    get: function get() {
      return this.modal_;
    },
    set: function set(modal) {
      // console.log('ModalOutletComponent set modal', modal, this);
      var _getContext2 = rxcomp.getContext(this),
          module = _getContext2.module;

      if (this.modal_ && this.modal_.node) {
        module.remove(this.modal_.node, this);
        this.modalNode.removeChild(this.modal_.node);
      }

      if (modal && modal.node) {
        this.modal_ = modal;
        this.modalNode.appendChild(modal.node);
        var instances = module.compile(modal.node);
      }

      this.modal_ = modal;
      this.pushChanges();
    }
  }, {
    key: "busy",
    get: function get() {
      return this.busy_;
    },
    set: function set(busy) {
      // console.log('ModalOutletComponent set busy', busy, this);
      if (this.busy_ !== busy) {
        this.busy_ = busy;
        this.pushChanges();
      }
    }
  }]);

  return ModalOutletComponent;
}(rxcomp.Component);
ModalOutletComponent.meta = {
  selector: '[modal-outlet]',
  template:
  /* html */
  "\n\t<div class=\"modal-outlet__container\" [class]=\"{ active: modal, busy: busy }\">\n\t\t<div class=\"modal-outlet__background\" (click)=\"onClose($event)\"></div>\n\t\t<div class=\"modal-outlet__modal\"></div>\n\t\t<!-- spinner -->\n\t\t<div class=\"spinner spinner--contrasted\" *if=\"busy\"></div>\n\t</div>\n\t"
};var GalleryModalComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(GalleryModalComponent, _Component);

  function GalleryModalComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = GalleryModalComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        parentInstance = _getContext.parentInstance;

    if (parentInstance instanceof ModalOutletComponent) {
      var data = parentInstance.modal.data;
      var items = this.items = data.items;
      var initialSlide = this.initialSlide = data.initialSlide;
      console.log(items, initialSlide);
      /*
      if (data.target) {
      	const { node, module } = getContext(this);
      	const content = node.querySelector('.side-modal__content');
      	content.appendChild(data.target);
      	const instances = this.instances = module.compile(content);
      	console.log('GalleryModalComponent.onInit', instances);
      }
      */

      console.log('GalleryModalComponent.onInit', data);
    }
    /*
    this.resize$().pipe(
    	takeUntil(this.unsubscribe$),
    ).subscribe();
    */

  };

  _proto.resize$ = function resize$() {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var header = document.querySelector('header');
    return rxjs.fromEvent(window, 'resize').pipe(operators.startWith(true), operators.tap(function (_) {
      node.style.top = header.offsetHeight + "px";
    }));
  };

  _proto.onClose = function onClose() {
    ModalService.reject();
  };

  return GalleryModalComponent;
}(rxcomp.Component);
GalleryModalComponent.meta = {
  selector: '[gallery-modal]'
};var GalleryComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(GalleryComponent, _Component);

  function GalleryComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = GalleryComponent.prototype;

  _proto.onInit = function onInit() {
    // console.log(this.node.firstElementChild.outerHTML);
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.dataset.originalInnerHTML = node.innerHTML;
    this.click$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  _proto.click$ = function click$() {
    var _this = this;

    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    return rxjs.fromEvent(node, 'click').pipe(operators.map(function (_) {
      var currentSrc = node.getAttribute('gallery');
      var galleryItems = Array.prototype.slice.call(document.querySelectorAll('[gallery]')).filter(function (x) {
        return !x.parentNode.classList.contains('swiper-slide-duplicate');
      }).map(function (x) {
        var src = x.getAttribute('gallery'); // console.log('src', src);

        var originalInnerHTML = x.dataset.originalInnerHTML || x.innerHTML; // console.log('originalInnerHTML', originalInnerHTML)
        // const outerHTML = x.firstElementChild.outerHTML;

        var div = document.createElement('div');
        div.innerHTML = originalInnerHTML;
        var cloneNode = div.firstElementChild; // const cloneNode = Component.create(originalInnerHTML); //x.firstElementChild.cloneNode(true);
        // const iframes = Array.prototype.slice.call(cloneNode.querySelectorAll('iframe'));
        // iframes.forEach(x => x.parentNode.removeChild(x));
        // console.log(originalInnerHTML);

        var srcNode = _this.setSrcNode(cloneNode, src);

        return {
          src: src,
          node: cloneNode,
          active: src === currentSrc
        };
      });
      return galleryItems;
    }), operators.tap(function (items) {
      _this.addGallery(items);
    }));
  };

  _proto.listeners$ = function listeners$() {
    var close = this.close$();
    return rxjs.merge(close, this.prev$(), this.next$(), this.events$()).pipe(operators.takeUntil(close));
  };

  _proto.addGallery = function addGallery(items) {
    console.log('clicked', items);
    var initialSlide = items.reduce(function (p, c, i) {
      return c.active ? i : p;
    }, 0);
    ModalService.open$({
      src: environment.template.modal.galleryModal,
      data: {
        items: items,
        initialSlide: initialSlide
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      console.log('GalleryComponent.addGallery', event);
    });
  };

  _proto.close$ = function close$() {
    var _this2 = this;

    var modalNode = this.modalNode;
    var button = modalNode.querySelector('.btn--close');
    var body = document.querySelector('body');
    return rxjs.fromEvent(button, 'click').pipe(operators.tap(function (_) {
      // !!!
      rxcomp.Component.unregister(modalNode); // this.instances.forEach(x => x.destroy());

      body.removeChild(modalNode); // CursorService.clear();
      // this.instances = null;

      _this2.modalNode = null;
    }));
  };

  _proto.prev$ = function prev$() {
    var _this3 = this;

    var modalNode = this.modalNode;
    var button = modalNode.querySelector('.btn--prev');
    return rxjs.fromEvent(button, 'click').pipe(operators.tap(function (_) {
      var swiperInstance = _this3.swiperInstance;

      if (swiperInstance != null) {
        swiperInstance.slidePrev();
      }
    }));
  };

  _proto.next$ = function next$() {
    var _this4 = this;

    var modalNode = this.modalNode;
    var button = modalNode.querySelector('.btn--next');
    return rxjs.fromEvent(button, 'click').pipe(operators.tap(function (_) {
      var swiperInstance = _this4.swiperInstance;

      if (swiperInstance != null) {
        swiperInstance.slideNext();
      }
    }));
  };

  _proto.events$ = function events$() {
    var indexNode = this.modalNode.querySelector('.modal-gallery__index');
    var swiperInstance = this.swiperInstance;

    if (swiperInstance != null) {
      return swiperInstance.events$.pipe(operators.tap(function (index) {
        // console.log('index', index, swiperInstance);
        indexNode.innerHTML = index + 1 + " / " + swiperInstance.total;
      }));
    } else {
      return rxjs.EMPTY;
    }
  };

  _proto.getSrcNode = function getSrcNode(node) {
    if (node.getAttribute('src') != null) {
      return node;
    } else {
      return node.querySelector('[src]');
    }
  };

  _proto.setSrcNode = function setSrcNode(node, src) {
    var srcNode = this.getSrcNode(node);

    if (srcNode && srcNode.tagName.toLowerCase() === 'img') {
      srcNode.setAttribute('src', src);
    }

    return srcNode;
  };

  return GalleryComponent;
}(rxcomp.Component);

_defineProperty(GalleryComponent, "meta", {
  selector: '[gallery]'
});var HighlightPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(HighlightPipe, _Pipe);

  function HighlightPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  HighlightPipe.transform = function transform(text, query) {
    if (!query) {
      return text;
    }

    if (!Array.isArray(query)) {
      query = [query];
    } // text = HighlightPipe.encodeHTML(text);


    var escapedQuery = query.map(function (x) {
      return HighlightPipe.escapeRegexChars(x);
    });
    var regExp = new RegExp("(<[^>]+>)|(" + escapedQuery.join('|') + ")", 'gmi'); // const regExp = new RegExp(`(?<!\<)${escapedQuery.join('(?![\w\s]*[\>])|(?<!\<)')}(?![\w\s]*[\>])`, 'gmi');
    // const regExp = new RegExp('&[^;]+;|' + escapedQuery.join('|'), 'gi');

    text = text.replace(regExp, function (match, g1, g2) {
      if (g1) {
        return g1;
      } else {
        return '<b>' + g2 + '</b>';
      } // return match.toLowerCase() === x.toLowerCase() ? '<strong>' + match + '</strong>' : match;

    }); // text = HighlightPipe.decodeHTML(text);

    console.log(text, query);
    return text;
  };

  HighlightPipe.escapeRegexChars = function escapeRegexChars(text) {
    return text.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  };

  HighlightPipe.safeToString = function safeToString(text) {
    return text === undefined || text === null ? '' : text.toString().trim();
  };

  HighlightPipe.encodeHTML = function encodeHTML(text) {
    return this.safeToString(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  HighlightPipe.decodeHTML = function decodeHTML(text) {
    return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  };

  return HighlightPipe;
}(rxcomp.Pipe);
HighlightPipe.meta = {
  name: 'highlight'
};/*
['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
['"', '&', ''', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
*/

var HtmlPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(HtmlPipe, _Pipe);

  function HtmlPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  HtmlPipe.transform = function transform(value) {
    if (value) {
      value = value.replace(/&#(\d+);/g, function (m, n) {
        return String.fromCharCode(parseInt(n));
      });
      var escapes = ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
      var unescapes = ['"', '&', '\'', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
      var rx = new RegExp("(&" + escapes.join(';)|(&') + ";)", 'g');
      value = value.replace(rx, function () {
        for (var i = 1; i < arguments.length; i++) {
          if (arguments[i]) {
            // console.log(arguments[i], unescapes[i - 1]);
            return unescapes[i - 1];
          }
        }
      }); // console.log(value);

      return value;
    }
  };

  return HtmlPipe;
}(rxcomp.Pipe);
HtmlPipe.meta = {
  name: 'html'
};var IdDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(IdDirective, _Directive);

  function IdDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = IdDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('id', this.id);
  };

  return IdDirective;
}(rxcomp.Directive);
IdDirective.meta = {
  selector: '[[id]]',
  inputs: ['id']
};var LabelForDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(LabelForDirective, _Directive);

  function LabelForDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = LabelForDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('for', this.labelFor);
  };

  return LabelForDirective;
}(rxcomp.Directive);
LabelForDirective.meta = {
  selector: '[[labelFor]]',
  inputs: ['labelFor']
};var LabelPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(LabelPipe, _Pipe);

  function LabelPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  LabelPipe.transform = function transform(key) {
    var labels = LabelPipe.labels_;
    return labels[key] || key; // `#${key}#`;
  };

  LabelPipe.getKeys = function getKeys() {
    for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    return LabelPipe.transform(keys.map(function (x) {
      return x.replace('-', '_');
    }).join('_'));
  };

  LabelPipe.setLabels = function setLabels() {
    var LABELS = Utils.merge({
      select: 'Seleziona',
      browse: 'Sfoglia',
      cancel: 'Annulla',
      error_email: 'Email non valida',
      error_match: 'I campi non corrispondono',
      error_required: 'Campo obbligatorio',
      loading: 'caricamento',
      remove: 'Rimuovi',
      required: 'Richiesto',
      select_file: 'Seleziona una file...',
      update: 'Aggiorna',
      upload: 'Carica',
      drag_and_drop_images: 'Drag And Drop your images here'
    }, environment.labels);
    this.labels_ = LABELS;
  };

  return LabelPipe;
}(rxcomp.Pipe);
LabelPipe.setLabels();
LabelPipe.meta = {
  name: 'label'
};var NameDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(NameDirective, _Directive);

  function NameDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = NameDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.setAttribute('name', this.name);
  };

  return NameDirective;
}(rxcomp.Directive);
NameDirective.meta = {
  selector: '[[name]]',
  inputs: ['name']
};var NumberPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(NumberPipe, _Pipe);

  function NumberPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  NumberPipe.transform = function transform(value, options, language) {
    if (options === void 0) {
      options = {};
    }

    if (language === void 0) {
      language = null;
    }

    // = 'en-IN'
    if (value != null) {
      // !!! keep losing
      language = language || environment.currentLanguage;
      return new Intl.NumberFormat(language, options).format(value);
    }
  };

  return NumberPipe;
}(rxcomp.Pipe);
NumberPipe.meta = {
  name: 'number'
};var DIVISIONS = [{
  amount: 60,
  name: 'seconds'
}, {
  amount: 60,
  name: 'minutes'
}, {
  amount: 24,
  name: 'hours'
}, {
  amount: 7,
  name: 'days'
}, {
  amount: 4.34524,
  name: 'weeks'
}, {
  amount: 12,
  name: 'months'
}, {
  amount: Number.POSITIVE_INFINITY,
  name: 'years'
}];
var RelativeDatePipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(RelativeDatePipe, _Pipe);

  function RelativeDatePipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  RelativeDatePipe.transform = function transform(value, options, language) {
    if (options === void 0) {
      options = {
        numeric: 'auto'
      };
    }

    if (language === void 0) {
      language = null;
    }

    // = 'en-IN'
    if (value != null) {
      // !!! keep losing
      var date = value instanceof Date ? value : new Date(value);
      language = language || environment.currentLanguage;
      var formatter = new Intl.RelativeTimeFormat(language, options);
      var duration = (date - new Date()) / 1000;

      for (var i = 0; i <= DIVISIONS.length; i++) {
        var division = DIVISIONS[i];

        if (Math.abs(duration) < division.amount) {
          return formatter.format(Math.round(duration), division.name);
        }

        duration /= division.amount;
      }
    }
  };

  return RelativeDatePipe;
}(rxcomp.Pipe);
RelativeDatePipe.meta = {
  name: 'relativeDate'
};var ScrollMenuDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ScrollMenuDirective, _Directive);

  function ScrollMenuDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ScrollMenuDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var anchors = this.anchors = Array.prototype.slice.call(node.querySelectorAll('[href]')).filter(function (x) {
      return x.hasAttribute('href');
    }).map(function (x) {
      var href = x.getAttribute('href');
      var target = document.querySelector(href);
      return {
        a: x,
        href: href,
        target: target
      };
    }); // console.log(anchors);

    rxjs.fromEvent(window, 'scroll').pipe(operators.startWith(1), operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      var tops = anchors.map(function (x, i) {
        var rect = x.target.getBoundingClientRect();
        return {
          top: rect.top,
          index: i
        };
      });
      tops.sort(function (a, b) {
        return a.top - b.top;
      });
      var nearest = tops.reduce(function (p, c, i) {
        var distance = Math.abs(c.top);
        return distance < p.distance ? _objectSpread2(_objectSpread2({}, c), {}, {
          distance: distance
        }) : p;
      }, Object.assign({}, tops[0], {
        distance: Number.POSITIVE_INFINITY
      }));
      _this.index = nearest.index;
    });
  };

  _createClass(ScrollMenuDirective, [{
    key: "index",
    set: function set(index) {
      if (this.index_ !== index) {
        this.index_ = index;
        var anchors = this.anchors;
        anchors.forEach(function (x, i) {
          index === i ? x.a.classList.add('active') : x.a.classList.remove('active');
        });
      }
    }
  }]);

  return ScrollMenuDirective;
}(rxcomp.Directive);
ScrollMenuDirective.meta = {
  selector: "[scroll-menu]"
};var ScrollToDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ScrollToDirective, _Directive);

  function ScrollToDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ScrollToDirective.prototype;

  _proto.onInit = function onInit() {
    this.initialFocus = false;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var expression = this.expression = node.getAttribute("(scrollTo)");
    this.outputFunction = module.makeFunction(expression, ['$event']);
    this.scrollTo$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {});
  };

  _proto.scrollTo$ = function scrollTo$() {
    var _this = this;

    var _getContext2 = rxcomp.getContext(this),
        module = _getContext2.module,
        node = _getContext2.node,
        parentInstance = _getContext2.parentInstance;

    return rxjs.fromEvent(node, 'click').pipe(operators.tap(function (event) {
      event.preventDefault();
      var result = module.resolve(_this.outputFunction, parentInstance, event);

      if (typeof result === 'string') {
        var target = document.querySelector(result);

        if (target) {
          var from = _this.currentTop();

          var to = from + target.getBoundingClientRect().top - 150;
          var o = {
            tween: 0
          };
          var html = document.querySelector('html');
          gsap.set(html, {
            'scroll-behavior': 'auto'
          });
          gsap.to(o, {
            duration: Math.abs(to - from) / 5000,
            tween: 1,
            ease: Quad.easeOut,
            overwrite: 'all',
            onUpdate: function onUpdate() {
              window.scrollTo(0, from + (to - from) * o.tween);
            },
            onComplete: function onComplete() {
              gsap.set(html, {
                'scroll-behavior': 'smooth'
              });
            }
          });
        }
      }
    }), operators.shareReplay(1));
  };

  _proto.currentTop = function currentTop() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset; // Internet Explorer 6 - standards mode

    if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6, 7 and 8

    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
  };

  return ScrollToDirective;
}(rxcomp.Directive);
ScrollToDirective.meta = {
  selector: "[(scrollTo)]"
};var ScrollStickyDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ScrollStickyDirective, _Directive);

  function ScrollStickyDirective() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Directive.call.apply(_Directive, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "sticked_", false);

    return _this;
  }

  var _proto = ScrollStickyDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    this.targetNode = this.target ? node.querySelector(this.target) || node : node;
    this.until = this.until ? document.querySelector(this.until) : null;
    console.log('ScrollStickyDirective', this.targetNode, this.until);
    this.sticky$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {// console.log('ScrollStickyDirective', event);
    });
  };

  _proto.sticky$ = function sticky$() {
    var _this2 = this;

    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var targetNode = this.targetNode;
    var until = this.until;
    return ScrollService.scroll$.pipe(operators.tap(function (event) {
      console.log(event);
      var rect = node.getBoundingClientRect();
      var y = 0;

      if (_this2.bottom) {
        var bottom = window.innerHeight - targetNode.offsetHeight;

        if (window.innerWidth >= 1024 && rect.y > bottom) {
          y = bottom - rect.y;
          _this2.sticked = true;
        } else {
          _this2.sticked = false;
        }
      } else {
        var top = event.direction === 'down' ? 80 : 135;

        if (window.innerWidth >= 1024 && rect.y < top) {
          y = top - rect.y;

          if (until) {
            var untilRect = until.getBoundingClientRect();
            var height = untilRect.y - rect.y;
            y = Math.min(height, y);
          }

          _this2.sticked = true;
        } else {
          _this2.sticked = false;
        }
      }

      console.log(rect.height - targetNode.offsetHeight); // gsap.set(targetNode, { y });
    }));
  };

  _createClass(ScrollStickyDirective, [{
    key: "sticked",
    get: function get() {
      return this.sticked_;
    },
    set: function set(sticked) {
      if (this.sticked_ !== sticked) {
        this.sticked_ = sticked;

        if (this.targetNode) {
          sticked ? this.targetNode.classList.add('sticked') : this.targetNode.classList.remove('sticked');
        }
      }
    }
  }]);

  return ScrollStickyDirective;
}(rxcomp.Directive);
ScrollStickyDirective.meta = {
  selector: '[scroll-sticky],[[scroll-sticky]]',
  inputs: ['target', 'until', 'bottom']
};var ScrollDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ScrollDirective, _Directive);

  function ScrollDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ScrollDirective.prototype;

  _proto.onInit = function onInit() {
    this.scroll$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {// console.log('ScrollDirective', event);
    });
  };

  _proto.scroll$ = function scroll$() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var target = this.scroll && node.querySelector(this.scroll) || node;
    var container = target === node ? window : node;
    var speed = this.scrollSpeed ? parseFloat(this.scrollSpeed) : 1.5;
    return ScrollService.scroll$.pipe(operators.tap(function (_) {
      if (window.innerWidth < 1024) {
        gsap.set(target, {
          clearProps: true
        });
        return;
      }

      var containerRect = container === window ? {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      } : container.getBoundingClientRect();
      var wh = containerRect.height;
      var rect = target.getBoundingClientRect();
      var currentY = gsap.getProperty(target, 'y');
      var top = rect.top - currentY;
      var height = rect.height;
      var space = wh + height;
      var pow;

      if (top > -height && top < wh) {
        pow = (top + height) / space;
        pow = 1 - pow * 2;
        var y = pow * speed * -100;
        gsap.to(target, {
          y: y,
          duration: 0.250
        });
      }
      /*
      const wh2 = wh / 2;
      const bottom = rect.bottom - currentY;
      if (top < wh && bottom > 0) {
      	pow = (top - wh2) / wh2;
      	const y = pow * speed * 40;
      	gsap.set(node, { y });
      }
      */

    }));
  };

  return ScrollDirective;
}(rxcomp.Directive);
ScrollDirective.meta = {
  selector: '[scroll]',
  inputs: ['scroll', 'scrollSpeed']
};var ShareDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ShareDirective, _Directive);

  function ShareDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ShareDirective.prototype;

  _proto.onInit = function onInit() {
    // console.log('ShareComponent.onInit', this.share, this.title);
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var href = this.href;
    node.setAttribute('href', href);

    if (this.share !== 'mailTo') {
      node.setAttribute('target', '_blank');
      rxjs.fromEvent(node, 'click').pipe(operators.tap(function (event) {
        event.preventDefault();
        window.open(href, 'ShareWindow', window.innerWidth >= 768 ? 'width=640,height=480' : '');
      }), operators.takeUntil(this.unsubscribe$)).subscribe();
    }
  }
  /*
  onChanges() {
  	console.log('ShareComponent.onChanges', this.share, this.shareTitle);
  }
  */
  ;

  _proto.encodeURI = function encodeURI(text) {
    return encodeURIComponent(text).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

  _createClass(ShareDirective, [{
    key: "href",
    get: function get() {
      switch (this.share) {
        case 'facebook':
          return this.facebookUrl;

        case 'pinterest':
          return this.pinterestUrl;

        case 'linkedIn':
          return this.linkedInUrl;

        case 'twitter':
          return this.twitterUrl;

        case 'whatsapp':
          return this.whatsappUrl;

        case 'mailTo':
          return this.mailToUrl;
      }
    }
  }, {
    key: "facebookUrl",
    get: function get() {
      return "https://www.facebook.com/sharer/sharer.php?u=" + this.url;
    }
  }, {
    key: "pinterestUrl",
    get: function get() {
      return "https://www.pinterest.com/pin/create/button/?url=" + this.url + "&media=&description=" + this.title;
    }
  }, {
    key: "linkedInUrl",
    get: function get() {
      return "https://www.linkedin.com/shareArticle?mini=true&url=" + this.url + "&title=" + this.title;
    }
  }, {
    key: "twitterUrl",
    get: function get() {
      return "https://twitter.com/intent/tweet?text=" + this.title + "%20" + this.url;
    }
  }, {
    key: "whatsappUrl",
    get: function get() {
      return "https://api.whatsapp.com/send?text=" + this.url;
    }
  }, {
    key: "mailToUrl",
    get: function get() {
      return "mailto:?subject=" + this.title + "&body=" + this.url;
    }
  }, {
    key: "title",
    get: function get() {
      var title = this.shareTitle ? this.shareTitle : document.title;
      return this.encodeURI(title);
    }
  }, {
    key: "url",
    get: function get() {
      var url = this.shareUrl;

      if (url) {
        if (url.indexOf(window.location.origin) === -1) {
          url = window.location.origin + (url.indexOf('/') === 0 ? url : '/' + url);
        }
      } else {
        url = window.location.href;
      }

      return this.encodeURI(url);
    }
  }]);

  return ShareDirective;
}(rxcomp.Directive);
ShareDirective.meta = {
  selector: '[share]',
  inputs: ['share', 'shareUrl', 'shareTitle']
};var SlugPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(SlugPipe, _Pipe);

  function SlugPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  SlugPipe.transform = function transform(key) {
    var slug = environment.slug;
    return slug[key] || "#" + key;
  };

  return SlugPipe;
}(rxcomp.Pipe);
SlugPipe.meta = {
  name: 'slug'
};var SvgIconStructure = /*#__PURE__*/function (_Structure) {
  _inheritsLoose(SvgIconStructure, _Structure);

  function SvgIconStructure() {
    return _Structure.apply(this, arguments) || this;
  }

  var _proto = SvgIconStructure.prototype;

  _proto.onInit = function onInit() {
    this.update();
  };

  _proto.onChanges = function onChanges() {
    this.update();
  };

  _proto.update = function update() {
    if (this.name_ !== this.name) {
      this.name_ = this.name;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      if (node.parentNode) {
        var _element$classList;

        var xmlns = 'http://www.w3.org/2000/svg';
        var element = document.createElementNS(xmlns, "svg");
        var w = this.width || 24;
        var h = this.height || 24;
        element.setAttribute('class', "icon--" + this.name); // element.setAttributeNS(null, 'width', w);
        // element.setAttributeNS(null, 'height', h);

        element.setAttributeNS(null, 'viewBox', "0 0 " + w + " " + h);
        element.innerHTML = "<use xlink:href=\"#" + this.name + "\"></use>";
        element.rxcompId = node.rxcompId;

        (_element$classList = element.classList).add.apply(_element$classList, node.classList);

        node.parentNode.replaceChild(element, node);
      }
    }
  };

  return SvgIconStructure;
}(rxcomp.Structure);
SvgIconStructure.meta = {
  selector: 'svg-icon',
  inputs: ['name', 'width', 'height']
};
/*
<svg class="copy" width="24" height="24" viewBox="0 0 24 24"><use xlink:href="#copy"></use></svg>
*/var SwiperDirective = /*#__PURE__*/function (_Component) {
  _inheritsLoose(SwiperDirective, _Component);

  function SwiperDirective() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = SwiperDirective.prototype;

  _proto.onInit = function onInit() {
    this.options = {
      slidesPerView: 'auto',
      spaceBetween: 0,
      centeredSlides: true,
      speed: 600,
      autoplay: {
        delay: 5000
      },
      keyboardControl: true,
      mousewheelControl: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      }
    };
    this.init_();
  };

  _proto.onChanges = function onChanges() {
    this.swiperInitOrUpdate_();
  };

  _proto.onDestroy = function onDestroy() {
    this.removeListeners_();
    this.swiperDestroy_();
  };

  _proto.onBeforePrint = function onBeforePrint() {
    this.swiperDestroy_();
  };

  _proto.slideToIndex = function slideToIndex(index) {
    // console.log('SwiperDirective.slideToIndex', index);
    if (this.swiper) {
      this.swiper.slideTo(index);
    }
  };

  _proto.hasPrev = function hasPrev() {
    var swiper = this.swiper;

    if (swiper) {
      // console.log('SwiperDirective.hasPrev', swiper.activeIndex, swiper.realIndex, swiper.slides.length);
      if (swiper.activeIndex > 0 && swiper.slides.length > swiper.activeIndex) {
        return true;
      }
    }
  };

  _proto.hasNext = function hasNext() {
    var swiper = this.swiper;

    if (swiper) {
      var slidesPerView = swiper.params.slidesPerView === 'auto' ? 1 : swiper.params.slidesPerView || 1; // console.log('SwiperDirective.hasNext', swiper.slides.length, slidesPerView, swiper.activeIndex);

      if (swiper.activeIndex < swiper.slides.length - slidesPerView) {
        return true;
      }
    }
  };

  _proto.slidePrev = function slidePrev() {
    var swiper = this.swiper;

    if (this.hasPrev()) {
      // console.log('SwiperDirective.slidePrev', swiper.activeIndex, swiper.realIndex, swiper.slides);
      swiper.slideTo(swiper.activeIndex - 1);
    }
  };

  _proto.slideNext = function slideNext() {
    var swiper = this.swiper;

    if (this.hasNext()) {
      // console.log('SwiperDirective.slideNext', swiper.activeIndex, swiper.realIndex, swiper.slides);
      swiper.slideTo(swiper.activeIndex + 1);
    }
  };

  _proto.init_ = function init_(target) {
    var _this = this;

    this.events$ = new rxjs.Subject();

    if (this.enabled) {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      target = target || node;
      this.target = target;
      gsap.set(target, {
        opacity: 0
      });
      this.index = 0;
      var on = this.options.on || {};

      on.slideChange = function () {
        var swiper = _this.swiper;

        if (swiper) {
          _this.index = swiper.activeIndex;

          _this.events$.next(_this.index);

          _this.pushChanges();
        }
      };

      this.options.on = on;
      this.addListeners_();
    }
  };

  _proto.addListeners_ = function addListeners_() {
    this.onBeforePrint = this.onBeforePrint.bind(this);
    window.addEventListener('beforeprint', this.onBeforePrint);
    /*
    scope.$on('onResize', ($scope) => {
    	this.onResize(scope, element, attributes);
    });
    */
  };

  _proto.removeListeners_ = function removeListeners_() {
    window.removeEventListener('beforeprint', this.onBeforePrint);
  };

  _proto.swiperInitOrUpdate_ = function swiperInitOrUpdate_() {
    if (this.enabled) {
      var target = this.target;

      if (this.swiper) {
        this.swiper.update();
      } else {
        var swiper;
        var on = this.options.on || (this.options.on = {});
        var callback = on.init;

        if (!on.init || !on.init.swiperDirectiveInit) {
          on.init = function () {
            var _this2 = this;

            gsap.to(target, {
              duration: 0.4,
              opacity: 1,
              ease: Power2.easeOut
            });
            setTimeout(function () {
              if (typeof callback === 'function') {
                callback.apply(_this2, [swiper, element, scope]);
              }
            }, 1);
          };

          on.init.swiperDirectiveInit = true;
        }

        gsap.set(target, {
          opacity: 1
        });
        swiper = new Swiper(target, this.options); // console.log(swiper);

        this.swiper = swiper;
        this.swiper._opening = true;
        target.classList.add('swiper-init');
      }
    }
  };

  _proto.swiperDestroy_ = function swiperDestroy_() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  };

  _createClass(SwiperDirective, [{
    key: "slideIndex",
    get: function get() {
      return this.swiper ? this.swiper.realIndex + 1 : 0;
    }
  }, {
    key: "slideTotal",
    get: function get() {
      return this.swiper ? this.swiper.slides.length : 0;
    }
  }, {
    key: "enabled",
    get: function get() {
      return !window.matchMedia('print').matches;
    }
  }]);

  return SwiperDirective;
}(rxcomp.Component);
SwiperDirective.meta = {
  selector: '[swiper]',
  inputs: ['consumer']
};// <script src='https://gruppoconcorde-cdn.thron.com/shared/ce/bootstrap/1/scripts/embeds-min.js'></script>

var ThronService = /*#__PURE__*/function () {
  function ThronService() {}

  ThronService.thron$ = function thron$() {
    var thron = window.THRONContentExperience || window.THRONPlayer;

    if (thron) {
      return rxjs.of(thron);
    } else {
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', 'https://gruppoconcorde-cdn.thron.com/shared/ce/bootstrap/1/scripts/embeds-min.js');
      var loaded$ = rxjs.fromEvent(script, 'load').pipe( // tap(event => console.log(event, window.THRONContentExperience || window.THRONPlayer)),
      operators.map(function (event) {
        return window.THRONContentExperience || window.THRONPlayer;
      }), operators.shareReplay(1));
      return document.head.appendChild(script) && loaded$;
    }
  };

  return ThronService;
}();var ID = 0;
var ThronComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ThronComponent, _Component);

  function ThronComponent() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "playing_", false);

    return _this;
  }

  var _proto = ThronComponent.prototype;

  _proto.onInit = function onInit() {
    // console.log('ThronComponent.onInit');
    this.init$().pipe(operators.first()).subscribe();
  };

  _proto.init$ = function init$() {
    var _this2 = this;

    return ThronService.thron$().pipe(operators.tap(function (THRON) {
      // const THRON = window.THRONContentExperience || window.THRONPlayer;
      if (!THRON) {
        return;
      } // console.log('THRONContentExperience', window.THRONContentExperience, 'THRONPlayer', window.THRONPlayer);


      var _getContext = rxcomp.getContext(_this2),
          node = _getContext.node;

      var target = _this2.target = node.querySelector('.video > .thron');
      var id = target.id = "thron-" + ++ID;
      var media = _this2.thron;

      if (media.indexOf('pkey=') === -1) {
        var splitted = media.split('/');
        var clientId = splitted[6];
        var xcontentId = splitted[7];
        var pkey = splitted[8];
        media = "https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=" + clientId + "&xcontentId=" + xcontentId + "&pkey=" + pkey;
      }

      var controls = _this2.controls = node.hasAttribute('controls') ? true : false,
          loop = _this2.loop = node.hasAttribute('loop') ? true : false,
          autoplay = _this2.autoplay = node.hasAttribute('autoplay') ? true : false;
      var player = _this2.player = THRON(id, {
        media: media,
        loop: loop,
        autoplay: autoplay,
        muted: !controls,
        displayLinked: 'close',
        noSkin: !controls // lockBitrate: 'max',

      });
      _this2.onReady = _this2.onReady.bind(_this2);
      _this2.onCanPlay = _this2.onCanPlay.bind(_this2);
      _this2.onPlaying = _this2.onPlaying.bind(_this2);
      _this2.onPlay = _this2.onPlay.bind(_this2);
      _this2.onPause = _this2.onPause.bind(_this2);
      _this2.onComplete = _this2.onComplete.bind(_this2);
      player.on('ready', _this2.onReady);
      player.on('canPlay', _this2.onCanPlay);
      player.on('playing', _this2.onPlaying);
      player.on('play', _this2.onPlay);
      player.on('pause', _this2.onPause);
      player.on('complete', _this2.onComplete);
    }));
  };

  _proto.onReady = function onReady() {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var id = this.target.id;
    var player = this.player;

    if (!this.controls) {
      var mediaContainer = player.mediaContainer();
      var video = mediaContainer.querySelector('video');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
    }

    this.ready.next(id); // video.setAttribute('autoplay', 'true');
  };

  _proto.onCanPlay = function onCanPlay() {
    var _getContext3 = rxcomp.getContext(this),
        node = _getContext3.node;

    var id = this.target.id; // console.log('ThronDirective.onCanPlay', id);

    this.canPlay.next(id);
  };

  _proto.onPlaying = function onPlaying() {
    var _getContext4 = rxcomp.getContext(this),
        node = _getContext4.node;

    var id = this.target.id;
    var player = this.player;
    player.off('playing', this.onPlaying);

    if (!this.controls) {
      var qualities = player.qualityLevels(); // console.log('ThronDirective.onPlaying', id, qualities);

      if (qualities.length) {
        var highestQuality = qualities[qualities.length - 1].index;
        var lowestQuality = qualities[0].index;
        player.currentQuality(highestQuality); // console.log('ThronDirective.onPlaying', id, 'currentQuality', player.currentQuality());
      }
    }
  };

  _proto.onPlay = function onPlay() {
    var _getContext5 = rxcomp.getContext(this),
        node = _getContext5.node;

    var id = this.target.id; // console.log('ThronDirective.onComplete', id);

    this.playing = true;
    this.play.next(id);
  };

  _proto.onPause = function onPause() {
    var _getContext6 = rxcomp.getContext(this),
        node = _getContext6.node;

    var id = this.target.id; // console.log('ThronDirective.onComplete', id);

    this.playing = false;
    this.pause.next(id);
  };

  _proto.onComplete = function onComplete() {
    var _getContext7 = rxcomp.getContext(this),
        node = _getContext7.node;

    var id = this.target.id; // console.log('ThronDirective.onComplete', id);

    this.playing = false;
    this.complete.next(id);
  };

  _proto.playVideo = function playVideo() {
    var _getContext8 = rxcomp.getContext(this),
        node = _getContext8.node;

    var id = this.target.id;
    var player = this.player;
    var status = player.status(); // console.log('ThronDirective.playVideo', id, status);

    if (status && !status.playing) {
      player.play();
    }
  };

  _proto.pauseVideo = function pauseVideo() {
    var _getContext9 = rxcomp.getContext(this),
        node = _getContext9.node;

    var id = this.target.id;
    var player = this.player;
    var status = player.status(); // console.log('ThronDirective.pauseVideo', id, status);

    if (status && status.playing) {
      player.pause();
    }
  };

  _proto.toggle = function toggle() {
    var _getContext10 = rxcomp.getContext(this),
        node = _getContext10.node;

    var id = this.target.id;
    var player = this.player;
    var status = player.status(); // console.log('ThronDirective.pauseVideo', id, status);

    if (status && status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  _proto.play = function play(id) {
    // console.log('ThronDirective.play', id, id, id === id);
    var _getContext11 = rxcomp.getContext(this),
        node = _getContext11.node;

    if (id === this.target.id) {
      this.playVideo();
    }
  };

  _proto.pause = function pause(id) {
    // console.log('ThronDirective.pause', id, id, id === id);
    var _getContext12 = rxcomp.getContext(this),
        node = _getContext12.node;

    if (id === this.target.id) {
      this.pauseVideo();
    }
  };

  _proto.onDestroy = function onDestroy() {
    var player = this.player;

    if (player) {
      player.off('ready', this.onReady);
      player.off('canPlay', this.onCanPlay);
      player.off('playing', this.onPlaying);
      player.off('play', this.onPlay);
      player.off('pause', this.onPause);
      player.off('complete', this.onComplete);
    }
  };

  _createClass(ThronComponent, [{
    key: "playing",
    get: function get() {
      return this.playing_;
    },
    set: function set(playing) {
      if (this.playing_ !== playing) {
        this.playing_ = playing;

        var _getContext13 = rxcomp.getContext(this),
            node = _getContext13.node;

        if (node) {
          playing ? node.classList.add('playing') : node.classList.remove('playing');
        }
      }
    }
  }]);

  return ThronComponent;
}(rxcomp.Component);
ThronComponent.meta = {
  selector: '[thron],[[thron]]',
  outputs: ['ready', 'canPlay', 'play', 'pause', 'complete'],
  inputs: ['thron', 'm3u8'],
  template:
  /* html */
  ""
};var TitleDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(TitleDirective, _Directive);

  function TitleDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  _createClass(TitleDirective, [{
    key: "title",
    get: function get() {
      return this.title_;
    },
    set: function set(title) {
      if (this.title_ !== title) {
        this.title_ = title;

        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        title ? node.setAttribute('title', title) : node.removeAttribute('title');
      }
    }
  }]);

  return TitleDirective;
}(rxcomp.Directive);
TitleDirective.meta = {
  selector: '[[title]]',
  inputs: ['title']
};var ToggleDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ToggleDirective, _Directive);

  function ToggleDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = ToggleDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    rxjs.fromEvent(node, 'click').pipe(operators.tap(function (_) {
      var items = Array.prototype.slice.call(document.querySelectorAll(_this.toggle));
      items.forEach(function (item) {
        if (item === node) {
          item.classList.contains('active') ? item.classList.remove('active') : item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }), operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  return ToggleDirective;
}(rxcomp.Directive);
ToggleDirective.meta = {
  selector: '[toggle]',
  inputs: ['toggle']
};var factories = [AltDirective, AppearDirective, ClickOutsideDirective, DownloadDirective, // DropDirective,
DropdownDirective, DropdownItemDirective, // DropdownItemDirective,
EllipsisDirective, FilterItemComponent, GalleryComponent, GalleryModalComponent, IdDirective, LabelForDirective, // LanguageComponent,
// LazyDirective,
// ModalComponent,
ModalOutletComponent, NameDirective, ScrollDirective, ScrollStickyDirective, ScrollToDirective, ScrollMenuDirective, ShareDirective, SvgIconStructure, SwiperDirective, ThronComponent, TitleDirective, ToggleDirective // UploadItemComponent,
// VirtualStructure
];
var pipes = [DatePipe, EnvPipe, FlagPipe, HighlightPipe, HtmlPipe, LabelPipe, NumberPipe, RelativeDatePipe, SlugPipe];
var CommonModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(CommonModule, _Module);

  function CommonModule() {
    return _Module.apply(this, arguments) || this;
  }

  return CommonModule;
}(rxcomp.Module);
CommonModule.meta = {
  imports: [],
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};var UID = 10000;
var ControlComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ControlComponent, _Component);

  function ControlComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ControlComponent.prototype;

  _proto.onInit = function onInit() {
    this.uid = ++UID;
    this.label = this.label || 'label';
  };

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node; // console.log(this, node, this.control);


    var control = this.control;
    var flags = control.flags;
    Object.keys(flags).forEach(function (key) {
      flags[key] ? node.classList.add(key) : node.classList.remove(key);
    });
  };

  _createClass(ControlComponent, [{
    key: "uniqueId",
    get: function get() {
      return this.control.name + this.uid;
    }
  }]);

  return ControlComponent;
}(rxcomp.Component);
ControlComponent.meta = {
  selector: '[control]',
  inputs: ['control']
};var ControlCheckboxComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlCheckboxComponent, _ControlComponent);

  function ControlCheckboxComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlCheckboxComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    _ControlComponent.prototype.onInit.call(this);

    if (this.target === 'modal') {
      setTimeout(function () {
        _this.link$().pipe(operators.takeUntil(_this.unsubscribe$)).subscribe();
      }, 1);
    }
  };

  _proto.link$ = function link$() {
    var _this2 = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var anchors = Array.prototype.slice.call(node.querySelectorAll('a')); // console.log(anchors, node.innerHTML);

    return rxjs.merge.apply(void 0, anchors.map(function (anchor) {
      return rxjs.fromEvent(anchor, 'click');
    })).pipe(operators.switchMap(function (event) {
      event.preventDefault();
      event.stopPropagation(); // console.log('UserDetailComponent.onModalUserUpdate');

      var anchor = event.target;
      var href = anchor.getAttribute('href'); // console.log('ControlCheckboxComponent.link$.href', href);

      return rxjs.from(fetch(href).then(function (response) {
        return response.text();
      }));
    }), operators.tap(function (html) {
      // console.log('ControlCheckboxComponent.link$.html', html);
      var parser = new DOMParser();
      var htmlDocument = parser.parseFromString(html, 'text/html'); // console.log('ControlCheckboxComponent.link$.htmlDocument', htmlDocument);

      var title = htmlDocument.querySelector('.section--intro-sm .title');
      title = title ? title.innerHTML : null;
      var abstract = htmlDocument.querySelector('.section--intro-sm .descritpion');
      abstract = abstract ? abstract.innerHTML : null;
      var description = htmlDocument.querySelector('.section--text .col-md-6');
      description = description ? description.innerHTML : null;
      ModalService.open$({
        src: environment.template.modal.genericModal,
        data: {
          title: title,
          abstract: abstract,
          description: description
        }
      }).pipe(operators.takeUntil(_this2.unsubscribe$)).subscribe(function (event) {// console.log('ControlCheckboxComponent.link$.genericModal', event);
      });
    }));
  };

  return ControlCheckboxComponent;
}(ControlComponent);
ControlCheckboxComponent.meta = {
  selector: '[control-checkbox]',
  inputs: ['control', 'label', 'target'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form--checkbox\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<input [id]=\"uniqueId\" type=\"checkbox\" class=\"control--checkbox\" [formControl]=\"control\" [value]=\"true\" />\n\t\t\t<label [labelFor]=\"uniqueId\">\n\t\t\t\t<svg class=\"icon icon--checkbox\"><use xlink:href=\"#checkbox\"></use></svg>\n\t\t\t\t<svg class=\"icon icon--checkbox-checked\"><use xlink:href=\"#checkbox-checked\"></use></svg>\n\t\t\t\t<span [innerHTML]=\"label | html\"></span>\n\t\t\t\t<span class=\"required__sign\">*</span>\n\t\t\t</label>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var KeyboardService = /*#__PURE__*/function () {
  function KeyboardService() {}

  KeyboardService.keydown$ = function keydown$() {
    if (!this.keydown$_) {
      this.keydown$_ = rxjs.fromEvent(window, 'keydown').pipe(operators.shareReplay(1));
    }

    return this.keydown$_;
  };

  KeyboardService.keyup$ = function keyup$() {
    if (!this.keyup$_) {
      this.keyup$_ = rxjs.fromEvent(window, 'keyup').pipe(operators.shareReplay(1));
    }

    return this.keyup$_;
  };

  KeyboardService.keys$ = function keys$() {
    var _this = this;

    if (!this.keys$_) {
      this.keys$_ = rxjs.merge(this.keydown$(), this.keyup$()).pipe(operators.map(function (event) {
        var keys = _this.keys;

        if (event.type === 'keydown') {
          keys[event.key] = true;
        } else {
          delete keys[event.key];
        }

        return _this.keys;
      }), operators.startWith(this.keys), operators.shareReplay(1));
    }

    return this.keys$_;
  };

  KeyboardService.key$ = function key$() {
    if (!this.key$_) {
      var regexp = /\w/;
      this.key$_ = this.keydown$().pipe(operators.filter(function (event) {
        return event.key && event.key.match(regexp);
      }), operators.map(function (event) {
        return event.key;
      }), operators.shareReplay(1));
    }

    return this.key$_;
  };

  KeyboardService.typing$ = function typing$() {
    if (!this.typing$_) {
      var typing = '',
          to;
      this.typing$_ = this.key$().pipe(operators.map(function (key) {
        if (to) {
          clearTimeout(to);
        }

        typing += key;
        to = setTimeout(function () {
          typing = '';
        }, 1500);
        return typing;
      }), operators.shareReplay(1));
    }

    return this.typing$_;
  };

  return KeyboardService;
}();

_defineProperty(KeyboardService, "keys", {});var ControlCustomSelectComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlCustomSelectComponent, _ControlComponent);

  function ControlCustomSelectComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlCustomSelectComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    _ControlComponent.prototype.onInit.call(this);

    this.dropped = false;
    this.dropdownId = DropdownDirective.nextId();
    KeyboardService.typing$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (word) {
      _this.scrollToWord(word);
    });
    /*
    KeyboardService.key$().pipe(
    	takeUntil(this.unsubscribe$)
    ).subscribe(key => {
    	this.scrollToKey(key);
    });
    */
  }
  /*
  onChanges() {
  	// console.log('ControlCustomSelectComponent.onChanges');
  }
  */
  ;

  _proto.scrollToWord = function scrollToWord(word) {
    // console.log('ControlCustomSelectComponent.scrollToWord', word);
    var items = this.control.options || [];
    var index = -1;

    for (var i = 0; i < items.length; i++) {
      var x = items[i];

      if (x.name.toLowerCase().indexOf(word.toLowerCase()) === 0) {
        // console.log(word, x.name);
        index = i;
        break;
      }
    }

    if (index !== -1) {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      var dropdown = node.querySelector('.dropdown');
      var navDropdown = node.querySelector('.nav--dropdown');
      var item = navDropdown.children[index];
      dropdown.scrollTo(0, item.offsetTop);
    }
  };

  _proto.setOption = function setOption(item) {
    // console.log('setOption', item, this.isMultiple);
    var value;

    if (this.isMultiple) {
      var _value = this.control.value || [];

      var index = _value.indexOf(item.id);

      if (index !== -1) {
        // if (value.length > 1) {
        _value.splice(index, 1); // }

      } else {
        _value.push(item.id);
      }

      _value.length ? _value.slice() : null, _readOnlyError("value");
    } else {
      value = item.id; // DropdownDirective.dropdown$.next(null);
    }

    this.control.value = value;
    this.change.next(value);
  };

  _proto.hasOption = function hasOption(item) {
    if (this.isMultiple) {
      var values = this.control.value || [];
      return values.indexOf(item.id) !== -1;
    } else {
      return this.control.value === item.id;
    }
  };

  _proto.getLabel = function getLabel() {
    var value = this.control.value;
    var items = this.control.options || [];

    if (this.isMultiple) {
      value = value || [];

      if (value.length) {
        return value.map(function (v) {
          var item = items.find(function (x) {
            return x.id === v || x.name === v;
          });
          return item ? item.name : '';
        }).join(', ');
      } else {
        return this.select || 'select'; // LabelPipe.transform('select');
      }
    } else {
      var item = value ? items.find(function (x) {
        return x.id === value || x.name === value;
      }) : null;

      if (item) {
        return item.name;
      } else {
        return this.select || 'select'; // LabelPipe.transform('select');
      }
    }
  };

  _proto.onDropped = function onDropped($event) {
    // console.log('ControlCustomSelectComponent.onDropped', id);
    if (this.dropped && $event === null) {
      this.control.touched = true;
    }

    this.dropped = $event === this.dropdownId;
  };

  _createClass(ControlCustomSelectComponent, [{
    key: "isMultiple",
    get: function get() {
      return this.multiple && this.multiple !== false && this.multiple !== 'false';
    }
  }]);

  return ControlCustomSelectComponent;
}(ControlComponent);
ControlCustomSelectComponent.meta = {
  selector: '[control-custom-select]',
  outputs: ['change'],
  inputs: ['control', 'label', 'multiple', 'select'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form--select\" [class]=\"{ required: control.validators.length, multiple: isMultiple }\" [dropdown]=\"dropdownId\" (dropped)=\"onDropped($event)\">\n\t\t\t<label><span [innerHTML]=\"label\"></span> <span class=\"required__sign\">*</span></label>\n\t\t\t<span class=\"control--custom-select\" [innerHTML]=\"getLabel() | label\"></span>\n\t\t\t<svg class=\"caret-down\"><use xlink:href=\"#caret-down\"></use></svg>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t\t<div class=\"dropdown\" [dropdown-item]=\"dropdownId\">\n\t\t\t<div class=\"category\" [innerHTML]=\"label\"></div>\n\t\t\t<ul class=\"nav--dropdown\" [class]=\"{ multiple: isMultiple }\">\n\t\t\t\t<li (click)=\"setOption(item)\" [class]=\"{ empty: item.id == null }\" *for=\"let item of control.options\">\n\t\t\t\t\t<span [class]=\"{ active: hasOption(item) }\" [innerHTML]=\"item.name | label\"></span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t"
};var ControlEmailComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlEmailComponent, _ControlComponent);

  function ControlEmailComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlEmailComponent.prototype;

  _proto.onInit = function onInit() {
    _ControlComponent.prototype.onInit.call(this);
  };

  return ControlEmailComponent;
}(ControlComponent);
ControlEmailComponent.meta = {
  selector: '[control-email]',
  inputs: ['control', 'label'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [labelFor]=\"uniqueId\"><span [innerHTML]=\"label\"></span> <span class=\"required__sign\">*</span></label>\n\t\t\t<input [id]=\"uniqueId\" type=\"text\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" required email />\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ControlFileComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlFileComponent, _ControlComponent);

  function ControlFileComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlFileComponent.prototype;

  _proto.onInit = function onInit() {
    _ControlComponent.prototype.onInit.call(this);

    this.labels = window.labels || {};
    this.file = null;
    this.onReaderComplete = this.onReaderComplete.bind(this);
  };

  _proto.onInputDidChange = function onInputDidChange(event) {
    var input = event.target;
    var file = input.files[0];
    this.file = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type
    };
    var reader = new FileReader();
    reader.addEventListener('load', this.onReaderComplete);
    reader.readAsDataURL(file); // reader.readAsArrayBuffer() // Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.
    // reader.readAsBinaryString() // Starts reading the contents of the specified Blob, once finished, the result attribute contains the raw binary data from the file as a string.
    // reader.readAsDataURL() // Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
    // reader.readAsText() // Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string. An optional encoding name can be specified.
  };

  _proto.onReaderComplete = function onReaderComplete(event) {
    var content = event.target.result;
    this.file.content = content;
    this.control.value = this.file; // console.log('ControlFileComponent.onReaderComplete', this.file);
    // image/*,
  };

  return ControlFileComponent;
}(ControlComponent);
ControlFileComponent.meta = {
  selector: '[control-file]',
  inputs: ['control', 'label'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form--file\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label for=\"file\"><span [innerHTML]=\"label\"></span> <span class=\"required__sign\">*</span></label>\n\t\t\t<span class=\"control--text\" [innerHTML]=\"file?.name || labels.select_file\"></span>\n\t\t\t<svg class=\"upload\"><use xlink:href=\"#upload\"></use></svg>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t\t<input name=\"file\" type=\"file\" accept=\".pdf,.doc,.docx,*.txt\" class=\"control--file\" (change)=\"onInputDidChange($event)\" />\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ControlPasswordComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlPasswordComponent, _ControlComponent);

  function ControlPasswordComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlPasswordComponent.prototype;

  _proto.onInit = function onInit() {
    _ControlComponent.prototype.onInit.call(this);

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    if (node.hasAttribute('secure')) {
      // const name = [..."abcdefghijklmnopqrsuvwxyz0123456789"].map((c, i, a) => a[Math.floor(Math.random() * a.length)]).join('');
      var input = node.querySelector('input');
      input.setAttribute('autocomplete', 'new-password');
    }
  };

  return ControlPasswordComponent;
}(ControlComponent);
ControlPasswordComponent.meta = {
  selector: '[control-password]',
  inputs: ['control', 'label'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [labelFor]=\"uniqueId\"><span [innerHTML]=\"label\"></span> <span class=\"required__sign\">*</span></label>\n\t\t\t<input [id]=\"uniqueId\" type=\"password\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" />\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ControlPrivacyComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlPrivacyComponent, _ControlComponent);

  function ControlPrivacyComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlPrivacyComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    _ControlComponent.prototype.onInit.call(this);

    if (this.target === 'modal') {
      setTimeout(function () {
        _this.link$().pipe(operators.takeUntil(_this.unsubscribe$)).subscribe();
      }, 1);
    }
  };

  _proto.onChanges = function onChanges() {
    var _this2 = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var inputs = Array.prototype.slice.call(node.querySelectorAll('input'));
    inputs.forEach(function (input, i) {
      _this2.control.value === true && i === 0 || _this2.control.value === false && i === 1 ? input.setAttribute('checked', '') : input.removeAttribute('checked');
    });
  };

  _proto.onSelect = function onSelect(value) {
    this.control.value = value;
  };

  _proto.link$ = function link$() {
    var _this3 = this;

    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var anchors = Array.prototype.slice.call(node.querySelectorAll('a')); // console.log(anchors, node.innerHTML);

    return rxjs.merge.apply(void 0, anchors.map(function (anchor) {
      return rxjs.fromEvent(anchor, 'click');
    })).pipe(operators.switchMap(function (event) {
      event.preventDefault();
      event.stopPropagation(); // console.log('UserDetailComponent.onModalUserUpdate');

      var anchor = event.target;
      var href = anchor.getAttribute('href'); // console.log('ControlPrivacyComponent.link$.href', href);

      return rxjs.from(fetch(href).then(function (response) {
        return response.text();
      }));
    }), operators.tap(function (html) {
      // console.log('ControlPrivacyComponent.link$.html', html);
      var parser = new DOMParser();
      var htmlDocument = parser.parseFromString(html, 'text/html'); // console.log('ControlPrivacyComponent.link$.htmlDocument', htmlDocument);

      var title = htmlDocument.querySelector('.section--intro-sm .title');
      title = title ? title.innerHTML : null;
      var abstract = htmlDocument.querySelector('.section--intro-sm .descritpion');
      abstract = abstract ? abstract.innerHTML : null;
      var description = htmlDocument.querySelector('.section--text .col-md-6');
      description = description ? description.innerHTML : null;
      ModalService.open$({
        src: environment.template.modal.genericModal,
        data: {
          title: title,
          abstract: abstract,
          description: description
        }
      }).pipe(operators.takeUntil(_this3.unsubscribe$)).subscribe(function (event) {// console.log('ControlPrivacyComponent.link$.genericModal', event);
      });
    }));
  };

  return ControlPrivacyComponent;
}(ControlComponent);
ControlPrivacyComponent.meta = {
  selector: '[control-privacy]',
  inputs: ['control', 'label', 'target'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form--privacy\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<div class=\"group--inputs\">\n\t\t\t\t<input type=\"radio\" class=\"control--checkbox\" [id]=\"uniqueId + '_true'\" [name]=\"uniqueId\" [value]=\"true\" (change)=\"onSelect(true)\" />\n\t\t\t\t<label [labelFor]=\"uniqueId + '_true'\">\n\t\t\t\t\t<svg class=\"icon icon--checkbox\"><use xlink:href=\"#checkbox\"></use></svg>\n\t\t\t\t\t<svg class=\"icon icon--checkbox-checked\"><use xlink:href=\"#checkbox-checked\"></use></svg>\n\t\t\t\t\t<span>Acconsento</span>\n\t\t\t\t</label>\n\t\t\t\t<input type=\"radio\" class=\"control--checkbox\" [id]=\"uniqueId + '_false'\" [name]=\"uniqueId\" [value]=\"false\" (change)=\"onSelect(false)\" />\n\t\t\t\t<label [labelFor]=\"uniqueId + '_false'\">\n\t\t\t\t\t<svg class=\"icon icon--checkbox\"><use xlink:href=\"#checkbox\"></use></svg>\n\t\t\t\t\t<svg class=\"icon icon--checkbox-checked\"><use xlink:href=\"#checkbox-checked\"></use></svg>\n\t\t\t\t\t<span>Non acconsento</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"description\">\n\t\t\t\t<span [innerHTML]=\"label | html\"></span>\n\t\t\t\t<span class=\"required__sign\">*</span>\n\t\t\t</div>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ControlSearchComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlSearchComponent, _ControlComponent);

  function ControlSearchComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlSearchComponent.prototype;

  _proto.onInit = function onInit() {
    _ControlComponent.prototype.onInit.call(this);

    this.disabled = this.disabled || false;
  };

  return ControlSearchComponent;
}(ControlComponent);
ControlSearchComponent.meta = {
  selector: '[control-search]',
  inputs: ['control', 'label', 'disabled'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length, disabled: disabled }\">\n\t\t\t<svg class=\"search\"><use xlink:href=\"#search\"></use></svg>\n\t\t\t<input type=\"text\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" [disabled]=\"disabled\" />\n\t\t</div>\n\t"
};var ControlTextComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlTextComponent, _ControlComponent);

  function ControlTextComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlTextComponent.prototype;

  _proto.onInit = function onInit() {
    _ControlComponent.prototype.onInit.call(this);

    this.disabled = this.disabled || false;
  };

  return ControlTextComponent;
}(ControlComponent);
ControlTextComponent.meta = {
  selector: '[control-text]',
  inputs: ['control', 'label', 'disabled'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length, disabled: disabled }\">\n\t\t\t<label [labelFor]=\"uniqueId\"><span [innerHTML]=\"label\"></span> <span class=\"required__sign\">*</span></label>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t\t<input [id]=\"uniqueId\" type=\"text\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" [disabled]=\"disabled\" />\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ControlTextareaComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ControlTextareaComponent, _ControlComponent);

  function ControlTextareaComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ControlTextareaComponent.prototype;

  _proto.onInit = function onInit() {
    _ControlComponent.prototype.onInit.call(this);

    this.disabled = this.disabled || false;
  };

  return ControlTextareaComponent;
}(ControlComponent);
ControlTextareaComponent.meta = {
  selector: '[control-textarea]',
  inputs: ['control', 'label', 'disabled'],
  template:
  /* html */
  "\n\t\t<div class=\"group--form--textarea\" [class]=\"{ required: control.validators.length, disabled: disabled }\">\n\t\t\t<label [labelFor]=\"uniqueId\"><span [innerHTML]=\"label\"></span> <span class=\"required__sign\">*</span></label>\n\t\t\t<textarea [id]=\"uniqueId\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" [innerHTML]=\"label\" rows=\"4\" [disabled]=\"disabled\"></textarea>\n\t\t\t<span class=\"required__badge\" [innerHTML]=\"'required' | label\"></span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
};var ErrorsComponent = /*#__PURE__*/function (_ControlComponent) {
  _inheritsLoose(ErrorsComponent, _ControlComponent);

  function ErrorsComponent() {
    return _ControlComponent.apply(this, arguments) || this;
  }

  var _proto = ErrorsComponent.prototype;

  _proto.getLabel = function getLabel(key, value) {
    var label = LabelPipe.transform("error_" + key);
    return label;
  };

  return ErrorsComponent;
}(ControlComponent);
ErrorsComponent.meta = {
  selector: 'errors-component',
  inputs: ['control'],
  template:
  /* html */
  "\n\t<div class=\"inner\" [style]=\"{ display: control.invalid && control.touched ? 'block' : 'none' }\">\n\t\t<div class=\"error\" *for=\"let [key, value] of control.errors\">\n\t\t\t<span [innerHTML]=\"getLabel(key, value)\"></span>\n\t\t\t<!-- <span class=\"key\" [innerHTML]=\"key\"></span> <span class=\"value\" [innerHTML]=\"value | json\"></span> -->\n\t\t</div>\n\t</div>\n\t"
};var TestComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(TestComponent, _Component);

  function TestComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = TestComponent.prototype;

  _proto.onTest = function onTest(event) {
    this.test.next(event);
  };

  _proto.onReset = function onReset(event) {
    this.reset.next(event);
  };

  return TestComponent;
}(rxcomp.Component);
TestComponent.meta = {
  selector: 'test-component',
  inputs: ['form'],
  outputs: ['test', 'reset'],
  template:
  /* html */
  "\n\t<div class=\"test-component\" *if=\"!('production' | flag)\">\n\t\t<div class=\"test-component__title\">development mode</div>\n\t\t<code [innerHTML]=\"form.value | json\"></code>\n\t\t<button type=\"button\" class=\"btn--link\" (click)=\"onTest($event)\"><span>test</span></button>\n\t\t<button type=\"button\" class=\"btn--link\" (click)=\"onReset($event)\"><span>reset</span></button>\n\t</div>\n\t"
};var factories$1 = [ControlCheckboxComponent, ControlCustomSelectComponent, ControlEmailComponent, ControlFileComponent, ControlPasswordComponent, ControlPrivacyComponent, // ControlSelectComponent,
ControlSearchComponent, ControlTextareaComponent, ControlTextComponent, // DisabledDirective,
ErrorsComponent, TestComponent // ValueDirective,
];
var pipes$1 = [];
var ControlsModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(ControlsModule, _Module);

  function ControlsModule() {
    return _Module.apply(this, arguments) || this;
  }

  return ControlsModule;
}(rxcomp.Module);
ControlsModule.meta = {
  imports: [],
  declarations: [].concat(factories$1, pipes$1),
  exports: [].concat(factories$1, pipes$1)
};var CardProductDetailComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CardProductDetailComponent, _Component);

  function CardProductDetailComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = CardProductDetailComponent.prototype;

  _proto.onRequestInfo = function onRequestInfo() {
    ModalService.open$({
      src: environment.template.modal.contactModal,
      data: {
        id: this.id
      }
    }).pipe(operators.first()).subscribe(function (event) {
      console.log('CardProductDetailComponent.open$', event);
    });
  };

  return CardProductDetailComponent;
}(rxcomp.Component);
CardProductDetailComponent.meta = {
  selector: '[card-product-detail]',
  inputs: ['id']
};function push_(event) {
  var dataLayer = window.dataLayer || [];
  dataLayer.push(event);
  console.log('GtmService.dataLayer', event);
}

var GtmService = /*#__PURE__*/function () {
  function GtmService() {}

  GtmService.push = function push(event) {
    return push_(event);
  };

  return GtmService;
}();var FormService = /*#__PURE__*/function () {
  function FormService() {}

  FormService.toOptions = function toOptions(options) {
    options = options.slice().map(function (x) {
      return {
        id: x.value,
        name: x.label
      };
    });
    return options;
  };

  FormService.toSelectOptions = function toSelectOptions(options) {
    options = options.slice().map(function (x) {
      return {
        id: x.value,
        name: x.label
      };
    });
    options.unshift({
      id: null,
      name: 'select'
    });
    return options;
  };

  return FormService;
}();function RequiredIfValidator(fieldName, formGroup, shouldBe) {
  return new rxcompForm.FormValidator(function (value) {
    var field = null;

    if (typeof formGroup === 'function') {
      field = formGroup().get(fieldName);
    } else if (formGroup) {
      field = formGroup.get(fieldName);
    }

    return !value && field && (shouldBe != null ? field.value === shouldBe : field.value != null) ? {
      required: {
        value: value,
        requiredIf: fieldName
      }
    } : null;
  });
}var HttpService = /*#__PURE__*/function () {
  function HttpService() {}

  HttpService.http$ = function http$(method, url, data, format, userPass, options) {
    var _this = this;

    if (userPass === void 0) {
      userPass = null;
    }

    if (options === void 0) {
      options = {};
    }

    var methods = ['POST', 'PUT', 'PATCH'];
    var response_ = null; // url = this.getUrl(url, format);

    options = Object.assign({
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, options, {
      body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
    });

    if (userPass) {
      // options.mode = 'no-cors';
      options.credentials = 'include';
      userPass = window.btoa(userPass);
      options.headers['Authorization'] = "Basic " + userPass;
    }

    options.headers = new Headers(options.headers);
    return rxjs.from(fetch(url, options).then(function (response) {
      response_ = response; // console.log(response);

      try {
        var contentType = response.headers.get('content-type');
        var typedResponse;

        if (contentType && contentType.indexOf('application/json') !== -1) {
          typedResponse = response.json();
        } else {
          typedResponse = response.text();
        }

        if (response.ok) {
          return typedResponse;
        } else {
          return typedResponse.then(function (data) {
            return Promise.reject(data);
          });
        }
      } catch (error) {
        if (response.ok) {
          console.warn('HttpService.http$', 'Cannot parse response');
          return Promise.resolve();
        } else {
          return Promise.reject(error);
        }
      }
    })).pipe(operators.catchError(function (error) {
      return rxjs.throwError(_this.getError(error, response_));
    }));
  }
  /*
  // !!! todo mapping response.data
  static http$(method, url, data, format = 'json') {
  	const methods = ['POST', 'PUT', 'PATCH'];
  	const body = (data && methods.indexOf(method) !== -1) ? JSON.stringify(data) : undefined;
  	const queryString = (data && methods.indexOf(method) !== -1) ? Object.keys(data).map(function(key) {
  		return key + '=' + encodeURI(data[key]);
  	}).join('&') : undefined;
  	if (queryString) {
  		url = `${url}?${queryString}`;
  	}
  	let response_ = null;
  	return from(fetch(url, {
  		method: method,
  		headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'application/json',
  		},
  		body: body,
  	}).then((response) => {
  		response_ = new HttpResponse(response);
  		try {
  			const contentType = response.headers.get('content-type');
  			let typedResponse;
  			if (contentType && format === 'json' && contentType.indexOf('application/json') !== -1) {
  				typedResponse = response.json();
  			} else if (format === 'blob') {
  				typedResponse = response.blob();
  			} else {
  				typedResponse = response.text();
  			}
  			return typedResponse.then(data => {
  				response_.data = data;
  				if (response.ok) {
  					return Promise.resolve(response_);
  				} else {
  					return Promise.reject(response_);
  				}
  			});
  		} catch(error) {
  			if (response.ok) {
  				console.warn('HttpService.http$', 'Cannot parse response');
  				return Promise.resolve(response_);
  			} else {
  				return Promise.reject(this.getError(error, response_));
  			}
  		}
  	})).pipe(
  		catchError(error => {
  			return throwError(this.getError(error, response_));
  		}),
  	);
  }
  */
  ;

  HttpService.get$ = function get$(url, data, format) {
    var query = this.query(data);
    return this.http$('GET', "" + url + query, undefined, format);
  };

  HttpService.delete$ = function delete$(url) {
    return this.http$('DELETE', url);
  };

  HttpService.post$ = function post$(url, data) {
    return this.http$('POST', url, data);
  };

  HttpService.put$ = function put$(url, data) {
    return this.http$('PUT', url, data);
  };

  HttpService.patch$ = function patch$(url, data) {
    return this.http$('PATCH', url, data);
  };

  HttpService.query = function query(data) {
    return ''; // todo
  };

  HttpService.getError = function getError(object, response) {
    var error = typeof object === 'object' ? object : {};

    if (!error.status) {
      error.status = response ? response.status : 0;
    }

    if (!error.statusCode) {
      error.statusCode = response ? response.status : 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = response ? response.statusText : object;
    } // console.log('HttpService.getError', error, response);


    return error;
  };

  return HttpService;
}();var LocationService = /*#__PURE__*/function () {
  function LocationService() {}

  LocationService.has = function has(key) {
    var params = new URLSearchParams(window.location.search); // console.log('LocationService.has', params);

    return params.has(key);
  };

  LocationService.get = function get(key) {
    var params = new URLSearchParams(window.location.search); // console.log('LocationService.get', params);

    return params.get(key);
  };

  LocationService.set = function set(keyOrValue, value) {
    var params = new URLSearchParams(window.location.search);

    if (typeof keyOrValue === 'string') {
      params.set(keyOrValue, value);
    } else {
      params.set(keyOrValue, '');
    }

    this.pushParams(params); // console.log('LocationService.set', params, keyOrValue, value);
  };

  LocationService.pushParams = function pushParams(params) {
    if (window.history && window.history.pushState) {
      var title = document.title;
      var url = window.location.href.split('?')[0] + "?" + params.toString();
      window.history.pushState(params.toString(), title, url);
    }
  };

  LocationService.replace = function replace(from, to) {
    var history = window.history;

    if (history && history.replaceState) {
      var location = window.location;
      var title = document.title;

      if (location.pathname === '/') {
        var url = location.origin + to + location.search;
        history.replaceState(history.state, title, url);
      } else if (location.href.indexOf(from) !== -1) {
        var _url = location.href.replace(from, to);

        history.replaceState(history.state, title, _url);
      }
    }
  };

  LocationService.deserialize = function deserialize(key) {
    var encoded = this.get('params');
    return this.decode(key, encoded);
  };

  LocationService.serialize = function serialize(keyOrValue, value) {
    var params = this.deserialize();
    var encoded = this.encode(keyOrValue, value, params);
    this.set('params', encoded);
  };

  LocationService.decode = function decode(key, encoded) {
    var decoded = null;

    if (encoded) {
      var json = window.atob(encoded);
      decoded = JSON.parse(json);
    }

    if (key && decoded) {
      decoded = decoded[key];
    }

    return decoded || null;
  };

  LocationService.encode = function encode(keyOrValue, value, params) {
    params = params || {};
    var encoded = null;

    if (typeof keyOrValue === 'string') {
      params[keyOrValue] = value;
    } else {
      params = keyOrValue;
    }

    var json = JSON.stringify(params);
    encoded = window.btoa(json);
    return encoded;
  };

  return LocationService;
}();var LanguageService = /*#__PURE__*/function () {
  function LanguageService() {}

  LanguageService.getDefaultLanguages = function getDefaultLanguages() {
    return environment.alternates || [];
  };

  LanguageService.getDefaultLanguage = function getDefaultLanguage() {
    return environment.defaultLanguage || (this.languages ? this.languages[0].lang : null);
  };

  LanguageService.setLanguage = function setLanguage(language) {
    this.selectedLanguage = language.lang;
  };

  LanguageService.setLanguage$ = function setLanguage$(language) {
    var _this = this;

    return rxjs.from(fetch(language.href).then(function (response) {
      return response.text();
    })).pipe(operators.tap(function (html) {
      // console.log('html', html);
      var labelsMatch = /(window\.labels[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*=[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n*[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\{((\{[\s\S]+?\})|[\s\S])+?\})/gm.exec(html);

      if (labelsMatch) {
        // console.log('labels', labelsMatch[0]);
        new Function(labelsMatch[0]).call(window);
        LabelPipe.setLabels();
      }

      var bhereMatch = /(window\.bhere[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*=[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n*[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\{((\{[\s\S]+?\})|[\s\S])+?\})/gm.exec(html);

      if (bhereMatch) {
        // console.log('bhere', bhereMatch[0]);
        var data = {};
        new Function(bhereMatch[0].replace('window', 'this')).call(data);

        if (data.bhere) {
          Utils.merge(environment, data.bhere);
        }
      }

      LocationService.replace(_this.activeLanguage.href, language.href); // console.log(window.labels);

      _this.selectedLanguage = language.lang;
    }));
  };

  LanguageService.toggleLanguages = function toggleLanguages() {
    this.showLanguages = !this.showLanguages;
    this.pushChanges();
  };

  _createClass(LanguageService, null, [{
    key: "hasLanguages",
    get: function get() {
      return this.languages.length > 1;
    }
  }, {
    key: "activeLanguage",
    get: function get() {
      var _this2 = this;

      return this.languages.find(function (language) {
        return language.lang === _this2.selectedLanguage;
      });
    }
  }]);

  return LanguageService;
}();

_defineProperty(LanguageService, "languages", LanguageService.getDefaultLanguages());

_defineProperty(LanguageService, "defaultLanguage", LanguageService.getDefaultLanguage());

_defineProperty(LanguageService, "selectedLanguage", LanguageService.defaultLanguage);var ApiService = /*#__PURE__*/function (_HttpService) {
  _inheritsLoose(ApiService, _HttpService);

  function ApiService() {
    return _HttpService.apply(this, arguments) || this;
  }

  ApiService.get$ = function get$(url, data, format) {
    return _HttpService.get$.call(this, "" + environment.api + url, data, format);
  };

  ApiService.delete$ = function delete$(url) {
    return _HttpService.delete$.call(this, "" + environment.api + url);
  };

  ApiService.post$ = function post$(url, data) {
    return _HttpService.post$.call(this, "" + environment.api + url, data);
  };

  ApiService.put$ = function put$(url, data) {
    return _HttpService.put$.call(this, "" + environment.api + url, data);
  };

  ApiService.patch$ = function patch$(url, data) {
    return _HttpService.patch$.call(this, "" + environment.api + url, data);
  };

  return ApiService;
}(HttpService);

_defineProperty(ApiService, "currentLanguage", LanguageService.activeLanguage);var ContactsService = /*#__PURE__*/function () {
  function ContactsService() {}

  ContactsService.data$ = function data$() {
    if (environment.flags.production) {
      return ApiService.get$('/contacts/data');
    } else {
      return ApiService.get$('/contacts/data.json');
    }
  };

  ContactsService.submit$ = function submit$(payload) {
    if (environment.flags.production) {
      return ApiService.post$('/contacts/submit', payload);
    } else {
      return ApiService.get$('/contacts/submit.json');
    }
  };

  return ContactsService;
}();var ContactModalComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ContactModalComponent, _Component);

  function ContactModalComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ContactModalComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.error = null;
    this.success = false;
    var form = this.form = new rxcompForm.FormGroup({
      firstName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      lastName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      telephone: new rxcompForm.FormControl(null),
      country: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      city: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      message: new rxcompForm.FormControl(null),
      privacy: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredTrueValidator()]),
      newsletter: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      commercial: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      promotion: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      newsletterLanguage: new rxcompForm.FormControl(null, [RequiredIfValidator('newsletter', form)]),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();
    });
    this.load$().pipe(operators.first()).subscribe();
  };

  _proto.load$ = function load$() {
    var _this2 = this;

    return ContactsService.data$().pipe(operators.tap(function (data) {
      var controls = _this2.controls;
      controls.country.options = FormService.toSelectOptions(data.country.options);

      _this2.pushChanges();
    }));
  };

  _proto.test = function test() {
    var form = this.form;
    var controls = this.controls;
    var country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
    form.patch({
      firstName: 'Jhon',
      lastName: 'Appleseed',
      email: 'jhonappleseed@gmail.com',
      telephone: '0721 411112',
      country: country,
      city: 'Pesaro',
      message: 'Hi!',
      privacy: true,
      checkRequest: window.antiforgery,
      checkField: ''
    });
  };

  _proto.reset = function reset() {
    var form = this.form;
    form.reset();
  };

  _proto.onSubmit = function onSubmit(model) {
    var _this3 = this;

    var form = this.form;
    console.log('ContactModalComponent.onSubmit', form.value); // console.log('ContactModalComponent.onSubmit', 'form.valid', valid);

    if (form.valid) {
      // console.log('ContactModalComponent.onSubmit', form.value);
      form.submitted = true;
      ContactsService.submit$(form.value).pipe(operators.first()).subscribe(function (_) {
        _this3.success = true;
        form.reset();
        GtmService.push({
          'event': "Contact",
          'form_name': "Contatti"
        });

        if (form.value.newsletter) {
          GtmService.push({
            'event': "ContactNewsletter",
            'form_name': "ContattiNewsletter"
          });
        }
      }, function (error) {
        console.log('ContactModalComponent.error', error);
        _this3.error = error;

        _this3.pushChanges();
      });
    } else {
      form.touched = true;
    }
  };

  _proto.onClose = function onClose() {
    ModalService.reject();
  };

  return ContactModalComponent;
}(rxcomp.Component);
ContactModalComponent.meta = {
  selector: '[contact-modal]'
};var OpenModallyDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(OpenModallyDirective, _Directive);

  function OpenModallyDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = OpenModallyDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var selector = node.getAttribute('open-modally');
    var target = document.querySelector(selector);

    if (target) {
      target = target.cloneNode(true); // target.parentNode.removeChild(target);

      this.click$(target).pipe(operators.takeUntil(this.unsubscribe$)).subscribe();
    }
  };

  _proto.click$ = function click$(target) {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node,
        module = _getContext2.module;

    return rxjs.fromEvent(node, 'click').pipe(operators.tap(function (_) {
      ModalService.open$({
        src: environment.template.modal.sideModal,
        data: {
          target: target
        }
      }).pipe(operators.first()).subscribe(function (event) {
        console.log('OpenModallyDirective.open$', event);
      });
    }));
  };

  return OpenModallyDirective;
}(rxcomp.Directive);
OpenModallyDirective.meta = {
  selector: '[open-modally]'
};var SideModalComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(SideModalComponent, _Component);

  function SideModalComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = SideModalComponent.prototype;

  _proto.onInit = function onInit() {
    var _getContext = rxcomp.getContext(this),
        parentInstance = _getContext.parentInstance;

    if (parentInstance instanceof ModalOutletComponent) {
      var data = parentInstance.modal.data;

      if (data.target) {
        var _getContext2 = rxcomp.getContext(this),
            node = _getContext2.node,
            module = _getContext2.module;

        var content = node.querySelector('.side-modal__content');
        content.appendChild(data.target);
        var instances = this.instances = module.compile(content);
        console.log('SideModalComponent.onInit', instances);
      }

      console.log('SideModalComponent.onInit', data);
    }
    /*
    this.resize$().pipe(
    	takeUntil(this.unsubscribe$),
    ).subscribe();
    */

  };

  _proto.resize$ = function resize$() {
    var _getContext3 = rxcomp.getContext(this),
        node = _getContext3.node;

    var header = document.querySelector('header');
    return rxjs.fromEvent(window, 'resize').pipe(operators.startWith(function (_) {
      return null;
    }), operators.tap(function (_) {
      node.style.top = header.offsetHeight + "px";
    }));
  };

  _proto.onClose = function onClose() {
    ModalService.reject();
  };

  return SideModalComponent;
}(rxcomp.Component);
SideModalComponent.meta = {
  selector: '[side-modal]'
};var SwiperContentDirective = /*#__PURE__*/function (_SwiperDirective) {
  _inheritsLoose(SwiperContentDirective, _SwiperDirective);

  function SwiperContentDirective() {
    return _SwiperDirective.apply(this, arguments) || this;
  }

  var _proto = SwiperContentDirective.prototype;

  _proto.onInit = function onInit() {
    this.options = {
      slidesPerView: 1,
      spaceBetween: 300,
      speed: 600,
      keyboardControl: true,
      mousewheelControl: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      navigation: {
        prevEl: '.btn--prev',
        nextEl: '.btn--next'
      }
    };
    this.init_(); // console.log('SwiperContentDirective.onInit');
  };

  return SwiperContentDirective;
}(SwiperDirective);
SwiperContentDirective.meta = {
  selector: '[swiper-content]'
};var SwiperGalleryDirective = /*#__PURE__*/function (_SwiperDirective) {
  _inheritsLoose(SwiperGalleryDirective, _SwiperDirective);

  function SwiperGalleryDirective() {
    return _SwiperDirective.apply(this, arguments) || this;
  }

  var _proto = SwiperGalleryDirective.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    console.log(this.initialSlide);
    this.options = {
      initialSlide: this.initialSlide,
      slidesPerView: 1,
      spaceBetween: 80,
      speed: 600,
      keyboardControl: true,
      mousewheelControl: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      navigation: {
        prevEl: '.btn--gallery-prev',
        nextEl: '.btn--gallery-next'
      }
    };
    this.init_();
    setTimeout(function () {
      _this.swiper.slideTo(_this.initialSlide, 0);
    }, 100); // console.log('SwiperContentDirective.onInit');
  };

  return SwiperGalleryDirective;
}(SwiperDirective);
SwiperGalleryDirective.meta = {
  selector: '[swiper-gallery]',
  inputs: ['items', 'initialSlide']
};var SwiperMainDirective = /*#__PURE__*/function (_SwiperDirective) {
  _inheritsLoose(SwiperMainDirective, _SwiperDirective);

  function SwiperMainDirective() {
    return _SwiperDirective.apply(this, arguments) || this;
  }

  var _proto = SwiperMainDirective.prototype;

  _proto.onInit = function onInit() {
    this.options = {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      autoplay: {
        delay: 5000
      },
      keyboardControl: true,
      mousewheelControl: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      pagination: {
        el: '.main-hero__bullets',
        clickable: true
      },
      navigation: {
        prevEl: '.btn--up',
        nextEl: '.btn--down'
      }
    };
    this.init_(); // console.log('SwiperMainDirective.onInit');
  };

  return SwiperMainDirective;
}(SwiperDirective);
SwiperMainDirective.meta = {
  selector: '[swiper-main]'
};var SwiperToolkitDirective = /*#__PURE__*/function (_SwiperDirective) {
  _inheritsLoose(SwiperToolkitDirective, _SwiperDirective);

  function SwiperToolkitDirective() {
    return _SwiperDirective.apply(this, arguments) || this;
  }

  var _proto = SwiperToolkitDirective.prototype;

  _proto.onInit = function onInit() {
    this.options = {
      slidesPerView: 1,
      spaceBetween: 60,
      speed: 600,
      autoplay: {
        delay: 5000
      },
      keyboardControl: true,
      mousewheelControl: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      }
    };
    this.init_(); // console.log('SwiperToolkitDirective.onInit');
  };

  return SwiperToolkitDirective;
}(SwiperDirective);
SwiperToolkitDirective.meta = {
  selector: '[swiper-toolkit]'
};var ErrorComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ErrorComponent, _Component);

  function ErrorComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ErrorComponent.prototype;

  _proto.onInit = function onInit() {
    this.showDetail = false; // console.log('ErrorComponent.onInit', this.error);
  };

  _proto.onDetailToggle = function onDetailToggle() {
    this.showDetail = !this.showDetail;
    this.pushChanges();
  };

  return ErrorComponent;
}(rxcomp.Component);
ErrorComponent.meta = {
  selector: 'error-component',
  inputs: ['error'],
  template:
  /* html */
  "\n\t<div class=\"error\" (click)=\"onDetailToggle($event)\">\n\t\t<div class=\"status\">Error <span [innerHTML]=\"error.status\"></span></div>\n\t\t<div class=\"exception-message\" [innerHTML]=\"error.exceptionMessage\"></div>\n\t\t<button type=\"button\" class=\"btn--detail\"><svg class=\"caret-down\"><use xlink:href=\"#caret-down\"></use></svg></button>\n\t</div>\n\t<div class=\"error-details\" *if=\"showDetail\">\n\t\t<div class=\"message\" [innerHTML]=\"error.message\"></div>\n\t\t<div class=\"exception-type\" [innerHTML]=\"error.exceptionType\"></div>\n\t\t<div class=\"stack-trace\" [innerHTML]=\"error.stackTrace\"></div>\n\t</div>\n\t"
};var MenuService = /*#__PURE__*/function () {
  function MenuService() {}

  MenuService.setMenu = function setMenu(id) {
    this.menu$_.next(id);
  };

  MenuService.toggleMenu = function toggleMenu(id) {
    this.menu$_.next(this.currentMenu === id ? -1 : id);
  };

  MenuService.onBack = function onBack() {
    this.menu$_.next(-1);
  };

  MenuService.menu$ = function menu$() {
    return this.menu$_;
  };

  _createClass(MenuService, null, [{
    key: "currentMenu",
    get: function get() {
      return this.menu$_.getValue();
    }
  }]);

  return MenuService;
}();

_defineProperty(MenuService, "menu$_", new rxjs.BehaviorSubject(-1));var HeaderService = /*#__PURE__*/function () {
  function HeaderService() {}

  HeaderService.setHeader = function setHeader(id) {
    this.header$_.next(id);
  };

  HeaderService.toggleHeader = function toggleHeader(id) {
    this.header$_.next(this.currentHeader === id ? -1 : id);
  };

  HeaderService.onBack = function onBack() {
    this.header$_.next(-1);
  };

  HeaderService.header$ = function header$() {
    return this.header$_;
  };

  _createClass(HeaderService, null, [{
    key: "currentHeader",
    get: function get() {
      return this.header$_.getValue();
    }
  }]);

  return HeaderService;
}();

_defineProperty(HeaderService, "header$_", new rxjs.BehaviorSubject(-1));var HeaderComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(HeaderComponent, _Component);

  function HeaderComponent() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "direction_", null);

    _defineProperty(_assertThisInitialized(_this), "scrolled_", null);

    return _this;
  }

  var _proto = HeaderComponent.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;

    var body = document.querySelector('body');
    this.header = HeaderService.currentHeader;
    HeaderService.header$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (header) {
      _this2.header = header;

      _this2.pushChanges();

      body.setAttribute('class', header !== -1 ? header + "-active" : '');
    });
    this.menu = MenuService.currentMenu;
    MenuService.menu$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (menu) {
      _this2.menu = menu;

      _this2.pushChanges();
    });
    ScrollService.scroll$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      _this2.direction = event.direction;
      _this2.scrolled = event.scroll.y > 100; // console.log('HeaderComponent', event.scroll.y, event.direction, event.speed);
    });
  };

  _proto.onToggle = function onToggle(id) {
    MenuService.onBack();
    HeaderService.toggleHeader(id);
  };

  _proto.onMenu = function onMenu(id) {
    MenuService.setMenu(id);
  };

  _proto.onBack = function onBack(event) {
    MenuService.onBack();
  };

  _createClass(HeaderComponent, [{
    key: "direction",
    get: function get() {
      return this.direction_;
    },
    set: function set(direction) {
      if (this.direction_ !== direction) {
        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        node.classList.remove("scrolling-" + this.direction_);
        node.classList.add("scrolling-" + direction);
        this.direction_ = direction;
      }
    }
  }, {
    key: "scrolled",
    get: function get() {
      return this.scrolled_;
    },
    set: function set(scrolled) {
      if (this.scrolled_ !== scrolled) {
        this.scrolled_ = scrolled;

        var _getContext2 = rxcomp.getContext(this),
            node = _getContext2.node;

        scrolled ? node.classList.add("scrolled") : node.classList.remove("scrolled");
      }
    }
  }]);

  return HeaderComponent;
}(rxcomp.Component);
HeaderComponent.meta = {
  selector: '[header]'
};var NewsletterPropositionComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(NewsletterPropositionComponent, _Component);

  function NewsletterPropositionComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = NewsletterPropositionComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var form = this.form = new rxcompForm.FormGroup({
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()])
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();
    });
  };

  _proto.onNewsletter = function onNewsletter(event) {
    console.log('NewsletterPropositionComponent.onNewsletter', this.form.value);
    var encoded = LocationService.encode('email', this.form.value.email, {});
    window.location.href = this.action + "?params=" + encoded;
  };

  return NewsletterPropositionComponent;
}(rxcomp.Component);
NewsletterPropositionComponent.meta = {
  selector: '[newsletter-proposition]',
  inputs: ['action']
};var SwitchComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(SwitchComponent, _Component);

  function SwitchComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = SwitchComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var over = false;

    var onResize = function onResize() {
      node.style.clipPath = over ? _this.overPath : _this.path;
    };

    var onOver = function onOver() {
      over = true;
      gsap.to(node, {
        duration: 0.5,
        ease: Elastic.easeOut,
        'clip-path': _this.overPath
      });
    };

    var onOut = function onOut() {
      over = false;
      gsap.to(node, {
        duration: 0.5,
        ease: Elastic.easeOut,
        'clip-path': _this.path
      });
    };

    onResize();
    window.addEventListener('resize', onResize);
    node.addEventListener('mouseover', onOver);
    node.addEventListener('mouseout', onOut);
  };

  _createClass(SwitchComponent, [{
    key: "path",
    get: function get() {
      var w = 40;
      var h = window.innerHeight;
      return "path('M0,0 L" + w + ",0 C" + w + "," + h * .25 + "," + w + "," + h * .75 + "," + w + "," + h + " L" + w + "," + h + " L0," + h + " L0,0 Z')";
    }
  }, {
    key: "overPath",
    get: function get() {
      var w = 40;
      var w2 = 60;
      var h = window.innerHeight;
      return "path('M0,0 L" + w + ",0 C" + w2 + "," + h * .25 + "," + w2 + "," + h * .75 + "," + w + "," + h + " L" + w + "," + h + " L0," + h + " L0,0 Z')";
    }
  }]);

  return SwitchComponent;
}(rxcomp.Component);
SwitchComponent.meta = {
  selector: '[switch]'
};var SessionStorageService = /*#__PURE__*/function () {
  function SessionStorageService() {}

  SessionStorageService.delete = function _delete(name) {
    if (this.isSessionStorageSupported()) {
      window.sessionStorage.removeItem(name);
    }
  };

  SessionStorageService.exist = function exist(name) {
    if (this.isSessionStorageSupported()) {
      return window.sessionStorage[name] !== undefined;
    }
  };

  SessionStorageService.get = function get(name) {
    var value = null;

    if (this.isSessionStorageSupported() && window.sessionStorage[name] !== undefined) {
      try {
        value = JSON.parse(window.sessionStorage[name]);
      } catch (e) {
        console.log('SessionStorageService.get.error parsing', name, e);
      }
    }

    return value;
  };

  SessionStorageService.set = function set(name, value) {
    if (this.isSessionStorageSupported()) {
      try {
        var cache = [];
        var json = JSON.stringify(value, function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }

            cache.push(value);
          }

          return value;
        });
        window.sessionStorage.setItem(name, json);
      } catch (e) {
        console.log('SessionStorageService.set.error serializing', name, value, e);
      }
    }
  };

  SessionStorageService.isSessionStorageSupported = function isSessionStorageSupported() {
    if (this.supported) {
      return true;
    }

    var supported = false;

    try {
      supported = 'sessionStorage' in window && window.sessionStorage !== null;

      if (supported) {
        window.sessionStorage.setItem('test', '1');
        window.sessionStorage.removeItem('test');
      } else {
        supported = false;
      }
    } catch (e) {
      supported = false;
    }

    this.supported = supported;
    return supported;
  };

  return SessionStorageService;
}();var UserViews = {
  SIGN_IN: 1,
  SIGN_UP: 2,
  FORGOTTEN: 3,
  EDIT: 4
};
var User = /*#__PURE__*/function () {
  function User(data) {
    if (data) {
      Object.assign(this, data);
    }
  }

  _createClass(User, [{
    key: "shortName",
    get: function get() {
      return (this.firstName || '?').substr(0, 1).toUpperCase() + (this.lastName || '?').substr(0, 1).toUpperCase();
    }
  }, {
    key: "fullName",
    get: function get() {
      return this.firstName + ' ' + this.lastName;
    }
  }]);

  return User;
}();
var UserService = /*#__PURE__*/function () {
  function UserService() {}

  UserService.setUser = function setUser(user) {
    if (user) {
      SessionStorageService.set('user', user);
    } else {
      SessionStorageService.delete('user');
    }

    this.user$_.next(user);
  };

  UserService.data$ = function data$() {
    if (environment.flags.production) {
      return ApiService.get$('/aquafil/user/data');
    } else {
      return ApiService.get$('/user/data.json');
    }
  };

  UserService.forgot$ = function forgot$(payload) {
    if (environment.flags.production) {
      return ApiService.post$('/aquafil/user/forgot', payload);
    } else {
      return ApiService.get$("/user/forgot.json");
    }
  };

  UserService.me$ = function me$() {
    var _this = this;

    if (UserService.busyMe) {
      return this.user$_;
    } else {
      UserService.busyMe = true;
      return rxjs.of(1).pipe(operators.switchMap(function (_) {
        if (environment.flags.production) {
          return ApiService.get$("/aquafil/user/me");
        } else {
          var sessionUser = SessionStorageService.get('user');

          if (sessionUser) {
            return rxjs.of(sessionUser);
          } else {
            return ApiService.get$("/user/me.json");
          }
        }
      }), operators.map(function (user) {
        console.log('UserService.user$', user);
        return _this.mapUser(user);
      }), operators.catchError(function (_) {
        return rxjs.of(null);
      }), operators.switchMap(function (user) {
        _this.setUser(user);

        return _this.user$_;
      }));
    }
  };

  UserService.signin$ = function signin$(payload) {
    var _this2 = this;

    return (environment.flags.production ? ApiService.post$("/aquafil/user/signin", payload) : ApiService.get$("/user/signin.json")).pipe(operators.map(function (response) {
      return _this2.mapUser(response);
    }), operators.tap(function (user) {
      return _this2.setUser(user);
    }));
  };

  UserService.signout$ = function signout$() {
    var _this3 = this;

    return (environment.flags.production ? ApiService.post$("/aquafil/user/signout") : ApiService.get$("/user/signout.json")).pipe(operators.tap(function (_) {
      return _this3.setUser(null);
    }));
  };

  UserService.signup$ = function signup$(payload) {
    var _this4 = this;

    // console.log('UserService.signup$', payload);
    return (environment.flags.production ? ApiService.post$("/aquafil/user/signup", payload) : ApiService.get$("/user/signup.json")).pipe(operators.map(function (response) {
      response.user = _this4.mapUser(response.user);
      return response;
    }), operators.tap(function (response) {
      return _this4.setUser(response.user);
    }) //document.location.reload(),
    );
  };

  UserService.edit$ = function edit$(payload) {
    var _this5 = this;

    // console.log('UserService.edit$', payload);
    return (environment.flags.production ? ApiService.post$("/aquafil/user/edit", payload) : ApiService.get$("/user/edit.json")).pipe(operators.map(function (response) {
      response.user = _this5.mapUser(response.user);
      return response;
    }), operators.tap(function (response) {
      return _this5.setUser(response.user);
    }) //document.location.reload(),
    );
  };

  UserService.editPassword$ = function editPassword$(payload) {
    // console.log('UserService.editPassword$', payload);
    return environment.flags.production ? ApiService.post$("/aquafil/user/edit-password", payload) : ApiService.get$("/user/edit-password.json");
  };

  UserService.accessData$ = function accessData$(payload) {
    // console.log('UserService.accessData$', payload);
    return environment.flags.production ? ApiService.post$("/aquafil/user/access-data", payload) : ApiService.get$("/user/access-data.json");
  };

  UserService.delete$ = function delete$(payload) {
    // console.log('UserService.delete$', payload);
    return environment.flags.production ? ApiService.post$("/aquafil/user/delete", payload) : ApiService.get$("/user/delete.json");
  };

  UserService.gdpr$ = function gdpr$() {
    if (environment.flags.production) {
      return ApiService.get$('/aquafil/user/gdpr');
    } else {
      return ApiService.get$('/user/gdpr.json');
    }
  };

  UserService.tryFacebook$ = function tryFacebook$(me) {
    return rxjs.of(null);
  };

  UserService.tryGoogle$ = function tryGoogle$(me) {
    return rxjs.of(null);
  };

  UserService.tryLinkedin$ = function tryLinkedin$(me) {
    return rxjs.of(null);
  };

  UserService.sessionStorage$ = function sessionStorage$() {
    return rxjs.of(SessionStorageService.get('user') || null);
  };

  UserService.mapUser = function mapUser(user) {
    return user ? new User(user) : null;
  };

  UserService.mapUsers = function mapUsers(users) {
    return users ? users.map(function (x) {
      return UserService.mapUser(x);
    }) : [];
  };

  _createClass(UserService, null, [{
    key: "currentUser",
    get: function get() {
      return this.user$_.getValue();
    }
  }]);

  return UserService;
}();

_defineProperty(UserService, "user$_", new rxjs.BehaviorSubject(null));var UserDeleteComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserDeleteComponent, _Component);

  function UserDeleteComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserDeleteComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.error = null;
    this.success = false;
    var form = this.form = new rxcompForm.FormGroup({
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      password: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();

      LocomotiveScrollService.update();
    });
    UserService.me$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (user) {
      if (user) {
        form.patch({
          email: user.email
        }, true);
      }
    });
  };

  _proto.onSubmit = function onSubmit() {
    var _this2 = this;

    var form = this.form;
    console.log('UserDeleteComponent.onSubmit', form.value);

    if (form.valid) {
      form.submitted = true;
      UserService.delete$(form.value).pipe(operators.first(), operators.switchMap(function (_) {
        return UserService.signout$();
      })).subscribe(function (response) {
        console.log('UserDeleteComponent.onSubmit', response);
        _this2.success = true;
        GtmService.push({
          'event': "AccessData",
          'form_name': "AccessData"
        });
        form.reset();
      }, function (error) {
        console.log('UserDeleteComponent.error', error);
        _this2.error = error;
        form.submitted = false;

        _this2.pushChanges();

        LocomotiveScrollService.update();
      });
    } else {
      form.touched = true;
    }
  };

  return UserDeleteComponent;
}(rxcomp.Component);
UserDeleteComponent.meta = {
  selector: '[user-delete]'
};var UserDetailComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserDetailComponent, _Component);

  function UserDetailComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserDetailComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.countries = [];
    this.occupations = [];
    this.newsletterLanguages = [];
    this.gdpr = [];
    UserService.me$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (user) {
      _this.user = user;

      _this.pushChanges();
    });
    this.load$().pipe(operators.first(), operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  _proto.load$ = function load$() {
    var _this2 = this;

    return rxjs.combineLatest([UserService.data$(), UserService.gdpr$()]).pipe(operators.tap(function (datas) {
      var data = datas[0];
      _this2.countries = data.country.options;
      _this2.occupations = data.occupation.options;
      _this2.newsletterLanguages = data.newsletterLanguage.options;
      var gdpr = datas[1];
      _this2.gdpr = gdpr;

      _this2.pushChanges();
    }));
  };

  _proto.onModalUserUpdate = function onModalUserUpdate(event) {
    // console.log('UserDetailComponent.onModalUserUpdate');
    ModalService.open$({
      src: environment.template.modal.userModal,
      data: {
        view: 4
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {// console.log('UserDetailComponent.onModalSignUp', event);
    });
  };

  _proto.onModalGdpr = function onModalGdpr(legalNote) {
    // console.log('UserDetailComponent.onModalUserUpdate');
    ModalService.open$({
      src: environment.template.modal.genericModal,
      data: {
        title: legalNote.title,
        description: legalNote.description
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {// console.log('UserDetailComponent.onModalGdpr', event);
    });
  };

  _createClass(UserDetailComponent, [{
    key: "countryName",
    get: function get() {
      var _this3 = this;

      var countryName = null;

      if (this.user && this.countries.length) {
        var country = this.countries.find(function (x) {
          return x.value === _this3.user.country;
        });

        if (country) {
          countryName = country.label;
        }
      }

      return countryName;
    }
  }, {
    key: "occupationName",
    get: function get() {
      var _this4 = this;

      var occupationName = null;

      if (this.user && this.occupations.length) {
        var occupation = this.occupations.find(function (x) {
          return x.value === _this4.user.occupation;
        });

        if (occupation) {
          occupationName = occupation.label;
        }
      }

      return occupationName;
    }
  }, {
    key: "newsletterLanguageName",
    get: function get() {
      var _this5 = this;

      var newsletterLanguageName = null;

      if (this.user && this.newsletterLanguages.length) {
        var newsletterLanguage = this.newsletterLanguages.find(function (x) {
          return x.value === _this5.user.newsletterLanguage;
        });

        if (newsletterLanguage) {
          newsletterLanguageName = newsletterLanguage.label;
        }
      }

      return newsletterLanguageName;
    }
  }]);

  return UserDetailComponent;
}(rxcomp.Component);
UserDetailComponent.meta = {
  selector: '[user-detail]'
};var UserEditPasswordComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserEditPasswordComponent, _Component);

  function UserEditPasswordComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserEditPasswordComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.error = null;
    this.success = false;
    var form = this.form = new rxcompForm.FormGroup({
      tokenEncoded: this.tokenEncoded,
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      password: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();

      LocomotiveScrollService.update();
    });
  };

  _proto.onSubmit = function onSubmit() {
    var _this2 = this;

    var form = this.form;
    console.log('UserEditPasswordComponent.onSubmit', form.value);

    if (form.valid) {
      form.submitted = true;
      UserService.editPassword$(form.value).pipe(operators.first(), operators.switchMap(function (_) {
        return UserService.signout$();
      })).subscribe(function (response) {
        console.log('UserEditPasswordComponent.onSubmit', response);
        _this2.success = true;
        GtmService.push({
          'event': "EditPassword",
          'form_name': "EditPassword"
        });
        form.reset();
      }, function (error) {
        console.log('UserEditPasswordComponent.error', error);
        _this2.error = error;
        form.submitted = false;

        _this2.pushChanges();

        LocomotiveScrollService.update();
      });
    } else {
      form.touched = true;
    }
  };

  return UserEditPasswordComponent;
}(rxcomp.Component);
UserEditPasswordComponent.meta = {
  selector: '[user-edit-password]',
  inputs: ['tokenEncoded']
};var UserEditComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserEditComponent, _Component);

  function UserEditComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserEditComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.user = null;
    this.error = null;
    this.success = false;
    this.responseMessage = null;
    var form = this.form = new rxcompForm.FormGroup({
      firstName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      lastName: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      country: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      city: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      company: new rxcompForm.FormControl(null),
      occupation: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      privacy: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredTrueValidator()]),
      newsletter: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      commercial: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      promotion: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      newsletterLanguage: new rxcompForm.FormControl(null, [RequiredIfValidator('newsletter', form)]),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();

      LocomotiveScrollService.update();
    });
    this.load$().pipe(operators.first(), operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  _proto.load$ = function load$() {
    var _this2 = this;

    return rxjs.combineLatest([UserService.data$(), UserService.me$()]).pipe(operators.tap(function (results) {
      var data = results[0];
      var controls = _this2.controls;
      controls.country.options = FormService.toSelectOptions(data.country.options);
      controls.occupation.options = FormService.toSelectOptions(data.occupation.options);
      controls.newsletterLanguage.options = FormService.toSelectOptions(data.newsletterLanguage.options);
      var user = results[1];
      _this2.user = user;

      if (user) {
        var form = _this2.form;
        form.patch(user, true);
      }

      _this2.pushChanges();
    }));
  };

  _proto.test = function test() {
    var form = this.form;
    var controls = this.controls;
    var country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
    var occupation = controls.occupation.options.length > 1 ? controls.occupation.options[1].id : null;
    form.patch({
      firstName: 'Jhon',
      lastName: 'Appleseed',
      country: country,
      city: 'Pesaro',
      company: 'Websolute',
      occupation: occupation,
      email: 'jhonappleseed@gmail.com',
      privacy: true
    });
  };

  _proto.reset = function reset() {
    var form = this.form;
    form.reset();
  };

  _proto.onSubmit = function onSubmit() {
    var _this3 = this;

    this.responseMessage = null;
    var form = this.form;
    console.log('UserEditComponent.onSubmit', form.value);

    if (form.valid) {
      form.submitted = true;
      UserService.edit$(form.value).pipe(operators.first()).subscribe(function (response) {
        console.log('UserEditComponent.onSubmit', response);
        _this3.responseMessage = response.responseMessage;
        _this3.success = true;
        /*
        GtmService.push({
        	'event': "Registration",
        	'form_name': "Registrazione"
        });
        */

        form.reset();
      }, function (error) {
        console.log('UserEditComponent.error', error);
        _this3.error = error;
        form.submitted = false;

        _this3.pushChanges();

        LocomotiveScrollService.update();
      });
    } else {
      form.touched = true;
    }
  };

  return UserEditComponent;
}(rxcomp.Component);
UserEditComponent.meta = {
  selector: '[user-edit]'
};var UserForgotComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserForgotComponent, _Component);

  function UserForgotComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserForgotComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.error = null;
    this.success = false;
    var form = this.form = new rxcompForm.FormGroup({
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();

      LocomotiveScrollService.update();
    });
  };

  _proto.test = function test() {
    var form = this.form;
    form.patch({
      email: 'jhonappleseed@gmail.com'
    });
  };

  _proto.reset = function reset() {
    var form = this.form;
    form.reset();
  };

  _proto.onSubmit = function onSubmit() {
    var _this2 = this;

    var form = this.form;
    console.log('UserForgotComponent.onSubmit', form.value);

    if (form.valid) {
      form.submitted = true;
      UserService.forgot$(form.value).pipe(operators.first()).subscribe(function (response) {
        console.log('UserForgotComponent.onSubmit', response);
        _this2.success = true;
        GtmService.push({
          'event': "Forgot",
          'form_name': "Recupero Password"
        });
        form.reset();

        _this2.forgot.next(true);
      }, function (error) {
        console.log('UserForgotComponent.error', error);
        _this2.error = error;
        form.submitted = false;

        _this2.pushChanges();

        LocomotiveScrollService.update();
      });
    } else {
      form.touched = true;
    }
  };

  _proto.onSignIn = function onSignIn() {
    this.viewSignIn.next();
  };

  _proto.onSignUp = function onSignUp() {
    this.viewSignUp.next();
  };

  return UserForgotComponent;
}(rxcomp.Component);
UserForgotComponent.meta = {
  selector: '[user-forgot]',
  outputs: ['forgot', 'viewSignIn', 'viewSignUp']
};var UserComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserComponent, _Component);

  function UserComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserComponent.prototype;

  _proto.onInit = function onInit() {
    this.views = UserViews;
    this.view = this.view || UserViews.SIGN_UP;
  };

  _proto.onModalSignIn = function onModalSignIn(event) {
    // console.log('UserComponent.onModalSignIn');
    ModalService.open$({
      src: environment.template.modal.userModal,
      data: {
        view: 1
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      console.log('UserComponent.onModalSignIn', event);
    });
  };

  _proto.onModalSignUp = function onModalSignUp(event) {
    // console.log('UserComponent.onModalSignUp');
    ModalService.open$({
      src: environment.template.modal.userModal,
      data: {
        view: 2,
        skipAutoClose: true
      }
    }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      console.log('UserComponent.onModalSignUp', event);
    });
  };

  _proto.setView = function setView(view) {
    this.view = view;
    this.pushChanges();

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    LocomotiveScrollService.scrollTo(node, {
      offset: -100
    });
  };

  _proto.onViewSignIn = function onViewSignIn(event) {
    // console.log('UserComponent.onViewSignIn');
    this.setView(UserViews.SIGN_IN);
  };

  _proto.onViewSignUp = function onViewSignUp(event) {
    // console.log('UserComponent.onViewSignIn');
    this.setView(UserViews.SIGN_UP);
  };

  _proto.onViewForgot = function onViewForgot(event) {
    // console.log('UserComponent.onViewForgot');
    this.setView(UserViews.FORGOTTEN);
  };

  _proto.onSignIn = function onSignIn(user) {
    console.log('UserComponent.onSignIn', user);
    UserService.setUser(user);

    if (this.navTo) {
      window.location.href = this.navTo;
    } // nav to profile

  };

  _proto.onSignUp = function onSignUp(user) {
    console.log('UserComponent.onSignUp', user);
    UserService.setUser(user);

    if (this.navTo) {
      window.location.href = this.navTo;
    } // nav to profile

  };

  _proto.onForgot = function onForgot(email) {
    /*
    console.log('UserComponent.onForgot', email);
    this.setView(UserViews.SIGN_IN);
    */
  };

  return UserComponent;
}(rxcomp.Component);
UserComponent.meta = {
  selector: '[user]',
  inputs: ['navTo', 'view']
};var UserModalComponent = /*#__PURE__*/function (_UserComponent) {
  _inheritsLoose(UserModalComponent, _UserComponent);

  function UserModalComponent() {
    return _UserComponent.apply(this, arguments) || this;
  }

  var _proto = UserModalComponent.prototype;

  _proto.onInit = function onInit() {
    _UserComponent.prototype.onInit.call(this);

    var _getContext = rxcomp.getContext(this),
        parentInstance = _getContext.parentInstance;

    if (parentInstance instanceof ModalOutletComponent) {
      var data = parentInstance.modal.data;
      this.view = data.view;
      this.me = data.me;
      this.skipAutoClose = data.skipAutoClose; // console.log('UserModalComponent.onInit', data);
    }

    LocomotiveScrollService.stop();
  };

  _proto.setView = function setView(view) {
    this.view = view;
    this.pushChanges();

    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var target = window.innerWidth >= 1024 ? node.querySelector('.modal__inner') : node;
    target.scrollTo(0, 0);
  };

  _proto.onViewForgot = function onViewForgot() {
    console.log('UserModalComponent.onViewForgot');
    this.setView(UserViews.FORGOTTEN);
  };

  _proto.onViewSignIn = function onViewSignIn() {
    console.log('UserModalComponent.onViewSignIn');
    this.setView(UserViews.SIGN_IN);
  };

  _proto.onViewSignUp = function onViewSignUp() {
    console.log('UserModalComponent.onViewSignUp');
    this.setView(UserViews.SIGN_UP);
  };

  _proto.onClose = function onClose() {
    ModalService.reject();
  };

  _proto.onSignUp = function onSignUp(user) {
    // console.log('UserModalComponent.onSignUp', user);
    if (!this.skipAutoClose) {
      ModalService.resolve(user);
    }
  };

  _proto.onSignIn = function onSignIn(user) {
    // console.log('UserModalComponent.onSignIn', user);
    ModalService.resolve(user);
  };

  _proto.onDestroy = function onDestroy() {
    LocomotiveScrollService.start();
  };

  return UserModalComponent;
}(UserComponent);
UserModalComponent.meta = {
  selector: '[user-modal]'
};var UserSigninComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserSigninComponent, _Component);

  function UserSigninComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserSigninComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.error = null;
    this.success = false;
    var form = this.form = new rxcompForm.FormGroup({
      email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      password: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();

      LocomotiveScrollService.update();
    });
  };

  _proto.test = function test() {
    var form = this.form;
    form.patch({
      email: 'jhonappleseed@gmail.com',
      password: '********'
    });
  };

  _proto.reset = function reset() {
    var form = this.form;
    form.reset();
  };

  _proto.onSubmit = function onSubmit() {
    var _this2 = this;

    var form = this.form;
    console.log('UserSigninComponent.onSubmit', form.value);

    if (form.valid) {
      form.submitted = true;
      UserService.signin$(form.value).pipe(operators.first()).subscribe(function (response) {
        console.log('UserSigninComponent.onSubmit', response);
        _this2.success = true;
        GtmService.push({
          'event': "Signin",
          'form_name': "Login"
        });
        form.reset();

        _this2.signIn.next(response);
      }, function (error) {
        console.log('UserSigninComponent.error', error);
        _this2.error = error;
        form.submitted = false;

        _this2.pushChanges();

        LocomotiveScrollService.update();
      });
    } else {
      form.touched = true;
    }
  };

  _proto.onForgot = function onForgot(event) {
    this.viewForgot.next();
  };

  _proto.onSignUp = function onSignUp(event) {
    this.viewSignUp.next();
  };

  return UserSigninComponent;
}(rxcomp.Component);
UserSigninComponent.meta = {
  selector: '[user-signin]',
  outputs: ['signIn', 'viewForgot', 'viewSignUp']
};function MatchValidator(fieldName, formGroup) {
  return new rxcompForm.FormValidator(function (value) {
    var field = formGroup ? formGroup.get(fieldName) : null;

    if (!value || !field) {
      return null;
    }

    return value !== field.value ? {
      match: {
        value: value,
        match: field.value
      }
    } : null;
  });
}var UserSignupComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(UserSignupComponent, _Component);

  function UserSignupComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = UserSignupComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.me = this.me || {};
    this.user = this.user || null;
    this.error = null;
    this.success = false;
    this.responseMessage = null;
    var form = this.form = new rxcompForm.FormGroup({
      firstName: new rxcompForm.FormControl(this.me.firstName || null, [rxcompForm.Validators.RequiredValidator()]),
      lastName: new rxcompForm.FormControl(this.me.lastName || null, [rxcompForm.Validators.RequiredValidator()]),
      country: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      city: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      company: new rxcompForm.FormControl(null),
      occupation: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      email: new rxcompForm.FormControl(this.me.email || null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
      password: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      passwordConfirm: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), MatchValidator('password', form)]),
      privacy: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredTrueValidator()]),
      newsletter: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      commercial: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      promotion: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
      newsletterLanguage: new rxcompForm.FormControl(null, [RequiredIfValidator('newsletter', form)]),
      checkRequest: window.antiforgery,
      checkField: ''
    });
    var controls = this.controls = form.controls;
    form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (_) {
      _this.pushChanges();

      LocomotiveScrollService.update();
    });
    this.load$().pipe(operators.first(), operators.takeUntil(this.unsubscribe$)).subscribe();
  };

  _proto.load$ = function load$() {
    var _this2 = this;

    return UserService.data$().pipe(operators.tap(function (data) {
      var controls = _this2.controls;
      controls.country.options = FormService.toSelectOptions(data.country.options);
      controls.occupation.options = FormService.toSelectOptions(data.occupation.options);
      controls.newsletterLanguage.options = FormService.toSelectOptions(data.newsletterLanguage.options);

      _this2.pushChanges();
    }));
  };

  _proto.test = function test() {
    var form = this.form;
    var controls = this.controls;
    var country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
    var occupation = controls.occupation.options.length > 1 ? controls.occupation.options[1].id : null;
    form.patch({
      firstName: 'Jhon',
      lastName: 'Appleseed',
      country: country,
      city: 'Pesaro',
      company: 'Websolute',
      occupation: occupation,
      email: 'jhonappleseed@gmail.com',
      password: '********',
      passwordConfirm: '********',
      privacy: true,
      newsletter: false,
      commercial: false,
      promotion: false
    });
  };

  _proto.reset = function reset() {
    var form = this.form;
    form.reset();
  };

  _proto.onSubmit = function onSubmit() {
    var _this3 = this;

    this.responseMessage = null;
    var form = this.form;
    console.log('UserSignupComponent.onSubmit', form.value);

    if (form.valid) {
      form.submitted = true;
      UserService.signup$(form.value).pipe(operators.first()).subscribe(function (response) {
        console.log('UserSignupComponent.onSubmit', response);
        _this3.responseMessage = response.responseMessage;
        _this3.success = true;
        GtmService.push({
          'event': "Registration",
          'form_name': "Registrazione"
        });
        form.reset();

        _this3.signUp.next(response.user);
      }, function (error) {
        console.log('UserSignupComponent.error', error);
        _this3.error = error;
        form.submitted = false;

        _this3.pushChanges();

        LocomotiveScrollService.update();
      });
    } else {
      form.touched = true;
    }
  };

  _proto.onSignIn = function onSignIn() {
    this.viewSignIn.next();
  };

  return UserSignupComponent;
}(rxcomp.Component);
UserSignupComponent.meta = {
  selector: '[user-signup]',
  outputs: ['signUp', 'viewSignIn'],
  inputs: ['me', 'user']
};var factories$2 = [ErrorComponent, HeaderComponent, NewsletterPropositionComponent, SwiperContentDirective, SwiperGalleryDirective, SwiperMainDirective, SwiperToolkitDirective, SwitchComponent, UserComponent, UserDeleteComponent, UserEditComponent, UserEditPasswordComponent, UserForgotComponent, UserModalComponent, UserDetailComponent, UserSigninComponent, UserSignupComponent];
var pipes$2 = [];
var SharedModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(SharedModule, _Module);

  function SharedModule() {
    return _Module.apply(this, arguments) || this;
  }

  return SharedModule;
}(rxcomp.Module);
SharedModule.meta = {
  imports: [],
  declarations: [].concat(factories$2, pipes$2),
  exports: [].concat(factories$2, pipes$2)
};var AppModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, rxcompForm.FormModule, CommonModule, ControlsModule, SharedModule],
  declarations: [ContactModalComponent, CardProductDetailComponent, OpenModallyDirective, SideModalComponent],
  bootstrap: AppComponent
};rxcomp.Browser.bootstrap(AppModule);})));