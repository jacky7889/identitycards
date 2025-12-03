export default function Steps() {
  const steps = [
    {
      icon: "fa-desktop",
      title: "Step 1",
      text: "Take A4 Size Paper with Photos and the details of Employees",
    },
    {
      icon: "fa-cog",
      title: "Step 2",
      text: "Paste the Employees Photos on the A4 Size Paper and write their details below the images.",
    },
    {
      icon: "fa-leaf",
      title: "Step 3",
      text: "Scan the page/pages at 300 dpi resolution.",
    },
    {
      icon: "fa-umbrella",
      title: "Step 4",
      text: "And the final step is to mail it to us.",
    },
  ];

  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Steps Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <i className={`fa ${step.icon} fa-3x text-blue-600 mb-4`}></i>
              <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
       
      </div>
    </section>
  );
}
