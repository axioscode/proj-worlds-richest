let d3 = require("d3");

class makeBarChart {

    constructor(opts) {
        this.element = opts.element;
        this.data = opts.data;
        this.aspectHeight = opts.aspectHeight ? opts.aspectHeight : .68;
        this.onReady = opts.onReady;

        this.update();
         //Callback for whatever. 

    }

    _setData() {

    }

    _setDimensions() {
        // define width, height and margin

        this.margin = {
            top: 20,
            right: 15,
            bottom: 30,
            left: 45
        };

        this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
        this.height = (this.element.offsetWidth * this.aspectHeight) - this.margin.top - this.margin.bottom; //Determine desired height here

    }

    _setScales() {

        this.xScale = d3.scaleBand().rangeRound([0, this.width]).padding(0.1),
            this.yScale = d3.scaleLinear().rangeRound([this.height, 0]);

        this.xScale.domain(this.data.map(d => {
            return d["year"];
        }));

        this.yScale.domain([0, d3.max(this.data, d => {
            return d["adjusted"];
        })]);


        this.xAxis = d3.axisBottom(this.xScale)
            .tickSize(15)
            .tickFormat(d => {
                return d % 10 === 0 ? d : d == "1982" ? '1982' : '';
            });


        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(5)
            .tickSize(-this.width)
            .tickFormat(d => {
                return d === 0 ? `0` : `$${d}b`;
            })

    }

    update() {
        this._setDimensions();
        this._setScales();
        this.draw();
    }

    draw() {

        // set up parent element and SVG
        this.element.innerHTML = "";

        this.svg = d3.select(this.element).append('svg');

        //Set svg dimensions
        this.svg.attr('width', this.width + this.margin.left + this.margin.right);
        this.svg.attr('height', this.height + this.margin.top + this.margin.bottom);

        // create the chart group.
        this.plot = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
            .attr("class", "chart-g");

        this.plot.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.plot.selectAll(".axis--x .tick")
            .classed("show", function(d, i) {
                return d % 10 === 0 || d == "1982";
            });

        this.plot.append("g")
            .attr("class", "axis axis--y")
            .call(this.yAxis);

        this.drawBars();

        this.onReady();
    }

    drawBars() {
        this.plot.selectAll(".bar")
            .data(this.data)
            .enter().append("rect")
            .each(d=> {
                //console.log(d);
            })
            .attr("class", "bar")
            .attr("x", d => {
                return this.xScale(d["year"]);
            })
            .attr("y", d => {
                return this.yScale(d["adjusted"]);
            })
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => {
                return this.height - this.yScale(d["adjusted"]);
            });

        this.plot.selectAll(".lbl")
            .data(this.data)
            .enter().append("text")
            .attr("class", "lbl")
            .attr("x", d => {
                return this.xScale(d["year"]) + (this.xScale.bandwidth()/2)
            })
            .attr("y", d => {
                return this.yScale(d["adjusted"]) - 4;
            })
            .text(d=> {
                return `${round(d["adjusted"], 0)}`;
            });

    }


}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

export default makeBarChart;