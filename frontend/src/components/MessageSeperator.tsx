interface DateSeparatorProps {
    label: string;
}

const DateSeparator = ({ label } : DateSeparatorProps) => {
  return (
    <div className="flex items-center my-6">
      <div className="flex-grow h-px bg-gray-200" />
      <span className="px-4 py-1 mx-4 text-sm text-gray-700 bg-gray-100 rounded-md">
        {label}
      </span>
      <div className="flex-grow h-px bg-gray-200" />
    </div>
  );
};

export default DateSeparator;
