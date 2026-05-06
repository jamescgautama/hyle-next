export function StatsSection() {
  const stats = [
    { value: "34", label: "Provinces Covered" },
    { value: "3", label: "Data Metrics" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <section className="bg-offwhite bg-grid-pattern py-16 md:py-24">
      <div className="mx-auto max-w-[1000px] px-6">
        <div className="bg-forest rounded-3xl p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center pt-10 md:pt-0 first:pt-0 text-white">
                <span className="text-4xl md:text-5xl font-normal tracking-tight">
                  {stat.value}
                </span>
                <span className="mt-3 text-base font-normal text-white/70">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
