// Function to initialize page upon load
function init() {
    var url = "/api/statelist";
    d3.json(url).then(function (menuData) {
        console.log(menuData);

        // Prepare menu items for State dropdown
        for (var i = 0; i < menuData.length; i++) {
            d3.select("#selDataset")
                .append("option").text(menuData[i].State);
        }

        // Populate demographic info box with first ID
        var state = menuData[0].State;

        url = "/api/" + state + "/counties";
        d3.json(url).then(function (countyData) {
            console.log(countyData);
            // Prepare menu items for County dropdown
            for (var i = 0; i < countyData.length; i++) {
                d3.select("#selCountyDataset")
                    .append("option").text(countyData[i].County);
            }

            var county = countyData[0].County;

            plotScatterCounty(state, county)
        })
    });
};

// Plots scatterplot based on raw values
function plotScatterCounty(state, county) {
    // PLOT SCATTERPLOT BY COUNTY
    url = "/api/v5/" + state +"/"+ county;
    d3.json(url).then(function (plotData) {
        console.log(plotData);

        var counties_array = [];
        var housing_value = [];
        var months = [];
        var years = [];
        var ts_value = [];
        var interest_rates = [];

        for (var i = 0; i < plotData.length; i++) {
            counties_array.push(plotData[i].County); // county
            housing_value.push(plotData[i].HousingValue); // housing value
            months.push(plotData[i].Month); // month
            years.push(plotData[i].Year); // year
            ts_value.push(plotData[i].TSValue); // ts
            interest_rates.push(plotData[i].InterestRate); // interest rate
        }

        // Build graph with first ID
        var data = [{
            x: ts_value,
            y: housing_value,
            mode: 'markers',
            type: 'scatter',
            name: 'County',
            // text: county_names,
            showlegend: false,
            marker: {
                size: 13,
                color: interest_rates,
                colorscale: 'Viridis',
                colorbar: {
                    thickness: 30,
                    title:"Interest rates"
                }
            },

            // hovertemplate:
            //     "<b>%{text}</b><br><br>" +
            //     "%{yaxis.title.text}: %{y:.2%}<br>" + // CHECK!
            //     "%{xaxis.title.text}: %{x:.2f}<br>" +
            //     "<extra></extra>",
        }];

        var layout = {
            hovermode: "closest",
            hoverlabel: { bgcolor: "#FFF" },
            xaxis: {
                // range: [d3.min(x_values) - 10, d3.max(x_values) + 10],
                title: "Time",
                // showgrid:false,
                gridcolor: '#ffff',
                ticklen: 4

            },
            yaxis: {
                // range: [d3.min(y_values) - 0.01, d3.max(y_values) + 0.05],
                title: "Average property value",
                // showgrid: false,
                gridcolor: '#ffff',
                ticklen: 4
            },
            plot_bgcolor: 'rgba(240,240,240, 0.95)',
            title: `${county}, ${state}`,
            autosize: false,
            width: 900,
            height: 500,
            margin: {
                l: 100,
                r: 50,
                b: 100,
                t: 100,
                pad: 10
            },
            legend: {
                x: 1,
                xanchor: 'right',
                y: 1,
                font: {
                    family: 'sans-serif',
                    size: 12,
                    color: '#000'
                },
                bgcolor: '#E2E2E2',
                bordercolor: '#FFFFFF',
                borderwidth: 1
            },
            font: {
                family: 'Arial, sans-serif'
            }
        };

        Plotly.newPlot('scatter-county', data, layout);

        ///regression models
       
        var url = "/api/v6/" + state +"/"+ county;
        d3.json(url).then(function (plotData) {
        console.log(plotData);
        });
    })
}

function optionChanged(option) {
    // Get the state abbreviation equivalent
    var url = "/api/statelist";

    d3.json(url).then(function (stateList) {
        console.log(stateList);
        abbrevDict = stateList.filter(d => d.State[0] === option);
        console.log(abbrevDict);
        state = abbrevDict[0].State;

        url = "/api/" + state + "/counties";
        d3.json(url).then(function (countyData) {
            console.log(countyData);
            // Empty county dropdown
            d3.select("#selCountyDataset").html("");
            // Prepare menu items for county dropdown
            for (var i = 0; i < countyData.length; i++) {
                d3.select("#selCountyDataset")
                    .append("option").text(countyData[i].County);
            }
            county = countyData[0].County;

            plotScatterCounty(state, county);
        });
    });
};

function countyChanged(county) {

    var state = d3.select("#selDataset").node().value;
    console.log(state);

    plotScatterCounty(state, county);
}

init()