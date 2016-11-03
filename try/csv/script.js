$(document).ready(function () {
    console.log("ready!");

    filenames = [
        "fac_1234_5-10-7-3-10.csv",
        "fac_12345_3-7-7-2-6.csv",
        "fac_12345_5-10-7-3-10.csv",
        "fac_123456_3-7-7-2-6.csv",
        "fac_123457_2-10-8-1-3.csv",
        "fac_123457_3-7-7-2-6.csv"
    ];
    (function () {
        $.each(filenames, function (val, text) {
            // val - index.. text - ary element val
            $('#list').append($('<option></option>').val(val).html(text))
        })
    }());

// var o = new Option(filenames);
// // jquerify the DOM object 'o' so we can use the html method
// $(o).html("option text");
// $("#list").append(o);

    d3.select('#rand').on('click', function () {
        ary_len = filenames.length;
        var rand_file = filenames[Math.floor(Math.random() * ary_len)];

        d3draw(rand_file);
    });

    d3.select('#render').on('click', function () {
        selected_file = filenames[$("#list").val()];
        d3draw(selected_file);
    });

    d3draw(filenames[0]);

    function d3draw(filename) {
        console.log("Drawing " + filename);
        draw(filename);
        svg.selectAll("*").remove(); // clearing
    }

});
