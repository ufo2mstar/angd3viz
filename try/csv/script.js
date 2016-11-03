$(document).ready(function () {
    console.log("ready!");

    // Files for rendering!

    // filenames = [
    //     "fac_1234_5-10-7-3-10.csv",
    //     "fac_12345_3-7-7-2-6.csv",
    //     "fac_12345_5-10-7-3-10.csv",
    //     "fac_123456_3-7-7-2-6.csv",
    //     "fac_123457_2-10-8-1-3.csv",
    //     "fac_123457_3-7-7-2-6.csv"
    // ];

    filenames = [
        "fac_15298_3-6-9-5-6.csv",
        "fac_22333_1-3-10-3-8.csv",
        "fac_22624_5-10-7-4-1.csv",
        "fac_24477_2-7-4-4-10.csv",
        "fac_28145_5-4-3-1-3.csv",
        "fac_31324_5-7-2-2-7.csv",
        "fac_51423_1-4-8-3-4.csv",
        "fac_59151_2-3-2-4-5.csv",
        "fac_59531_2-9-5-3-1.csv",
        "fac_77435_5-8-5-4-1.csv",
        "fac_81721_5-10-6-3-5.csv",
        "fac_88259_5-1-4-1-9.csv",
        "fac_88526_1-9-8-1-6.csv"
    ];

    // fill selectlist #list with the filenames
    $.each(filenames, function (val, text) {
        var o = new Option(val, text);
        // jquerifying the DOM object 'o' to use the jquery methods
        $(o).val(val).html(text);
        $("#list").append(o);
        // val - index.. text - ary element val.. oneliner!
        // $('#list').append($('<option></option>').val(val).html(text));
    });

    // calling the d3 render method..
    function d3draw(filename) {
        console.log("Drawing " + filename);
        draw(filename);
        svg.selectAll("*").remove(); // clearing
    }

    // setting last_rand as a rand display flag
    var last_rand = 0;

    // render a random file!
    d3.select('#rand').on('click', function () {
        ary_len = filenames.length;
        do { // to make sure we are not repeating previous rand
            var this_rand = Math.floor(Math.random() * ary_len);
        } while (this_rand == last_rand);
        var rand_file = filenames[this_rand];
        $('#list').val(this_rand);
        d3draw(rand_file);
    });

    // render the selected file..
    d3.select('#render').on('click', function () {
        selected_file = filenames[$("#list").val()];
        d3draw(selected_file);
    });

    // render on select list value change itself!
    $('#list').change(function () {
            console.log("change in list to " + filenames[$(this).val()]);
            $('#render').click()
        }
    );

    // first time rendering - donno why but, i always like doing it this way..
    $('#rand').click();
});
