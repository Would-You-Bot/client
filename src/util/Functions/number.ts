export function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function assignRanks(leaderboard: any[], start: number = 0) {
  let rank = 1;

  return leaderboard.map((item, index) => {
    const { score } = item;
    if (index > 0 && score < leaderboard[index - 1].score) {
      rank = index + 1;
    }
    return {
      rank: rank + start,
      ...item,
    };
  });
}
