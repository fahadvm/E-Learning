"use client";



export default function Contributions() {
  const [data, setData] = useState<IContributionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await studentProfileApi.getcontributions("fahad_fad", "fahadvm");
        console.log("response of cotribution:",res)
        if (!res.ok || !res.data) return;

        // TODAY'S CONTRIBUTIONS
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const eventsRes = await fetch(
          `https://api.github.com/users/fahadvm/events/public?per_page=100`
        );
        console.log("response of eventRes:",eventsRes)
        const events = await eventsRes.json();

        const todayEvents = Array.isArray(events)
          ? events.filter((e: any) => e.created_at.split("T")[0] === todayStr)
          : [];

        const todayCount = todayEvents.filter((e: any) => e.type === "PushEvent").length;

        const level =
          todayCount === 0 ? 0 : todayCount <= 2 ? 1 : todayCount <= 5 ? 2 : todayCount <= 10 ? 3 : 4;

        const todayContribution: IGithubContribution = {
          date: todayStr,
          count: todayCount,
          level,
        };

        const updatedGithub = res.data.github.filter((d: any) => d.date !== todayStr);
        updatedGithub.push(todayContribution);

        setData({ github: updatedGithub, leetcode: res.data.leetcode });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[300px] bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Contributions...</div>
      </div>
    );
  }

  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const validContributions = data.github
    .filter((d) => {
      const date = new Date(d.date);
      return date >= oneYearAgo && date <= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalContributions = validContributions.reduce((sum, d) => sum + d.count, 0);

  const weeks: (IGithubContribution | null)[][] = [];
  let currentWeek: (IGithubContribution | null)[] = [];
  const currentDate = new Date(oneYearAgo);
  let dataIndex = 0;

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const contribution = validContributions[dataIndex];

    if (contribution && contribution.date === dateStr) {
      currentWeek.push(contribution);
      dataIndex++;
    } else {
      currentWeek.push(null);
    }

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  // Month labels
  const monthLabels: { month: string; weekIndex: number; weekWidth: number }[] = [];
  weeks.forEach((week, i) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return;

    const monthName = new Date(firstDay.date).toLocaleString("default", { month: "short" });

    const prev = monthLabels[monthLabels.length - 1];
    if (!prev || prev.month !== monthName) {
      monthLabels.push({ month: monthName, weekIndex: i, weekWidth: 1 });
    } else {
      prev.weekWidth += 1;
    }
  });

  const computedTotalSolved =
    data.leetcode.easySolved + data.leetcode.mediumSolved + data.leetcode.hardSolved;
return (
  <div className="text-white">
    <div className="grid lg:grid-cols-2 gap-10">
      {/* GitHub */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <h3 className="text-2xl font-bold mb-6 text-indigo-400">GitHub Contributions</h3>
        <p className="text-3xl font-bold mb-6">{totalContributions} <span className="text-lg text-gray-400">this year</span></p>

        <div className="overflow-x-auto">
          <div className="flex gap-3">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1">
                {week.map((day, j) => (
                  <div
                    key={j}
                    className={`w-4 h-4 rounded ${day ? GITHUB_COLORS[day.level] : 'bg-gray-800'} transition-all hover:scale-150 hover:z-10`}
                    title={day ? `${day.count} on ${day.date}` : 'No activity'}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 text-sm">
          <span className="text-gray-400">Less</span>
          {[0,1,2,3,4].map(l => <div key={l} className={`w-4 h-4 rounded ${GITHUB_COLORS[l]}`} />)}
          <span className="text-gray-400">More</span>
        </div>
      </div>

      {/* LeetCode */}
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="h-10 mx-auto mb-6 opacity-80" />
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          {computedTotalSolved}
        </div>
        <p className="text-xl text-gray-300 mt-2 mb-8">Problems Solved</p>

        <div className="space-y-5 text-left">
          <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl">
            <span className="text-green-400 font-semibold">Easy</span>
            <span className="text-3xl font-bold">{data.leetcode.easySolved}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-xl">
            <span className="text-yellow-400 font-semibold">Medium</span>
            <span className="text-3xl font-bold">{data.leetcode.mediumSolved}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-xl">
            <span className="text-red-400 font-semibold">Hard</span>
            <span className="text-3xl font-bold">{data.leetcode.hardSolved}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
