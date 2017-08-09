let d3 = require("d3");

class arrowNav {

    constructor(opts) {
        this.data = opts.data;
        this.element = d3.select("#arrowNav");
        this.setEvents();
        this.context = opts.context;
        this.callback = opts.callback;


        this.titles = {
            "Bill Gates": "1992, 1994-97, 2009, 2014-16",
            "Carlos Slim": "2010-13",
            "Daniel Ludwig": "1982",
            "Gordon Getty": "1983-84",
            "John Kluge": "1989-91",
            "Sam Walton": "1985-88",
            "Warren Buffett": "1993, 2008"
        }


    }

    setEvents() {

        let _this = this;

        this.currVal = 4;

        this.keys = Object.keys(this.data);

        this.element.select(".current-index").html(1);
        this.element.select(".total-count").html(this.keys.length);

        this.element.selectAll(".nav-item").on("click", function(d) {
            let dir = d3.select(this).attr("data-direction") === "backward" ? -1 : 1;
            _this.updateChart(dir);
            _this.callback();
        });

    }

    updateChart(dir) {

        if (this.currVal + dir > (this.keys.length - 1)) {
            this.currVal = 0;
        } else if (this.currVal + dir < 0) {
            this.currVal = (this.keys.length - 1);
        } else {
            this.currVal = this.currVal + dir;
        }

        this.element.select(".current-index").html(this.currVal + 1);

        let nameKey = this.keys[this.currVal];

        let name = this.data[nameKey].name;

        d3.select(".nav h2").html(this.data[nameKey].name);
        d3.select(".nav p").html(this.titles[name]);

        this.context.plot.selectAll(".bar")
            .classed("active", d => {
                return d.name_key === nameKey;
            });

        this.context.plot.selectAll(".lbl")
            .classed("active", d => {
                return d.name_key === nameKey;
            });

    }




}



export default arrowNav;