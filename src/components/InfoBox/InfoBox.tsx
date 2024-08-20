import "./InfoBox.css";

export enum InfoStatus {
    Info = 0,
    Warning,
    Success,
    Error,
}

const statusData = [
    {
        color: "information",
        icon: (
            <>
                <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                <path d="M12 19l0 .01"></path>
            </>
        ),
    },
    {
        color: "warning",
        icon: (
            <>
                <path d="M12 5v7"></path>
                <path d="M12 19L12 19"></path>
            </>
        ),
    },
    {
        color: "success",
        icon: (
            <>
                <path d="M5 12l5 5l10 -10"></path>
            </>
        ),
    },
    {
        color: "error",
        icon: (
            <>
                <path d="M18 6l-12 12"></path>
                <path d="M6 6l12 12"></path>
            </>
        ),
    },
];

/**
 *
 * @param {string} status information, warning, success, error
 * @returns
 */
export default function InfoBox({
    status = InfoStatus.Info,
    children,
}: {
    status: InfoStatus;
    children: React.ReactNode;
}) {
    return (
        <div
            className="xellanix-info-box"
            style={{
                backgroundColor: `var(--${statusData[status].color}-background-color)`,
            }}
            role="status">
            <div
                className="xellanix-info-box-icon"
                style={{
                    backgroundColor: `var(--${statusData[status].color}-color)`,
                }}
                aria-hidden="true">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent-button-text-color)"
                    strokeWidth="0.1575em"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    {statusData[status].icon}
                </svg>
            </div>
            <strong>{InfoStatus[status]}:</strong>
            {children}
        </div>
    );
}
