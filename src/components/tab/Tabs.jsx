import { TabButton } from "@/components/tab/TabButton";

export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => (
    <div className={`flex flex-wrap border-b gap-5 pb-3 border-gray-200 dark:border-gray-700 ${className}`}>
        {tabs.map((tab) => (
            <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
            />
        ))}
    </div>
);