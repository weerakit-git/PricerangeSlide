const slider = document.querySelector('.range-slider');
const progress = slider.querySelector('.progress');
const minPriceInput = slider.querySelector('.min-price');
const maxPriceInput = slider.querySelector('.max-price');
const minInput = slider.querySelector('.min-input');
const maxInput = slider.querySelector('.max-input');

const updateProgress = () => {
    const minValue = parseInt(minInput.value);
    const maxValue = parseInt(maxInput.value);
    const range = maxInput.max - minInput.min;
    const valueRange = maxValue - minValue;
    const width = (valueRange / range) * 100;
    const minOffset = ((minValue - minInput.min) / range) * 100;
    progress.style.width = width + '%';
    progress.style.left = minOffset + '%';

    minPriceInput.value = minValue;
    maxPriceInput.value = maxValue;
}

const updateRange = (event) => {
    const input = event.target;
    const min = parseInt(minPriceInput.value);
    const max = parseInt(maxPriceInput.value);

    if (input === minPriceInput && min > max) {
        max = min;
        maxPriceInput.value = max;
    }
    else if (input === maxPriceInput && max < min) {
        min = max;
        minPriceInput.value = min;
    }

    minInput.value = min;
    maxInput.value = max;
    updateProgress();
}
minPriceInput.addEventListener('input', updateRange);
maxPriceInput.addEventListener('input', updateRange);
minInput.addEventListener('input', () => {
    if (parseInt(minInput.value) >= parseInt(maxInput.value)) {

        maxInput.value = minInput.value;
    }
    updateProgress();
})

maxInput.addEventListener('input', () => {
    if (parseInt(maxInput.value) <= parseInt(minInput.value)) {
        minInput.value = maxInput.value;
    }
    updateProgress();
})


progress.addEventListener('mousedown', startDrag);
progress.addEventListener('touchstart', startDrag, { passive: false });

document.addEventListener('mousemove', onDrag);
document.addEventListener('touchmove', onDrag, { passive: false });

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);


function getClientX(event) {
  if (event.touches) {
    return event.touches[0].clientX;
  }
  return event.clientX;
}

function startDrag(event) {
    event.preventDefault();
    isDragging = true;
    const clientX = getClientX(event);
    startOffsetX = clientX - progress.getBoundingClientRect().left;
    slider.classList.toggle('dragging', isDragging);
}

function onDrag(event) {
    if (!isDragging) return;

    const sliderRect = slider.getBoundingClientRect();
    const progressWidth = parseFloat(progress.style.width || 0);
    const clientX = getClientX(event);

    let newLeft = ((clientX - sliderRect.left - startOffsetX) / sliderRect.width) * 100;
    newLeft = Math.min(Math.max(newLeft, 0), 100 - progressWidth);

    progress.style.left = newLeft + '%';

    const range = maxInput.max - minInput.min;
    const newMin = Math.round((newLeft / 100) * range + parseInt(minInput.min));
    const newMax = newMin + parseInt(maxInput.value) - parseInt(minInput.value);

    minInput.value = newMin;
    maxInput.value = newMax;
    updateProgress();
}

function stopDrag() {
    if (isDragging) {
        isDragging = false;
        slider.classList.toggle('dragging', false);
    }
}


updateProgress();