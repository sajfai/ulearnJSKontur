addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    let moveAndHide;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide = animaster().moveAndHide(block, 10000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 21000);
        });
    let animation;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animation = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            animation.stop();
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHide.reset();
        });
}

function animaster() {
    /**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    function moveAndHide(element, duration) {
        animaster().move(element, 2 / 5 * duration, { x: 100, y: 20 });
        const timeoutID = setTimeout(() => {
            animaster().fadeOut(element, 3 / 5 * duration);
        }, 2 / 5 * duration);
        return {
            reset: () => {
                clearTimeout(timeoutID);
                resetFadeOut(element);
                resetMoveAndScale(element);
            }
        }
    }

    function showAndHide(element, duration) {
        animaster().fadeIn(element, 1 / 3 * duration);
        setTimeout(() => {
            animaster().fadeOut(element, 1 / 3 * duration)
        }, 2 / 3 * duration);
    }

    function decreaseAndIncrease(element, duration, increase, decrease) {
        animaster().scale(element, duration, increase);
        setTimeout(() => { animaster().scale(element, duration, decrease); }, duration);
    }

    function heartBeating(element) {
        const intervalID = setInterval(() => { animaster().decreaseAndIncrease(element, 500, 1.4, 1);}, 1000);
        animaster().decreaseAndIncrease(element, 500, 1.4, 1);
        return {
            stop: () => {clearInterval(intervalID);}
        }
    }

    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }

    function resetMoveAndScale(element) {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }

    return {
        scale: scale,
        move: move,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        decreaseAndIncrease: decreaseAndIncrease,
        heartBeating: heartBeating
    }
}

