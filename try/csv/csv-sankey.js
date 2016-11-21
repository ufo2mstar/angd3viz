var units = "Million";

var linkStroke = {
    default: 0.5,
    dim: 0.2,
    highlight: 0.7
};

var buffer = 100,
    screenWidth = window.innerWidth - (window.innerHeight / 10),
    screenHeight = window.innerHeight - (window.innerHeight / 10);

//console.log(innerWidth+ " x " + innerHeight);
console.log(screenWidth + " x " + screenHeight);

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = screenWidth - margin.left - margin.right,
    height = screenHeight - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function (d) {
        return "$ " + formatNumber(d) + " " + units;
    },
    color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(120)
    .nodePadding(30)
    .size([width, height]);

var path = sankey.link();


function draw(filename) {

// load the data
    d3.csv(filename, function (error, data) {

        //set up graph in same style as original example but empty
        //nodes- need to give the metadata here somehow!
        graph = {"nodes": [], "links": []};

        data.forEach(function (d) {
            graph.nodes.push({"name": d.source});
            graph.nodes.push({"name": d.target});
            graph.links.push({
                "source": d.source,
                "target": d.target,
                "value": d.value
            });
        });

        // return only the distinct / unique nodes
        graph.nodes = d3.keys(d3.nest()
            .key(function (d) {
                return d.name;
            })
            .map(graph.nodes));

        // loop through each link replacing the text with its index from node
        graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });

        //now loop through each nodes to make nodes an array of objects
        // rather than an array of strings
        graph.nodes.forEach(function (d, i) {
            graph.nodes[i] = {"name": d};
        });

        //sankey render starts

        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32); // haha, itr count for the iterative relaxation..

// add in the linkages
//        var link = svg.append("g").selectAll(".link")
//            .data(graph.links)
//            .enter().append("path")
//            .attr("class", "link")
//            .attr("d", path)
//            .style("stroke-width", function (d) {
//                return Math.max(1, d.dy);
//            })
//            .sort(function (a, b) {
//                return b.dy - a.dy;
//            });

//        new link try

        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .attr("id", function (d, i) { // for link highlighting
                d.id = i;
                return "link-" + i;
            })
            .style("fill", "none")
            .style("stroke-opacity", linkStroke.default)
            .on("mouseover", function() { d3.select(this).style("stroke-opacity", linkStroke.highlight) } )
            .on("mouseout", function() { d3.select(this).style("stroke-opacity", linkStroke.default) } )
            .style("stroke-width", function (d) {
                return Math.max(1, d.dy);
            })
            .style("stroke", function (d) {
                //return "rgb("+d.source.color+")";
                //return d3.rgb(d.source.color).darker(2);
                //console.log(d.source.name);
                return d3.rgb(color(d.source.name.replace(/ .*/, ""))).darker(2);
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            });

// add the link titles
        link.append("title")
            .text(function (d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + format(d.value);
            });

// add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", highlight_node_links) // adding for click hilighting
            .call(d3.behavior.drag()
                .origin(function (d) {
                    return d;
                })
                .on("dragstart", function () {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

// add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
                //return d3.rgb(d.color).brighter(2);
            })
            .append("title")
            .text(function (d) {
                return dispAmount(d)
            });

        // link coloring
        link.style("stroke", function (d) {
            //return "rgb("+d.source.color+")";
            //return d3.rgb(d.source.color).darker(2);
            //console.log(d.source.name);
            //return d3.rgb(d.source.color).darker(3);
            return d3.rgb(d.source.color).darker(1);
            //return d3.rgb(d.source.color).brighter(1);
        });

// add in the title for the nodes
        var offset = 8;
        node.append("text")
            .attr({
                x: function (d) {
                    return d.dx / 2;
                },
                y: function (d) {
                    return (d.dy / 2) - offset;
                },
                dy: ".35em",
                "text-anchor": "middle",
                fill: "black"
                //transform: "rotate(90)"
            })
            .text(function (d) {
                //return nodeContent(d);
                return d.name;
            });

        node.append("text")
            .attr({
                x: function (d) {
                    return d.dx / 2;
                },
                y: function (d) {
                    return (d.dy / 2) + offset;
                },
                dy: ".35em",
                "text-anchor": "middle",
                //fill: "black",
                fill: function (d) {
                    //return d3.rgb(d.color).darker(-2)
                    //return d3.rgb(d.color).darker(-2)
                    //return d3.rgb(d.color).brighter(4)
                    //console.log(d.color);
                    return "black"
                }
                //transform: "rotate(90)"
            })
            .text(function (d) {
                return nodeContent(d);
                //return d.name + "\n" + d.name;
            });

        //node.append("text")
        //    .attr("x", function (d) {
        //        return d.dx / 2;
        //    })
        //    .attr("y", function (d) {
        //        return d.dy / 2;
        //    })
        //    .attr("dy", ".35em")
        //    .attr("text-anchor", "middle")
        //    .attr("fill", "red")
        //    .attr("transform", null)
        //    .text(function (d) {
        //        return nodeContent(d);
        //    });
        //.filter(function (d) {
        //    return d.x < width / 2;
        //})
        //.attr("x", sankey.nodeWidth())
        //.attr("text-anchor", "middle");

// the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + d.x + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

// function for placing node content
        function nodeContent(d) {
            //return d.name;
            //return d.value + dispAmount(d);
            return format(d.value);
            //return JSON.stringify(d); //TypeError: cyclic object value
            //return d;
        }

        function dispAmount(d) {
            return d.name + "\n" + format(d.value);
        }

    });


    function highlight_node_links(node, i) {
        console.log("hilight try");
        var remainingNodes = [],
            nextNodes = [];

        var stroke_opacity = 0;
        if (d3.select(this).attr("data-clicked") == "1") {
            d3.select(this).attr("data-clicked", "0");
            d3.selectAll(".link").style("stroke-opacity", linkStroke.default);
            stroke_opacity = linkStroke.default;
        } else {
            d3.select(this).attr("data-clicked", "1");
            // dim all links here!
            d3.selectAll(".link").style("stroke-opacity", linkStroke.dim);
            stroke_opacity = linkStroke.highlight;
        }

        var traverse = [{
            linkType: "sourceLinks",
            nodeType: "target"
        }, {
            linkType: "targetLinks",
            nodeType: "source"
        }];

        traverse.forEach(function (step) {
            node[step.linkType].forEach(function (link) {
                remainingNodes.push(link[step.nodeType]);
                highlight_link(link.id, stroke_opacity);
            });

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function (node) {
                    node[step.linkType].forEach(function (link) {
                        nextNodes.push(link[step.nodeType]);
                        highlight_link(link.id, stroke_opacity);
                    });
                });
                remainingNodes = nextNodes;
            }
        });
    }

    function highlight_link(id, opacity) {
        d3.select("#link-" + id).style("stroke-opacity", opacity);
    }

};
