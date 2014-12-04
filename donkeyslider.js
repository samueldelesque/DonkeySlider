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
	
	//HTML
	<div class="slider-container">
		<div class="slider">
			<div class="slide">
				<img>
				<p>Dummy text</p>
			</div>
			<div class="slide">
				<img>
				<p>Dummy text</p>
			</div>
			<div class="slide">
				<img>
				<p>Dummy text</p>
			</div>
		</div>
		<div class="handles"></div>
	</div>


	//JS
	$(document).ready(function() {
		window.myDonkey = new DonkeySlider(".slider-container");
	});

	//CSS (for the handles, optional)
	.handles{
		margin-top:10px;
		text-align: center;
	.handles b{
		display: inline-block;
		margin: 6px;
		width: 10px;
		height: 10px;
		background: #eee;
		position: relative;
		border-radius:10px;
	}
	.handles b.active:before{
		content: "";
		position: absolute;
		top: 2px;
		left: 2px;
		width: 6px;
		height: 6px;
		background: #000;
		border-radius:6px;
	}

 *
 */

(function(window,$,hammer) {
	if(!$)console.error("jQuery is required for Donkey.");
	if(!hammer)console.error("jQuery.hammer is required for Donkey.");
	$.fn.hammer = hammer;
	window.DonkeySlider = function(container,slider,slides,handles){
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

			init: function(container,slider,slides,handles){
				//construct the jQuery elements for later use
				_.$w = $(window);

				if(!container){console.error("Please pass a valid jQuery selector to DonkeySlider()");return;}
				_.$container = $(container);
			
				if(!slider){slider = ".slider"}
				_.$slider = $(slider,_.$container);
			
				if(!slides){slides = ".slide"}
				_.$slides = $(slides,_.$slider);

				if(!handles){handles = ".handles"}
				_.$handles = $(handles,_.$container);

				_.count = _.$slides.length;

				_.listen();
				_.setStyles();
				return _;
			},

			setStyles: function(){
				_.$container.css({
					overflow:"hidden",
					width:"100%",
					paddingRight:_.slideMargin,
					boxSizing:"border-box",
				});
				_.$slides.css({
					position:"relative",
					marginLeft:_.slideMargin,
					boxSizing:"border-box",
					float:"left",
				});
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
						var index = -1 * Math.round(pos/_.width()),
							min = -((_.count-1) * _.width()),
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

			width: function(){
				return _.slideWidth + _.slideMargin;
			},

			showSlide: function(index){
				var offset = -index*_.width();
				if(index == _.count-1)offset += (1-_.showPercent) * _.slideWidth;
				_.$slider.animate({
					transform:"translateX("+Math.round(offset)+"px)"
				});
				_.movement = offset;
				_.activeSlide = index;

				_.$handles.find("b").removeClass("active").eq(index).addClass("active");
			},

			listen: function(){
				_.$w.resize(function(){
					_.slideWidth = Math.round((_.$w.width()-(_.sliderMargin * 2)) * _.showPercent);
					_.$slides.css("width",_.slideWidth);
					_.$slider.css({
						width: (_.slideWidth+_.slideMargin) * _.count
					});
				});
				_.$w.trigger("resize");

				_.$slider.hammer({drag_lock_to_axis: true}).on("release dragleft dragright swipeleft swiperight", _.swiping);
				_.$slider.trigger("release");

				for(i=0;i<_.count;i++){_.$handles.append("<b></b>")}
				_.$handles.find("b").on("click",function(e){_.showSlide($(this).index())}).eq(0).addClass("active");
			}
		}
		return _.init(container,slider,slides,handles);
	}
})(window,jQuery,jQuery.fn.hammer);
