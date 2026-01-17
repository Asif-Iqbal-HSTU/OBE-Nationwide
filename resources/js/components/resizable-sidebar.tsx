import { Sidebar } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

const SIDEBAR_WIDTH_KEY = 'sidebar_width';

export default function ResizableSidebar({
    children,
}: {
    children: React.ReactNode;
}) {
    const [width, setWidth] = useState(() => {
        if (typeof window === 'undefined') return 260;
        return Number(localStorage.getItem(SIDEBAR_WIDTH_KEY)) || 260;
    });

    useEffect(() => {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, width.toString());
    }, [width]);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = width;

        const onMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + (e.clientX - startX);
            if (newWidth >= 180 && newWidth <= 420) {
                setWidth(newWidth);
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="relative h-full flex-none" style={{ width }}>
            <Sidebar
                collapsible="icon"
                variant="inset"
                className="h-full w-full"
            >
                {children}
            </Sidebar>

            {/* Drag handle */}
            <div
                onMouseDown={startResize}
                className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-border hover:bg-primary/40"
            />
        </div>
    );
}
