import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Reusable Breadcrumb Component with Schema.org markup
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items [{ label, href, current }]
 * @param {string} props.className - Additional CSS classes
 */
export default function Breadcrumb({ breadcrumbItems = [], className = '' }) {

    return (
        <nav
            aria-label="Breadcrumb"
            className={`my-6 ${className}`}
        >
            <ol
                className="flex flex-wrap items-center gap-2 text-sm"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
            >
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;
                    const position = index + 1;

                    return (
                        <li
                            key={index}
                            className="flex items-center gap-2"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {!isLast ? (
                                <>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition-colors duration-200"
                                        itemProp="item"
                                    >
                                        {index === 0 && <Home className="w-4 h-4" />}
                                        <span itemProp="name">{item.label}</span>
                                    </Link>
                                    <meta itemProp="position" content={position.toString()} />
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </>
                            ) : (
                                <>
                                    <span
                                        className="text-gray-900 font-medium"
                                        itemProp="name"
                                    >
                                        {item.label}
                                    </span>
                                    <meta itemProp="position" content={position.toString()} />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}