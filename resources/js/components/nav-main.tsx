import { useState, useEffect } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const EXPANDED_KEY = 'sidebar_expanded_items';

export interface NavGroup {
    label?: string;
    items: NavItem[];
}

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();

    const [expanded, setExpanded] = useState<Set<string>>(() => {
        if (typeof window === 'undefined') return new Set();
        const stored = localStorage.getItem(EXPANDED_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });

    useEffect(() => {
        localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expanded]));
    }, [expanded]);

    const toggle = (key: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const isItemActive = (href: any) => {
        if (typeof href !== 'string') return false;

        const resolvedHref = resolveUrl(href);
        const currentUrl = page.url;

        // Exact match
        if (currentUrl === resolvedHref) return true;

        // Prefix match but ensure it's a path segment boundary
        if (currentUrl.startsWith(resolvedHref)) {
            const rest = currentUrl.slice(resolvedHref.length);
            return rest === '' || rest.startsWith('/') || rest.startsWith('?');
        }

        return false;
    };

    const isParentActive = (item: NavItem): boolean => {
        if (isItemActive(item.href)) return true;
        if (item.items) {
            return item.items.some((child) => isParentActive(child));
        }
        return false;
    };

    return (
        <>
            {groups.map((group, index) => (
                <SidebarGroup key={group.label || index} className="px-2 py-0">
                    {group.label && (
                        <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            {group.label}
                        </SidebarGroupLabel>
                    )}
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <RecursiveMenuItem
                                key={item.title}
                                item={item}
                                expanded={expanded}
                                toggle={toggle}
                                isItemActive={isItemActive}
                                isParentActive={isParentActive}
                            />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}

/* ------------------------------------------- */
/* Recursive Component for any menu depth     */
/* ------------------------------------------- */

function RecursiveMenuItem({
    item,
    expanded,
    toggle,
    isItemActive,
    isParentActive,
}: {
    item: NavItem;
    expanded: Set<string>;
    toggle: (key: string) => void;
    isItemActive: (href: string) => boolean;
    isParentActive: (item: NavItem) => boolean;
}) {
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expanded.has(item.title);
    const isActive = isParentActive(item);

    // If no children → simple link
    if (!hasChildren) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    // If has children → collapsible
    return (
        <Collapsible open={isExpanded} onOpenChange={() => toggle(item.title)}>
            <SidebarMenuItem>
                <div className="flex items-center w-full">

                    {/* ✅ Main link works */}
                    <SidebarMenuButton asChild isActive={isActive} className="flex-1">
                        <Link href={item.href} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>

                    {/* ✅ Arrow toggle */}
                    <CollapsibleTrigger asChild>
                        <button className="ml-auto p-2">
                            <ChevronRight
                                className={`transition-transform ${isExpanded ? 'rotate-90' : ''
                                    }`}
                            />
                        </button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items!.map((child) => (
                            <RecursiveSubMenu
                                key={child.title}
                                item={child}
                                expanded={expanded}
                                toggle={toggle}
                                isItemActive={isItemActive}
                                isParentActive={isParentActive}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

/* ------------------------------------------- */
/* Recursive submenu for deeper levels         */
/* ------------------------------------------- */

function RecursiveSubMenu({
    item,
    expanded,
    toggle,
    isItemActive,
    isParentActive,
}: {
    item: NavItem;
    expanded: Set<string>;
    toggle: (key: string) => void;
    isItemActive: (href: string) => boolean;
    isParentActive: (item: NavItem) => boolean;
}) {
    const hasChildren = item.items && item.items.length > 0;
    const isExpanded = expanded.has(item.title);
    const isActive = isParentActive(item);

    if (!hasChildren) {
        return (
            <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={isActive}>
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return (
        <Collapsible open={isExpanded} onOpenChange={() => toggle(item.title)}>
            <SidebarMenuSubItem>
                <div className="flex items-center w-full">
                    <SidebarMenuSubButton asChild isActive={isActive} className="flex-1">
                        <Link href={item.href} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuSubButton>

                    <CollapsibleTrigger asChild>
                        <button className="ml-auto p-2">
                            <ChevronRight
                                className={`transition-transform ${isExpanded ? 'rotate-90' : ''
                                    }`}
                            />
                        </button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items!.map((child) => (
                            <RecursiveSubMenu
                                key={child.title}
                                item={child}
                                expanded={expanded}
                                toggle={toggle}
                                isItemActive={isItemActive}
                                isParentActive={isParentActive}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuSubItem>
        </Collapsible>
    );
}
