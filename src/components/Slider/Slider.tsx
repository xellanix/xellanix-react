import React, { useEffect, useRef } from "react";
import "./Slider.css";
import { HTMLProps } from "../../shared";

type SliderInputRef = {
    sliderInputRef?: React.RefObject<HTMLInputElement>;
};

type SliderProps = {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
};

type SliderOptionalProps = {
    id?: string;
    className?: string;
    onChange?: (value: number) => void;
    onDeferredChange?: (value: number) => void;
};

type DetailedSliderProps = SliderInputRef & SliderProps & SliderOptionalProps;

const updateValue = (
    slider: HTMLDivElement | null,
    thumb: HTMLDivElement | null,
    value: number,
    min: number,
    max: number
) => {
    if (slider && thumb) {
        const sliderWidth = slider.getBoundingClientRect().width;
        const containerWidth = slider.parentElement!.getBoundingClientRect().width;
        const maxLeftFactor = sliderWidth / containerWidth;

        const progress = ((value - min) / (max - min)) * 100;

        thumb.style.left = `${progress * maxLeftFactor}%`;
        slider.style.background = `linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) ${progress}%, var(--ternary-background-color2) ${progress}%, var(--ternary-background-color2) 100%)`;
    }
};

export function SliderInput({
    sliderInputRef,
    style,
    ...props
}: HTMLProps<HTMLInputElement, SliderInputRef>) {
    useEffect(() => {
        const el = sliderInputRef!.current;

        const handleChange = (event: Event) => {
            const target = event.target as HTMLInputElement;

            let value = Number(target.value);

            if (!Number.isNaN(value))
                value = Math.max(Number(target.min), Math.min(Number(target.max), value));

            target.value = Number.isNaN(value) ? "-" : value.toString();
        };

        if (el) {
            el.addEventListener("change", handleChange);
        }

        return () => el?.removeEventListener("change", handleChange);
    }, []);

    return (
        <input
            ref={sliderInputRef}
            type="number"
            pattern="-?[0-9]+"
            style={{ ...{ width: "96px" }, ...style }}
            {...props}
        />
    );
}

export default function Slider({
    sliderInputRef,
    min,
    max,
    step,
    defaultValue,
    onChange,
    onDeferredChange,
    className,
    style,
    ...props
}: HTMLProps<HTMLDivElement, DetailedSliderProps>) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updateValue(
            sliderRef.current,
            thumbRef.current,
            Math.max(Math.min(defaultValue, max), min),
            min,
            max
        );

        const inputCurrent = sliderInputRef?.current;
        if (inputCurrent) {
            inputCurrent.min = min.toString();
            inputCurrent.max = max.toString();
            inputCurrent.value = defaultValue.toString();
        }

        onChange?.(defaultValue);
        onDeferredChange?.(defaultValue);
    }, [defaultValue, min, max]);

    useEffect(() => {
        const inputCurrent = sliderInputRef?.current;
        if (inputCurrent) {
            inputCurrent.step = step.toString();
        }
    }, [step]);

    useEffect(() => {
        let lastThumbPos = 0,
            mousePos = 0,
            sliderWidth = 0,
            containerWidth = 0,
            currentValue = defaultValue,
            deferredValue = defaultValue;

        const handleMove = (event: MouseEvent | TouchEvent) => {
            event.preventDefault();

            if (sliderRef.current && thumbRef.current) {
                const clientX =
                    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

                const newLeft = Math.min(
                    Math.max(lastThumbPos + (clientX - mousePos), 0),
                    sliderWidth
                );
                let finalValue = (newLeft / sliderWidth) * (max - min) + min;
                finalValue = Math.round(finalValue / step) * step;

                if (finalValue !== currentValue) {
                    currentValue = finalValue;

                    thumbRef.current.style.left = `${(newLeft / containerWidth) * 100}%`;
                    const cssPercent = (newLeft / sliderWidth) * 100;
                    sliderRef.current.style.background = `linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) ${cssPercent}%, var(--ternary-background-color2) ${cssPercent}%, var(--ternary-background-color2) 100%)`;

                    onChange?.(finalValue);
                    if (sliderInputRef?.current) {
                        sliderInputRef.current.value = finalValue.toString();
                    }
                }
            }
        };

        const handleDown = (event: MouseEvent | TouchEvent) => {
            event.preventDefault();

            mousePos = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            lastThumbPos = thumbRef.current!.offsetLeft;
            sliderWidth = sliderRef.current!.getBoundingClientRect().width;
            containerWidth = thumbRef.current!.parentElement!.getBoundingClientRect().width;

            document.addEventListener("mousemove", handleMove);
            document.addEventListener("touchmove", handleMove);
            document.addEventListener("mouseup", handleUp);
            document.addEventListener("touchend", handleUp);
        };

        const handleUp = () => {
            if (deferredValue !== currentValue) {
                deferredValue = currentValue;
                onDeferredChange?.(deferredValue);
            }

            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("touchmove", handleMove);
            document.removeEventListener("mouseup", handleUp);
            document.removeEventListener("touchend", handleUp);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                currentValue -= step;
            } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                currentValue += step;
            } else return;

            updateValue(sliderRef.current, thumbRef.current, currentValue, min, max);
            onChange?.(currentValue);
            if (sliderInputRef?.current) sliderInputRef.current.value = currentValue.toString();
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (
                !(
                    event.key === "ArrowLeft" ||
                    event.key === "ArrowDown" ||
                    event.key === "ArrowRight" ||
                    event.key === "ArrowUp"
                )
            )
                return;

            if (deferredValue !== currentValue) {
                deferredValue = currentValue;
                onDeferredChange?.(deferredValue);
            }
        };

        const handleInputChange = (event: Event) => {
            const target = event.currentTarget as HTMLInputElement;

            onChange?.(Number(target.value));
            onDeferredChange?.(Number(target.value));
        };

        const handleInputType = (event: Event) => {
            const target = Number((event.target as HTMLInputElement).value);
            updateValue(
                sliderRef.current,
                thumbRef.current,
                Math.max(Math.min(target, max), min),
                min,
                max
            );

            onChange?.(target);
        };

        thumbRef.current?.addEventListener("mousedown", handleDown);
        thumbRef.current?.addEventListener("touchstart", handleDown);
        thumbRef.current?.parentElement?.addEventListener("keydown", handleKeyDown);
        thumbRef.current?.parentElement?.addEventListener("keyup", handleKeyUp);

        sliderInputRef?.current?.addEventListener("input", handleInputType);
        sliderInputRef?.current?.addEventListener("change", handleInputChange);

        return () => {
            thumbRef.current?.removeEventListener("mousedown", handleDown);
            thumbRef.current?.removeEventListener("touchstart", handleDown);
            thumbRef.current?.parentElement?.removeEventListener("keydown", handleKeyDown);
            thumbRef.current?.parentElement?.removeEventListener("keyup", handleKeyUp);

            sliderInputRef?.current?.removeEventListener("input", handleInputType);
            sliderInputRef?.current?.removeEventListener("change", handleInputChange);
        };
    }, []);

    return (
        <div
            className={"xellanix-slider" + (className ? " " + className : "")}
            tabIndex={0}
            style={style}
            {...props}>
            <div className="xellanix-slider-bar" ref={sliderRef} />
            <div className="xellanix-slider-thumb" ref={thumbRef} />
        </div>
    );
}
