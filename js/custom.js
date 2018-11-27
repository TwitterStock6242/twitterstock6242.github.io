$(document).ready(function() {
    
    $("#predictionPage").click(function() {
        $(this).css("color", "#5a64a1");
        $("#predictionLine").css("opacity", "1");
        $("#predictionSection").css("display", "block");

        $("#historyPage").css("color", "#62667a");
        $("#historyLine").css("opacity", "0");
        $("#historySection").css("display", "none");
    });

    $("#historyPage").click(function() {
        $(this).css("color", "#5a64a1");
        $("#historyLine").css("opacity", "1");
        $("#historySection").css("display", "block");

        $("#predictionPage").css("color", "#62667a");
        $("#predictionLine").css("opacity", "0");
        $("#predictionSection").css("display", "none");
    });

    
    
    
    // history chart tab
    
    $("#day").click(function() {
        $(this).addClass("tab-active");
        
        $("#week").removeClass("tab-active");
        $("#month").removeClass("tab-active");
        $("#year").removeClass("tab-active");
    });
    
    $("#week").click(function() {
        $(this).addClass("tab-active");
        
        $("#day").removeClass("tab-active");
        $("#month").removeClass("tab-active");
        $("#year").removeClass("tab-active");
    });
    
    $("#month").click(function() {
        $(this).addClass("tab-active");
        
        $("#day").removeClass("tab-active");
        $("#week").removeClass("tab-active");
        $("#year").removeClass("tab-active");
    });
    
    $("#year").click(function() {
        $(this).addClass("tab-active");
        
        $("#day").removeClass("tab-active");
        $("#week").removeClass("tab-active");
        $("#month").removeClass("tab-active");
    });
    
    
    
    var stock_url = "https://twitter-stock.appspot.com/queryrange?end=2017-10-30&range=5&scale=1";
    
    var twitter_url = "https://twitter-stock.appspot.com/queryTweets?end=2017-10-30&range=5";
    
    var prediction_url = "https://twitter-stock.appspot.com/queryPredict?date=2016-07-29&time=18:30";
    
    var stock_data;
    
    var twitter_data;
    
    var prediction_data;
    
    var parseDate = d3.timeParse("%Y-%m-%d");
    
    var parseTime = d3.timeParse("%H:%M");
    
    var tweets = d3.select("#tweets");

    var historySVG = d3.select("#history-chart");
    
    
    
    
    getData(stock_url, "stock", drawResult);
    getData(twitter_url, "twitter", drawResult);
    getData(prediction_url, "prediction", drawResult);
    
    function drawResult() {
        
        d3.queue()
//        .defer(d3.csv, "../twitter_data/twitter-test.csv")
//        .defer(d3.csv, "../stock_data/2015.csv")
            .defer(d3.csv, "../prediction_data/prediction.csv")
            .await(function(error, dataset_prediction) {
                
                if(error) {
                    console.error("Error while loading dataset.");
                    console.error(error);
                    return;
                }
//
////            console.log(dataset_twitter);
////            console.log(dataset_stock);
//                console.log(dataset_prediction);
            
                
                stock_data.forEach(function(d) {
                    d.entire_time = d.date + " " + d.time;
                    d.date = parseDate(d.date);
                    d.time = parseTime(d.time);
                });
            
                twitter_data.forEach(function(d) {
                    d.entire_time = d.date + " " + d.time;
                    d.date = parseDate(d.date);
                    d.time = parseTime(d.time);
                });
                
                
                // history sub sections
            
                var change_count = 0;
                var change_pos_count = 0;
                var change_neg_count = 0;
                var pre_count = 0;
                var pre_pos_count = 0;
                var pre_neg_count = 0;
                var ca = 0;
                var p_ca = 0;
                var n_ca = 0;

                dataset_prediction.forEach(function(d) {
                    if (parseFloat(d.change) == 1) {
                        change_pos_count = change_pos_count + 1;
                    }

                    if (parseFloat(d.change) == 2) {
                        change_neg_count = change_neg_count + 1;
                    }

                    if (parseFloat(d.pred_change) == 1) {
                        pre_pos_count = pre_pos_count + 1;
                    }

                    if (parseFloat(d.pred_change) == 2) {
                        pre_neg_count = pre_neg_count + 1;
                    }

                });

                change_count = change_pos_count + change_neg_count;
                pre_count = pre_pos_count + pre_neg_count;

                ca = ((pre_count / change_count) * 100).toFixed(0);
                p_ca = ((pre_pos_count / change_pos_count) * 100).toFixed(0);
                n_ca = ((pre_neg_count / change_neg_count) * 100).toFixed(0);

////            console.log(change_pos_count);
////            console.log(change_neg_count);
////            console.log(change_count);
////            console.log(pre_pos_count);
////            console.log(pre_neg_count);
////            console.log(pre_count);

                d3.select(".si-data")
                    .text(change_count);

                d3.select(".si-pos-div")
                    .style("width", change_pos_count * 0.02 + "rem");

                d3.select(".si-pos")
                    .text(change_pos_count);

                d3.select(".si-neg-div")
                    .style("width", change_neg_count * 0.02 + "rem");

                d3.select(".si-neg")
                    .text(change_neg_count);

                d3.select(".cp-data")
                    .text(pre_count);

                d3.select(".cp-pos-div")
                    .style("width", pre_pos_count * 0.02 + "rem");

                d3.select(".cp-pos")
                    .text(pre_pos_count);

                d3.select(".cp-neg-div")
                    .style("width", pre_neg_count * 0.02 + "rem");

                d3.select(".cp-neg")
                    .text(pre_neg_count);

                d3.select(".ca-data")
                    .text(ca + "%");

                d3.select(".ca-pos")
                    .text(p_ca + "%");

                d3.select(".ca-pos-div")
                    .style("width", p_ca * 0.035 + "rem");

                d3.select(".ca-neg")
                    .text(n_ca + "%");

                d3.select(".ca-neg-div")
                    .style("width", n_ca * 0.035 + "rem");


            
                // history twitter
            
                var dataset_aggregated_twitter = [];

                twitter_data.forEach(function(d) {
                    dataset_prediction.forEach(function(c) {
                        if (parseFloat(d.id) == parseFloat(c.twt_id)) {
                            dataset_aggregated_twitter.push(d);
                            return true;
                        }
                    });
                });


//    //        var twitter_nested = d3.nest()
//    //            .key(function(d) {
//    //                return d.year;
//    //            })
//    //            .key(function(d) {
//    //                return d.month;
//    //            })
//    //            .key(function(d) {
//    //                return d.day;
//    //            })
//    //            .entries(dataset_twitter);

            
                var tweetEnter = tweets.selectAll(".tweet")
                    .data(dataset_aggregated_twitter)
                    .enter()
                    .append("div")
                    .attr("class", "tweet");

                tweetEnter.append("div")
                    .attr("class", "side");
        
                // up volume container divs

                tweetEnter.selectAll(".side")
                    .append("div")
                    .attr("class", "volume-container");

                tweetEnter.selectAll(".volume-container")
                    .append("div")
                    .attr("class", "up-volume-container");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up10");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up9");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up8");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up7");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up6");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up5");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up4");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up3");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up2");

                tweetEnter.selectAll(".up-volume-container")
                    .append("div")
                    .attr("class", "volume up1");

                // down volume container divs

                tweetEnter.selectAll(".volume-container")
                    .append("div")
                    .attr("class", "down-volume-container");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down1");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down2");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down3");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down4");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down5");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down6");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down7");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down8");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down9");

                tweetEnter.selectAll(".down-volume-container")
                    .append("div")
                    .attr("class", "volume down10");
            
            
            
                d3.selectAll(".up-volume-container")
                    .attr("data-price-change", function(d) {
                        var price = "";
                        var future_price = "";
                        var price_change = "";
                        var price_percent = "";
                            
                        var d_new = moment(d.entire_time, "YYYY-MM-DD HH:mm");
//                        console.log(d_new.format());
                    
                        var d_new_30 = d_new.add(30, "m");
//                        console.log(d_new_30.format());
                    
                        stock_data.forEach(function(c) {
                            if (d.entire_time == c.entire_time) {
                                price = c.close;
                            }
                        });

                        stock_data.forEach(function(c) {
                            var c_new = moment(c.entire_time, "YYYY-MM-DD HH:mm");
                            
                            
                            if (c_new.format() == d_new_30.format()) {
                                future_price = c.close;
                            }
                        });
                    
                        price_change = (parseFloat(future_price) - parseFloat(price)).toFixed(2);
                    
                        price_percent = ((price_change / parseFloat(price)) * 100).toFixed(2);
                    
                        if ((price_percent >= 0) && (price_percent < 0.02)) {
                            return "l1";
                        }
                        else if ((price_percent >= 0.02) && (price_percent < 0.04)) {
                            return "l2";
                        }
                        else if ((price_percent >= 0.04) && (price_percent < 0.06)) {
                            return "l3";
                        }
                        else if ((price_percent >= 0.06) && (price_percent < 0.08)) {
                            return "l4";
                        }
                        else if ((price_percent >= 0.08) && (price_percent < 0.1)) {
                            return "l5";
                        }
                        else if ((price_percent >= 0.1) && (price_percent < 0.12)) {
                            return "l6";
                        }
                        else if ((price_percent >= 0.12) && (price_percent < 0.14)) {
                            return "l7";
                        }
                        else if ((price_percent >= 0.14) && (price_percent < 0.16)) {
                            return "l8";
                        }
                        else if ((price_percent >= 0.16) && (price_percent < 0.18)) {
                            return "l9";
                        }
                        else if (price_percent >= 0.18) {
                            return "l10";
                        }
                        else {
                            return "l0";
                        }
                    });
            
                d3.selectAll(".down-volume-container")
                    .attr("data-price-change", function(d) {
                        var price = "";
                        var future_price = "";
                        var price_change = "";
                        var price_percent = "";
                            
                        var d_new = moment(d.entire_time, "YYYY-MM-DD HH:mm");
//                        console.log(d_new.format());
                    
                        var d_new_30 = d_new.add(30, "m");
//                        console.log(d_new_30.format());
                    
                        stock_data.forEach(function(c) {
                            if (d.entire_time == c.entire_time) {
                                price = c.close;
                            }
                        });

                        stock_data.forEach(function(c) {
                            var c_new = moment(c.entire_time, "YYYY-MM-DD HH:mm");
                            
                            
                            if (c_new.format() == d_new_30.format()) {
                                future_price = c.close;
                            }
                        });
                    
                        price_change = parseFloat(future_price) - parseFloat(price);
                    
                        price_percent = (price_change / parseFloat(price)) * 100;
                    
                        if ((price_percent <= 0) && (price_percent > -0.02)) {
                            return "l1";
                        }
                        else if ((price_percent <= -0.02) && (price_percent > -0.04)) {
                            return "l2";
                        }
                        else if ((price_percent <= -0.04) && (price_percent > -0.06)) {
                            return "l3";
                        }
                        else if ((price_percent <= -0.06) && (price_percent > -0.08)) {
                            return "l4";
                        }
                        else if ((price_percent <= -0.08) && (price_percent > -0.1)) {
                            return "l5";
                        }
                        else if ((price_percent <= -0.1) && (price_percent > -0.12)) {
                            return "l6";
                        }
                        else if ((price_percent <= -0.12) && (price_percent > -0.14)) {
                            return "l7";
                        }
                        else if ((price_percent <= -0.14) && (price_percent > -0.16)) {
                            return "l8";
                        }
                        else if ((price_percent <= -0.16) && (price_percent > -0.18)) {
                            return "l9";
                        }
                        else if (price_percent <= -0.18) {
                            return "l10";
                        }
                        else {
                            return "l0";
                        }
                    });
            
                d3.selectAll(".up1")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l1") || (i == "l2") || (i == "l3") || (i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up2")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l2") || (i == "l3") || (i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up3")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l3") || (i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up4")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up5")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up6")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up7")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up8")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up9")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l9") || (i == "l10")) {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".up10")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if (i == "l10") {
                            return "#4eb784";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down1")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l1") || (i == "l2") || (i == "l3") || (i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down2")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l2") || (i == "l3") || (i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down3")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l3") || (i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down4")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l4") || (i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down5")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l5") || (i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down6")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l6") || (i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down7")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l7") || (i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down8")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l8") || (i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down9")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if ((i == "l9") || (i == "l10")) {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                d3.selectAll(".down10")
                    .style("background-color", function(d) {
                        var i = d3.select(this.parentNode).attr("data-price-change");
                    
                        if (i == "l10") {
                            return "#d23f31";
                        }
                        else {
                            return "#dfe2ee";
                        }
                });
            
                
            
            
            
            
                tweetEnter.append("div")
                    .attr("class", "tooltip");
            
                d3.selectAll(".side")
                    .on("mouseover", function(d) {
                        var price = "";
                        var future_price = "";
                        var price_change = "";
                        var price_percent = "";
                            
                        var d_new = moment(d.entire_time, "YYYY-MM-DD HH:mm");
                        console.log(d_new.format());
                    
                        var d_new_30 = d_new.add(30, "m");
                        console.log(d_new_30.format());
                    
                        stock_data.forEach(function(c) {
                            if (d.entire_time == c.entire_time) {
                                price = c.close;
                            }
                        });

                        stock_data.forEach(function(c) {
                            var c_new = moment(c.entire_time, "YYYY-MM-DD HH:mm");
                            
                            
                            if (c_new.format() == d_new_30.format()) {
                                future_price = c.close;
                            }
                        });
                    
                        
                    
                        console.log(price);
                        console.log(future_price);
                    
                        price_change = parseFloat(future_price) - parseFloat(price);
                    
                        price_percent = ((price_change / parseFloat(price)) * 100).toFixed(2);
                    
                        var tag = "";
                    
                        if (price_change >= 0) {
                            tag = "+";
                        }
                        
                        var content = "<p class='tooltip-title'>Price change in 30 min</p><p class='tooltip-text'>" + tag + price_change.toFixed(2) + "<span style='color: #a2a9c4;'> / </span>" + tag +  price_percent + "%" + "</p>";
                            
                        d3.select(this.parentNode)
                            .select(".tooltip")
                            .style("opacity", "1")
                            .html(content);
                    
                        if (price_change >= 0) {
                            $(".tooltip-text").css("color", "#4eb784");
                        }
                        else {
                            $(".tooltip-text").css("color", "#d23f31");
                        }
                        
                    })
                    .on("mouseout", function(d) {
                        d3.select(this.parentNode)
                            .select(".tooltip")
                            .style("opacity", "0"); 
                    });
            
                // twitter card    
            
                tweetEnter.append("div")
                    .attr("class", "row1")
                    .append("div")
                    .attr("class", "profile-pic");

                tweetEnter.selectAll(".row1")
                    .append("div")
                    .attr("class", "name-info")
                    .append("p")
                    .attr("class", "name")
                    .text("Donald J. Trump")

                tweetEnter.selectAll(".name-info")
                    .append("p")
                    .attr("class", "username")
                    .text("@realDonaleTrump");

                tweetEnter.selectAll(".row1")
                    .append("p")
                    .attr("class", "create-time")
                    .text(function(d) {
                        return d.entire_time;
                    }); 

                tweetEnter.append("div")
                    .attr("class", "row2");

                tweetEnter.selectAll(".row2")
                    .append("p")
                    .attr("class", "content")
                    .text(function(d) {
                        return d.text;
                    });

                tweetEnter.append("div")
                    .attr("class", "row3");

                tweetEnter.selectAll(".row3")
                    .append("img")
                    .attr("src", "./image/heart.svg")
                    .attr("class", "favorite");

                tweetEnter.selectAll(".row3")
                    .append("p")
                    .attr("class", "favorite-text")
                    .text(function(d) {
                        return d.favorate;
                    });

                tweetEnter.selectAll(".row3")
                    .append("img")
                    .attr("src", "./image/forward.svg")
                    .attr("class", "retweet");

                tweetEnter.selectAll(".row3")
                    .append("p")
                    .attr("class", "retweet-text")
                    .text(function(d) {
                        return d.retweet;
                    });

                tweetEnter.append("div")
                    .attr("class", "break-line");

                tweetEnter.append("div")
                    .attr("class", "row4")
                    .on("click", function(d) {
                        var url = "https://twitter.com/realDonaldTrump/status/" + d.id;

                        window.open(url, '_blank');
                    });

                tweetEnter.selectAll(".row4")
                    .append("img")
                    .attr("src", "./image/link.svg")
                    .attr("class", "link-icon");

                tweetEnter.selectAll(".row4")
                    .append("p")
                    .attr("class", "link")
                    .text("View original tweet");

                tweetEnter.selectAll(".row4")
                    .append("img")
                    .attr("src", "./image/arrow-right.svg")
                    .attr("class", "arrow");
            
            
            

                
            
                var stock_nested = d3.nest()
                    .key(function(d) {
                        return d.date;
                    })
                    .entries(stock_data);
  
//                console.log(stock_nested);
            
                var dayData = stock_nested[0].values;
            
                console.log(dayData);
                console.log(stock_data);

                xExtent = d3.extent(stock_data, function(d) {
                    var date_change = moment(d.entire_time, "YYYY-MM-DD HH:mm");
                    return date_change;
                });

                yExtent = d3.extent(stock_data, function(d) {
                    return parseFloat(d.close);
                });

//                console.log(xExtent);
//                console.log(yExtent);



                xScale = d3.scaleTime()
                    .range([40, 1350]);
            
                xScale_brush = d3.scaleTime()
                    .range([40, 1350]);

                yScale = d3.scaleLinear()
                    .domain(yExtent)
                    .range([420, 40]);

                yGrid = d3.axisLeft(yScale)
                    .ticks(7)
                    .tickSize(-1310)
                    .tickFormat("");

                xAxis = d3.axisBottom(xScale)
                    .ticks(5);
            
                xAxis_brush = d3.axisBottom(xScale_brush);
//                    .tickSize(-20);

                yAxis = d3.axisLeft(yScale)
                    .ticks(7);
            
                brush = d3.brushX()
                    .extent([[40, 0], [1350, 20]])
                    .on("brush end", brushed);
            
                zoom = d3.zoom()
                    .scaleExtent([1, Infinity])
                    .on("zoom", zoomed);
            
                focus = historySVG.append("g")
                    .attr("class", "focus")
                    .attr("transform", "translate(0, 0)");
            
                context = historySVG.append("g")
                    .attr("class", "context")
                    .attr("transform", "translate(0, 500)");
            
                xScale.domain(xExtent);
            
                xScale_brush.domain(xScale.domain());
            
                gx = focus.append("g")
                    .attr("class", "axis x")
                    .attr("transform", "translate(0, 465)")
                    .call(xAxis);

                gy = focus.append("g")
                    .attr("class", "axis y")
                    .attr("transform", "translate(40, 0)")
                    .call(yAxis);

                focus.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(40, 0)")
                    .call(yGrid);

                focus.append("text")
                    .attr("class", "stock-name")
                    .attr("transform", "translate(-5, 15)")
                    .text("SPDR S&P 500 ETF TRUST");
            
                lineInterpolate = d3.line()
                    .x(function(d) {
                        var date_change = moment(d.entire_time, "YYYY-MM-DD HH:mm");
                        return xScale(date_change);
                    })
                    .y(function(d) {
                        return yScale(parseFloat(d.close));
                    });
            
                clip = historySVG.append("defs")
                    .append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", "1310")
                    .attr("height", "420")
                    .attr("transform", "translate(40, 40)");
            
                lineChart = historySVG.append("g")
                    .attr("clip-path", "url(#clip)")
                    .attr("class", "focus")
                    .attr("transform", "translate(0, 0)");

                lineChart.selectAll(".line-plot")
                    .data([stock_data])
                    .enter()
                    .append("path")
                    .attr("class", "line-plot")
                    .attr("d", lineInterpolate);  
            
                tweetIcon = lineChart.selectAll(".single-tweet")
                    .data(dataset_aggregated_twitter);
            
                tweetIconEnter = tweetIcon.enter()
                    .append("image")
                    .attr("class", "single-tweet")
                    .attr("xlink:href", "../image/twitter-logo.svg")
                    .attr("width", "30")
                    .attr("height", "30")
                    .attr("transform", function(d) {
                        var date_change = moment(d.entire_time, "YYYY-MM-DD HH:mm");
                        return "translate(" + xScale(date_change) + ", 430)";
                    });
            
                tweetIconMerge = tweetIconEnter.merge(tweetIcon);
            
                context.append("rect")
                    .attr("width", "1310")
                    .attr("height", "20")
                    .style("fill", "none")
                    .attr("transform", "translate(40, 0)");
            
                context.append("g")
                    .attr("class", "brush-axis")
                    .attr("transform", "translate(0, 20)")
                    .call(xAxis_brush);
            
                context.append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, xScale.range());
            
                historySVG.append("rect")
                    .attr("class", "zoom")
                    .attr("width", "1310")
                    .attr("height", "380")
                    .attr("transform", "translate(40, 40)")
                    .call(zoom);
            
            


            });
        
    }
    
    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

        var s = d3.event.selection || xScale_brush.range();

        xScale.domain(s.map(xScale_brush.invert, xScale_brush));
        
