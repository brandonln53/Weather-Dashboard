// var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=Denver&appid=27e1ff91585923eba53dd5c136acca4e";

$(document).ready(function(){
    var displayDate = moment();
       
    displayDate = displayDate.add(1 +'d');
    var futureDate = displayDate.format('l');
        
    $("#search-button").on("click", function(){
        var searchCity = $("#search-value").val();
        // var searchCity = "Denver";
        searchWeather(searchCity);
    })
    $(".history").on("click", "li", function(){
        searchWeather($(this).text());
    })

    function makeRow(text){
        var li = $("<li>").text(text);
        $(".history").append(li);
        $("#search-value").empty();
    }

    function searchWeather(searchCity){
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=27e1ff91585923eba53dd5c136acca4e&units=imperial",
            dataType: "JSON",
            success: function(data){
                if (history.indexOf(searchCity) === -1){
                    history.push(searchCity);
                    window.localStorage.setItem("history", JSON.stringify(history));
                    makeRow(searchCity);
                }
                $("#today").empty();
                var card = $("<div>").addClass("card");
                var time = moment().format("LLL");
                
                var city = $("<h1>").addClass("cityName").text(`${data.name}`);
                var date = $("<h3>").addClass("date").text(`Date: ${time}`);
                var iconImage = $("<img>").addClass("icon-image").attr("src","https://openweathermap.org/img/w/" + data.weather[0].icon +".png");

                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp +"F°");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "mph");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
                var cardBody = $("<div>").addClass("card-body");

                cardBody.append(city, date, iconImage, temp, humid, wind);
                card.append(cardBody);
                $("#today").append(card);
                getWeather(searchCity);
                // this is where the bonus UV index function would go.
            }
        })
    }
    function getWeather(searchCity){
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=27e1ff91585923eba53dd5c136acca4e&units=imperial",
            dataType: "JSON",
            success: function(data){
                $("#forecast").html("<h4>5-Day Forecast</h4>").append("<div class='row'>");
                for (
                    var i = 0; i < data.list.length; i++
                ){
                    if(data.list[i].dt_txt.indexOf("15:00:00") !== -1){
                    var col = $("<div>").addClass("col-md-2");
                    var card = $("<div>").addClass("card bg-primary text-white");
                    var body = $("<div>").addClass("card-body p-2");
                    var img = $("<div>").html(`<img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">`);
                    var p1 = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp_max + "F°");
                    var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    col.append(card.append(body.append(futureDate, img, p1, p2)));
                    $("#forecast .row").append(col);
                }}
            }
        })
    }

    var history = JSON.parse(window.localStorage.getItem("history")) || [];
    if(history.length > 0){
        searchWeather(history[history.length - 1]);
    }
    for (
        var i = 0; i < history.length; i++
    ){
        makeRow(history[i]);
    }
});

localStorage.clear();
