$(document).ready(function() {
    
    // navigation
    
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
    
    
    
    // add tweet
    
    $(".addTweet").click(function() {
        d3.select(".r-tweet")
            .style("display", "block");
        
        d3.selectAll(".p-single-tweet, .p-ref-line, .p-ref-text, .p-pred-line-plot")
            .style("opacity", "1");
    });
    
    
    // prediction page demo button
//    $(".addTweet").click(function() {
//        var new_tweet = {
//            date: "2017-10-31",
//            favorite: "12345",
//            id: "925006418989715456",
//            retweet: "2355",
//            text: "xxxx",
//            time: "9:23"
//        }
//        
//        dataset_aggregated_twitter.push(new_tweet);
//        
//        drawResult();
//    });

    
    // history chart tab
    
//    $("#day").click(function() {
//        $(this).addClass("tab-active");
//        
//        $("#week").removeClass("tab-active");
//        $("#month").removeClass("tab-active");
//        $("#year").removeClass("tab-active");
//    });
//    
//    $("#week").click(function() {
//        $(this).addClass("tab-active");
//        
//        $("#day").removeClass("tab-active");
//        $("#month").removeClass("tab-active");
//        $("#year").removeClass("tab-active");
//    });
//    
//    $("#month").click(function() {
//        $(this).addClass("tab-active");
//        
//        $("#day").removeClass("tab-active");
//        $("#week").removeClass("tab-active");
//        $("#year").removeClass("tab-active");
//    });
//    
//    $("#year").click(function() {
//        $(this).addClass("tab-active");
//        
//        $("#day").removeClass("tab-active");
//        $("#week").removeClass("tab-active");
//        $("#month").removeClass("tab-active");
//    });
    
    
    
//    var stock_url = "https://twitter-stock.appspot.com/queryrange?end=2017-10-30&range=5&scale=1";
//    
//    var twitter_url = "https://twitter-stock.appspot.com/queryTweets?end=2017-10-30&range=5";
//    
//    var prediction_url = "https://twitter-stock.appspot.com/queryPredict?date=2016-07-29&time=18:30";
    
//    var parseDate = d3.timeParse("%Y-%m-%d");
//    
//    var parseTime = d3.timeParse("%H:%M");
    
    var tweets = d3.select("#tweets");

    var historySVG = d3.select("#history-chart");
    
    var r_tweets = d3.select("#recent-tweets");
    
    var predictSVG = d3.select("#prediction-chart");
    
    
    
    
//    getData(stock_url, "stock", drawResult);
//    getData(twitter_url, "twitter", drawResult);
//    getData(prediction_url, "prediction", drawResult);
        
    d3.queue()
        .defer(d3.csv, "../data/all_prediction_data.csv")
        .defer(d3.csv, "../data/all_stock_data.csv")
        .await(function(error, dataset_twitter, dataset_stock) {
                
            if(error) {
                console.error("Error while loading dataset.");
                console.error(error);
                return;
            }

            console.log(dataset_twitter);
//            console.log(dataset_stock);


            // dataset preprocessing
        
            dataset_twitter.forEach(function(d) {
                var date = parseInt(d.year) + "-" + parseInt(d.month) + "-" + parseInt(d.day) + " " + "0:00";
                
                var timeObj = moment(date, "YYYY-MM-DD HH:mm");
                
                var entire_time = timeObj.add(parseInt(d.minute), "m");
                
                d.entire_time = entire_time.toDate();
                d.entire_time_text = entire_time.format("YYYY-MM-DD HH:mm");
                d.created_at = entire_time.format("h:mm A - D MMM YYYY")
            });
        
            dataset_stock.forEach(function(d) {
                var date = parseInt(d.year) + "-" + parseInt(d.month) + "-" + parseInt(d.day) + " " + "4:00";
                
                var timeObj = moment(date, "YYYY-MM-DD HH:mm");
                
                var entire_time = timeObj.add(parseInt(d.num_minutes), "m");
                
                d.entire_time = entire_time.toDate();
                d.entire_time_text = entire_time.format("YYYY-MM-DD HH:mm");
//                d.date = parseDate(d.date);
//                d.time = parseTime(d.time);
            });
        
            twitter_nested = d3.nest()
                .key(function(c) {
                    return c.year;
                })
                .key(function(c) {
                    return c.month;
                })
                .entries(dataset_twitter);
        
            twitter_year_data = twitter_nested[0].values;
        
            twitter_month_data = twitter_year_data[0].values;
        
            var dataset_aggregated_twitter = twitter_month_data.filter(function(d) {
                return d.change == "1.0" || d.change == "2.0";
            });
        
            console.log(dataset_aggregated_twitter);
        
            stock_nested = d3.nest()
                .key(function(c) {
                    return c.year;
                })
                .key(function(c) {
                    return c.month;
                })
                .entries(dataset_stock);
        
//            console.log(stock_nested);
        
            stock_year_data = stock_nested[3].values;
        
//            console.log(stock_year_data);
        
            stock_month_data_tmp = stock_year_data.filter(function(d) { return d.key == "10.0"; });
        
            stock_month_data = stock_month_data_tmp[0].values;
        
//            console.log(stock_month_data);
        
            stock_month_data_nested = d3.nest()
                .key(function(c) {
                    return c.day;
                })
                .entries(stock_month_data);
        
//            console.log(stock_month_data_nested);
        
            stock_day_data_tmp = stock_month_data_nested.filter(function(d) { return d.key == "25.0"; });
        
//            console.log(stock_day_data_tmp);
        
            stock_day_data = stock_day_data_tmp[0].values;
        
//            console.log(stock_day_data);
        
            stock_day_data_sorted = stock_day_data.sort(function(a, b) { return d3.ascending(a.entire_time, b.entire_time); });
        
//            console.log(stock_day_data_sorted);
        
            stock_day_data_part = stock_day_data_sorted.filter(function(d) { return parseFloat(d.num_minutes) < 501.0; });
        
//            console.log(stock_day_data_part);
        
            dataset_aggregated_twitter_part = dataset_aggregated_twitter.filter(function(d) { return d.minute != "741.0"; });
        
//            console.log(dataset_aggregated_twitter_part);
        
            dataset_twitter_pick_tmp = dataset_aggregated_twitter.filter(function(d) { return d.minute == "741.0"; });
        
            console.log(dataset_twitter_pick_tmp);
        
            dataset_twitter_pick = [
                {
                    time: dataset_twitter_pick_tmp[0].entire_time,
                    price: dataset_twitter_pick_tmp[0].current_price
                }
            ];
        
            for (var i = 1; i <=30; i++) {
                var timeObj = moment(dataset_twitter_pick_tmp[0].entire_time_text, "YYYY-MM-DD HH:mm");
                
                var min = i * 1;
                
                var timeTmp = timeObj.add(i * 1, "m");
                
                var priceSign = "price" + i;
                
                var predObj = {
                    time: timeTmp.toDate(),
                    price: dataset_twitter_pick_tmp[0][priceSign]
                }
                
                dataset_twitter_pick.push(predObj);
            }
        
            console.log(dataset_twitter_pick);


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

            dataset_twitter.forEach(function(d) {
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
//            dataset_aggregated_twitter = [];
//
//            twitter_data.forEach(function(d) {
//                dataset_prediction.forEach(function(c) {
//                    if (parseFloat(d.id) == parseFloat(c.twt_id)) {
//                        dataset_aggregated_twitter.push(d);
//                        return true;
//                    }
//                });
//            });
//
//            dataset_aggregated_twitter.reverse();
        
            // history twitter section
        
            var tweetEnter = tweets.selectAll(".tweet")
                .data(dataset_aggregated_twitter)
                .enter()
                .append("div")
                .attr("class", "tweet")
                .attr("id", function(d) {
                    return "t" + d.tweet_id;
                });

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
        
        
            // add data to up volume container
        
            d3.selectAll(".up-volume-container")
                .attr("data-price-change", function(d) {
                    var price = "";
                    var future_price = "";
                    var price_change = "";
                    var price_percent = "";

                    var d_new = moment(d.entire_time_text, "YYYY-MM-DD HH:mm");

                    var d_new_30 = d_new.add(30, "m");

                    stock_month_data.forEach(function(c) {
                        if (d.entire_time_text == c.entire_time_text) {
                            price = c.close;
                        }
                    });

                    stock_month_data.forEach(function(c) {
                        var c_new = moment(c.entire_time_text, "YYYY-MM-DD HH:mm");


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

                    var d_new = moment(d.entire_time_text, "YYYY-MM-DD HH:mm");

                    var d_new_30 = d_new.add(30, "m");

                    stock_month_data.forEach(function(c) {
                        if (d.entire_time_text == c.entire_time_text) {
                            price = c.close;
                        }
                    });

                    stock_month_data.forEach(function(c) {
                        var c_new = moment(c.entire_time_text, "YYYY-MM-DD HH:mm");


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
            

            // tweet tooltip

            tweetEnter.append("div")
                .attr("class", "tooltip");

            d3.selectAll(".side")
                .on("mouseover", function(d) {
                    var price = "";
                    var future_price = "";
                    var price_change = "";
                    var price_percent = "";

                    var d_new = moment(d.entire_time_text, "YYYY-MM-DD HH:mm");

                    var d_new_30 = d_new.add(30, "m");

                    stock_month_data.forEach(function(c) {
                        if (d.entire_time_text == c.entire_time_text) {
                            price = c.close;
                        }
                    });

                    stock_month_data.forEach(function(c) {
                        var c_new = moment(c.entire_time_text, "YYYY-MM-DD HH:mm");

                        if (c_new.format() == d_new_30.format()) {
                            future_price = c.close;
                        }
                    });

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
                    return d.created_at;
                }); 

            tweetEnter.append("div")
                .attr("class", "row2");

            tweetEnter.selectAll(".row2")
                .append("p")
                .attr("class", "content")
                .text(function(d) {
                    return d.clean_text;
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
                    return d.favorite_count;
                });

            tweetEnter.selectAll(".row3")
                .append("img")
                .attr("src", "./image/forward.svg")
                .attr("class", "retweet");

            tweetEnter.selectAll(".row3")
                .append("p")
                .attr("class", "retweet-text")
                .text(function(d) {
                    return d.retweet_count;
                });

            tweetEnter.append("div")
                .attr("class", "break-line");

            tweetEnter.append("div")
                .attr("class", "row4")
                .on("click", function(d) {
                    var url = "https://twitter.com/realDonaldTrump/status/" + d.tweet_id;

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


            // recent tweets
        
            var r_tweetEnter = r_tweets.selectAll(".r-tweet")
                .data(dataset_aggregated_twitter)
                .enter()
                .append("div")
                .attr("class", "r-tweet");

            r_tweetEnter.append("div")
                .attr("class", "r-row1")
                .append("div")
                .attr("class", "profile-pic");

            r_tweetEnter.selectAll(".r-row1")
                .append("div")
                .attr("class", "name-info")
                .append("p")
                .attr("class", "name")
                .text("Donald J. Trump")

            r_tweetEnter.selectAll(".name-info")
                .append("p")
                .attr("class", "username")
                .text("@realDonaleTrump");

            r_tweetEnter.selectAll(".r-row1")
                .append("p")
                .attr("class", "create-time")
                .text(function(d) {
                    return d.created_at;
                }); 

            r_tweetEnter.append("div")
                .attr("class", "r-row2");

            r_tweetEnter.selectAll(".r-row2")
                .append("p")
                .attr("class", "content")
                .text(function(d) {
                    return d.clean_text;
                });

            r_tweetEnter.append("div")
                .attr("class", "r-row3");

            r_tweetEnter.selectAll(".r-row3")
                .append("img")
                .attr("src", "./image/heart.svg")
                .attr("class", "favorite");

            r_tweetEnter.selectAll(".r-row3")
                .append("p")
                .attr("class", "favorite-text")
                .text(function(d) {
                    return d.favorite_count;
                });

            r_tweetEnter.selectAll(".r-row3")
                .append("img")
                .attr("src", "./image/forward.svg")
                .attr("class", "retweet");

            r_tweetEnter.selectAll(".r-row3")
                .append("p")
                .attr("class", "retweet-text")
                .text(function(d) {
                    return d.retweet_count;
                });

            r_tweetEnter.append("div")
                .attr("class", "break-line");

            r_tweetEnter.append("div")
                .attr("class", "r-row4")
                .on("click", function(d) {
                    var url = "https://twitter.com/realDonaldTrump/status/" + d.tweet_id;

                    window.open(url, '_blank');
                });

            r_tweetEnter.selectAll(".r-row4")
                .append("img")
                .attr("src", "./image/link.svg")
                .attr("class", "link-icon");

            r_tweetEnter.selectAll(".r-row4")
                .append("p")
                .attr("class", "link")
                .text("View original tweet");

            r_tweetEnter.selectAll(".r-row4")
                .append("img")
                .attr("src", "./image/arrow-right.svg")
                .attr("class", "arrow");
        
            d3.select(".r-tweet")
                .style("display", "none");

        
            // history line chart
        
            xExtent = d3.extent(stock_month_data, function(d) {
                return d.entire_time;
            });

            yExtent = d3.extent(stock_month_data, function(d) {
                return parseFloat(d.close);
            });

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

            focus.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(0, 465)")
                .call(xAxis);

            focus.append("g")
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
                    return xScale(d.entire_time);
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
                .data([stock_month_data])
                .enter()
                .append("path")
                .attr("class", "line-plot")
                .attr("d", lineInterpolate);
        
            
            // history dots

            dataset_dots = [];

            stock_month_data.forEach(function(d) {
                dataset_aggregated_twitter.forEach(function(c) {
                    if (c.entire_time_text == d.entire_time_text) {
                        dataset_dots.push(d);
                    }
                });
            });

//            console.log(dataset_dots);

            lineChart.selectAll(".tweet-dot")
                .data(dataset_dots)
                .enter()
                .append("circle")
                .attr("class", "tweet-dot")
                .attr("r", "7.5")
                .attr("cx", function(d) {
                    return xScale(d.entire_time);
                })
                .attr("cy", function(d) {
                    return yScale(parseFloat(d.close));
                })
                .style("fill", "#d23f31");
        
        
            // history tweet icon

            tweetIcon = lineChart.selectAll(".single-tweet")
                .data(dataset_aggregated_twitter)
                .enter()
                .append("image")
                .attr("class", "single-tweet")
                .attr("xlink:href", "../image/twitter-logo.svg")
                .attr("width", "30")
                .attr("height", "30")
                .attr("transform", function(d) {
                    return "translate(" + xScale(d.entire_time) + ", 430)";
                });
        
            
            // history dot tooltip

            d3.selectAll(".single-tweet")
                .on("mouseover", function(d) {
                    var id = "t" + d.tweet_id;
                
                    var positionX = $(this).offset().left - 350;

                    d3.selectAll(".tweet-dot")
                        .filter(function(c) {
                            return c.entire_time_text == d.entire_time_text;
                        })
                        .classed("selected", true)
                        .style("opacity", "1");

                    var positionY = $(".selected").offset().top - 150;

                    var price = "";
                    var future_price = "";
                    var price_change = "";
                    var price_percent = "";
                    var predict_text = "";
                    var predict_icon = "";

                    var d_new = moment(d.entire_time_text, "YYYY-MM-DD HH:mm");

                    var d_new_30 = d_new.add(30, "m");

                    stock_month_data.forEach(function(c) {
                        if (d.entire_time_text == c.entire_time_text) {
                            price = c.close;
                        }
                    });

                    stock_month_data.forEach(function(c) {
                        var c_new = moment(c.entire_time_text, "YYYY-MM-DD HH:mm");

                        if (c_new.format() == d_new_30.format()) {
                            future_price = c.close;
                        }
                    });

                    price_change = parseFloat(future_price) - parseFloat(price);

                    price_percent = ((price_change / parseFloat(price)) * 100).toFixed(2);

                    var tag = "";

                    if (price_change >= 0) {
                        tag = "+";
                    }

                    d3.select(".chart-tooltip")
                        .style("display", "block")
                        .style("left", positionX + "px")
                        .style("top", positionY + "px")
                        .html(function() {
                            return "<div style='display: flex; flex-direction: row; margin-top: 0.14rem;'><p class='chart-tooltip-text1'>" + d.created_at + "</p></div><div style='display: flex; flex-direction: row; align-items: center; margin-top: 0.14rem;'><p class='chart-tooltip-text2'>Original Price</p><p class='chart-tooltip-text3'>USD " + price + "</p></div><div style='display: flex; flex-direction: row; align-items: center; margin-top: 0.14rem;'><p class='chart-tooltip-text2'>Change in 30 min</p><p class='chart-tooltip-text4'>" + tag + price_change.toFixed(2) + "<span style='color: #a2a9c4;'> / </span>" + tag + price_percent + "%</p></div><div style='display: flex; flex-direction: row; align-items: center; margin-top: 0.14rem;'><p class='chart-tooltip-text2'>Predicted Trend</p><img src='" + predict_icon + "' class='predict-icon'><p class='chart-tooltip-text5'>" + predict_text + "</p></div>";
                        });
                
                    if (price_change >= 0) {
                        $(".chart-tooltip-text4").css("color", "#4eb784");
                        $(".predict-icon").attr("src", "../image/up.svg");
                        $(".chart-tooltip-text5").text("up");
                        $(".chart-tooltip-text5").css("color", "#4eb784");
                        $("#" + id).css("border", "solid 0.03rem #4eb784");
                    }
                    else {
                        $(".chart-tooltip-text4").css("color", "#d23f31");
                        $(".predict-icon").attr("src", "../image/down.svg");
                        $(".chart-tooltip-text5").text("down");
                        $(".chart-tooltip-text5").css("color", "#d23f31");
                        $("#" + id).css("border", "solid 0.03rem #d23f31");
                    }
                
                    
                })
                .on("mouseout", function(d) {
                    d3.selectAll(".tweet")
                        .filter(function(c) {
                            return c.entire_time_text == d.entire_time_text;
                        })
                        .style("border", "solid 0.01rem #d3d6e1");

                    d3.selectAll(".tweet-dot")
                        .filter(function(c) {
                            return c.entire_time_text == d.entire_time_text;
                        })
                        .classed("selected", false)
                        .style("opacity", "0");

                    d3.select(".chart-tooltip")
                        .style("display", "none");
                })
                .on("click", function(d) {
                    var id = "t" + d.tweet_id;
                
                    var scrTop = $("#" + id).position().top;
                
                    $("#tweets").animate({
                        scrollTop: $("#tweets").scrollTop() + scrTop
                    }, 400);
                });
        
        
            // history brush and zoom

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


            // prediction line chart
        
            p_xExtent = d3.extent(stock_day_data, function(d) {
                return d.entire_time;
            });

//            p_yExtent = d3.extent(stock_day_data, function(d) {
//                return parseFloat(d.close);
//            });

            p_yExtent_vmax = d3.max(stock_day_data_part, function(d) {
                return parseFloat(d.close) + 0.35 + parseFloat(d.volume) * 0.0000001 * 0.5;
            });

            p_yExtent_vmin = d3.min(stock_day_data_part, function(d) {
                return parseFloat(d.close) - 0.35 - parseFloat(d.volume) * 0.0000001 * 0.5;
            });

            p_yExtent_v = [p_yExtent_vmin, p_yExtent_vmax];

            p_xScale = d3.scaleTime()
                .range([40, 1350]);

            p_xScale_brush = d3.scaleTime()
                .range([40, 1350]);

            p_yScale = d3.scaleLinear()
                .domain(p_yExtent_v)
                .range([420, 40]);

            p_yGrid = d3.axisLeft(p_yScale)
                .ticks(7)
                .tickSize(-1310)
                .tickFormat("");

            p_xAxis = d3.axisBottom(p_xScale)
                .ticks(5);

            p_yAxis = d3.axisLeft(p_yScale)
                .ticks(7);

            p_zoom = d3.zoom()
                .scaleExtent([1, 10])
                .on("zoom", p_zoomed);

            p_focus = predictSVG.append("g")
                .attr("class", "p-focus")
                .attr("transform", "translate(0, 0)");

            p_xScale.domain(p_xExtent);

            p_xScale_brush.domain(p_xScale.domain());

            p_focus.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(0, 465)")
                .call(p_xAxis);

            p_focus.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(40, 0)")
                .call(p_yAxis);

            p_focus.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(40, 0)")
                .call(p_yGrid);

            p_focus.append("text")
                .attr("class", "stock-name")
                .attr("transform", "translate(-5, 15)")
                .text("SPDR S&P 500 ETF TRUST");

            p_lineInterpolate = d3.line()
                .x(function(d) {
                    return p_xScale(d.entire_time);
                })
                .y(function(d) {
                    return p_yScale(parseFloat(d.close));
                });

            p_clip = predictSVG.append("defs")
                .append("clipPath")
                .attr("id", "p-clip")
                .append("rect")
                .attr("width", "1310")
                .attr("height", "420")
                .attr("transform", "translate(40, 40)");

            volumeArea = d3.area()
//                    .interpolate("basis")
                .x(function(d) {
                    return p_xScale(d.entire_time);
                })
                .y0(function(d) {
                    return p_yScale(parseFloat(d.close) + 0.35 + parseFloat(d.volume) * 0.0000001 * 0.5);
                })
                .y1(function(d) {
                    return p_yScale(parseFloat(d.close) - 0.35 - parseFloat(d.volume) * 0.0000001 * 0.5);
                });

            p_areaChart = predictSVG.append("g")
                .attr("clip-path", "url(#p-clip)")
                .attr("class", "p-focus")
                .attr("transform", "translate(0, 0)");

            p_areaChart.selectAll(".p-area")
                .data([stock_day_data_part])
                .enter()
                .append("path")
                .attr("class", "p-area")
                .attr("d", volumeArea);

            p_lineChart = predictSVG.append("g")
                .attr("clip-path", "url(#p-clip)")
                .attr("class", "p-focus")
                .attr("transform", "translate(0, 0)");

            p_lineChart.selectAll(".p-line-plot")
                .data([stock_day_data_part])
                .enter()
                .append("path")
                .attr("class", "p-line-plot")
                .attr("d", p_lineInterpolate);
        
            p_tweetIcon = p_lineChart.selectAll(".p-single-tweet")
                .data(dataset_aggregated_twitter.filter(function(d) { return d.minute == "741.0"; }))
                .enter()
                .append("image")
                .attr("class", "p-single-tweet")
                .attr("xlink:href", "../image/twitter-logo.svg")
                .attr("width", "30")
                .attr("height", "30")
                .attr("transform", function(d) {
                    return "translate(" + p_xScale(d.entire_time) + ", 430)";
                });
        
            p_ref_line = p_lineChart.selectAll(".p-ref-line")
                .data(dataset_aggregated_twitter.filter(function(d) { return d.minute == "741.0"; }))
                .enter()
                .append("line")
                .attr("class", "p-ref-line")
                .attr("x1", function(d) {
                    return p_xScale(d.entire_time);
                })
                .attr("y1", "440")
                .attr("x2", function(d) {
                    return p_xScale(d.entire_time);
                })
                .attr("y2", "30");
        
            p_ref_text = p_lineChart.selectAll(".p-ref-text")
                .data(dataset_aggregated_twitter.filter(function(d) { return d.minute == "741.0"; }))
                .enter()
                .append("text")
                .attr("class", "p-ref-text")
                .attr("transform", function(d) {
                    return "translate(" + p_xScale(d.entire_time) + ", 60)";
                })
                .text(function(d) {
                    return "12:21 PM - USD 268.91";
                });
        
            p_pred_lineInterpolate = d3.line()
                .x(function(d) {
                    return p_xScale(d.time);
                })
                .y(function(d) {
                    return p_yScale(parseFloat(d.price));
                });
        
            p_pred_lineChart = predictSVG.append("g")
                .attr("clip-path", "url(#p-clip)")
                .attr("class", "p-focus")
                .attr("transform", "translate(0, 0)");

            p_pred_lineChart.selectAll(".p-pred-line-plot")
                .data([dataset_twitter_pick])
                .enter()
                .append("path")
                .attr("class", "p-pred-line-plot")
                .attr("d", p_pred_lineInterpolate);

            predictSVG.append("rect")
                .attr("class", "zoom")
                .attr("width", "1310")
                .attr("height", "380")
                .attr("transform", "translate(40, 40)")
                .call(p_zoom);
        
            d3.selectAll(".p-single-tweet, .p-ref-line, .p-ref-text, .p-pred-line-plot")
                .style("opacity", "0");
        
        });

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

        var s = d3.event.selection || xScale_brush.range();

        xScale.domain(s.map(xScale_brush.invert, xScale_brush));

        lineChart.select(".line-plot")
            .attr("d", lineInterpolate);

        focus.select(".x")
            .call(xAxis);

        d3.selectAll(".tweet-dot")
            .attr("cx", function(d) {
                return xScale(d.entire_time);
            })
            .attr("cy", function(d) {
                return yScale(parseFloat(d.close));
            });

        d3.selectAll(".single-tweet")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.entire_time) + ", 430)";
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

        lineChart.select(".line-plot")
            .attr("d", lineInterpolate);

        focus.select(".x")
            .call(xAxis);
        
        d3.selectAll(".tweet-dot")
            .attr("cx", function(d) {
                return xScale(d.entire_time);
            })
            .attr("cy", function(d) {
                return yScale(parseFloat(d.close));
            });
        
        d3.selectAll(".single-tweet")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.entire_time) + ", 430)";
            });

        context.select(".brush")
            .call(brush.move, xScale.range().map(t.invertX, t));
    }
    
    function p_zoomed() {

        var t = d3.event.transform;
        
        p_xScale.domain(t.rescaleX(p_xScale_brush).domain());
        
        p_lineChart.select(".p-line-plot")
            .attr("d", p_lineInterpolate);
        
        p_areaChart.select(".p-area")
            .attr("d", volumeArea);

        p_focus.select(".x")
            .call(p_xAxis);
        
        d3.selectAll(".p-single-tweet")
            .attr("transform", function(d) {
                return "translate(" + p_xScale(d.entire_time) + ", 430)";
            });
        
        p_lineChart.select(".p-ref-line")
            .attr("x1", function(d) {
                return p_xScale(d.entire_time);
            })
            .attr("x2", function(d) {
                return p_xScale(d.entire_time);
            })
        
        p_lineChart.select(".p-ref-text")
            .attr("transform", function(d) {
                return "translate(" + p_xScale(d.entire_time) + ", 60)";
            });
        
        p_pred_lineChart.selectAll(".p-pred-line-plot")
                .attr("d", p_pred_lineInterpolate);
        
    }
  
  

//    function getData(url_address, data_type, callback) {
//        $.ajax({
//            url: url_address,
//            dataType: "json",
//            type: "GET",
//            success: function(data) {
////                console.log(data);
//                passData(data, data_type);
//                callback();
//
//            },
//            error: function() {
//                console.log("ERROR!");
//            }
//        });
//    }
//    
//    function passData(data, data_type) {
//        if (data_type == "stock") {
//            stock_data = data;
////            console.log(stock_data);
//        }
//        else if (data_type == "twitter") {
//            twitter_data = data;
////            console.log(twitter_data);
//        }
//        else if (data_type == "prediction") {
//            prediction_data = data;
////            console.log(prediction_data);
//        }
//    }

    

    
    
});

