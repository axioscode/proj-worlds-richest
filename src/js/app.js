var setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
var trackEvent = require('./analytics.js').trackEvent;


let d3 = require("d3-selection");

let theData = require("../data/data.json");

import makeBarChart from "./barchart";
import arrowNav from "./arrowNav";
import makeTimer from "./makeTimer";

var pym = require('pym.js');
var pymChild = null;

document.addEventListener("DOMContentLoaded", main());

function main() {

	var pymChild = new pym.Child();

	let guys = {};

	theData.forEach(d=> {
		if (!guys[d.name_key]) {
			guys[d.name_key] = {
				name : d.name,
				years : []
			};
		}

		guys[d.name_key].years.push(d.year);

	});

	let theChart = new makeBarChart({
		element: document.querySelector(`.chart`),
		data : theData,
		aspectHeight : .5,
		onReady : function() {
			pymChild.sendHeight();
		}
	});

	let theNav = new arrowNav({
		data : guys,
		context : theChart,
		callback : function() {
			theTimer.pause();
		}
	})

	theNav.updateChart(0);

	let theTimer = new makeTimer({
        speed: 2000,
        onUpdate: function() {
            theNav.updateChart(1);
        }
	})

	theTimer.start();

	d3.select(window).on("resize", ()=> {
		theChart.update();
	})

  
}




