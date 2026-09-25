function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* 
        The icon is passed into this component from the parent.
        We're keeping this component reusable so we can use it
        for different features.
      */}
      <div className="mb-4 text-3xl">{icon}</div>

      {/* Feature title */}
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

      {/* Feature description */}
      <p className="mt-2 leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}

export default FeatureCard;
