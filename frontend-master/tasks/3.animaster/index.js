addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            //animaster().fadeIn(block);
            const customAnimation = animaster()
                .addFadeIn(2000)
            customAnimation.play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //animaster().move(block, 1000, { x: 100, y: 10 });
            const customAnimation = animaster()
                .addMove(2000, { x: 100, y: 10 })
            customAnimation.play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            //animaster().scale(block, 1000, 1.25);
            const customAnimation = animaster()
                .addScale(2000, 1.25)
            customAnimation.play(block);
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

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block1 = document.getElementById('customAnimationPlayBlock1');
            const block2 = document.getElementById('customAnimationPlayBlock2');
            const customAnimation = animaster()
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1);
            customAnimation.play(block1);

            customAnimation.play(block2);
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
        const intervalID = setInterval(() => { animaster().decreaseAndIncrease(element, 500, 1.4, 1); }, 1000);
        animaster().decreaseAndIncrease(element, 500, 1.4, 1);
        return {
            stop: () => { clearInterval(intervalID); }
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

    function addMove(duration, delta) {
        this._steps.push({
            type: "move",
            duration: duration,
            delta: delta
        })
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push({
            type: "fadeIn",
            duration: duration,
        })
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push({
            type: "scale",
            duration: duration,
            ratio: ratio
        })
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push({
            type: "fadeOut",
            duration: duration,
        })
        return this;
    }

    function play(element) {
        console.log(`play calling ${new Date()}`);
        let sum = 0;
        for (let step of this._steps) {
            switch (step.type) {
                case "move":
                    setTimeout(() => { 
                        this.move(element, step.duration, step.delta);
                        console.log(`move calling ${new Date()}`);
                    }, sum);  
                    break;
                case "fadeIn":
                    setTimeout(() => { 
                        this.fadeIn(element, step.duration);
                        console.log(`fadeIn calling ${new Date()}`);
                    }, sum);
                    break;
                case "scale":
                    setTimeout(() => { 
                        this.scale(element, step.duration, step.ratio);
                        console.log(`scale calling ${new Date()}`);
                    }, sum);
                    break;
            }
            sum += step.duration;
        }
    }

    return {
        scale: scale,
        move: move,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        decreaseAndIncrease: decreaseAndIncrease,
        heartBeating: heartBeating,
        addMove: addMove,
        addFadeIn: addFadeIn,
        addScale: addScale,
        addFadeOut: addFadeOut,
        play: play,
        _steps: []

    }
}

