const advocatePanel = document.getElementById('advocate-panel');

advocatePanel.addEventListener('mousemove', (e) => {
    const width = advocatePanel.offsetWidth;
    let mouseX = e.clientX - advocatePanel.offsetLeft;
    let offset = (mouseX / width) * 100 - 50;
    let speed = (mouseX / width - 0.5) * 2;

    advocatePanel.style.transform = `translateX(${offset}px)`;
    advocatePanel.style.transitionDuration = `${0.5 - Math.abs(speed) * 0.5}s`;
    advocatePanel.style.transitionTimingFunction = 'linear';
    advocatePanel.scrollLeft += speed * 10;
});
