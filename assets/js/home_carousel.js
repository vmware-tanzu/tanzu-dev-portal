function scrollPanel (event) {
    let amount = 0;
    let directionModifier;
    const $carousel = $('#advocate-panel');
    const scrollOffset = $carousel.scrollLeft();
    if ($(event.target).closest('div').hasClass('arrow-left')) {
        amount = $carousel.width() / 2 - scrollOffset;
        directionModifier = -1;
    } else {
        amount = $carousel.width() / 2 + scrollOffset;
        directionModifier = 1;
    }
    $carousel.animate({ scrollLeft: amount * directionModifier }, 1000);
}

function debounceLeading(func, timeout = 800) {
    let timer;
    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}

$('div.arrow-left i, div.arrow-right i').on('click', debounceLeading((event) => scrollPanel(event)));