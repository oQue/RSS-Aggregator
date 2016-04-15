$(function() {
    
    $("#menu_button").click(function () {
        $('.ui.sidebar').sidebar({
            dimPage          : true,
            transition       : 'overlay',
            mobileTransition : 'uncover'    
        });
        $('.ui.sidebar').sidebar("toggle");
    });
    
});
    
var yqlCallback = function(data) {
    var result = data.query.results.item;
    console.log(result);
    var container = $('#content');
    for (var i = 0; i < result.length; i++) {
        var item = '<h3 class="ui top attached header"><a href="' + result[i].link + '" target="_blank">' + result[i].title + '</a></h3><div class="ui attached segment"><div class="ui blue ribbon label">' + result[i].pubDate + '</div><div>' + result[i].description + '</div>'
        container.append(item);
    }
    $('#loaderDiv').remove();
};