//        console.log(xScale.domain());

        lineChart.select(".line-plot")
            .attr("d", lineInterpolate);

        focus.select(".x")
            .call(xAxis);
        
        d3.selectAll(".single-tweet")
            .attr("transform", function(d) {
                var date_change = moment(d.entire_time, "YYYY-MM-DD HH:mm");
                return "translate(" + xScale(date_change) + ", 430)";
            });

        historySVG.select(".zoom")
            .call(zoom.transform, d3.zoomIdentity
                 .scale(1310 / (s[1] - s[0]))
                 .translate(-s[0], 0));

    }

    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;

        var t = d3.event.transform;

        xScale.domain(t.rescaleX(xScale_brush).domain());
//        console.log(xScale.domain());

        lineChart.select(".line-plot")
            .attr("d", lineInterpolate);

        focus.select(".x")
            .call(xAxis);
        
        d3.selectAll(".single-tweet")
            .attr("transform", function(d) {
                var date_change = moment(d.entire_time, "YYYY-MM-DD HH:mm");
                return "translate(" + xScale(date_change) + ", 430)";
            });

        context.select(".brush")
            .call(brush.move, xScale.range().map(t.invertX, t));
    }
  

    function getData(url_address, data_type, callback) {
        $.ajax({
            url: url_address,
            dataType: "json",
            type: "GET",
            success: function(data) {
//                console.log(data);
                passData(data, data_type);
                callback();

            },
            error: function() {
                console.log("ERROR!");
            }
        });
    }
    
    function passData(data, data_type) {
        if (data_type == "stock") {
            stock_data = data;
//            console.log(stock_data);
        }
        else if (data_type == "twitter") {
            twitter_data = data;
//            console.log(twitter_data);
        }
        else if (data_type == "prediction") {
            prediction_data = data;
//            console.log(prediction_data);
        }
    }

    

    
    
});

