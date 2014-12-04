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
		var Donkey = {
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
				Donkey.$w = $(window);

				if(!slider){console.error("Please pass a valid jQuery selector to Donkey.init()");return;}
				Donkey.$slider = $(slider);
			
				if(!slides){slides = ".slide"}
				Donkey.$slides = $(slides,Donkey.slider);

				if(!handles){handles = ".handles"}
				Donkey.$handles = $(handles,Donkey.slider);

				Donkey.listen();
				return Donkey;
			},

			swiping: function(e){
				switch(e.type){
					case "dragleft":
					case "dragright":
						Donkey.offset = Math.round(e.gesture.deltaX+Donkey.movement);
						Donkey.direction = e.type;
						Donkey.$slider.css({
							transform:"translateX("+Donkey.offset+"px)"
						});
					break;

					case "release":
						var pos = Donkey.offset;
						if(Donkey.direction == "dragleft"){pos-=100;}
						else{pos+=100;}
						var index = -1 * Math.round(pos/(Donkey.slideWidth + Donkey.slideMargin)),
							min = -((Donkey.count-1) * (Donkey.slideWidth + Donkey.slideMargin)),
							max = 0;
						
						if(pos < min)index = Donkey.count-1;
						if(pos > max)index = 0;
						Donkey.showSlide(index);
					break;
				}
			},

			next: function(){
				var next = Donkey.activeSlide + 1;
				if(next >= Donkey.count)next=0;
				Donkey.showSlide(next);
			},

			prev: function(){
				var prev = Donkey.activeSlide - 1;
				if(prev <= 0)prev=Donkey.count-1;
				Donkey.showSlide(prev);
			},

			showSlide: function(index){
				var offset = -index*(Donkey.slideWidth + Donkey.slideMargin);
				Donkey.$slider.animate({
					transform:"translateX("+offset+"px)"
				});
				Donkey.movement = offset;
				Donkey.activeSlide = index;

				Donkey.$handles.find("span").removeClass("active").eq(index).addClass("active");
			},

			listen: function(){
				Donkey.$w.resize(function(){
					Donkey.slideWidth = Math.round((Donkey.$w.width()-(Donkey.sliderMargin * 2)) * Donkey.showPercent);
					Donkey.$slides.css("width",Donkey.slideWidth);
				});
				Donkey.$w.trigger("resize");

				Donkey.$slider.hammer({drag_lock_to_axis: true}).on("release dragleft dragright swipeleft swiperight", Donkey.swiping);
				Donkey.count = Donkey.$slides.length;
				Donkey.$slider.trigger("release");
			}
		}
		return Donkey.init(selector);
	}
})(window,jQuery,jQuery.fn.hammer);
