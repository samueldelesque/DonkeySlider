/*
 * DonkeySlider - a jQuery/Hammer based donkey slider
 * Author: Samuel Delesque <hello@samueldelesque.me>
 *
 *
 * Dependencies: 
 * 
 * jQuery - http://jquery.com/ 
 * jQuery.Hammer - http://hammerjs.github.io/
 * (jQuery.transform - http://louisremi.github.io/jquery.transform.js/  for old browser support)
 *
 *
 *  example usage: 
	
	$(document).ready(function() {
		window.myDonkey = new DonkeySlider(".slider");
	});

 *
 */

(function(window,$,hammer) {
	if(!$)console.error("jQuery is required for Donkey.");
	if(!hammer)console.error("jQuery.hammer is required for Donkey.");
	$.fn.hammer = hammer;
	window.DonkeySlider = function(selector){
		var _ = {
			$el:null,
			w:{},
			activeSlide:null,
			slideWidth:240,
			slideMargin:20,
			offset:0,
			movement:0,
			direction:null,

			//slides fill 90% of window width
			showPercent:0.9,

			//if the slider has margins
			sliderMargin:20,

			init: function(slider,slides,handles){
				//construct the jQuery elements for later use
				_.$w = $(window);

				if(!slider){console.error("Please pass a valid jQuery selector to _.init()");return;}
				_.$slider = $(slider);
			
				if(!slides){slides = ".slide"}
				_.$slides = $(slides,_.slider);

				if(!handles){handles = ".handles"}
				_.$handles = $(handles,_.slider);

				_.listen();
				return _;
			},

			swiping: function(e){
				switch(e.type){
					case "dragleft":
					case "dragright":
						_.offset = Math.round(e.gesture.deltaX+_.movement);
						_.direction = e.type;
						_.$slider.css({
							transform:"translateX("+_.offset+"px)"
						});
					break;

					case "release":
						var pos = _.offset;
						if(_.direction == "dragleft"){pos-=100;}
						else{pos+=100;}
						var index = -1 * Math.round(pos/(_.slideWidth + _.slideMargin)),
							min = -((_.count-1) * (_.slideWidth + _.slideMargin)),
							max = 0;
						
						if(pos < min)index = _.count-1;
						if(pos > max)index = 0;
						_.showSlide(index);
					break;
				}
			},

			next: function(){
				var next = _.activeSlide + 1;
				if(next >= _.count)next=0;
				_.showSlide(next);
			},

			prev: function(){
				var prev = _.activeSlide - 1;
				if(prev <= 0)prev=_.count-1;
				_.showSlide(prev);
			},

			showSlide: function(index){
				var offset = -index*(_.slideWidth + _.slideMargin);
				_.$slider.animate({
					transform:"translateX("+offset+"px)"
				});
				_.movement = offset;
				_.activeSlide = index;

				_.$handles.find("span").removeClass("active").eq(index).addClass("active");
			},

			listen: function(){
				_.$w.resize(function(){
					_.slideWidth = Math.round((_.$w.width()-(_.sliderMargin * 2)) * _.showPercent);
					_.$slides.css("width",_.slideWidth);
				});
				_.$w.trigger("resize");

				_.$slider.hammer({drag_lock_to_axis: true}).on("release dragleft dragright swipeleft swiperight", _.swiping);
				_.count = _.$slides.length;
				_.$slider.trigger("release");
			}
		}
		return _.init(selector);
	}
})(window,jQuery,jQuery.fn.hammer);
