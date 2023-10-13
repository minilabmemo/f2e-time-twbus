import React, { useState, ReactNode } from 'react';

type TabProps = {
  label: string;
  children: ReactNode;
};

const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

const Tabs: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs-content">
      <div className="tabs">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement<TabProps>(child)) {
            const { label } = child.props;
            return (
              <div
                key={index}
                className={`tab ${index === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                {label}
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="tab-content">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export { Tabs, Tab };
