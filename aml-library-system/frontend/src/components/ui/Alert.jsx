export const Alert = ({ children, variant = "error" }) => {
  const variants = {
    error: "bg-red-50 border border-red-200 text-red-600",
    success: "bg-green-50 border border-green-200 text-green-600",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-600",
  };

  return (
    <div className={`${variants[variant]} rounded-md p-3`}>
      {children}
    </div>
  );
}; 