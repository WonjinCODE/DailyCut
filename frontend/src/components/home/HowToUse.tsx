const steps = [
  {
    number: "01",
    title: "시간 설정",
    description: "현재 시청 가능한 시간을 분 단위로 입력하거나 퀵 버튼을 사용하세요."
  },
  {
    number: "02",
    title: "OTT 선택",
    description: "구독 중인 OTT 플랫폼을 모두 선택하세요. 여러 개 선택도 가능합니다."
  },
  {
    number: "03",
    title: "즉시 감상",
    description: "검색 결과 중 가장 마음에 드는 콘텐츠를 골라 바로 시청을 시작하세요."
  }
];

const HowToUse = () => {
  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              고민은 줄이고,<br /> 즐거움은 늘리고.
            </h2>
            <p className="text-slate-400">
              DailyCut은 매우 단순하게 설계되었습니다. 단 세 번의 터치로 당신의 휴식 시간을 완벽하게 만드세요.
            </p>
          </div>
          <div className="hidden md:block h-px flex-grow mx-12 bg-gradient-to-r from-accent-red/50 to-transparent mb-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <span className="text-8xl font-black text-white/[0.03] absolute -top-10 -left-4 group-hover:text-accent-red/10 transition-colors">
                {step.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent-red text-white text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
