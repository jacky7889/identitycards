export default function BlogTags({ tags }) {
  if (!tags) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.split(',').map((tag, index) => (
        <span 
          key={index}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
        >
          {tag.trim()}
        </span>
      ))}
    </div>
  );
}