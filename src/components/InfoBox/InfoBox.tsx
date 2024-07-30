export enum InfoStatus {
    Info = 0,
    Warning,
    Success,
    Error,
}

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
            className="info-box"
            style={{
                backgroundColor:
                    status === InfoStatus.Warning
                        ? "var(--warning-background-color)"
                        : status === InfoStatus.Success
                        ? "var(--success-background-color)"
                        : status === InfoStatus.Error
                        ? "var(--error-background-color)"
                        : "var(--information-background-color)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
                borderRadius: "var(--button-border-radius)",
                padding: "16px",
                alignSelf: "stretch",
            }}>
            <div
                className="info-box-icon"
                style={{
                    backgroundColor:
                        status === InfoStatus.Warning
                            ? "var(--warning-color)"
                            : status === InfoStatus.Success
                            ? "var(--success-color)"
                            : status === InfoStatus.Error
                            ? "var(--error-color)"
                            : "var(--information-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--secondary-background-color)",
                    width: "24px",
                    height: "24px",
                    borderRadius: "32px",
                }}>
                {status === InfoStatus.Info && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-background-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-question-mark "><path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path><path d="M12 19l0 .01"></path></svg>}
                {status === InfoStatus.Warning && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-background-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-exclamation-mark "><path d="M12 19v.01"></path><path d="M12 15v-10"></path></svg>}
                {status === InfoStatus.Success && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-background-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-check "><path d="M5 12l5 5l10 -10"></path></svg>}
                {status === InfoStatus.Error && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-background-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-x "><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>}
            </div>
            <strong>{InfoStatus[status]}:</strong>
            {children}
        </div>
    );
}
