import * as React from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  className?: string;
}

// Define a common interface for props that will be passed to all children
interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, className, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);
    
    // Clone children and pass the activeTab state
    const enhancedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        // Type assertion to tell TypeScript the component accepts these props
        return React.cloneElement(child as React.ReactElement<any>, {
          activeTab,
          setActiveTab,
        });
      }
      return child;
    });
    
    return (
      <div ref={ref} className={className} {...props}>
        {enhancedChildren}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement>, Partial<TabsContextProps> {
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, activeTab, setActiveTab, ...props }, ref) => {
    // Clone children to pass activeTab and setActiveTab down to any nested components
    const enhancedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          activeTab,
          setActiveTab,
        });
      }
      return child;
    });
    
    return (
      <div ref={ref} className={className} role="tablist" {...props}>
        {enhancedChildren}
      </div>
    );
  }
);

TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Partial<TabsContextProps> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, activeTab, setActiveTab, className, children, ...props }, ref) => {
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={className}
        onClick={() => setActiveTab?.(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement>, Partial<TabsContextProps> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, activeTab, className, children, ...props }, ref) => {
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? "active" : "inactive"}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = "TabsContent";

// Card component for UI consistency 
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Tabs, TabsList, TabsTrigger, TabsContent, Card };