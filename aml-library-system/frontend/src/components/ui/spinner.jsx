import { cn } from "../../lib/utils"

export function Spinner({ className, ...props }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={cn(
          "h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <Spinner className="h-12 w-12" />
    </div>
  );
} 