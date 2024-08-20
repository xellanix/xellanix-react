import { useEffect, useRef } from "react";
import "./Slider.css";
import { HTMLProps } from "../../shared";

type ElementUpdaterCallback = (min: number, max: number, step: number, value: number) => void;
type SliderRefEvent = ((value: number) => void) | null;

export class SliderRef {
    public constructor(min?: number, max?: number, step?: number, defaultValue?: number) {
        this.init(min, max, step, defaultValue);
    }

    public get(type: "min" | "max" | "step" | "value"): number {
        return this[("_" + type) as keyof this] as unknown as number;
    }

    public set(type: "min" | "max" | "step" | "value", value: number) {
        (this[("_" + type) as keyof this] as unknown as number) = value;

        this._elementUpdater.forEach((callback) =>
            callback(this._min, this._max, this._step, this._value)
        );
    }

    public init(min?: number, max?: number, step?: number, value?: number) {
        if (min) this._min = min;
        if (max) this._max = max;
        if (step) this._step = step;
        if (value) this._value = value;
    }

    public callback(type: "change" | "input", fn: SliderRefEvent) {
        (this[("_" + type + "Event") as keyof this] as unknown as SliderRefEvent) = fn;
    }

    public removeCallback(type: "change" | "input" | "all") {
        if (type === "all") {
            this._changeEvent = null;
            this._inputEvent = null;
        } else {
            this.callback(type, null);
        }
    }

    public fireCallback(type: "change" | "input", value: number) {
        (this[("_" + type + "Event") as keyof this] as unknown as SliderRefEvent)?.(value);
    }

    public elementUpdater(callback: ElementUpdaterCallback) {
        this._elementUpdater.push(callback);
    }

    public removeElementUpdater(callback: ElementUpdaterCallback) {
        this._elementUpdater = this._elementUpdater.filter((el) => el !== callback);
    }

    private _value: number = 0;
    private _min: number = 0;
    private _max: number = 100;
    private _step: number = 1;

    private _changeEvent: SliderRefEvent = null;
    private _inputEvent: SliderRefEvent = null;

    private _elementUpdater: ElementUpdaterCallback[] = [];
}

type SliderInputRef = {
    sliderInputRef?: React.RefObject<SliderRef>;
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

export const useSlider = () => {
    return useRef<SliderRef>(new SliderRef());
};

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const el = inputRef?.current;
        const sliderRef = sliderInputRef?.current;

        const normalizeNegative = (event: Event) => {
            const target = event.target as HTMLInputElement;
            let value = Number(target.value);
            const isNaN = Number.isNaN(value);

            if (!isNaN) value = Math.max(Number(target.min), Math.min(Number(target.max), value));

            target.value = isNaN ? "-" : value.toString();
            sliderRef?.fireCallback("change", isNaN ? 0 : value);
        };

        const fireInput = (ev: Event) => {
            const value = (ev.target as HTMLInputElement).valueAsNumber;

            !Number.isNaN(value) && sliderRef?.fireCallback("input", value);
        };

        const elementUpdater = (min: number, max: number, step: number, value: number) => {
            if (el) {
                el.min = min.toString();
                el.max = max.toString();
                el.step = step.toString();
                el.value = value.toString();
            }
        };

        if (el) {
            // default
            el.addEventListener("change", normalizeNegative);
            el.addEventListener("input", fireInput);
        }

        sliderRef?.elementUpdater(elementUpdater);

        return () => {
            if (el) {
                el.removeEventListener("change", normalizeNegative);
                el.removeEventListener("input", fireInput);
            }

            sliderRef?.removeElementUpdater(elementUpdater);
        };
    }, []);

    return (
        <input
            ref={inputRef}
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

    const dataRef = useRef({ min: min, max: max, step: step });

    useEffect(() => {
        updateValue(
            sliderRef.current,
            thumbRef.current,
            Math.max(Math.min(defaultValue, max), min),
            min,
            max
        );

        dataRef.current = { min: min, max: max, step: step };

        sliderInputRef?.current?.init(min, max, step, defaultValue);
    }, [defaultValue, min, max]);

    useEffect(() => sliderInputRef?.current?.set("step", step), [step]);

    useEffect(() => {
        let lastThumbPos = 0,
            mousePos = 0,
            sliderWidth = 0,
            containerWidth = 0,
            currentValue = defaultValue,
            deferredValue = defaultValue;

        const setNewValue = (newValue: number) => {
            currentValue = newValue;
            onChange?.(newValue);
            sliderInputRef?.current?.set("value", newValue);
        };

        const handleMove = (event: MouseEvent | TouchEvent) => {
            event.preventDefault();

            if (sliderRef.current && thumbRef.current) {
                const clientX =
                    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

                const newLeft = Math.min(
                    Math.max(lastThumbPos + (clientX - mousePos), 0),
                    sliderWidth
                );

                const _min = dataRef.current.min;
                const _max = dataRef.current.max;
                const _step = dataRef.current.step;

                let finalValue = (newLeft / sliderWidth) * (_max - _min) + _min;
                finalValue = Math.round(finalValue / _step) * _step;

                if (finalValue !== currentValue) {
                    setNewValue(finalValue);

                    thumbRef.current.style.left = `${(newLeft / containerWidth) * 100}%`;
                    const cssPercent = (newLeft / sliderWidth) * 100;
                    sliderRef.current.style.background = `linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) ${cssPercent}%, var(--ternary-background-color2) ${cssPercent}%, var(--ternary-background-color2) 100%)`;
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

            updateValue(
                sliderRef.current,
                thumbRef.current,
                currentValue,
                dataRef.current.min,
                dataRef.current.max
            );
            setNewValue(currentValue);
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

        sliderInputRef?.current?.callback("change", (event: number) => {
            onDeferredChange?.(event);
            setNewValue(event);
        });
        sliderInputRef?.current?.callback("input", (event: number) => {
            updateValue(
                sliderRef.current,
                thumbRef.current,
                Math.max(Math.min(event, dataRef.current.max), dataRef.current.min),
                dataRef.current.min,
                dataRef.current.max
            );

            setNewValue(event);
        });

        thumbRef.current?.addEventListener("mousedown", handleDown);
        thumbRef.current?.addEventListener("touchstart", handleDown);
        thumbRef.current?.parentElement?.addEventListener("keydown", handleKeyDown);
        thumbRef.current?.parentElement?.addEventListener("keyup", handleKeyUp);

        return () => {
            sliderInputRef?.current?.removeCallback("all");

            thumbRef.current?.removeEventListener("mousedown", handleDown);
            thumbRef.current?.removeEventListener("touchstart", handleDown);
            thumbRef.current?.parentElement?.removeEventListener("keydown", handleKeyDown);
            thumbRef.current?.parentElement?.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div
            className={"xellanix-slider" + (className ? " " + className : "")}
            tabIndex={0}
            style={style}
            role="slider"
            {...props}>
            <div className="xellanix-slider-bar" ref={sliderRef} />
            <div className="xellanix-slider-thumb" ref={thumbRef} />
        </div>
    );
}
