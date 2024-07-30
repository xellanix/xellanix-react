// IMPORT SECTION
// node_modules
import {
    useState,
    useRef,
    useEffect,
    Dispatch,
    SetStateAction,
    ReactNode,
    createContext,
    useContext,
} from "react";
// local components
// assets
// local assets
// styles

type PopupItem = JSX.Element;

type Popup = {
    item: PopupItem | null;
    setItem: Dispatch<SetStateAction<PopupItem | null>>;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type PopupProviderProps = {
    iconSrc: string;
    iconText: string;
    children: ReactNode;
};

const PopupContext = createContext<Popup | null>(null);

export default function PopupProvider({
    iconSrc,
    iconText,
    children,
}: PopupProviderProps) {
    const [item, setItem] = useState<PopupItem | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <PopupContext.Provider value={{ item, setItem, isOpen, setIsOpen }}>
            {children}

            <PopupRoot isOpen={isOpen}>
                <PopupSection setIsOpen={setIsOpen} iconSrc={iconSrc} iconText={iconText}>
                    {item}
                </PopupSection>
            </PopupRoot>
        </PopupContext.Provider>
    );
}

export function usePopup() {
    const context = useContext(PopupContext);

    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }

    return context;
}

function PopupSection({
    setIsOpen,
    iconSrc,
    iconText,
    canBack,
    backHandler,
    children,
}: {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    iconSrc: string;
    iconText: string;
    canBack?: boolean;
    backHandler?: () => void;
    children?: ReactNode;
}) {
    const [defaultHeight, setDefaultHeight] = useState<number | null>(null);
    const [totalHeight, setTotalHeight] = useState<number | null>(null);

    const observedDiv = useRef(null);

    useEffect(() => {
        if (!observedDiv.current) {
            return;
        }

        const resizeObserver = new ResizeObserver(([entry]) => {
            const ph = entry.target.parentElement?.parentElement?.offsetHeight ?? 0;
            const clippedHeight = entry.target.parentElement?.offsetHeight ?? 0;
            const contentHeight = entry.target.scrollHeight;

            const usedHeight = ph - clippedHeight;
            const current = (defaultHeight ?? usedHeight) + contentHeight;

            setTotalHeight(current);
            setDefaultHeight(usedHeight);
        });

        resizeObserver.observe(observedDiv.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [observedDiv.current]);

    function closeAnyPopup() {
        document.querySelector("#popup")?.classList.add("out");

        setTimeout(() => {
            setIsOpen(false);
        }, 300);
    }

    return (
        <div
            id="popup"
            className="popup vertical-layout"
            style={{ height: totalHeight ?? "auto", minWidth: "100px" }}>
            <div className="horizontal-layout">
                {canBack && (
                    <div
                        className="default-back-button vertical-layout flex-align-middle flex-align-center"
                        onClick={backHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-arrow-left "><path d="M5 12l14 0"></path><path d="M5 12l6 6"></path><path d="M5 12l6 -6"></path></svg>
                    </div>
                )}
                <div className="icon-landscape">
                    <img src={iconSrc} alt={`${iconText} Icon`} />
                    <div>{iconText}</div>
                </div>
                <div
                    className="default-close-button vertical-layout flex-align-middle flex-align-center"
                    onClick={closeAnyPopup}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-x "><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                </div>
            </div>
            <div id="popup-container">
                <div ref={observedDiv} className="vertical-layout flex-align-center popup-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

function PopupRoot({ isOpen, children }: { isOpen: boolean; children: ReactNode }) {
    useEffect(() => {
        isOpen
            ? document.querySelector("html")?.classList.add("hide-all")
            : document.querySelector("html")?.classList.remove("hide-all");
    }, [isOpen]);

    return (
        <div id="smoke-layer" className={`vertical-layout flex-align-middle flex-align-center`}>
            {isOpen && children}
        </div>
    );
}
