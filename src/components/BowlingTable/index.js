function createData(
  name,
  Overs,
  Maidens,
  Runs,
  Wickets,
  Econ,
  Dots,
  fours,
  sixs,
  Wd,
  Nb,
  Team,
  innings
) {
  return {
    name,
    Overs,
    Maidens,
    Runs,
    Wickets,
    Econ,
    Dots,
    fours,
    sixs,
    Wd,
    Nb,
    Team,
    innings,
  };
}

export default function BowlingTable({ data, team, teamNum }) {
  const rows = data.map((item) => createData(...item));

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flow-root mt-4">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Bowler
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Overs
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Maidens
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Runs
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Wickets
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Econ
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Dots
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    4s
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    6s
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Wd
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                    Nb
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows
                  .filter((row) => row.Team === teamNum)
                  .map((row, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-blue-600 sm:pl-0">
                        {row.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Overs}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Maidens}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Runs}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm font-semibold text-gray-900 text-center">
                        {row.Wickets}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Econ}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Dots}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.fours}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.sixs}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Wd}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900 text-center">
                        {row.Nb}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
