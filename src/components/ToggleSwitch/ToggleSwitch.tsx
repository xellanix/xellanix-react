import { useCallback, useId } from "react";
import "./ToggleSwitch.css";
import { HTMLProps } from "../../shared";

type ToggleSwitchProps = {
    label?: string;
    labelPosition?: "before" | "after";
    defaultValue?: boolean;
    onChange?: (value: boolean) => void;
};

export default function ToggleSwitch({
    className,
    onChange,
    label,
    labelPosition = "after",
    defaultValue = false,
    ...props
}: HTMLProps<HTMLDivElement, ToggleSwitchProps>) {
    const controlId = useId();

    const clickHandle = useCallback(({ currentTarget }: React.UIEvent<HTMLDivElement>) => {
        const isOn = currentTarget.classList.toggle("on");
        onChange?.(isOn);
    }, []);

    const keyDownHandle = useCallback((ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            (!ev.repeat) && clickHandle(ev);
        }
    }, []);

    return (
        <div className="horizontal-layout flex-align-middle small-gap">
            {label && labelPosition === "before" && <label id={`tsl-${controlId}`}>{label}</label>}
            <div
                className={
                    "xellanix-toggle-switch" +
                    (defaultValue ? " on" : "") +
                    (className ? " " + className : "")
                }
                tabIndex={0}
                onClick={clickHandle}
                onKeyDown={keyDownHandle}
                role="switch"
                aria-labelledby={`tsl-${controlId}`}
                {...props}>
                <div className="xellanix-toggle-switch-handle"></div>
            </div>
            {label && labelPosition === "after" && <label>{label}</label>}
        </div>
    );
}
