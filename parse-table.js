module.exports = function (casper) {
    return casper.evaluate(function () {
        var cars = [];
        var sel = $('.description');
        $.each(sel, function (key, val) {
            var $descriptionBlock = $(val);
            cars.push({
                url: $descriptionBlock.find('.item-description-title-link').attr('href'),
                description: $descriptionBlock.find('.about').text()
            });
        });
        return cars;
    });
};