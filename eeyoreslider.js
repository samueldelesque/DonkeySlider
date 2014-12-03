/*
 * EeyoreSlider - a hammer based donkey slider
 * Author: Samuel Delesque <hello@samueldelesque.me>
 *
 *  example usage: 
	
	$(document).ready(function() {
		window.myEeyore = new EeyoreSlider(".pro-slider");
	});

 *
 */

(function($,hammer) {
	if(!$)console.error("jQuery is required for Eeyore.");
	if(!hammer)console.error("jQuery.hammer is required for Eeyore.");
	$.fn.hammer = hammer;
	var EeyoreSlider = function(selector){
		var Eeyore = {
			$el:null,
			w:{},
			activeSlide:null,
			slideWidth:240,
			slideMargin:20,
			offset:0,
			movement:0,
			direction:null,

			init: function(slider,slides,handles){
				//construct the jQuery elements for later use
				Eeyore.$w = $(window);

				if(!slider){console.error("Please pass a valid jQuery selector to Eeyore.init()");return;}
				Eeyore.$slider = $(slider);
			
				if(!slides){slides = ".slide"}
				Eeyore.$slides = $(slides,Eeyore.slider);

				if(!handles){handles = ".handles"}
				Eeyore.$handles = $(handles,Eeyore.slider);

				Eeyore.listen();
				return Eeyore;
			},

			swiping: function(e){
				switch(e.type){
					case "dragleft":
					case "dragright":
						Eeyore.offset = Math.round(e.gesture.deltaX+Eeyore.movement);
						Eeyore.direction = e.type;
						Eeyore.$slider.css({
							transform:"translateX("+Eeyore.offset+"px)"
						});
					break;

					case "release":
						var pos = Eeyore.offset;
						if(Eeyore.direction == "dragleft"){pos-=100;}
						else{pos+=100;}
						var width = Eeyore.slideWidth + Eeyore.slideMargin,
							index = -1 * Math.round(pos/width),
							offset = -index * width,
							min = -((Eeyore.count-1) * width),
							max = 0;
						
						if(pos < min){
							offset=min;
							index = Eeyore.count-1;
						}
						if(pos > max){
							offset=max; 
							index = 0;
						}
						Eeyore.$slider.animate({
							transform:"translateX("+offset+"px)"
						});

						Eeyore.$handles.find("span").removeClass("active");
						Eeyore.$handles.find("span").eq(index).addClass("active");

						Eeyore.movement = offset;
					break;
				}
			},

			listen: function(){
				Eeyore.$w.resize(function(){
					Eeyore.slideWidth = Math.round((Eeyore.$w.width()-40) * 0.9);
					Eeyore.$slides.css("width",Eeyore.slideWidth);
				});
				Eeyore.$w.trigger("resize");

				Eeyore.$slider.hammer({drag_lock_to_axis: true}).on("release dragleft dragright swipeleft swiperight", Eeyore.swiping);
				Eeyore.count = Eeyore.$slides.length;
				Eeyore.$slider.trigger("release");
			}
		}
		return Eeyore.init(selector);
	}
})(jQuery,jQuery.fn.hammer);
