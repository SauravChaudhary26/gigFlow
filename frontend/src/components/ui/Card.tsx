import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden", className)}
        {...props}
    />
));
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-6 py-4 border-b border-gray-100 dark:border-gray-700", className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6", className)}
        {...props}
    />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex items-center", className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
