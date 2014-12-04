DonkeySlider
============

A jQuery/hammer based slider

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


example usage: 
```	
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
	```
