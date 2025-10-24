import { parseAsBoolean, useQueryState } from "nuqs";

export const useSearchProjectCommand = () => {
    const [isOpen, setIsOpen] = useQueryState(
        'serach-project',
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    );

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return {
        isOpen,
        open,
        close,
        setIsOpen
    }
}