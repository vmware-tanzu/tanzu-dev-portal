function autoScroll(element) {
    let scrollSpeed = 0;
    const maxSpeed = 10;

    function handleMouseMove(event) {
        const center = {
            x: element.offsetLeft + element.offsetWidth / 2,
        };
        const distanceFromCenterX = Math.abs(event.clientX - center.x);
        const distanceFromEdgeX = Math.max(distanceFromCenterX - 100, 0);
        const scrollX = (event.clientX > center.x ? 1 : -1) * (distanceFromEdgeX / (element.offsetWidth / 2)) * maxSpeed;

        element.scrollLeft += scrollX;

        scrollSpeed = Math.min(Math.abs(scrollX), maxSpeed);
    }

    element.addEventListener('mousemove', handleMouseMove);

    function handleScroll() {
        if (scrollSpeed > 0) {
            scrollSpeed *= 0.9;
            if (scrollSpeed < 0.1) {
                scrollSpeed = 0;
            }
        }
    }

    element.addEventListener('scroll', handleScroll);
}

autoScroll(document.getElementById('advocate-panel'));
