module.exports = function (casper) {
    return casper.evaluate(function () {
        var cars = [];
        var sel = $('.item_table');
        $.each(sel, function (key, val) {
            var $item = $(val);
            var fullDescription = $item.find('.about').text().split('\n');
            var price = fullDescription[1].trim();
            var description = fullDescription[2].trim();

            var image = $item.find('.photo-wrapper > img').data('srcpath');
            if(!image) {
                image = $item.find('.photo-wrapper > img').attr('src');
            }
            cars.push({
                url: $item.find('.item-description-title-link').attr('href'),
                photo: image,
                description: description,
                price: price
            });
        });
        return cars;
    });
};